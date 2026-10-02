"use client";

import { useTransition } from "react";
import { cancelBookingAction, completeBookingAction, confirmBookingAction } from "@/lib/actions/bookings";
import { Button } from "@/components/ui/Button";
import type { CoachingBooking } from "@/lib/db/types";

export function BookingActions({ booking }: { booking: CoachingBooking }) {
  const [isPending, startTransition] = useTransition();

  if (booking.status === "pending_payment" || booking.status === "cancelled") {
    return null;
  }

  return (
    <div className="flex gap-2">
      {booking.status === "pending" && (
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => startTransition(() => confirmBookingAction(booking.id))}
        >
          Confirm
        </Button>
      )}
      {booking.status === "confirmed" && (
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => startTransition(() => completeBookingAction(booking.id))}
        >
          Mark completed
        </Button>
      )}
      {booking.status !== "completed" && (
        <Button
          size="sm"
          variant="ghost"
          disabled={isPending}
          onClick={() => startTransition(() => cancelBookingAction(booking.id))}
        >
          Cancel
        </Button>
      )}
    </div>
  );
}
