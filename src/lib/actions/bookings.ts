"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { coachingBookings } from "@/lib/db/schema";
import { bookingSchema } from "@/lib/validations";
import { startBookingCheckout } from "./payments";
import type { ActionState } from "./types";

const COACHING_SESSION_PRICE_NAIRA = 15000;

export async function createBookingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const [booking] = await db
    .insert(coachingBookings)
    .values({
      userId: user.id,
      topic: parsed.data.topic,
      notes: parsed.data.notes || null,
      preferredDate: new Date(parsed.data.preferredDate),
      priceNaira: COACHING_SESSION_PRICE_NAIRA,
    })
    .returning({ id: coachingBookings.id });

  const authorizationUrl = await startBookingCheckout(
    user.id,
    user.email as string,
    booking.id,
    COACHING_SESSION_PRICE_NAIRA
  );

  redirect(authorizationUrl);
}

export async function confirmBookingAction(bookingId: string) {
  await requireRole("admin", "instructor");
  await db
    .update(coachingBookings)
    .set({ status: "confirmed" })
    .where(eq(coachingBookings.id, bookingId));
  revalidatePath("/dashboard/admin/bookings");
}

export async function completeBookingAction(bookingId: string) {
  await requireRole("admin", "instructor");
  await db
    .update(coachingBookings)
    .set({ status: "completed" })
    .where(eq(coachingBookings.id, bookingId));
  revalidatePath("/dashboard/admin/bookings");
}

export async function cancelBookingAction(bookingId: string) {
  await requireRole("admin", "instructor");
  await db
    .update(coachingBookings)
    .set({ status: "cancelled" })
    .where(eq(coachingBookings.id, bookingId));
  revalidatePath("/dashboard/admin/bookings");
}
