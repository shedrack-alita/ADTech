import { desc } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { formatDate } from "@/lib/utils";

export default async function AdminEnrollmentsPage() {
  await requireRole("admin");

  const allEnrollments = await db.query.enrollments.findMany({
    orderBy: [desc(enrollments.enrolledAt)],
    with: { user: true, course: true, company: true, certificate: true },
    limit: 200,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Enrollments</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Every learner-to-course enrollment on the platform (most recent 200).
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-brand-navy/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-brand-mist text-left text-xs uppercase tracking-wide text-brand-slate">
            <tr>
              <th className="px-4 py-3">Learner</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Via company</th>
              <th className="px-4 py-3">Enrolled</th>
              <th className="px-4 py-3">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy/5">
            {allEnrollments.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-brand-navy">{e.user.name}</p>
                  <p className="text-xs text-brand-slate">{e.user.email}</p>
                </td>
                <td className="px-4 py-3 text-brand-slate">{e.course.title}</td>
                <td className="px-4 py-3 text-brand-slate">{e.company?.name ?? "—"}</td>
                <td className="px-4 py-3 text-brand-slate">{formatDate(e.enrolledAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ProgressBar percent={e.progressPercent} className="w-24" />
                    {e.certificate ? (
                      <Badge tone="green">Certified</Badge>
                    ) : (
                      <span className="text-xs text-brand-slate">{e.progressPercent}%</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allEnrollments.length === 0 && (
          <p className="p-6 text-center text-brand-slate">No enrollments yet.</p>
        )}
      </div>
    </div>
  );
}
