import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { courses, users } from "@/lib/db/schema";
import { AddStaffForm } from "@/components/dashboard/AddStaffForm";
import { StaffRow } from "@/components/dashboard/StaffRow";
import { Card, CardBody } from "@/components/ui/Card";

export default async function CompanyStaffPage() {
  const admin = await requireRole("company_admin");

  const staff = admin.companyId
    ? await db.query.users.findMany({
        where: eq(users.companyId, admin.companyId),
        with: { enrollments: { with: { course: true } } },
        orderBy: (users, { desc }) => [desc(users.createdAt)],
      })
    : [];

  const allCourses = await db
    .select({ id: courses.id, title: courses.title })
    .from(courses)
    .where(eq(courses.published, true));

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Staff & training</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Add staff and assign them the courses their roles need.
      </p>

      <Card className="mt-6">
        <CardBody>
          <h2 className="font-semibold text-brand-navy">Add a staff member</h2>
          <AddStaffForm />
        </CardBody>
      </Card>

      <div className="mt-6 space-y-3">
        {staff.map((member) => (
          <StaffRow key={member.id} member={member} courses={allCourses} />
        ))}
        {staff.length === 0 && (
          <p className="text-brand-slate">No staff added yet.</p>
        )}
      </div>
    </div>
  );
}
