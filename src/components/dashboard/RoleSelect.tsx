"use client";

import { useTransition } from "react";
import { updateUserRoleAction } from "@/lib/actions/admin";
import type { UserRole } from "@/lib/auth";

const roles: UserRole[] = ["learner", "instructor", "company_admin", "admin"];

export function RoleSelect({ userId, role }: { userId: string; role: UserRole }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={role}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as UserRole;
        startTransition(() => updateUserRoleAction(userId, next));
      }}
      className="rounded-lg border border-brand-navy/15 bg-white px-2 py-1 text-xs text-brand-navy"
    >
      {roles.map((r) => (
        <option key={r} value={r}>
          {r.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
