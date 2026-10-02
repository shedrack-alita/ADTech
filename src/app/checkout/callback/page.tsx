import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { finalizePaymentByReference } from "@/lib/actions/payments";
import { Button } from "@/components/ui/Button";

export default async function CheckoutCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const params = await searchParams;
  const reference = params.reference ?? params.trxref;

  if (!reference) {
    return (
      <StatusScreen
        ok={false}
        title="Missing payment reference"
        message="We couldn't find a payment reference in the URL. If you completed a payment, check your dashboard — it may already be reflected."
      />
    );
  }

  const result = await finalizePaymentByReference(reference);

  if (!result.ok) {
    return (
      <StatusScreen
        ok={false}
        title="Payment not confirmed"
        message={result.message}
      />
    );
  }

  const purpose = result.payment.purpose;

  return (
    <StatusScreen
      ok
      title="Payment successful"
      message={
        purpose === "course_enrollment"
          ? "You're enrolled! Head to your dashboard to start learning."
          : "Your coaching session request is in and awaiting confirmation. We'll be in touch."
      }
    />
  );
}

function StatusScreen({
  ok,
  title,
  message,
}: {
  ok: boolean;
  title: string;
  message: string;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-brand-mist px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        {ok ? (
          <CheckCircle2 className="mx-auto h-14 w-14 text-brand-teal" />
        ) : (
          <XCircle className="mx-auto h-14 w-14 text-red-500" />
        )}
        <h1 className="mt-4 text-xl font-bold text-brand-navy">{title}</h1>
        <p className="mt-2 text-sm text-brand-slate">{message}</p>
        <Button asChild className="mt-6 w-full">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
