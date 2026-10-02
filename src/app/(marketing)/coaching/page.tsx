import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { IMAGES } from "@/lib/images";
import { BookingForm } from "@/components/marketing/BookingForm";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/utils";

export const metadata = { title: "1-on-1 Coaching" };

const benefits = [
  "Personalized guidance from an experienced tech instructor",
  "Career pathfinding — pick the right track for your goals",
  "Code reviews, project feedback and interview preparation",
  "Flexible scheduling around your availability",
];

export default async function CoachingPage() {
  const user = await getCurrentUser();

  return (
    <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
          Personal Tutor
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-brand-navy sm:text-4xl">
          One-on-one coaching, built around you
        </h1>
        <p className="mt-4 max-w-xl text-brand-slate">
          Whether you&apos;re picking a tech career path, stuck on a project,
          or prepping for interviews, a coaching session gets you unblocked
          with a real instructor — not a chatbot.
        </p>

        <ul className="mt-8 space-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-brand-navy/90">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
              {b}
            </li>
          ))}
        </ul>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl shadow-md">
          <Image
            src={IMAGES.coaching}
            alt="A mentor and learner in a one-on-one coaching session"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>

        <div className="mt-6 rounded-2xl bg-brand-mist p-6">
          <p className="text-3xl font-extrabold text-brand-navy">{formatNaira(15000)}</p>
          <p className="mt-1 text-sm text-brand-slate">per 60-minute session</p>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-brand-navy">Book a session</h2>
        {user ? (
          <BookingForm />
        ) : (
          <div className="mt-5">
            <p className="text-sm text-brand-slate">
              Log in or create an account to book your coaching session.
            </p>
            <Button asChild className="mt-4 w-full">
              <Link href="/login?callbackUrl=/coaching">Log in to book</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
