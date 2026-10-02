"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { signOutAction } from "@/lib/actions/session";
import { navByRole, roleLabel } from "./nav-config";
import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/auth";

interface TopbarProps {
  name: string;
  role: UserRole;
}

export function Topbar({ name, role }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = navByRole[role];

  return (
    <header className="sticky top-0 z-30 border-b border-brand-navy/10 bg-white">
      <div className="flex items-center justify-between px-4 py-3.5 lg:px-8">
        <button
          className="p-1 text-brand-navy lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="hidden lg:block">
          <p className="text-sm text-brand-slate">
            Welcome back, <span className="font-semibold text-brand-navy">{name.split(" ")[0]}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-brand-navy">{name}</p>
            <p className="text-xs text-brand-slate">{roleLabel[role]}</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
            {initials(name)}
          </span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-full text-brand-navy/60 hover:bg-brand-mist hover:text-brand-navy"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {open && (
        <nav className="border-t border-brand-navy/10 bg-white px-4 py-3 lg:hidden">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  active ? "bg-brand-teal/10 text-brand-teal" : "text-brand-navy/70"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
