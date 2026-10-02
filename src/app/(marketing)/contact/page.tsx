import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/marketing/ContactForm";
import { IMAGES } from "@/lib/images";

export const metadata = { title: "Contact Us" };

const details = [
  { icon: Phone, label: "Call / WhatsApp", value: "+234 703 298 6425" },
  { icon: Mail, label: "Email", value: "hello@amplifydigitaltech.com" },
  { icon: MapPin, label: "Location", value: "Ibadan, Oyo State, Nigeria" },
];

export default function ContactPage() {
  return (
    <div className="container-page grid gap-12 py-16 lg:grid-cols-2">
      <div>
        <h1 className="text-3xl font-extrabold text-brand-navy sm:text-4xl">Get in touch</h1>
        <p className="mt-4 max-w-md text-brand-slate">
          Questions about a course, a coaching session, or training your
          team? Send us a message and we&apos;ll get back to you within one
          business day.
        </p>

        <div className="mt-8 space-y-4">
          {details.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
                <d.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs text-brand-slate">{d.label}</p>
                <p className="text-sm font-medium text-brand-navy">{d.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl shadow-md">
          <Image
            src={IMAGES.contact}
            alt="A support headset beside a laptop"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm">
        <ContactForm />
      </div>
    </div>
  );
}
