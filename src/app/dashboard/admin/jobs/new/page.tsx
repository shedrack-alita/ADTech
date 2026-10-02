import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { NewJobForm } from "@/components/dashboard/NewJobForm";

export default async function NewJobPage() {
  await requireRole("admin");
  const allCourses = await db
    .select({ id: courses.id, title: courses.title })
    .from(courses)
    .orderBy(courses.title);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">New job listing</h1>
      <div className="mt-6">
        <NewJobForm courses={allCourses} />
      </div>
    </div>
  );
}
