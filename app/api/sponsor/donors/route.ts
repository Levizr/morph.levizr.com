import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Donation } from "@/models/Donation";

export const dynamic = "force-dynamic";

const EMPTY = { donors: [], total: 0, totalUSD: 0 };

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(EMPTY);
  }
  try {
    await connectDB();
  } catch {
    return NextResponse.json(EMPTY);
  }

  const [donors, stats] = await Promise.all([
    Donation.find({ status: "paid" })
      .sort({ createdAt: -1 })
      .limit(24)
      .select({ name: 1, amountUSD: 1, createdAt: 1 })
      .lean(),
    Donation.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: 1 }, totalUSD: { $sum: "$amountUSD" } } },
    ]),
  ]);

  const total = stats[0]?.total ?? 0;
  const totalUSD = Math.round((stats[0]?.totalUSD ?? 0) * 100) / 100;

  return NextResponse.json({
    donors: donors.map((d) => ({
      name: d.name?.trim() ? d.name : "Anonymous",
      amountUSD: d.amountUSD,
      at: d.createdAt,
    })),
    total,
    totalUSD,
  });
}
