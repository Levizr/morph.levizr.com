import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchDocMarkdown, fetchDocsNav, type DocEntry } from "@/lib/github-docs";
import { renderMarkdown } from "@/lib/markdown";
import { MarkdownContent } from "../MarkdownContent";
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

function prettySegment(seg: string): string {
  return seg.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const STATUS_STYLES: Record<string, string> = {
  production: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  beta: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  development: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  future: "bg-violet-500/10 text-violet-400 border-violet-500/30",
};

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DocMeta({ entry, slug }: { entry?: DocEntry; slug: string[] }) {
  return (
    <div className="mb-8">
      <nav
        aria-label="Breadcrumb"
        className="text-xs text-muted flex items-center gap-1.5 flex-wrap mb-4"
      >
        <Link href="/docs" className="hover:text-accent transition-colors">
          Docs
        </Link>
        {slug.map((seg, i) => {
          const isLast = i === slug.length - 1;
          const label =
            isLast && entry?.title ? entry.title : prettySegment(seg);
          return (
            <span key={i} className="flex items-center gap-1.5">
              <span>/</span>
              <span
                className={
                  isLast ? "text-foreground font-medium" : "capitalize"
                }
              >
                {label}
              </span>
            </span>
          );
        })}
      </nav>

      {(entry?.status || entry?.author || entry?.lastUpdated) && (
        <div className="flex items-center gap-3 text-xs text-muted flex-wrap">
          {entry?.status && (
            <span
              className={`px-2 py-0.5 rounded-full border text-xs font-medium capitalize ${
                STATUS_STYLES[entry.status] ??
                "bg-surface border-border text-muted"
              }`}
            >
              {entry.status}
            </span>
          )}
          {entry?.author && <span>by {entry.author}</span>}
          {entry?.lastUpdated && (
            <span>Updated {formatDate(entry.lastUpdated)}</span>
          )}
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const nav = await fetchDocsNav();
  const entry = nav.find((d) => d.path === slug.join("/"));
  const title = entry?.title ?? fallbackTitle(slug);
  return {
    title: `${title} — Morph Docs`,
    description: entry?.description ?? `Morph documentation: ${title}`,
    keywords: entry?.keywords,
    authors: entry?.author ? [{ name: entry.author }] : undefined,
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

  const descriptions = new Map(
    nav.map((d) => [d.path, d.description ?? ""])
  );
  const html = renderMarkdown(markdown, file.join("/"), {
    description: entry?.description,
    descriptions,
  });

  const index = entry ? nav.indexOf(entry) : -1;
  const prev = index > 0 ? nav[index - 1] : undefined;
  const next =
    index >= 0 && index < nav.length - 1 ? nav[index + 1] : undefined;

  return (
    <div className="w-full min-w-0">
      <DocMeta entry={entry} slug={slug} />
      <MarkdownContent html={html} />
      <CodeCopyButtons />
      <PrevNext prev={prev} next={next} />
    </div>
  );
}