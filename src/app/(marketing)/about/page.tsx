import Image from "next/image";
import { ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import { BackgroundImage } from "@/components/ui/BackgroundImage";
import { IMAGES } from "@/lib/images";

export const metadata = { title: "About Us" };

const gallery = [
  { src: IMAGES.aboutCoding, label: "Coding & programming" },
  { src: IMAGES.aboutRobotics, label: "Robotics & IoT" },
  { src: IMAGES.aboutCoaching, label: "Coaching & mentorship" },
];

const pillars = [
  {
    icon: ShieldCheck,
    title: "Trust & Reliability",
    description: "We deliver on what we promise — in training and in the software we build.",
  },
  {
    icon: Sparkles,
    title: "Innovation & Growth",
    description: "We stay ahead of the curve so our learners and clients do too.",
  },
  {
    icon: Target,
    title: "Focus & Solutions",
    description: "We solve real problems with practical, results-driven work.",
  },
  {
    icon: Users,
    title: "Professional & Modern",
    description: "Every engagement, from a single course to a company rollout, is handled with care.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <div className="relative overflow-hidden bg-brand-navy py-20">
        <BackgroundImage src={IMAGES.about} priority scrim="bg-brand-navy/80" />
        <div className="container-page relative text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            About Amplify Digital Technologies
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            An advanced technology company dedicated to empowering
            individuals, businesses, and organizations through innovation,
            digital solutions, and future-ready skills.
          </p>
        </div>
      </div>

      <div className="container-page grid gap-12 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">What we do</h2>
          <p className="mt-3 text-brand-slate">
            We provide industry-focused training through hybrid coding and
            digital skills programs, digital literacy initiatives, tech
            career coaching, and mentorship — equipping learners with the
            practical knowledge and confidence needed to excel in
            today&apos;s digital economy.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Beyond education</h2>
          <p className="mt-3 text-brand-slate">
            We help businesses build, strengthen, and scale their digital
            presence through software development, website and mobile app
            development, UI/UX design, branding, and tailored digital
            transformation solutions.
          </p>
        </div>
      </div>

      <div className="container-page pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {gallery.map((item) => (
            <figure key={item.label} className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={item.src}
                alt={item.label}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
              <figcaption className="absolute bottom-3 left-4 text-sm font-semibold text-white">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="bg-brand-mist py-16">
        <div className="container-page">
          <h2 className="text-center text-2xl font-bold text-brand-navy">
            What we stand for
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-brand-navy">{pillar.title}</h3>
                <p className="mt-2 text-sm text-brand-slate">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page py-16 text-center">
        <h2 className="text-2xl font-bold text-brand-navy">Our promise</h2>
        <p className="mx-auto mt-3 max-w-2xl text-brand-slate">
          At Amplify Digital Technologies, we don&apos;t just teach
          technology — we leverage it to solve problems, drive innovation,
          and create lasting value for individuals and businesses alike.
          Partner with us today and transform your ideas into impactful
          digital solutions.
        </p>
      </div>
    </div>
  );
}
