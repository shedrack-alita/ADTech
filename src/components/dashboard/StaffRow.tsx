"use client";

import { useState, useTransition } from "react";
import { assignCourseToStaffAction } from "@/lib/actions/company";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Select } from "@/components/ui/Field";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import type { Course, Enrollment, User } from "@/lib/db/types";

interface StaffMember extends User {
  enrollments: (Enrollment & { course: Course })[];
}

export function StaffRow({
  member,
  courses,
}: {
  member: StaffMember;
  courses: { id: string; title: string }[];
}) {
  const [selected, setSelected] = useState(courses[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const assignedCourseIds = new Set(member.enrollments.map((e) => e.courseId));
  const availableCourses = courses.filter((c) => !assignedCourseIds.has(c.id));

  function handleAssign() {
    if (!selected) return;
    startTransition(async () => {
      const result = await assignCourseToStaffAction(member.id, selected);
      setMessage(result.error ?? result.success ?? null);
    });
  }

  return (
    <Card>
      <CardBody>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-brand-navy">{member.name}</p>
            <p className="text-xs text-brand-slate">{member.email}</p>
          </div>
          {availableCourses.length > 0 && (
            <div className="flex items-center gap-2">
              <Select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-52"
              >
                {availableCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </Select>
              <Button size="sm" disabled={isPending} onClick={handleAssign} type="button">
                Assign
              </Button>
            </div>
          )}
        </div>

        {message && <p className="mt-2 text-xs text-brand-teal-dark">{message}</p>}

        <div className="mt-4 space-y-2">
          {member.enrollments.map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-brand-navy/80">{e.course.title}</span>
              <div className="flex items-center gap-2">
                <ProgressBar percent={e.progressPercent} className="w-28" />
                <Badge tone={e.status === "completed" ? "green" : "navy"}>
                  {e.status === "completed" ? "Completed" : `${e.progressPercent}%`}
                </Badge>
              </div>
            </div>
          ))}
          {member.enrollments.length === 0 && (
            <p className="text-sm text-brand-slate">No courses assigned yet.</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
