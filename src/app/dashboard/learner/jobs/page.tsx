import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { certificates, enrollments, jobApplications, jobs } from "@/lib/db/schema";
import { JobCard } from "@/components/dashboard/JobCard";

export default async function LearnerJobsPage() {
  const user = await requireUser();

  const activeJobs = await db.query.jobs.findMany({
    where: eq(jobs.isActive, true),
    with: { requiredCourse: true },
    orderBy: (jobs, { desc }) => [desc(jobs.postedAt)],
  });

  const myCertifiedCourseIds = new Set(
    (
      await db
        .select({ courseId: enrollments.courseId })
        .from(certificates)
        .innerJoin(enrollments, eq(certificates.enrollmentId, enrollments.id))
        .where(eq(enrollments.userId, user.id))
    ).map((r) => r.courseId)
  );

  const myApplications = new Set(
    (
      await db
        .select({ jobId: jobApplications.jobId })
        .from(jobApplications)
        .where(eq(jobApplications.userId, user.id))
    ).map((r) => r.jobId)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Job opportunities</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Roles from our hiring partners — some require a specific course
        certificate.
      </p>

      <div className="mt-6 space-y-4">
        {activeJobs.length === 0 && (
          <p className="text-brand-slate">No open roles right now — check back soon.</p>
        )}
        {activeJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            eligible={!job.requiredCourseId || myCertifiedCourseIds.has(job.requiredCourseId)}
            alreadyApplied={myApplications.has(job.id)}
          />
        ))}
      </div>
    </div>
  );
}
