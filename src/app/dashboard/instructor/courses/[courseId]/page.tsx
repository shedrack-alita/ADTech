import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { formatDate } from "@/lib/utils";

export default async function InstructorCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const user = await requireRole("instructor", "admin");

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      enrollments: {
        with: { user: true, certificate: true },
        orderBy: (enrollments, { desc }) => [desc(enrollments.enrolledAt)],
      },
    },
  });

  if (!course) notFound();
  if (user.role === "instructor" && course.instructorId !== user.id) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">{course.title}</h1>
      <p className="mt-1 text-sm text-brand-slate">Student roster and progress.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-brand-navy/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-brand-mist text-left text-xs uppercase tracking-wide text-brand-slate">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Enrolled</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy/5">
            {course.enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-brand-navy">{enrollment.user.name}</p>
                  <p className="text-xs text-brand-slate">{enrollment.user.email}</p>
                </td>
                <td className="px-4 py-3 text-brand-slate">
                  {formatDate(enrollment.enrolledAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ProgressBar percent={enrollment.progressPercent} className="w-28" />
                    <span className="text-xs text-brand-slate">{enrollment.progressPercent}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={enrollment.status === "completed" ? "green" : "navy"}>
                    {enrollment.status === "completed" ? "Completed" : "Active"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {course.enrollments.length === 0 && (
          <p className="p-6 text-center text-brand-slate">No students enrolled yet.</p>
        )}
      </div>

      <Card className="mt-8">
        <CardBody>
          <p className="text-sm text-brand-slate">
            Need to update the syllabus, add modules or lessons? Course
            content is managed by an administrator — reach out and they can
            update it for you.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
