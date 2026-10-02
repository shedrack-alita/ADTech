"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { certificates, courses, enrollments, jobApplications, jobs } from "@/lib/db/schema";
import { jobApplicationSchema, jobSchema } from "@/lib/validations";
import type { ActionState } from "./types";

export async function applyToJobAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = jobApplicationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Something went wrong. Please try again." };
  }
  const { jobId, coverNote } = parsed.data;

  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
  if (!job || !job.isActive) return { error: "This job is no longer available." };

  if (job.requiredCourseId) {
    const [qualifying] = await db
      .select({ id: certificates.id })
      .from(enrollments)
      .innerJoin(certificates, eq(certificates.enrollmentId, enrollments.id))
      .where(
        and(
          eq(enrollments.userId, user.id),
          eq(enrollments.courseId, job.requiredCourseId)
        )
      )
      .limit(1);

    if (!qualifying) {
      return {
        error:
          "You need to complete the required course and earn its certificate before applying.",
      };
    }
  }

  const [existing] = await db
    .select({ id: jobApplications.id })
    .from(jobApplications)
    .where(and(eq(jobApplications.jobId, jobId), eq(jobApplications.userId, user.id)))
    .limit(1);

  if (existing) return { error: "You already applied to this role." };

  await db.insert(jobApplications).values({
    jobId,
    userId: user.id,
    coverNote: coverNote || null,
  });

  revalidatePath("/dashboard/learner/jobs");
  return { success: "Application submitted!" };
}

export async function createJobAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireRole("admin");
  const parsed = jobSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const data = parsed.data;
  await db.insert(jobs).values({
    title: data.title,
    companyName: data.companyName,
    description: data.description,
    location: data.location,
    type: data.type,
    requiredCourseId: data.requiredCourseId || null,
    isActive: data.isActive ?? true,
  });
  revalidatePath("/dashboard/admin/jobs");
  redirect("/dashboard/admin/jobs");
}

export async function toggleJobActiveAction(jobId: string, isActive: boolean) {
  await requireRole("admin");
  await db.update(jobs).set({ isActive }).where(eq(jobs.id, jobId));
  revalidatePath("/dashboard/admin/jobs");
}

export async function deleteJobAction(jobId: string) {
  await requireRole("admin");
  await db.delete(jobs).where(eq(jobs.id, jobId));
  revalidatePath("/dashboard/admin/jobs");
}

// Used by the admin "create job" form to list courses for the
// "required certificate" dropdown without another round trip.
export async function listCourseSlugsForJobs() {
  await requireRole("admin");
  return db
    .select({ id: courses.id, title: courses.title })
    .from(courses)
    .orderBy(courses.title);
}
