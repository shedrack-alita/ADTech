import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  Cpu,
  GraduationCap,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { Button } from "@/components/ui/Button";
import { BackgroundImage } from "@/components/ui/BackgroundImage";
import { CourseCard } from "@/components/marketing/CourseCard";
import { IMAGES } from "@/lib/images";

const learnPoints = [
  "Hands-on projects and practical exercises in every course",
  "Direct messaging with your instructor and progress tracking",
  "A verified certificate, and job opportunities for graduates",
];

const services = [
  {
    icon: MonitorSmartphone,
    title: "Hybrid Coding & Programming",
    description: "Learn coding with hands-on projects and real-world applications.",
  },
  {
    icon: Users,
    title: "Digital Literacy Awareness",
    description: "Building digital confidence for students, professionals and communities.",
  },
  {
    icon: Briefcase,
    title: "Tech Career Pathfinding",
    description: "Discover the right tech career path and prepare for opportunities.",
  },
  {
    icon: GraduationCap,
    title: "Personal Tutoring & Coaching",
    description: "One-on-one personalized coaching to help you learn better and faster.",
  },
  {
    icon: Cpu,
    title: "IoT & Embedded Systems",
    description: "Learn to design smart connected devices and embedded solutions.",
  },
  {
    icon: Sparkles,
    title: "Robotics & Automation",
    description: "Build and program robots, and learn industrial automation for modern systems.",
  },
];

const whyChoose = [
  { icon: GraduationCap, label: "Expert Instructors" },
  { icon: MonitorSmartphone, label: "Practical Projects" },
  { icon: Award, label: "Certification Available" },
  { icon: Users, label: "Hands-on Learning" },
  { icon: Briefcase, label: "Career Support" },
  { icon: Target, label: "Flexible Learning" },
];

const brandPillars = [
  { icon: ShieldCheck, label: "Trust & Reliability" },
  { icon: Sparkles, label: "Innovation & Growth" },
  { icon: Target, label: "Focus & Solutions" },
  { icon: Users, label: "Professional & Modern" },
];

export default async function HomePage() {
  const featuredCourses = await db
    .select()
    .from(courses)
    .where(eq(courses.published, true))
    .orderBy(desc(courses.createdAt))
    .limit(3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-navy">
        <BackgroundImage
          src={IMAGES.hero}
          priority
          scrim="bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/60"
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-teal/20 blur-3xl" />
        <div className="container-page relative grid gap-10 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Learn today.
              <br />
              <span className="text-brand-teal">Lead tomorrow.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/70">
              Practical, relevant, future-ready training in coding, digital
              skills, robotics and IoT — plus the coaching, certificates and
              career support to turn what you learn into a livelihood.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/courses">
                  Explore courses <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/coaching">Book a coaching session</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {brandPillars.map((pillar) => (
              <div
                key={pillar.label}
                className="rounded-2xl bg-white/5 p-5 text-white ring-1 ring-white/10"
              >
                <pillar.icon className="h-6 w-6 text-brand-teal" />
                <p className="mt-3 text-sm font-semibold">{pillar.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-brand-navy">Our services</h2>
          <p className="mt-3 text-brand-slate">
            Everything you need to go from curious to career-ready — for
            individuals, and full training programs for teams.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-brand-navy/10 p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
                <service.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-brand-navy">{service.title}</h3>
              <p className="mt-2 text-sm text-brand-slate">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Learn by doing */}
      <section className="container-page pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={IMAGES.learnByDoing}
              alt="Learners working together at a computer"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
              Practical. Relevant. Future-ready.
            </span>
            <h2 className="mt-2 text-3xl font-bold text-brand-navy">
              Learn by building real things
            </h2>
            <p className="mt-3 text-brand-slate">
              Every course is built around hands-on projects, with an
              instructor you can message directly — so you finish with skills,
              a portfolio and a certificate, not just notes.
            </p>
            <ul className="mt-6 space-y-3">
              {learnPoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-brand-navy/90">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      {featuredCourses.length > 0 && (
        <section className="bg-brand-mist py-20">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-brand-navy">Featured courses</h2>
                <p className="mt-2 text-brand-slate">Start learning something new this week.</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/courses">
                  View all courses <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why choose us */}
      <section className="container-page py-20">
        <div className="relative overflow-hidden rounded-3xl bg-brand-navy px-6 py-14 sm:px-14">
          <BackgroundImage src={IMAGES.whyChoose} scrim="bg-brand-navy/70" />
          <h2 className="relative text-center text-3xl font-bold text-white">
            Why choose Amplify Digital Technologies?
          </h2>
          <div className="relative mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {whyChoose.map((item) => (
              <div key={item.label} className="text-center text-white">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <item.icon className="h-5 w-5 text-brand-teal" />
                </div>
                <p className="mt-3 text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-24">
        <div className="grid overflow-hidden rounded-3xl border border-brand-navy/10 bg-white shadow-sm lg:grid-cols-[1fr_1.4fr]">
          <div className="relative min-h-52">
            <Image
              src={IMAGES.ctaTeam}
              alt="A team training session in a meeting room"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-brand-navy">
              Training a team, not just an individual?
            </h2>
            <p className="mt-2 text-brand-slate">
              Register your company, add your staff, and assign them the
              exact courses their roles need — all tracked in one dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/register/company">Register your company</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/enterprise">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
