"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerCompanyAction } from "@/lib/actions/auth";
import { initialActionState } from "@/lib/actions/types";
import { Card, CardBody } from "@/components/ui/Card";
import { FieldGroup, Input, Label } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function RegisterCompanyPage() {
  const [state, formAction] = useActionState(registerCompanyAction, initialActionState);

  return (
    <Card className="w-full max-w-lg">
      <CardBody className="p-8">
        <h1 className="text-2xl font-bold text-brand-navy">Register your company</h1>
        <p className="mt-1.5 text-sm text-brand-slate">
          Create a company workspace so you can add staff and assign them
          training for their roles.
        </p>

        <form action={formAction} className="mt-6">
          <FormMessage error={state.error} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            <FieldGroup>
              <Label htmlFor="companyName">Company name</Label>
              <Input id="companyName" name="companyName" required />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="industry">Industry (optional)</Label>
              <Input id="industry" name="industry" />
            </FieldGroup>
          </div>

          <div className="grid gap-x-4 sm:grid-cols-2">
            <FieldGroup>
              <Label htmlFor="contactPhone">Company phone (optional)</Label>
              <Input id="contactPhone" name="contactPhone" type="tel" />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="address">Address (optional)</Label>
              <Input id="address" name="address" />
            </FieldGroup>
          </div>

          <hr className="my-5 border-brand-navy/10" />
          <p className="mb-3 text-sm font-semibold text-brand-navy">
            Company admin account
          </p>

          <FieldGroup>
            <Label htmlFor="adminName">Your full name</Label>
            <Input id="adminName" name="adminName" required autoComplete="name" />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="email">Work email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
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

          <SubmitButton>Create company workspace</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-brand-slate">
          Signing up as an individual learner?{" "}
          <Link href="/register" className="font-semibold text-brand-teal">
            Register here
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
