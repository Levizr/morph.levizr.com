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

export function donationsConfigured(): boolean {
  return (
    Boolean(process.env.MONGODB_URI) &&
    Boolean(process.env.RAZORPAY_KEY_ID) &&
    Boolean(process.env.RAZORPAY_KEY_SECRET) &&
    Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
  );
}
