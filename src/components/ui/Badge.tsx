import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "teal" | "navy" | "slate" | "green" | "amber" | "red";

const tones: Record<Tone, string> = {
  teal: "bg-brand-teal/10 text-brand-teal-dark",
  navy: "bg-brand-navy/10 text-brand-navy",
  slate: "bg-brand-slate/10 text-brand-slate",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "navy", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
