import { eq } from "drizzle-orm";
import { Briefcase, GraduationCap, Users as UsersIcon } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { enrollments, users } from "@/lib/db/schema";
import { Card, CardBody } from "@/components/ui/Card";

export default async function CompanyOverviewPage() {
  const admin = await requireRole("company_admin");

  const staffCount = admin.companyId
    ? await db.$count(users, eq(users.companyId, admin.companyId))
    : 0;
  const enrollmentCount = admin.companyId
    ? await db.$count(enrollments, eq(enrollments.companyId, admin.companyId))
    : 0;
  const completedCount = admin.companyId
    ? (
        await db
          .select({ id: enrollments.id })
          .from(enrollments)
          .where(eq(enrollments.companyId, admin.companyId))
      ).length
    : 0;

  const stats = [
    { icon: UsersIcon, label: "Staff members", value: staffCount },
    { icon: GraduationCap, label: "Course assignments", value: enrollmentCount },
    { icon: Briefcase, label: "In training", value: completedCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Company overview</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Manage your team&apos;s training from here.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardBody className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                <stat.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-bold text-brand-navy">{stat.value}</p>
                <p className="text-xs text-brand-slate">{stat.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
