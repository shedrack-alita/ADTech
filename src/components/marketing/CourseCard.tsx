import Image from "next/image";
import Link from "next/link";
import { Clock, Signal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { courseImage } from "@/lib/images";
import { formatNaira } from "@/lib/utils";
import type { Course } from "@/lib/db/types";

const levelLabel: Record<Course["level"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function CourseCard({ course }: { course: Course }) {
  const image = courseImage(course);

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-navy/10 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy-light">
        {image ? (
          <>
            <Image
              src={image}
              alt={course.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 via-transparent to-transparent" />
          </>
        ) : (
          <span className="text-4xl font-black text-white/10">
            {course.category.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-white shadow-sm">
          <Badge tone={course.isFree ? "green" : "teal"}>
            {course.isFree ? "Free" : formatNaira(course.priceNaira)}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
          {course.category}
        </span>
        <h3 className="mt-1.5 font-semibold text-brand-navy group-hover:text-brand-teal">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-brand-slate">
          {course.summary}
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs text-brand-slate">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {course.durationWeeks} weeks
          </span>
          <span className="inline-flex items-center gap-1">
            <Signal className="h-3.5 w-3.5" /> {levelLabel[course.level]}
          </span>
        </div>
      </div>
    </Link>
  );
}
