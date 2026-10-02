import Image from "next/image";
import Link from "next/link";
import { BarChart3, CheckCircle2, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BackgroundImage } from "@/components/ui/BackgroundImage";
import { IMAGES } from "@/lib/images";

export const metadata = { title: "Team Training for Companies" };

const steps = [
  {
    icon: UserPlus,
    title: "Register your company",
    description: "Create a company workspace in minutes — you'll be the company admin.",
  },
  {
    icon: Users,
    title: "Add your staff",
    description: "Invite team members and they get their own learner accounts under your company.",
  },
  {
    icon: BarChart3,
    title: "Assign courses & track progress",
    description: "Assign the exact courses each role needs and monitor progress from one dashboard.",
  },
];

const benefits = [
  "One dashboard to manage every staff member's training",
  "Assign different courses to different roles or teams",
  "Track completion, progress and certificates earned",
  "Certified staff become eligible for relevant job opportunities",
];

export default function EnterprisePage() {
  return (
    <div>
      <div className="relative overflow-hidden bg-brand-navy py-20">
        <BackgroundImage src={IMAGES.enterprise} priority scrim="bg-brand-navy/80" />
        <div className="container-page relative text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Train your team, not just an individual
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Register your company, add your staff, and get them trained for
            the exact roles they were hired for — all tracked in one place.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/register/company">Register your company</Link>
          </Button>
        </div>
      </div>

      <div className="container-page py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="rounded-2xl border border-brand-navy/10 p-6">
              <span className="text-xs font-semibold text-brand-teal">STEP {i + 1}</span>
              <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-brand-navy">{step.title}</h3>
              <p className="mt-2 text-sm text-brand-slate">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-mist py-16">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">Why companies choose us</h2>
            <ul className="mt-6 space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-brand-navy/90">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white text-center shadow-sm">
            <div className="relative aspect-[16/9]">
              <Image
                src={IMAGES.enterpriseTeam}
                alt="Staff attending a training session"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-8">
              <p className="text-lg font-semibold text-brand-navy">
                Ready to upskill your team?
              </p>
              <p className="mt-2 text-sm text-brand-slate">
                Set up your company workspace today — it only takes a minute.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link href="/register/company">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
