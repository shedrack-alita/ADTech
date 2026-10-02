"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { courses, enrollments, lessons, modules } from "@/lib/db/schema";
import { courseSchema, lessonSchema, moduleSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { startCourseCheckout } from "./payments";
import type { ActionState } from "./types";

/**
 * Enrolls the current user in a course. Free courses grant access
 * immediately; paid courses redirect to Paystack checkout.
 */
export async function enrollInCourseAction(courseId: string) {
  const user = await requireUser();

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (!course || !course.published) {
    throw new Error("This course is not available.");
  }

  const [existing] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(eq(enrollments.userId, user.id), eq(enrollments.courseId, courseId))
    )
    .limit(1);

  if (existing) {
    redirect(`/dashboard/learner/courses/${existing.id}`);
  }

  if (course.isFree || course.priceNaira === 0) {
    const [enrollment] = await db
      .insert(enrollments)
      .values({ userId: user.id, courseId })
      .returning({ id: enrollments.id });
    revalidatePath("/dashboard/learner");
    redirect(`/dashboard/learner/courses/${enrollment.id}`);
  }

  const authorizationUrl = await startCourseCheckout(
    user.id,
    user.email as string,
    courseId
  );
  redirect(authorizationUrl);
}

async function uniqueSlug(title: string) {
  const base = slugify(title);
  const [existing] = await db
    .select({ id: courses.id })
    .from(courses)
    .where(eq(courses.slug, base))
    .limit(1);
  if (!existing) return base;
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function createCourseAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireRole("admin");
  const raw = Object.fromEntries(formData);
  const parsed = courseSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const data = parsed.data;
  const slug = await uniqueSlug(data.title);

  const [course] = await db
    .insert(courses)
    .values({
      slug,
      title: data.title,
      summary: data.summary,
      description: data.description,
      category: data.category,
      level: data.level,
      durationWeeks: data.durationWeeks,
      priceNaira: data.isFree ? 0 : data.priceNaira,
      isFree: !!data.isFree,
      thumbnailUrl: data.thumbnailUrl || null,
      instructorId: data.instructorId || null,
      published: !!data.published,
    })
    .returning({ id: courses.id });

  revalidatePath("/dashboard/admin/courses");
  revalidatePath("/courses");
  redirect(`/dashboard/admin/courses/${course.id}`);
}

export async function updateCourseAction(
  courseId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireRole("admin");
  const parsed = courseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const data = parsed.data;

  await db
    .update(courses)
    .set({
      title: data.title,
      summary: data.summary,
      description: data.description,
      category: data.category,
      level: data.level,
      durationWeeks: data.durationWeeks,
      priceNaira: data.isFree ? 0 : data.priceNaira,
      isFree: !!data.isFree,
      thumbnailUrl: data.thumbnailUrl || null,
      instructorId: data.instructorId || null,
      published: !!data.published,
      updatedAt: new Date(),
    })
    .where(eq(courses.id, courseId));

  revalidatePath(`/dashboard/admin/courses/${courseId}`);
  revalidatePath("/courses");
  return { success: "Course updated." };
}

export async function deleteCourseAction(courseId: string) {
  await requireRole("admin");
  await db.delete(courses).where(eq(courses.id, courseId));
  revalidatePath("/dashboard/admin/courses");
  redirect("/dashboard/admin/courses");
}

export async function createModuleAction(
  courseId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireRole("admin");
  const parsed = moduleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  await db.insert(modules).values({ courseId, ...parsed.data });
  revalidatePath(`/dashboard/admin/courses/${courseId}`);
  return { success: "Module added." };
}

export async function deleteModuleAction(courseId: string, moduleId: string) {
  await requireRole("admin");
  await db.delete(modules).where(eq(modules.id, moduleId));
  revalidatePath(`/dashboard/admin/courses/${courseId}`);
}

export async function createLessonAction(
  courseId: string,
  moduleId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireRole("admin");
  const parsed = lessonSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const data = parsed.data;
  await db.insert(lessons).values({
    moduleId,
    title: data.title,
    type: data.type,
    content: data.content || null,
    videoUrl: data.videoUrl || null,
    durationMinutes: data.durationMinutes,
    position: data.position,
  });
  revalidatePath(`/dashboard/admin/courses/${courseId}`);
  return { success: "Lesson added." };
}

export async function deleteLessonAction(courseId: string, lessonId: string) {
  await requireRole("admin");
  await db.delete(lessons).where(eq(lessons.id, lessonId));
  revalidatePath(`/dashboard/admin/courses/${courseId}`);
}
