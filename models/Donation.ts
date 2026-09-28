import mongoose, { Schema, model, models } from "mongoose";
import type { ChargeCurrency } from "@/lib/sponsor";

export type DonationStatus = "created" | "paid" | "failed";

export interface IDonation extends mongoose.Document {
  name: string;
  email: string;
  address: string;
  contact: string;
  /** Sticker price in USD — the source of truth for display. */
  amountUSD: number;
  /** What Razorpay actually charged, in the smallest subunit. */
  chargeAmountSubunits: number;
  chargeCurrency: ChargeCurrency;
  receipt: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: DonationStatus;
  timezone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    name: { type: String, default: "", maxlength: 80 },
    email: { type: String, default: "", maxlength: 120 },
    address: { type: String, default: "", maxlength: 300 },
    contact: { type: String, default: "", maxlength: 30 },
    amountUSD: { type: Number, required: true, min: 1, max: 10000 },
    chargeAmountSubunits: { type: Number, required: true, min: 1 },
    chargeCurrency: { type: String, enum: ["USD", "INR"], required: true },
    receipt: { type: String, required: true },
    razorpayOrderId: { type: String, required: true, unique: true, index: true },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
      index: true,
    },
    timezone: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Donation =
  (models.Donation as mongoose.Model<IDonation> | undefined) ??
  model<IDonation>("Donation", DonationSchema);
