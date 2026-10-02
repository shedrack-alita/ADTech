import { desc } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { RoleSelect } from "@/components/dashboard/RoleSelect";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const currentUser = await requireRole("admin");

  const allUsers = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
    with: { company: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Users</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Everyone with an account on the platform.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-brand-navy/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-brand-mist text-left text-xs uppercase tracking-wide text-brand-slate">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy/5">
            {allUsers.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-brand-navy">{u.name}</p>
                  <p className="text-xs text-brand-slate">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-brand-slate">{u.company?.name ?? "—"}</td>
                <td className="px-4 py-3 text-brand-slate">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3">
                  {u.id === currentUser.id ? (
                    <span className="text-xs text-brand-slate">You</span>
                  ) : (
                    <RoleSelect userId={u.id} role={u.role} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
