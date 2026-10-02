import Link from "next/link";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";

export default async function InstructorOverviewPage() {
  const user = await requireRole("instructor", "admin");

  const myCourses = await db.query.courses.findMany({
    where: eq(courses.instructorId, user.id),
    with: { enrollments: true },
    orderBy: (courses, { desc }) => [desc(courses.createdAt)],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">My courses</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Courses you teach, and how your students are progressing.
      </p>

      <div className="mt-6 space-y-4">
        {myCourses.length === 0 && (
          <Card>
            <CardBody className="text-center text-brand-slate">
              You haven&apos;t been assigned any courses yet. An admin can
              assign you as the instructor from the course editor.
            </CardBody>
          </Card>
        )}
        {myCourses.map((course) => {
          const active = course.enrollments.length;
          const completed = course.enrollments.filter((e) => e.status === "completed").length;
          return (
            <Link key={course.id} href={`/dashboard/instructor/courses/${course.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardBody className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-brand-navy">{course.title}</h3>
                    <p className="mt-1 text-sm text-brand-slate">
                      {active} enrolled · {completed} completed
                    </p>
                  </div>
                  <Badge tone={course.published ? "green" : "amber"}>
                    {course.published ? "Published" : "Draft"}
                  </Badge>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
