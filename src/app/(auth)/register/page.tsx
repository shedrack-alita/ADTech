"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerLearnerAction } from "@/lib/actions/auth";
import { initialActionState } from "@/lib/actions/types";
import { Card, CardBody } from "@/components/ui/Card";
import { FieldGroup, Input, Label } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerLearnerAction, initialActionState);

  return (
    <Card className="w-full max-w-md">
      <CardBody className="p-8">
        <h1 className="text-2xl font-bold text-brand-navy">Create your account</h1>
        <p className="mt-1.5 text-sm text-brand-slate">
          Join Amplify Digital Technologies and start learning.
        </p>

        <form action={formAction} className="mt-6">
          <FormMessage error={state.error} />
          <FieldGroup>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </FieldGroup>
          <SubmitButton>Create account</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-brand-slate">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-teal">
            Log in
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-brand-slate">
          Signing up on behalf of a company?{" "}
          <Link href="/register/company" className="font-semibold text-brand-teal">
            Register your team instead
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
