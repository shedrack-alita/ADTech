import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { courses, users } from "@/lib/db/schema";
import { updateCourseAction } from "@/lib/actions/courses";
import { CourseForm } from "@/components/dashboard/CourseForm";
import { ModuleManager } from "@/components/dashboard/ModuleManager";
import { DeleteCourseButton } from "@/components/dashboard/DeleteCourseButton";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  await requireRole("admin");

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      modules: {
        orderBy: (modules, { asc }) => [asc(modules.position)],
        with: { lessons: { orderBy: (lessons, { asc }) => [asc(lessons.position)] } },
      },
    },
  });
  if (!course) notFound();

  const instructors = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.role, "instructor"));

  const boundUpdate = updateCourseAction.bind(null, courseId);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">{course.title}</h1>
          <p className="mt-1 text-sm text-brand-slate">/courses/{course.slug}</p>
        </div>
        <DeleteCourseButton courseId={course.id} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-brand-navy">Course details</h2>
          <CourseForm
            action={boundUpdate}
            course={course}
            instructors={instructors}
            submitLabel="Save changes"
          />
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-brand-navy">Curriculum</h2>
          <ModuleManager courseId={course.id} modules={course.modules} />
        </div>
      </div>
    </div>
  );
}
