"use client";

import { useActionState } from "react";
import { submitContactAction } from "@/lib/actions/contact";
import { initialActionState } from "@/lib/actions/types";
import { FieldGroup, Input, Label, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactAction, initialActionState);

  return (
    <form action={formAction}>
      <FormMessage error={state.error} success={state.success} />
      <div className="grid gap-x-4 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </FieldGroup>
      </div>
      <FieldGroup>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" required />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={5} required />
      </FieldGroup>
      <SubmitButton>Send message</SubmitButton>
    </form>
  );
}
