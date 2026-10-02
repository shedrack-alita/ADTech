"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/actions/profile";
import { initialActionState } from "@/lib/actions/types";
import { FieldGroup, Input, Label, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { User } from "@/lib/db/types";

export function ProfileForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(updateProfileAction, initialActionState);

  return (
    <form action={formAction}>
      <FormMessage error={state.error} success={state.success} />
      <FieldGroup>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={user.email} disabled />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" defaultValue={user.name} required />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={user.phone ?? ""} />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          name="headline"
          placeholder="e.g. Aspiring frontend developer"
          defaultValue={user.headline ?? ""}
        />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={4} defaultValue={user.bio ?? ""} />
      </FieldGroup>
      <SubmitButton className="w-auto px-8">Save changes</SubmitButton>
    </form>
  );
}
