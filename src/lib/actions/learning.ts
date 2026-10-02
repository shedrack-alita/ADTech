"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  certificates,
  enrollments,
  lessonProgress,
  lessons,
  messages,
  modules,
  submissions,
} from "@/lib/db/schema";
import {
  messageSchema,
  reviewSubmissionSchema,
  submissionSchema,
} from "@/lib/validations";
import { generateCertificateNumber } from "@/lib/utils";
import type { ActionState } from "./types";

async function getOwnedEnrollment(enrollmentId: string, userId: string) {
  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.id, enrollmentId), eq(enrollments.userId, userId)))
    .limit(1);
  if (!enrollment) throw new Error("Enrollment not found.");
  return enrollment;
}

async function recomputeProgress(enrollmentId: string) {
  const enrollment = (
    await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId))
  )[0];
  if (!enrollment) return;

  const courseLessons = await db
    .select({ id: lessons.id })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .where(eq(modules.courseId, enrollment.courseId));

  const completedRows = await db
    .select({ id: lessonProgress.id })
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.enrollmentId, enrollmentId),
        eq(lessonProgress.completed, true)
      )
    );

  const total = courseLessons.length || 1;
  const percent = Math.round((completedRows.length / total) * 100);

  const isNowComplete = percent === 100;

  await db
    .update(enrollments)
    .set({
      progressPercent: percent,
      status: isNowComplete ? "completed" : enrollment.status,
      completedAt: isNowComplete ? enrollment.completedAt ?? new Date() : enrollment.completedAt,
    })
    .where(eq(enrollments.id, enrollmentId));

  if (isNowComplete) {
    await db
      .insert(certificates)
      .values({
        enrollmentId,
        certificateNumber: generateCertificateNumber(),
      })
      .onConflictDoNothing({ target: certificates.enrollmentId });
  }
}

export async function toggleLessonCompleteAction(
  enrollmentId: string,
  lessonId: string,
  completed: boolean
) {
  const user = await requireUser();
  await getOwnedEnrollment(enrollmentId, user.id);

  const [existing] = await db
    .select()
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.enrollmentId, enrollmentId),
        eq(lessonProgress.lessonId, lessonId)
      )
    )
    .limit(1);

  if (existing) {
    await db
      .update(lessonProgress)
      .set({ completed, completedAt: completed ? new Date() : null })
      .where(eq(lessonProgress.id, existing.id));
  } else {
    await db.insert(lessonProgress).values({
      enrollmentId,
      lessonId,
      completed,
      completedAt: completed ? new Date() : null,
    });
  }

  await recomputeProgress(enrollmentId);
  revalidatePath(`/dashboard/learner/courses/${enrollmentId}`);
  revalidatePath("/dashboard/learner");
}

export async function submitAssignmentAction(
  enrollmentId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  await getOwnedEnrollment(enrollmentId, user.id);

  const parsed = submissionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const { lessonId, content, fileUrl } = parsed.data;

  if (!content && !fileUrl) {
    return { error: "Add a written response or a link to your work." };
  }

  await db.insert(submissions).values({
    lessonId,
    enrollmentId,
    userId: user.id,
    content: content || null,
    fileUrl: fileUrl || null,
  });

  revalidatePath(`/dashboard/learner/courses/${enrollmentId}`);
  return { success: "Submission sent to your instructor." };
}

export async function reviewSubmissionAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  if (user.role !== "instructor" && user.role !== "admin") {
    return { error: "Only instructors can review submissions." };
  }

  const parsed = reviewSubmissionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  await db
    .update(submissions)
    .set({
      status: parsed.data.status,
      feedback: parsed.data.feedback || null,
      reviewedAt: new Date(),
    })
    .where(eq(submissions.id, parsed.data.submissionId));

  revalidatePath("/dashboard/instructor");
  return { success: "Feedback saved." };
}

export async function sendMessageAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = messageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Write a message first." };
  }

  await db.insert(messages).values({
    enrollmentId: parsed.data.enrollmentId,
    senderId: user.id,
    body: parsed.data.body,
  });

  revalidatePath(`/dashboard/learner/courses/${parsed.data.enrollmentId}`);
  revalidatePath("/dashboard/instructor/messages");
  return {};
}
