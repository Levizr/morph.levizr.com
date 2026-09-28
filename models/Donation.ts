import mongoose, { Schema, model, models } from "mongoose";
import type { ChargeCurrency } from "@/lib/sponsor";

export type DonationStatus = "created" | "paid" | "failed";

export interface IDonation extends mongoose.Document {
  name: string;
  email: string;
  address: string;
  contact: string;
  /** Sticker price in USD — exactly what the donor entered. */
  amountUSD: number;
  /**
   * Exact amount Razorpay charged, in the smallest currency subunit —
   * paise for INR charges (e.g. 239800 = ₹2,398), US cents for USD charges.
   * Same convention as Razorpay's own `amount` field; `chargeCurrency`
   * tells you which subunit it is.
   */
  paise: number;
  chargeCurrency: ChargeCurrency;
  /**
   * USD→INR rate applied for INR charges (live rate, or the hardcoded
   * fallback). With amountUSD + fxRate + paise you can always reconstruct
   * exactly what the donor entered and what paise we charged.
   * Undefined for USD charges (rate 1 by definition).
   */
  fxRate?: number;
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
    paise: { type: Number, required: true, min: 1 },
    chargeCurrency: { type: String, enum: ["USD", "INR"], required: true },
    fxRate: { type: Number, min: 1 },
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
