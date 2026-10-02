import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";

const socialLinks = ["f", "in", "ig", "x"];

const columns = [
  {
    title: "Learn",
    links: [
      { href: "/courses", label: "Browse courses" },
      { href: "/coaching", label: "1-on-1 coaching" },
      { href: "/jobs", label: "Job opportunities" },
      { href: "/register", label: "Create an account" },
    ],
  },
  {
    title: "For business",
    links: [
      { href: "/enterprise", label: "Team training" },
      { href: "/register/company", label: "Register your company" },
      { href: "/contact", label: "Talk to sales" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/login", label: "Log in" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white/80">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Empowering minds, building skills and shaping the future with
            technology — through hands-on courses, coaching and career
            pathways.
          </p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map((label) => (
              <span
                key={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/70 transition-colors hover:bg-brand-teal hover:text-white"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-brand-teal">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> +234 703 298 6425
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> hello@amplifydigitaltech.com
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Ibadan, Oyo State, Nigeria
            </span>
          </div>
          <span>&copy; {new Date().getFullYear()} Amplify Digital Technologies. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
