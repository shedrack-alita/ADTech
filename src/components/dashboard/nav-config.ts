import {
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  Contact2,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  UserCog,
  Users,
} from "lucide-react";
import type { UserRole } from "@/lib/auth";

export const navByRole: Record<
  UserRole,
  { href: string; label: string; icon: typeof LayoutDashboard }[]
> = {
  learner: [
    { href: "/dashboard/learner", label: "My Courses", icon: BookOpen },
    { href: "/dashboard/learner/bookings", label: "Coaching Bookings", icon: CalendarCheck },
    { href: "/dashboard/learner/jobs", label: "Job Opportunities", icon: Briefcase },
    { href: "/dashboard/profile", label: "Profile", icon: UserCog },
  ],
  instructor: [
    { href: "/dashboard/instructor", label: "My Courses", icon: GraduationCap },
    { href: "/dashboard/instructor/submissions", label: "Submissions", icon: LayoutDashboard },
    { href: "/dashboard/instructor/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/profile", label: "Profile", icon: UserCog },
  ],
  company_admin: [
    { href: "/dashboard/company", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/company/staff", label: "Staff & Training", icon: Users },
    { href: "/dashboard/profile", label: "Profile", icon: UserCog },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/enrollments", label: "Enrollments", icon: GraduationCap },
    { href: "/dashboard/admin/bookings", label: "Coaching Bookings", icon: CalendarCheck },
    { href: "/dashboard/admin/companies", label: "Companies", icon: Building2 },
    { href: "/dashboard/admin/jobs", label: "Jobs", icon: Briefcase },
    { href: "/dashboard/admin/inquiries", label: "Inquiries", icon: Contact2 },
  ],
};

export const roleLabel: Record<UserRole, string> = {
  learner: "Learner",
  instructor: "Instructor",
  company_admin: "Company Admin",
  admin: "Administrator",
};
