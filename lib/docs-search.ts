import { fetchDocsNav, fetchDocMarkdown } from "@/lib/github-docs";

export interface DocIndexEntry {
  path: string;
  title: string;
  section: string;
  headings: string[];
  text: string;
  description: string;
  keywords: string[];
  status: string;
  priority: number;
}

function extractHeadings(md: string): string[] {
  return [...md.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => m[1].trim());
}

function markdownToText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, (m) =>
      m.replace(/^```.*$/gm, "").replace(/`/g, "")
    )
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchDocsSearchIndex(): Promise<DocIndexEntry[]> {
  const docs = await fetchDocsNav();
  const entries = await Promise.all(
    docs.map(async (doc) => {
      const md = await fetchDocMarkdown((doc.file ?? doc.path).split("/"));
      if (!md) return null;
      return {
        path: doc.path,
        title: doc.title,
        section: doc.section,
        headings: extractHeadings(md),
        text: markdownToText(md).slice(0, 4000),
        description: doc.description ?? "",
        keywords: doc.keywords ?? [],
        status: doc.status ?? "production",
        priority: doc.priority ?? 0.5,
      } satisfies DocIndexEntry;
    })
  );
  return entries.filter((e): e is DocIndexEntry => e !== null);
}