"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/lib/actions/types";
import { initialActionState } from "@/lib/actions/types";
import { FieldGroup, Input, Label, Select, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { Course } from "@/lib/db/types";

interface CourseFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  course?: Course;
  instructors: { id: string; name: string }[];
  submitLabel: string;
}

export function CourseForm({ action, course, instructors, submitLabel }: CourseFormProps) {
  const [state, formAction] = useActionState(action, initialActionState);
  const [isFree, setIsFree] = useState(course?.isFree ?? false);

  return (
    <form action={formAction} className="max-w-2xl">
      <FormMessage error={state.error} success={state.success} />

      <FieldGroup>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={course?.title} required />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="summary">Short summary</Label>
        <Textarea id="summary" name="summary" rows={2} defaultValue={course?.summary} required />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="description">Full description</Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={course?.description}
          required
        />
      </FieldGroup>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            placeholder="e.g. Coding & Programming"
            defaultValue={course?.category}
            required
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="level">Level</Label>
          <Select id="level" name="level" defaultValue={course?.level ?? "beginner"}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </Select>
        </FieldGroup>
      </div>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="durationWeeks">Duration (weeks)</Label>
          <Input
            id="durationWeeks"
            name="durationWeeks"
            type="number"
            min={1}
            defaultValue={course?.durationWeeks ?? 4}
            required
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="priceNaira">Price (₦)</Label>
          <Input
            id="priceNaira"
            name="priceNaira"
            type="number"
            min={0}
            disabled={isFree}
            defaultValue={course?.priceNaira ?? 0}
          />
        </FieldGroup>
      </div>

      <FieldGroup>
        <Label htmlFor="thumbnailUrl">Thumbnail URL (optional)</Label>
        <Input id="thumbnailUrl" name="thumbnailUrl" type="url" defaultValue={course?.thumbnailUrl ?? ""} />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="instructorId">Instructor</Label>
        <Select id="instructorId" name="instructorId" defaultValue={course?.instructorId ?? ""}>
          <option value="">Unassigned</option>
          {instructors.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </Select>
      </FieldGroup>

      <div className="mb-4 flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-brand-navy">
          <input
            type="checkbox"
            name="isFree"
            value="true"
            defaultChecked={course?.isFree}
            onChange={(e) => setIsFree(e.target.checked)}
          />
          Free course
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-navy">
          <input type="checkbox" name="published" value="true" defaultChecked={course?.published} />
          Published (visible on the site)
        </label>
      </div>

      <SubmitButton className="w-auto px-8">{submitLabel}</SubmitButton>
    </form>
  );
}
