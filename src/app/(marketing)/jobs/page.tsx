import Link from "next/link";
import { eq } from "drizzle-orm";
import { Briefcase, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BackgroundImage } from "@/components/ui/BackgroundImage";
import { IMAGES } from "@/lib/images";

export const metadata = { title: "Job Opportunities" };

const typeLabel: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

export default async function JobsPage() {
  const user = await getCurrentUser();
  const activeJobs = await db.query.jobs.findMany({
    where: eq(jobs.isActive, true),
    with: { requiredCourse: true },
    orderBy: (jobs, { desc }) => [desc(jobs.postedAt)],
  });

  return (
    <div>
      <div className="relative overflow-hidden bg-brand-navy py-16">
        <BackgroundImage src={IMAGES.jobs} priority scrim="bg-brand-navy/80" />
        <div className="container-page relative mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Job opportunities for our graduates
          </h1>
          <p className="mt-3 text-white/70">
            Complete a course, earn your certificate, and get considered for
            roles from our hiring partners.
          </p>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="mx-auto max-w-3xl space-y-4">
          {activeJobs.length === 0 && (
            <p className="text-center text-brand-slate">
              No open roles right now — check back soon.
            </p>
          )}
          {activeJobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col gap-3 rounded-2xl border border-brand-navy/10 bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="font-semibold text-brand-navy">{job.title}</h2>
                <p className="text-sm text-brand-slate">{job.companyName}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-brand-slate">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" /> {typeLabel[job.type]}
                  </span>
                  {job.requiredCourse && (
                    <Badge tone="teal">Requires: {job.requiredCourse.title} certificate</Badge>
                  )}
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href={user ? "/dashboard/learner/jobs" : "/login?callbackUrl=/dashboard/learner/jobs"}>
                  {user ? "View & apply" : "Log in to apply"}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
