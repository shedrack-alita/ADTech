import Link from "next/link";
import { eq } from "drizzle-orm";
import { Award, BookOpen, GraduationCap } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { enrollments } from "@/lib/db/schema";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { formatDate } from "@/lib/utils";

export default async function LearnerOverviewPage() {
  const user = await requireRole("learner", "company_admin", "instructor", "admin");

  const myEnrollments = await db.query.enrollments.findMany({
    where: eq(enrollments.userId, user.id),
    with: { course: true, certificate: true },
    orderBy: (enrollments, { desc }) => [desc(enrollments.enrolledAt)],
  });

  const completedCount = myEnrollments.filter((e) => e.status === "completed").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">My Courses</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Continue where you left off, or browse more courses to enroll in.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard icon={BookOpen} label="Enrolled" value={myEnrollments.length} />
        <StatCard icon={GraduationCap} label="Completed" value={completedCount} />
        <StatCard
          icon={Award}
          label="Certificates"
          value={myEnrollments.filter((e) => e.certificate).length}
        />
      </div>

      <div className="mt-8 space-y-4">
        {myEnrollments.length === 0 && (
          <Card>
            <CardBody className="text-center">
              <p className="text-brand-slate">You&apos;re not enrolled in any courses yet.</p>
              <Link href="/courses" className="mt-3 inline-block font-semibold text-brand-teal">
                Browse courses →
              </Link>
            </CardBody>
          </Card>
        )}

        {myEnrollments.map((enrollment) => (
          <Link key={enrollment.id} href={`/dashboard/learner/courses/${enrollment.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-brand-navy">{enrollment.course.title}</h3>
                    {enrollment.status === "completed" && <Badge tone="green">Completed</Badge>}
                    {enrollment.certificate && <Badge tone="teal">Certified</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-brand-slate">
                    Enrolled {formatDate(enrollment.enrolledAt)}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <ProgressBar percent={enrollment.progressPercent} className="w-40" />
                    <span className="text-xs font-medium text-brand-slate">
                      {enrollment.progressPercent}%
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardBody className="flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-lg font-bold text-brand-navy">{value}</p>
          <p className="text-xs text-brand-slate">{label}</p>
        </div>
      </CardBody>
    </Card>
  );
}
