"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, type roleEnum } from "@/lib/db/schema";

type Role = (typeof roleEnum.enumValues)[number];

export async function updateUserRoleAction(userId: string, role: Role) {
  await requireRole("admin");
  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));
  revalidatePath("/dashboard/admin/users");
}
