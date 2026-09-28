import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Donation } from "@/models/Donation";
import {
  donationsConfigured,
  getRazorpay,
  getRazorpayPublicKey,
} from "@/lib/razorpay";
import {
  isValidAmountUSD,
  toSubunits,
  type ChargeCurrency,
} from "@/lib/sponsor";

export const dynamic = "force-dynamic";

const NOT_CONFIGURED =
  "Online donations are not switched on yet — please use the direct Razorpay link below instead.";

function cleanString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(req: Request) {
  if (!donationsConfigured()) {
    return NextResponse.json({ error: NOT_CONFIGURED }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const amountUSD =
    typeof body.amountUSD === "number" ? body.amountUSD : Number.NaN;
  const currency: ChargeCurrency = body.currency === "INR" ? "INR" : "USD";
  if (!isValidAmountUSD(amountUSD)) {
    return NextResponse.json(
      { error: "Pick an amount between $1 and $10,000." },
      { status: 400 }
    );
  }

  const donor = {
    name: cleanString(body.name, 80),
    email: cleanString(body.email, 120),
    address: cleanString(body.address, 300),
    contact: cleanString(body.contact, 30),
  };

  const chargeSubunits = toSubunits(amountUSD, currency);
  const razorpay = getRazorpay();
  if (!razorpay) {
    return NextResponse.json({ error: NOT_CONFIGURED }, { status: 503 });
  }

  const receipt = `morph_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  let order: { id: string };
  try {
    order = (await razorpay.orders.create({
      amount: chargeSubunits,
      currency,
      receipt,
      notes: {
        source: "morph.levizr.com/sponsor",
        amountUSD: String(amountUSD),
        donor_name: donor.name || "Anonymous",
        donor_email: donor.email,
      },
    })) as { id: string };
  } catch {
    return NextResponse.json(
      { error: "Could not reach Razorpay. Please try again in a minute." },
      { status: 502 }
    );
  }

  try {
    await connectDB();
    await Donation.create({
      ...donor,
      amountUSD,
      chargeAmountSubunits: chargeSubunits,
      chargeCurrency: currency,
      receipt,
      razorpayOrderId: order.id,
      status: "created",
    });
  } catch {
    return NextResponse.json(
      { error: "Order created but could not be saved. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    orderId: order.id,
    amountSubunits: chargeSubunits,
    currency,
    keyId: getRazorpayPublicKey(),
  });
}
