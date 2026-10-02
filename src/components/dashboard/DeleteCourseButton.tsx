"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteCourseAction } from "@/lib/actions/courses";
import { Button } from "@/components/ui/Button";

export function DeleteCourseButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="danger"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Delete this course? This also removes its enrollments and progress.")) {
          startTransition(() => deleteCourseAction(courseId));
        }
      }}
    >
      <Trash2 className="h-4 w-4" /> Delete course
    </Button>
  );
}
