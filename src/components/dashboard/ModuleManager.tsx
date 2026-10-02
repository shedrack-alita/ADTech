"use client";

import { useActionState, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  createLessonAction,
  createModuleAction,
  deleteLessonAction,
  deleteModuleAction,
} from "@/lib/actions/courses";
import { initialActionState } from "@/lib/actions/types";
import { Button } from "@/components/ui/Button";
import { FieldGroup, Input, Label, Select, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Card, CardBody } from "@/components/ui/Card";
import type { Lesson, Module } from "@/lib/db/types";

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export function ModuleManager({
  courseId,
  modules,
}: {
  courseId: string;
  modules: ModuleWithLessons[];
}) {
  return (
    <div className="space-y-5">
      {modules.map((module, i) => (
        <Card key={module.id}>
          <CardBody>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-brand-navy">
                Module {i + 1}: {module.title}
              </h3>
              <DeleteModuleButton courseId={courseId} moduleId={module.id} />
            </div>

            <ul className="mt-3 divide-y divide-brand-navy/5 rounded-lg border border-brand-navy/10">
              {module.lessons.map((lesson) => (
                <li key={lesson.id} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span>
                    {lesson.title}{" "}
                    <span className="text-xs text-brand-slate">
                      ({lesson.type}, {lesson.durationMinutes}min)
                    </span>
                  </span>
                  <DeleteLessonButton courseId={courseId} lessonId={lesson.id} />
                </li>
              ))}
              {module.lessons.length === 0 && (
                <li className="px-3 py-2 text-sm text-brand-slate">No lessons yet.</li>
              )}
            </ul>

            <AddLessonForm courseId={courseId} moduleId={module.id} nextPosition={module.lessons.length} />
          </CardBody>
        </Card>
      ))}

      <Card>
        <CardBody>
          <h3 className="font-semibold text-brand-navy">Add a module</h3>
          <AddModuleForm courseId={courseId} nextPosition={modules.length} />
        </CardBody>
      </Card>
    </div>
  );
}

function AddModuleForm({ courseId, nextPosition }: { courseId: string; nextPosition: number }) {
  const action = createModuleAction.bind(null, courseId);
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="mt-3 flex items-end gap-3">
      <FormMessage error={state.error} success={state.success} />
      <div className="flex-1">
        <Label htmlFor={`module-title-${courseId}`}>Module title</Label>
        <Input id={`module-title-${courseId}`} name="title" required />
      </div>
      <input type="hidden" name="position" value={nextPosition} />
      <SubmitButton className="w-auto px-5">
        <Plus className="h-4 w-4" /> Add
      </SubmitButton>
    </form>
  );
}

function AddLessonForm({
  courseId,
  moduleId,
  nextPosition,
}: {
  courseId: string;
  moduleId: string;
  nextPosition: number;
}) {
  const action = createLessonAction.bind(null, courseId, moduleId);
  const [state, formAction] = useActionState(action, initialActionState);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button variant="ghost" size="sm" className="mt-3" onClick={() => setOpen(true)} type="button">
        <Plus className="h-4 w-4" /> Add lesson
      </Button>
    );
  }

  return (
    <form action={formAction} className="mt-3 rounded-lg bg-brand-mist/60 p-3">
      <FormMessage error={state.error} success={state.success} />
      <FieldGroup>
        <Label htmlFor={`lesson-title-${moduleId}`}>Lesson title</Label>
        <Input id={`lesson-title-${moduleId}`} name="title" required />
      </FieldGroup>
      <div className="grid gap-x-3 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor={`lesson-type-${moduleId}`}>Type</Label>
          <Select id={`lesson-type-${moduleId}`} name="type" defaultValue="reading">
            <option value="reading">Reading</option>
            <option value="video">Video</option>
            <option value="assignment">Assignment</option>
            <option value="quiz">Quiz</option>
          </Select>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor={`lesson-duration-${moduleId}`}>Duration (minutes)</Label>
          <Input
            id={`lesson-duration-${moduleId}`}
            name="durationMinutes"
            type="number"
            min={1}
            defaultValue={15}
          />
        </FieldGroup>
      </div>
      <FieldGroup>
        <Label htmlFor={`lesson-video-${moduleId}`}>Video URL (optional)</Label>
        <Input id={`lesson-video-${moduleId}`} name="videoUrl" type="url" />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor={`lesson-content-${moduleId}`}>Content / instructions</Label>
        <Textarea id={`lesson-content-${moduleId}`} name="content" rows={3} />
      </FieldGroup>
      <input type="hidden" name="position" value={nextPosition} />
      <div className="flex gap-2">
        <SubmitButton className="w-auto px-6">Save lesson</SubmitButton>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function DeleteModuleButton({ courseId, moduleId }: { courseId: string; moduleId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Delete this module and all its lessons?")) {
          startTransition(() => deleteModuleAction(courseId, moduleId));
        }
      }}
      className="text-brand-slate hover:text-red-600 disabled:opacity-50"
      aria-label="Delete module"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function DeleteLessonButton({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Delete this lesson?")) {
          startTransition(() => deleteLessonAction(courseId, lessonId));
        }
      }}
      className="text-brand-slate hover:text-red-600 disabled:opacity-50"
      aria-label="Delete lesson"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
