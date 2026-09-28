import { NextResponse } from "next/server";
import { getUsdToInrRate } from "@/lib/fx";

export const dynamic = "force-dynamic";

/** Live USD→INR rate for the donate card display (cached 12h server-side). */
export async function GET() {
  const { rate, live } = await getUsdToInrRate();
  return NextResponse.json({ rate, live });
}
