const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not set. Add it to your .env.local file — see .env.example."
    );
  }
  return key;
}

interface InitializeTransactionArgs {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializeTransaction({
  email,
  amountNaira,
  reference,
  callbackUrl,
  metadata,
}: InitializeTransactionArgs) {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountNaira * 100, // Paystack expects kobo
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  });

  const json = (await res.json()) as PaystackInitializeResponse;
  if (!res.ok || !json.status || !json.data) {
    throw new Error(json.message || "Could not start Paystack transaction");
  }
  return json.data;
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    metadata?: Record<string, unknown>;
  };
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${getSecretKey()}` },
      cache: "no-store",
    }
  );

  const json = (await res.json()) as PaystackVerifyResponse;
  if (!res.ok || !json.data) {
    throw new Error(json.message || "Could not verify Paystack transaction");
  }
  return json.data;
}

/**
 * Verifies the `x-paystack-signature` header on incoming webhook requests
 * using HMAC SHA512 of the raw request body, as required by Paystack.
 * https://paystack.com/docs/payments/webhooks/
 */
export async function verifyWebhookSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const crypto = await import("node:crypto");
  const hash = crypto
    .createHmac("sha512", getSecretKey())
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}
