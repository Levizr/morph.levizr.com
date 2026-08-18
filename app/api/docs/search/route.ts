import { NextResponse } from "next/server";
import { fetchDocsSearchIndex } from "@/lib/docs-search";

export const dynamic = "force-dynamic";

export async function GET() {
  const docs = await fetchDocsSearchIndex();
  return NextResponse.json({ docs });
}