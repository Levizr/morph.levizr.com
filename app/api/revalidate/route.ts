import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createHmac, timingSafeEqual } from "crypto";
import { DOCS_TREE_TAG, NAV_TAG } from "@/lib/github-docs";

export const dynamic = "force-dynamic";

interface GitHubCommit {
  modified?: string[];
  added?: string[];
  removed?: string[];
}

const DOC_RE = /^docs\/(.+)\.md$/;
const NAV_RE = /^docs\/.*\.(json|jsonc)$/;

function verifySignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = signature.replace(/^sha256=/, "");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(provided, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

function collectDocTags(commits: GitHubCommit[]): string[] {
  const tags = new Set<string>();
  for (const commit of commits) {
    for (const file of [
      ...(commit.added ?? []),
      ...(commit.modified ?? []),
      ...(commit.removed ?? []),
    ]) {
      const match = file.match(DOC_RE);
      if (!match) continue;
      tags.add(`doc-${match[1]}`);
    }
  }
  return [...tags];
}

function navChanged(commits: GitHubCommit[]): boolean {
  return commits.some((commit) =>
    [...(commit.added ?? []), ...(commit.removed ?? [])].some((file) =>
      file.startsWith("docs/")
    )
  );
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = request.headers.get("x-github-event");
  if (event === "ping") {
    return NextResponse.json({ ok: true, ping: true });
  }

  if (event !== "push") {
    return NextResponse.json({ ok: true, ignored: `event: ${event}` });
  }

  let payload: { commits?: GitHubCommit[] };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const docTags = collectDocTags(payload.commits ?? []);
  const commits = payload.commits ?? [];

  const tags = new Set<string>(docTags);

  const jsonChanged = commits.some((c) =>
    [...(c.added ?? []), ...(c.modified ?? []), ...(c.removed ?? [])].some(
      (f) => NAV_RE.test(f)
    )
  );

  if (jsonChanged || navChanged(commits) || docTags.length > 0) {
    tags.add(DOCS_TREE_TAG);
    tags.add(NAV_TAG);
  }

  if (tags.size === 0) {
    return NextResponse.json({ ok: true, revalidated: [] });
  }

  const list = [...tags];
  for (const tag of list) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ ok: true, revalidated: list });
}
