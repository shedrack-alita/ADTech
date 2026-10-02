"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { initialActionState } from "@/lib/actions/types";
import { Card, CardBody } from "@/components/ui/Card";
import { FieldGroup, Input, Label } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialActionState);

  return (
    <Card className="w-full max-w-md">
      <CardBody className="p-8">
        <h1 className="text-2xl font-bold text-brand-navy">Welcome back</h1>
        <p className="mt-1.5 text-sm text-brand-slate">
          Log in to continue learning.
        </p>

        <form action={formAction} className="mt-6">
          <FormMessage error={state.error} />
          <FieldGroup>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </FieldGroup>
          <SubmitButton>Log in</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-brand-slate">
          New here?{" "}
          <Link href="/register" className="font-semibold text-brand-teal">
            Create an account
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-brand-slate">
          Registering a company?{" "}
          <Link href="/register/company" className="font-semibold text-brand-teal">
            Register your team
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
