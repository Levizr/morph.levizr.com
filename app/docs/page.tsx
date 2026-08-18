import type { Metadata } from "next";
import Link from "next/link";
import { fetchDocsNav } from "@/lib/github-docs";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Morph Docs",
  description: "Documentation for the Morph framework — a compiler-based native UI framework.",
};

export default async function DocsIndex() {
  const docs = await fetchDocsNav();

  const sections = docs.reduce<Record<string, typeof docs>>((acc, doc) => {
    (acc[doc.section] ??= []).push(doc);
    return acc;
  }, {});

  return (
    <div className="w-full min-w-0">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Documentation</h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          Everything you need to build native apps with Morph. Docs are pulled live from the
          repository and cached — first visit builds the page, every visit after is served
          from the edge.
        </p>
      </div>

      {Object.entries(sections).map(([section, entries]) => (
        <section key={section} className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
            {section}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {entries.map((doc) => (
              <Link
                key={doc.path}
                href={`/docs/${doc.path}`}
                className="group p-5 rounded-2xl border border-border bg-card hover:bg-surface transition-colors"
              >
                <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                  {doc.title}
                </h3>
                <p className="text-sm text-muted font-mono">
                  docs/{doc.file ?? doc.path}.md
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}