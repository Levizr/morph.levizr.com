import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Donation } from "@/models/Donation";

export const dynamic = "force-dynamic";

function signaturesMatch(expected: string, actual: string): boolean {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(actual, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "Donations are not switched on yet." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const orderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id : "";
  const paymentId =
    typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
  const signature =
    typeof body.razorpay_signature === "string" ? body.razorpay_signature : "";
  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  }

  try {
    await connectDB();
  } catch {
    return NextResponse.json({ error: "Database unavailable." }, { status: 500 });
  }

  const donation = await Donation.findOne({ razorpayOrderId: orderId });
  if (!donation) {
    return NextResponse.json({ error: "Unknown order." }, { status: 404 });
  }
  if (donation.status === "paid") {
    return NextResponse.json({ ok: true, amountUSD: donation.amountUSD });
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (!signaturesMatch(expected, signature)) {
    donation.status = "failed";
    await donation.save();
    return NextResponse.json(
      { error: "Payment verification failed. If money left your account, it will be refunded automatically — please contact us." },
      { status: 400 }
    );
  }

  donation.status = "paid";
  donation.razorpayPaymentId = paymentId;
  donation.razorpaySignature = signature;
  await donation.save();

  return NextResponse.json({ ok: true, amountUSD: donation.amountUSD });
}
