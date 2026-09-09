import { NextResponse } from "next/server";
import { fetchDevDocsSearchIndex } from "@/lib/docs-search";

export const dynamic = "force-dynamic";

export async function GET() {
  const docs = await fetchDevDocsSearchIndex();
  return NextResponse.json({ docs });
}
