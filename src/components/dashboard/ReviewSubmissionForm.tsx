"use client";

import { useActionState } from "react";
import { reviewSubmissionAction } from "@/lib/actions/learning";
import { initialActionState } from "@/lib/actions/types";
import { FieldGroup, Select, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ReviewSubmissionForm({ submissionId }: { submissionId: string }) {
  const [state, formAction] = useActionState(reviewSubmissionAction, initialActionState);

  return (
    <form action={formAction} className="mt-3 rounded-lg bg-brand-mist/60 p-3">
      <input type="hidden" name="submissionId" value={submissionId} />
      <FormMessage error={state.error} success={state.success} />
      <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
        <FieldGroup>
          <Select name="status" defaultValue="reviewed">
            <option value="reviewed">Mark reviewed</option>
            <option value="approved">Approve</option>
            <option value="changes_requested">Request changes</option>
          </Select>
        </FieldGroup>
        <FieldGroup>
          <Textarea name="feedback" rows={2} placeholder="Feedback for the student (optional)" />
        </FieldGroup>
      </div>
      <SubmitButton size="sm" className="w-auto px-6">
        Save feedback
      </SubmitButton>
    </form>
  );
}
