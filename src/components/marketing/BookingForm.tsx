"use client";

import { useActionState } from "react";
import { createBookingAction } from "@/lib/actions/bookings";
import { initialActionState } from "@/lib/actions/types";
import { FieldGroup, Input, Label, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function BookingForm() {
  const [state, formAction] = useActionState(createBookingAction, initialActionState);

  return (
    <form action={formAction} className="mt-5">
      <FormMessage error={state.error} success={state.success} />
      <FieldGroup>
        <Label htmlFor="topic">What do you need help with?</Label>
        <Input id="topic" name="topic" placeholder="e.g. Choosing a career path in tech" required />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="preferredDate">Preferred date & time</Label>
        <Input id="preferredDate" name="preferredDate" type="datetime-local" required />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="notes">Anything else we should know? (optional)</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </FieldGroup>
      <SubmitButton>Continue to payment</SubmitButton>
      <p className="mt-3 text-center text-xs text-brand-slate">
        You&apos;ll be redirected to Paystack to complete a secure payment.
      </p>
    </form>
  );
}
