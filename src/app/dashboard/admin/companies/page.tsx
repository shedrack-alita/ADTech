import { desc, eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { companies, enrollments, users } from "@/lib/db/schema";
import { Card, CardBody } from "@/components/ui/Card";

export default async function AdminCompaniesPage() {
  await requireRole("admin");

  const allCompanies = await db
    .select()
    .from(companies)
    .orderBy(desc(companies.createdAt));

  const withCounts = await Promise.all(
    allCompanies.map(async (company) => {
      const staffCount = await db.$count(users, eq(users.companyId, company.id));
      const enrollmentCount = await db.$count(enrollments, eq(enrollments.companyId, company.id));
      return { ...company, staffCount, enrollmentCount };
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Companies</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Organizations training their teams on Amplify.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {withCounts.map((company) => (
          <Card key={company.id}>
            <CardBody>
              <h3 className="font-semibold text-brand-navy">{company.name}</h3>
              <p className="text-xs text-brand-slate">{company.contactEmail}</p>
              <div className="mt-3 flex gap-4 text-sm text-brand-slate">
                <span>{company.staffCount} staff</span>
                <span>{company.enrollmentCount} enrollments</span>
              </div>
            </CardBody>
          </Card>
        ))}
        {withCounts.length === 0 && (
          <p className="text-brand-slate">No companies registered yet.</p>
        )}
      </div>
    </div>
  );
}
