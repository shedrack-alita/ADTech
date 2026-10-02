import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  coachingBookings,
  companies,
  courses,
  enrollments,
  inquiries,
  jobs,
  users,
} from "@/lib/db/schema";
import { Card, CardBody } from "@/components/ui/Card";
import {
  Briefcase,
  Building2,
  CalendarCheck,
  Contact2,
  GraduationCap,
  Users as UsersIcon,
} from "lucide-react";

export default async function AdminOverviewPage() {
  await requireRole("admin");

  const [
    userCount,
    courseCount,
    enrollmentCount,
    companyCount,
    pendingBookings,
    jobCount,
    newInquiries,
  ] = await Promise.all([
    db.$count(users),
    db.$count(courses),
    db.$count(enrollments),
    db.$count(companies),
    db.$count(coachingBookings),
    db.$count(jobs),
    db.$count(inquiries),
  ]);

  const stats = [
    { icon: UsersIcon, label: "Users", value: userCount },
    { icon: GraduationCap, label: "Courses", value: courseCount },
    { icon: GraduationCap, label: "Enrollments", value: enrollmentCount },
    { icon: Building2, label: "Companies", value: companyCount },
    { icon: CalendarCheck, label: "Coaching bookings", value: pendingBookings },
    { icon: Briefcase, label: "Job listings", value: jobCount },
    { icon: Contact2, label: "Contact inquiries", value: newInquiries },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Admin overview</h1>
      <p className="mt-1 text-sm text-brand-slate">
        A snapshot of everything happening on the platform.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
