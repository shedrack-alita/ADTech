import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { certificates } from "@/lib/db/schema";
import { Logo } from "@/components/layout/Logo";
import { PrintButton } from "@/components/marketing/PrintButton";
import { formatDate } from "@/lib/utils";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ certificateNumber: string }>;
}) {
  const { certificateNumber } = await params;

  const certificate = await db.query.certificates.findFirst({
    where: eq(certificates.certificateNumber, certificateNumber),
    with: {
      enrollment: { with: { user: true, course: true } },
    },
  });

  if (!certificate) notFound();

  const { user, course } = certificate.enrollment;

  return (
    <div className="min-h-screen bg-brand-mist py-12">
      <div className="container-page flex justify-between print:hidden">
        <Link href="/" className="text-sm font-semibold text-brand-navy">
          ← Amplify Digital Technologies
        </Link>
        <PrintButton />
      </div>

      <div className="mx-auto mt-8 max-w-3xl border-8 border-double border-brand-navy/20 bg-white p-12 text-center shadow-lg">
        <div className="flex items-center justify-center">
          <Logo height={48} />
        </div>

        <p className="mt-8 text-sm uppercase tracking-[0.3em] text-brand-teal">
          Certificate of Completion
        </p>
        <p className="mt-6 text-sm text-brand-slate">This certifies that</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-brand-navy">{user.name}</h1>
        <p className="mt-6 text-sm text-brand-slate">has successfully completed</p>
        <h2 className="mt-2 text-2xl font-semibold text-brand-navy">{course.title}</h2>

        <div className="mt-10 flex items-center justify-center gap-16 text-sm text-brand-slate">
          <div>
            <p className="font-semibold text-brand-navy">
              {formatDate(certificate.issuedAt)}
            </p>
            <p className="mt-1 border-t border-brand-navy/20 pt-1">Date issued</p>
          </div>
          <div>
            <p className="font-semibold text-brand-navy">{certificate.certificateNumber}</p>
            <p className="mt-1 border-t border-brand-navy/20 pt-1">Certificate No.</p>
          </div>
        </div>

        <p className="mt-10 text-xs text-brand-slate">
          Verify this certificate anytime at amplifydigitaltech.com/certificate/{certificate.certificateNumber}
        </p>
      </div>
    </div>
  );
}
