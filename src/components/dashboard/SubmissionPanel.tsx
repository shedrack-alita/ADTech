"use client";

import { useActionState } from "react";
import { submitAssignmentAction } from "@/lib/actions/learning";
import { initialActionState } from "@/lib/actions/types";
import { FieldGroup, Input, Label, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import type { Submission } from "@/lib/db/types";

const statusTone = {
  submitted: "amber",
  reviewed: "navy",
  approved: "green",
  changes_requested: "red",
} as const;

const statusLabel: Record<Submission["status"], string> = {
  submitted: "Awaiting review",
  reviewed: "Reviewed",
  approved: "Approved",
  changes_requested: "Changes requested",
};

export function SubmissionPanel({
  lessonId,
  enrollmentId,
  submissions,
}: {
  lessonId: string;
  enrollmentId: string;
  submissions: Submission[];
}) {
  const action = submitAssignmentAction.bind(null, enrollmentId);
  const [state, formAction] = useActionState(action, initialActionState);
  const mine = submissions.filter((s) => s.lessonId === lessonId);

  return (
    <div className="mt-4 rounded-xl border border-brand-navy/10 bg-white p-4">
      <h4 className="text-sm font-semibold text-brand-navy">Your submissions</h4>

      {mine.length > 0 && (
        <ul className="mt-3 space-y-2">
          {mine.map((s) => (
            <li key={s.id} className="rounded-lg bg-brand-mist/60 p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <Badge tone={statusTone[s.status]}>{statusLabel[s.status]}</Badge>
                <span className="text-xs text-brand-slate">{formatDateTime(s.submittedAt)}</span>
              </div>
              {s.content && <p className="mt-2 text-brand-navy/80">{s.content}</p>}
              {s.fileUrl && (
                <a href={s.fileUrl} target="_blank" rel="noreferrer" className="mt-1 block text-brand-teal">
                  View submitted work
                </a>
              )}
              {s.feedback && (
                <p className="mt-2 rounded-lg bg-white p-2 text-xs text-brand-navy/70">
                  <span className="font-semibold">Instructor feedback: </span>
                  {s.feedback}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="mt-4">
        <input type="hidden" name="lessonId" value={lessonId} />
        <FormMessage error={state.error} success={state.success} />
        <FieldGroup>
          <Label htmlFor={`content-${lessonId}`}>Written response (optional)</Label>
          <Textarea id={`content-${lessonId}`} name="content" rows={3} />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor={`fileUrl-${lessonId}`}>Link to your work (optional)</Label>
          <Input
            id={`fileUrl-${lessonId}`}
            name="fileUrl"
            type="url"
            placeholder="https://github.com/you/project"
          />
        </FieldGroup>
        <SubmitButton size="sm" className="w-auto px-6">
          Submit assignment
        </SubmitButton>
      </form>
    </div>
  );
}
