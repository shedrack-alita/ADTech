import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

const destinationByRole = {
  learner: "/dashboard/learner",
  instructor: "/dashboard/instructor",
  company_admin: "/dashboard/company",
  admin: "/dashboard/admin",
} as const;

export default async function DashboardIndexPage() {
  const user = await getCurrentUser();
  redirect(user ? destinationByRole[user.role] : "/login");
}
