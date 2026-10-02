"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, Loader2, PlayCircle } from "lucide-react";
import { toggleLessonCompleteAction } from "@/lib/actions/learning";
import { cn } from "@/lib/utils";
import { SubmissionPanel } from "./SubmissionPanel";
import type { Lesson, Submission } from "@/lib/db/types";

interface LessonItemProps {
  lesson: Lesson;
  enrollmentId: string;
  completed: boolean;
  submissions: Submission[];
}

export function LessonItem({ lesson, enrollmentId, completed, submissions }: LessonItemProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [localCompleted, setLocalCompleted] = useState(completed);

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    const next = !localCompleted;
    setLocalCompleted(next);
    startTransition(() => {
      toggleLessonCompleteAction(enrollmentId, lesson.id, next);
    });
  }

  return (
    <div className="border-b border-brand-navy/5 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-brand-mist/60"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span onClick={handleToggle} className="shrink-0">
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-brand-teal" />
            ) : localCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-brand-teal" />
            ) : (
              <Circle className="h-5 w-5 text-brand-navy/25" />
            )}
          </span>
          <span className={cn("truncate text-sm", localCompleted && "text-brand-slate line-through")}>
            {lesson.title}
          </span>
        </span>
        <span className="shrink-0 text-xs text-brand-slate">{lesson.durationMinutes} min</span>
      </button>

      {open && (
        <div className="bg-brand-mist/40 px-4 py-4">
          {lesson.videoUrl && (
            <a
              href={lesson.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-teal"
            >
              <PlayCircle className="h-4 w-4" /> Watch video lesson
            </a>
          )}
          {lesson.content && (
            <p className="whitespace-pre-line text-sm text-brand-navy/80">{lesson.content}</p>
          )}
          {lesson.type === "assignment" && (
            <SubmissionPanel
              lessonId={lesson.id}
              enrollmentId={enrollmentId}
              submissions={submissions}
            />
          )}
        </div>
      )}
    </div>
  );
}
