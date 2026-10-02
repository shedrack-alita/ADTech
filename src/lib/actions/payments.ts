"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  coachingBookings,
  courses,
  enrollments,
  payments,
} from "@/lib/db/schema";
import { initializeTransaction, verifyTransaction } from "@/lib/paystack";
import { generatePaymentReference } from "@/lib/utils";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/**
 * Idempotently verifies a Paystack transaction by reference and, on success,
 * fulfils whatever it was paying for (course enrollment or a coaching
 * booking). Safe to call multiple times — from the checkout callback page
 * AND the webhook — since it no-ops once a payment is already `success`.
 */
export async function finalizePaymentByReference(reference: string) {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.reference, reference))
    .limit(1);

  if (!payment) {
    return { ok: false as const, message: "Unknown payment reference." };
  }

  if (payment.status === "success") {
    return { ok: true as const, payment };
  }

  const verified = await verifyTransaction(reference);

  if (verified.status !== "success") {
    await db
      .update(payments)
      .set({ status: "failed" })
      .where(eq(payments.id, payment.id));
    return { ok: false as const, message: "Payment was not successful." };
  }

  await db.transaction(async (tx) => {
    await tx
      .update(payments)
      .set({ status: "success", verifiedAt: new Date() })
      .where(eq(payments.id, payment.id));

    if (payment.purpose === "course_enrollment") {
      const [existing] = await tx
        .select({ id: enrollments.id })
        .from(enrollments)
        .where(
          and(
            eq(enrollments.userId, payment.userId),
            eq(enrollments.courseId, payment.relatedId)
          )
        )
        .limit(1);

      if (!existing) {
        await tx.insert(enrollments).values({
          userId: payment.userId,
          courseId: payment.relatedId,
        });
      }
    }

    if (payment.purpose === "coaching_booking") {
      await tx
        .update(coachingBookings)
        .set({ status: "pending" })
        .where(eq(coachingBookings.id, payment.relatedId));
    }
  });

  return { ok: true as const, payment };
}

export async function startCourseCheckout(
  userId: string,
  email: string,
  courseId: string
) {
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (!course) throw new Error("Course not found.");

  const reference = generatePaymentReference("ENR");

  await db.insert(payments).values({
    userId,
    reference,
    amountNaira: course.priceNaira,
    purpose: "course_enrollment",
    relatedId: course.id,
  });

  const { authorization_url } = await initializeTransaction({
    email,
    amountNaira: course.priceNaira,
    reference,
    callbackUrl: `${appUrl()}/checkout/callback`,
    metadata: { purpose: "course_enrollment", courseId: course.id },
  });

  return authorization_url;
}

export async function startBookingCheckout(
  userId: string,
  email: string,
  bookingId: string,
  amountNaira: number
) {
  const reference = generatePaymentReference("CST");

  await db.insert(payments).values({
    userId,
    reference,
    amountNaira,
    purpose: "coaching_booking",
    relatedId: bookingId,
  });

  const { authorization_url } = await initializeTransaction({
    email,
    amountNaira,
    reference,
    callbackUrl: `${appUrl()}/checkout/callback`,
    metadata: { purpose: "coaching_booking", bookingId },
  });

  return authorization_url;
}
