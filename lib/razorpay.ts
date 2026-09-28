import crypto from "crypto";
import Razorpay from "razorpay";

export function getRazorpay(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function getRazorpayPublicKey(): string | null {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? null;
}

/**
 * Verify a Razorpay webhook: HMAC-SHA256 of the RAW request body keyed with
 * the webhook secret (Dashboard → Settings → Webhooks), compared against
 * the `x-razorpay-signature` header. Always pass the untouched body string —
 * parsing to JSON and re-stringifying breaks the signature.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!rawBody || !signature || !secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function donationsConfigured(): boolean {
  return (
    Boolean(process.env.MONGODB_URI) &&
    Boolean(process.env.RAZORPAY_KEY_ID) &&
    Boolean(process.env.RAZORPAY_KEY_SECRET) &&
    Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
  );
}
