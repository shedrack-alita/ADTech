"use server";

import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { contactSchema } from "@/lib/validations";
import type { ActionState } from "./types";

export async function submitContactAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  await db.insert(inquiries).values(parsed.data);
  return { success: "Thanks! We'll get back to you within one business day." };
}
