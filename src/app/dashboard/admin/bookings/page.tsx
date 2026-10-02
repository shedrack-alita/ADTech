import { desc } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { coachingBookings } from "@/lib/db/schema";
import { Badge } from "@/components/ui/Badge";
import { BookingActions } from "@/components/dashboard/BookingActions";
import { formatDateTime } from "@/lib/utils";

const statusTone = {
  pending_payment: "amber",
  pending: "navy",
  confirmed: "teal",
  completed: "green",
  cancelled: "red",
} as const;

export default async function AdminBookingsPage() {
  await requireRole("admin");

  const allBookings = await db.query.coachingBookings.findMany({
    orderBy: [desc(coachingBookings.createdAt)],
    with: { user: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Coaching bookings</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Confirm paid bookings and mark sessions complete.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-brand-navy/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-brand-mist text-left text-xs uppercase tracking-wide text-brand-slate">
            <tr>
              <th className="px-4 py-3">Learner</th>
              <th className="px-4 py-3">Topic</th>
              <th className="px-4 py-3">Preferred time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy/5">
            {allBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-brand-navy">{booking.user.name}</p>
                  <p className="text-xs text-brand-slate">{booking.user.email}</p>
                </td>
                <td className="px-4 py-3 text-brand-slate">{booking.topic}</td>
                <td className="px-4 py-3 text-brand-slate">
                  {formatDateTime(booking.preferredDate)}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[booking.status]}>
                    {booking.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <BookingActions booking={booking} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allBookings.length === 0 && (
          <p className="p-6 text-center text-brand-slate">No bookings yet.</p>
        )}
      </div>
    </div>
  );
}
