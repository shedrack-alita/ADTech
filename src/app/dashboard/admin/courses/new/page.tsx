import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createCourseAction } from "@/lib/actions/courses";
import { CourseForm } from "@/components/dashboard/CourseForm";

export default async function NewCoursePage() {
  await requireRole("admin");
  const instructors = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.role, "instructor"));

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">New course</h1>
      <p className="mt-1 text-sm text-brand-slate">
        You can add modules and lessons after creating the course.
      </p>
      <div className="mt-6">
        <CourseForm action={createCourseAction} instructors={instructors} submitLabel="Create course" />
      </div>
    </div>
  );
}
