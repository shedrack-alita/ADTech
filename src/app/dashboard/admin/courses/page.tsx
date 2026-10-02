import Link from "next/link";
import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/utils";

export default async function AdminCoursesPage() {
  await requireRole("admin");
  const allCourses = await db.query.courses.findMany({
    orderBy: [desc(courses.createdAt)],
    with: { instructor: true, modules: { with: { lessons: true } } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Courses</h1>
          <p className="mt-1 text-sm text-brand-slate">Manage your course catalog.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/courses/new">
            <Plus className="h-4 w-4" /> New course
          </Link>
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-brand-navy/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-brand-mist text-left text-xs uppercase tracking-wide text-brand-slate">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Instructor</th>
              <th className="px-4 py-3">Lessons</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy/5">
            {allCourses.map((course) => {
              const lessonCount = course.modules.reduce((n, m) => n + m.lessons.length, 0);
              return (
                <tr key={course.id} className="hover:bg-brand-mist/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/admin/courses/${course.id}`}
                      className="font-medium text-brand-navy hover:text-brand-teal"
                    >
                      {course.title}
                    </Link>
                    <p className="text-xs text-brand-slate">{course.category}</p>
                  </td>
                  <td className="px-4 py-3 text-brand-slate">
                    {course.instructor?.name ?? "Unassigned"}
                  </td>
                  <td className="px-4 py-3 text-brand-slate">{lessonCount}</td>
                  <td className="px-4 py-3 text-brand-slate">
                    {formatNaira(course.priceNaira)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={course.published ? "green" : "amber"}>
                      {course.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {allCourses.length === 0 && (
          <p className="p-6 text-center text-brand-slate">No courses yet.</p>
        )}
      </div>
    </div>
  );
}
