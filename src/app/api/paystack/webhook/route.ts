import { NextResponse } from "next/server";
import { finalizePaymentByReference } from "@/lib/actions/payments";
import { verifyWebhookSignature } from "@/lib/paystack";

// Paystack calls this endpoint server-to-server after a transaction
// completes. We re-verify the transaction with Paystack's API (never trust
// the webhook body alone) before granting access.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  const isValid = await verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    return NextResponse.json({ received: true }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody) as { event: string; data?: { reference?: string } };
    const reference = event.data?.reference;
    if (event.event === "charge.success" && reference) {
      await finalizePaymentByReference(reference);
    }
  } catch {
    // Swallow parsing/finalization errors — Paystack retries on non-2xx,
    // and the checkout callback page also finalizes idempotently.
  }

  return NextResponse.json({ received: true });
}
