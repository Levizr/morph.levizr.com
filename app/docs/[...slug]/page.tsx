import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchDocMarkdown, fetchDocsNav, type DocEntry } from "@/lib/github-docs";
import { renderMarkdown } from "@/lib/markdown";
import { CodeCopyButtons } from "../CodeCopyButtons";

export const dynamic = "force-static";
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

function fallbackTitle(slug: string[]): string {
  return slug
    .join(" / ")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const nav = await fetchDocsNav();
  const entry = nav.find((d) => d.path === slug.join("/"));
  const title = entry?.title ?? fallbackTitle(slug);
  return {
    title: `${title} — Morph Docs`,
    description: `Morph documentation: ${title}`,
  };
}

function PrevNext({ prev, next }: { prev?: DocEntry; next?: DocEntry }) {
  return (
    <nav className="mt-14 pt-8 border-t border-border grid grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={`/docs/${prev.path}`}
          className="group flex flex-col gap-1 rounded-xl border border-border bg-card p-4 hover:border-accent/40 hover:bg-surface transition-colors"
        >
          <span className="text-xs text-muted group-hover:text-accent transition-colors">
            ← Previous
          </span>
          <span className="text-sm font-semibold truncate">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/docs/${next.path}`}
          className="group flex flex-col gap-1 items-end rounded-xl border border-border bg-card p-4 text-right hover:border-accent/40 hover:bg-surface transition-colors"
        >
          <span className="text-xs text-muted group-hover:text-accent transition-colors">
            Next →
          </span>
          <span className="text-sm font-semibold truncate max-w-full">
            {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug.length === 0) notFound();

  const path = slug.join("/");
  const nav = await fetchDocsNav();
  const entry = nav.find((d) => d.path === path);
  const file = (entry?.file ?? path).split("/");

  const markdown = await fetchDocMarkdown(file);
  if (!markdown) notFound();

  const html = renderMarkdown(markdown, file.join("/"));

  const index = entry ? nav.indexOf(entry) : -1;
  const prev = index > 0 ? nav[index - 1] : undefined;
  const next =
    index >= 0 && index < nav.length - 1 ? nav[index + 1] : undefined;

  return (
    <div className="w-full min-w-0">
      <article
        className="docs-content w-full min-w-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CodeCopyButtons />
      <PrevNext prev={prev} next={next} />
    </div>
  );
}