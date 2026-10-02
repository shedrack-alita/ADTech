"use client";

import { useActionState } from "react";
import { createJobAction } from "@/lib/actions/jobs";
import { initialActionState } from "@/lib/actions/types";
import { FieldGroup, Input, Label, Select, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function NewJobForm({ courses }: { courses: { id: string; title: string }[] }) {
  const [state, formAction] = useActionState(createJobAction, initialActionState);

  return (
    <form action={formAction} className="max-w-xl">
      <FormMessage error={state.error} />
      <FieldGroup>
        <Label htmlFor="title">Job title</Label>
        <Input id="title" name="title" required />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="companyName">Hiring company</Label>
        <Input id="companyName" name="companyName" required />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} required />
      </FieldGroup>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue="Remote" required />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="type">Job type</Label>
          <Select id="type" name="type" defaultValue="full_time">
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </Select>
        </FieldGroup>
      </div>
      <FieldGroup>
        <Label htmlFor="requiredCourseId">Required course certificate (optional)</Label>
        <Select id="requiredCourseId" name="requiredCourseId" defaultValue="">
          <option value="">None — open to all</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </Select>
      </FieldGroup>
      <label className="mb-4 flex items-center gap-2 text-sm text-brand-navy">
        <input type="checkbox" name="isActive" value="true" defaultChecked />
        Active (visible on the site)
      </label>
      <SubmitButton className="w-auto px-8">Publish job</SubmitButton>
    </form>
  );
}
