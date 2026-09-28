import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Donation } from "@/models/Donation";
import { verifyWebhookSignature } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

interface RazorpayWebhookPayment {
  id: string;
  order_id?: string;
  amount?: number;
}

interface RazorpayWebhookPayload {
  event?: string;
  payload?: {
    payment?: { entity?: RazorpayWebhookPayment };
  };
}

/**
 * Razorpay webhook — the safety net under the client-side verify call.
 * If the donor's tab closes, the network drops, or /api/sponsor/verify
 * never runs, Razorpay retries this endpoint until a donation is marked
 * paid. Handler is idempotent: re-deliveries of an already-paid order
 * just get an OK.
 *
 * Setup: Dashboard → Settings → Webhooks → Add New Webhook →
 * URL https://morph.levizr.com/api/sponsor/webhook, events
 * payment.captured + payment.failed → copy the secret into
 * RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "Webhooks are not configured." },
      { status: 503 }
    );
  }

  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const rawBody = await req.text();
  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Bad signature." }, { status: 400 });
  }

  let body: RazorpayWebhookPayload;
  try {
    body = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Bad payload." }, { status: 400 });
  }

  const event = body.event ?? "";
  if (event !== "payment.captured" && event !== "payment.failed") {
    return NextResponse.json({ ok: true, ignored: event });
  }

  const entity = body.payload?.payment?.entity;
  const orderId = entity?.order_id ?? "";
  const paymentId = entity?.id ?? "";
  if (!orderId || !paymentId) {
    return NextResponse.json({ error: "Bad payload." }, { status: 400 });
  }

  try {
    await connectDB();
  } catch {
    // Return 500 so Razorpay retries the delivery later.
    return NextResponse.json({ error: "Database unavailable." }, { status: 500 });
  }

  const donation = await Donation.findOne({ razorpayOrderId: orderId });
  if (!donation) {
    // Not one of ours (e.g. a dashboard test webhook) — ack, don't retry.
    return NextResponse.json({ ok: true, unknownOrder: true });
  }
  if (donation.status === "paid") {
    return NextResponse.json({ ok: true, deduped: true });
  }

  if (event === "payment.captured") {
    donation.status = "paid";
    donation.razorpayPaymentId = paymentId;
  } else {
    donation.status = "failed";
    donation.razorpayPaymentId = paymentId;
  }
  await donation.save();

  return NextResponse.json({ ok: true, status: donation.status });
}

export async function GET() {
  return NextResponse.json(
    { error: "Use POST — see README for webhook setup." },
    { status: 405 }
  );
}
