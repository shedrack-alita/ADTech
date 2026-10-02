"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { navByRole } from "./nav-config";
import type { UserRole } from "@/lib/auth";

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = navByRole[role];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-brand-navy/10 bg-white lg:block">
      <div className="flex h-full flex-col px-4 py-6">
        <Link href="/" className="px-2">
          <Logo />
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-teal/10 text-brand-teal"
                    : "text-brand-navy/70 hover:bg-brand-mist"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
