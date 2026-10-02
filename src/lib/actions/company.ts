"use server";

import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { courses, enrollments, users } from "@/lib/db/schema";
import { addStaffSchema } from "@/lib/validations";
import type { ActionState } from "./types";

export async function addStaffAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireRole("company_admin");
  const parsed = addStaffSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);
  if (existing) return { error: "A user with that email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email: normalizedEmail,
    passwordHash,
    role: "learner",
    companyId: admin.companyId,
  });

  revalidatePath("/dashboard/company/staff");
  return { success: `${name} was added to your team.` };
}

export async function assignCourseToStaffAction(
  staffUserId: string,
  courseId: string
): Promise<ActionState> {
  const admin = await requireRole("company_admin");

  const [staff] = await db
    .select({ id: users.id, companyId: users.companyId })
    .from(users)
    .where(eq(users.id, staffUserId))
    .limit(1);

  if (!staff || staff.companyId !== admin.companyId) {
    return { error: "That staff member is not part of your company." };
  }

  const [course] = await db
    .select({ id: courses.id })
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);
  if (!course) return { error: "Course not found." };

  const [existing] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(eq(enrollments.userId, staffUserId), eq(enrollments.courseId, courseId))
    )
    .limit(1);

  if (existing) return { error: "This staff member is already enrolled in that course." };

  await db.insert(enrollments).values({
    userId: staffUserId,
    courseId,
    companyId: admin.companyId,
  });

  revalidatePath("/dashboard/company/staff");
  return { success: "Course assigned." };
}
