import { notFound } from "next/navigation";
import Link from "next/link";
import { and, asc, eq } from "drizzle-orm";
import { Award, MessageCircle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { enrollments, messages, submissions } from "@/lib/db/schema";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { LessonItem } from "@/components/dashboard/LessonItem";
import { MessageThread } from "@/components/dashboard/MessageThread";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ enrollmentId: string }>;
}) {
  const { enrollmentId } = await params;
  const user = await requireUser();

  const enrollment = await db.query.enrollments.findFirst({
    where: and(eq(enrollments.id, enrollmentId), eq(enrollments.userId, user.id)),
    with: {
      certificate: true,
      lessonProgress: true,
      course: {
        with: {
          instructor: true,
          modules: {
            orderBy: (modules, { asc }) => [asc(modules.position)],
            with: {
              lessons: { orderBy: (lessons, { asc }) => [asc(lessons.position)] },
            },
          },
        },
      },
    },
  });

  if (!enrollment) notFound();

  const completedLessonIds = new Set(
    enrollment.lessonProgress.filter((p) => p.completed).map((p) => p.lessonId)
  );

  const mySubmissions = await db
    .select()
    .from(submissions)
    .where(eq(submissions.enrollmentId, enrollmentId));

  const thread = await db.query.messages.findMany({
    where: eq(messages.enrollmentId, enrollmentId),
    orderBy: asc(messages.createdAt),
    with: { sender: true },
  });

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
            {enrollment.course.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-brand-navy">{enrollment.course.title}</h1>
          {enrollment.course.instructor && (
            <p className="mt-1 text-sm text-brand-slate">
              Instructor: {enrollment.course.instructor.name}
            </p>
          )}
        </div>
        {enrollment.certificate ? (
          <Button asChild variant="outline">
            <Link href={`/certificate/${enrollment.certificate.certificateNumber}`}>
              <Award className="h-4 w-4" /> View certificate
            </Link>
          </Button>
        ) : (
          <Badge tone="teal">{enrollment.progressPercent}% complete</Badge>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <ProgressBar percent={enrollment.progressPercent} className="max-w-sm" />
        <span className="text-sm font-medium text-brand-slate">
          {enrollment.progressPercent}%
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-brand-navy/10 bg-white">
          <div className="border-b border-brand-navy/10 px-4 py-3">
            <h2 className="font-semibold text-brand-navy">Curriculum</h2>
          </div>
          {enrollment.course.modules.map((module, i) => (
            <div key={module.id} className="border-b border-brand-navy/5 last:border-b-0">
              <div className="bg-brand-mist/50 px-4 py-2 text-sm font-semibold text-brand-navy">
                Module {i + 1}: {module.title}
              </div>
              {module.lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  enrollmentId={enrollment.id}
                  completed={completedLessonIds.has(lesson.id)}
                  submissions={mySubmissions}
                />
              ))}
            </div>
          ))}
          {enrollment.course.modules.length === 0 && (
            <p className="p-4 text-sm text-brand-slate">
              Curriculum for this course is being finalized.
            </p>
          )}
        </div>

        <div className="flex h-[520px] flex-col rounded-2xl border border-brand-navy/10 bg-white">
          <div className="flex items-center gap-2 border-b border-brand-navy/10 px-4 py-3">
            <MessageCircle className="h-4 w-4 text-brand-teal" />
            <h2 className="font-semibold text-brand-navy">Messages</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <MessageThread
              enrollmentId={enrollment.id}
              messages={thread}
              currentUserId={user.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
