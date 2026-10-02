import Link from "next/link";
import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JobRowActions } from "@/components/dashboard/JobRowActions";

export default async function AdminJobsPage() {
  await requireRole("admin");
  const allJobs = await db.query.jobs.findMany({
    orderBy: [desc(jobs.postedAt)],
    with: { requiredCourse: true, applications: true },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Job listings</h1>
          <p className="mt-1 text-sm text-brand-slate">
            Roles posted for certified graduates.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/jobs/new">
            <Plus className="h-4 w-4" /> New job
          </Link>
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {allJobs.map((job) => (
          <div
            key={job.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-navy/10 bg-white p-5"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-brand-navy">{job.title}</p>
                <Badge tone={job.isActive ? "green" : "slate"}>
                  {job.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-brand-slate">
                {job.companyName} · {job.applications.length} applicant(s)
                {job.requiredCourse ? ` · Requires ${job.requiredCourse.title}` : ""}
              </p>
            </div>
            <JobRowActions jobId={job.id} isActive={job.isActive} />
          </div>
        ))}
        {allJobs.length === 0 && (
          <p className="text-brand-slate">No job listings yet.</p>
        )}
      </div>
    </div>
  );
}
