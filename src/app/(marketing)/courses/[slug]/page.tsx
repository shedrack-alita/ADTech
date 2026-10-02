import { notFound } from "next/navigation";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { BookOpen, CheckCircle2, Clock, PlayCircle, Signal } from "lucide-react";
import { db } from "@/lib/db";
import { courses, enrollments } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { enrollInCourseAction } from "@/lib/actions/courses";
import { Button } from "@/components/ui/Button";
import { BackgroundImage } from "@/components/ui/BackgroundImage";
import { courseImage } from "@/lib/images";
import { formatNaira } from "@/lib/utils";

const levelLabel = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await db.query.courses.findFirst({
    where: and(eq(courses.slug, slug), eq(courses.published, true)),
    with: {
      instructor: true,
      modules: {
        orderBy: (modules, { asc }) => [asc(modules.position)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.position)],
          },
        },
      },
    },
  });

  if (!course) notFound();

  const user = await getCurrentUser();
  let enrollmentId: string | null = null;

  if (user) {
    const [existing] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, course.id)))
      .limit(1);
    enrollmentId = existing?.id ?? null;
  }

  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const heroImage = courseImage(course);

  return (
    <div className="bg-white">
      <div className="relative overflow-hidden bg-brand-navy py-14">
        {heroImage && (
          <BackgroundImage
            src={heroImage}
            scrim="bg-gradient-to-r from-brand-navy/95 via-brand-navy/80 to-brand-navy/50"
          />
        )}
        <div className="container-page relative grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
              {course.category}
            </span>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-white/70">{course.summary}</p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {course.durationWeeks} weeks
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Signal className="h-4 w-4" /> {levelLabel[course.level]}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> {totalLessons} lessons
              </span>
              {course.instructor && <span>Taught by {course.instructor.name}</span>}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <div className="text-3xl font-extrabold text-brand-navy">
              {course.isFree ? "Free" : formatNaira(course.priceNaira)}
            </div>
            <p className="mt-1 text-sm text-brand-slate">
              {course.isFree ? "No cost to enroll" : "One-time payment · lifetime access"}
            </p>

            <div className="mt-5">
              {enrollmentId ? (
                <Button asChild className="w-full">
                  <Link href={`/dashboard/learner/courses/${enrollmentId}`}>
                    Continue learning
                  </Link>
                </Button>
              ) : user ? (
                <form action={enrollInCourseAction.bind(null, course.id)}>
                  <Button type="submit" className="w-full">
                    {course.isFree ? "Enroll for free" : "Enroll now"}
                  </Button>
                </form>
              ) : (
                <Button asChild className="w-full">
                  <Link href={`/login?callbackUrl=/courses/${course.slug}`}>
                    Log in to enroll
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">About this course</h2>
          <p className="mt-3 whitespace-pre-line text-brand-slate">{course.description}</p>

          <h2 className="mt-10 text-xl font-bold text-brand-navy">Curriculum</h2>
          <div className="mt-4 space-y-3">
            {course.modules.map((module, i) => (
              <div key={module.id} className="rounded-xl border border-brand-navy/10">
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="font-semibold text-brand-navy">
                    Module {i + 1}: {module.title}
                  </h3>
                  <span className="text-xs text-brand-slate">
                    {module.lessons.length} lessons
                  </span>
                </div>
                <ul className="divide-y divide-brand-navy/5 border-t border-brand-navy/5">
                  {module.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-brand-slate"
                    >
                      <span className="inline-flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-brand-teal" /> {lesson.title}
                      </span>
                      <span>{lesson.durationMinutes} min</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {course.modules.length === 0 && (
              <p className="text-sm text-brand-slate">Curriculum coming soon.</p>
            )}
          </div>
        </div>

        <aside>
          <div className="rounded-2xl bg-brand-mist p-6">
            <h3 className="font-semibold text-brand-navy">What you get</h3>
            <ul className="mt-4 space-y-3 text-sm text-brand-slate">
              {[
                "Hands-on projects and practical exercises",
                "Direct messaging with your instructor",
                "Progress tracking on your learner dashboard",
                "A verified certificate on completion",
                "Eligibility for related job opportunities",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
