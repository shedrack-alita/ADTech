"use client";

import { useActionState } from "react";
import { addStaffAction } from "@/lib/actions/company";
import { initialActionState } from "@/lib/actions/types";
import { FieldGroup, Input, Label } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function AddStaffForm() {
  const [state, formAction] = useActionState(addStaffAction, initialActionState);

  return (
    <form action={formAction} className="mt-4 grid gap-4 sm:grid-cols-3">
      <FormMessage error={state.error} success={state.success} />
      <FieldGroup>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="password">Temporary password</Label>
        <Input id="password" name="password" type="text" minLength={8} required />
      </FieldGroup>
      <div className="sm:col-span-3">
        <SubmitButton className="w-auto px-8">Add staff member</SubmitButton>
      </div>
    </form>
  );
}
