import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { CourseCard } from "@/components/marketing/CourseCard";
import { BackgroundImage } from "@/components/ui/BackgroundImage";
import { IMAGES } from "@/lib/images";

export const metadata = { title: "Courses" };

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const allCourses = await db
    .select()
    .from(courses)
    .where(eq(courses.published, true));

  const categories = Array.from(new Set(allCourses.map((c) => c.category))).sort();
  const filtered = category
    ? allCourses.filter((c) => c.category === category)
    : allCourses;

  return (
    <div>
      <div className="relative overflow-hidden bg-brand-navy py-16">
        <BackgroundImage src={IMAGES.coursesBanner} priority scrim="bg-brand-navy/80" />
        <div className="container-page relative mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Courses & training programs
          </h1>
          <p className="mt-3 text-white/70">
            Practical, hands-on tracks in coding, digital skills, robotics and
            more — each one built to get you certified and job-ready.
          </p>
        </div>
      </div>

      <div className="container-page py-12">
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <FilterPill label="All" active={!category} href="/courses" />
            {categories.map((c) => (
              <FilterPill key={c} label={c} active={category === c} href={`/courses?category=${encodeURIComponent(c)}`} />
            ))}
          </div>
        )}

        <div className="mt-12">
          {filtered.length === 0 ? (
            <p className="text-center text-brand-slate">
              No courses published yet — check back soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPill({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <a
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-brand-navy text-white"
          : "bg-brand-mist text-brand-navy hover:bg-brand-navy/10"
      }`}
    >
      {label}
    </a>
  );
}
