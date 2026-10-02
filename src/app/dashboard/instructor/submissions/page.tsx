import { desc, eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { courses, lessons, modules, submissions, users } from "@/lib/db/schema";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { ReviewSubmissionForm } from "@/components/dashboard/ReviewSubmissionForm";
import { formatDateTime } from "@/lib/utils";

const statusTone = {
  submitted: "amber",
  reviewed: "navy",
  approved: "green",
  changes_requested: "red",
} as const;

export default async function InstructorSubmissionsPage() {
  const user = await requireRole("instructor", "admin");

  const baseQuery = db
    .select({
      submission: submissions,
      lessonTitle: lessons.title,
      courseTitle: courses.title,
      studentName: users.name,
      studentEmail: users.email,
    })
    .from(submissions)
    .innerJoin(lessons, eq(submissions.lessonId, lessons.id))
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .innerJoin(courses, eq(modules.courseId, courses.id))
    .innerJoin(users, eq(submissions.userId, users.id));

  const rows =
    user.role === "admin"
      ? await baseQuery.orderBy(desc(submissions.submittedAt))
      : await baseQuery
          .where(eq(courses.instructorId, user.id))
          .orderBy(desc(submissions.submittedAt));

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Submissions to review</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Assignment submissions from students across your courses.
      </p>

      <div className="mt-6 space-y-4">
        {rows.length === 0 && (
          <Card>
            <CardBody className="text-center text-brand-slate">
              No submissions yet.
            </CardBody>
          </Card>
        )}
        {rows.map(({ submission, lessonTitle, courseTitle, studentName, studentEmail }) => (
          <Card key={submission.id}>
            <CardBody>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-navy">{lessonTitle}</p>
                  <p className="text-xs text-brand-slate">
                    {courseTitle} · {studentName} ({studentEmail})
                  </p>
                </div>
                <Badge tone={statusTone[submission.status]}>
                  {formatDateTime(submission.submittedAt)}
                </Badge>
              </div>
              {submission.content && (
                <p className="mt-3 text-sm text-brand-navy/80">{submission.content}</p>
              )}
              {submission.fileUrl && (
                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block text-sm text-brand-teal"
                >
                  View submitted work
                </a>
              )}
              <ReviewSubmissionForm submissionId={submission.id} />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
