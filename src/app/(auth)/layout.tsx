import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { BackgroundImage } from "@/components/ui/BackgroundImage";
import { IMAGES } from "@/lib/images";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1fr_0.9fr]">
      <div className="flex min-h-screen flex-col bg-brand-mist">
        <div className="container-page flex items-center py-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-16">
          {children}
        </div>
      </div>

      <aside className="relative hidden overflow-hidden bg-brand-navy lg:flex lg:items-end">
        <BackgroundImage
          src={IMAGES.auth}
          priority
          scrim="bg-gradient-to-t from-brand-navy via-brand-navy/60 to-brand-navy/30"
        />
        <div className="relative p-12">
          <p className="text-4xl font-extrabold leading-tight text-white">
            Learn today.
            <br />
            <span className="text-brand-teal">Lead tomorrow.</span>
          </p>
          <p className="mt-4 max-w-sm text-white/70">
            Practical, certified training in coding, digital skills, robotics
            and IoT — with coaching and career support along the way.
          </p>
        </div>
      </aside>
    </div>
  );
}
