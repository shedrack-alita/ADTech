"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteJobAction, toggleJobActiveAction } from "@/lib/actions/jobs";
import { Button } from "@/components/ui/Button";

export function JobRowActions({ jobId, isActive }: { jobId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => startTransition(() => toggleJobActiveAction(jobId, !isActive))}
      >
        {isActive ? "Deactivate" : "Activate"}
      </Button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("Delete this job listing?")) {
            startTransition(() => deleteJobAction(jobId));
          }
        }}
        className="text-brand-slate hover:text-red-600"
        aria-label="Delete job"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
