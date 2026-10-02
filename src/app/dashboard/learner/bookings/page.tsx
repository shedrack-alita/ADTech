import Link from "next/link";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { coachingBookings } from "@/lib/db/schema";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";

const statusTone = {
  pending_payment: "amber",
  pending: "navy",
  confirmed: "teal",
  completed: "green",
  cancelled: "red",
} as const;

const statusLabel: Record<string, string> = {
  pending_payment: "Awaiting payment",
  pending: "Awaiting confirmation",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function LearnerBookingsPage() {
  const user = await requireUser();
  const myBookings = await db
    .select()
    .from(coachingBookings)
    .where(eq(coachingBookings.userId, user.id))
    .orderBy(coachingBookings.createdAt);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Coaching bookings</h1>
          <p className="mt-1 text-sm text-brand-slate">Your past and upcoming coaching sessions.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/coaching">Book another session</Link>
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {myBookings.length === 0 && (
          <Card>
            <CardBody className="text-center text-brand-slate">
              You haven&apos;t booked a coaching session yet.
            </CardBody>
          </Card>
        )}
        {myBookings.map((booking) => (
          <Card key={booking.id}>
            <CardBody className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-brand-navy">{booking.topic}</p>
                <p className="mt-1 text-sm text-brand-slate">
                  {formatDateTime(booking.preferredDate)}
                </p>
              </div>
              <Badge tone={statusTone[booking.status]}>{statusLabel[booking.status]}</Badge>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
