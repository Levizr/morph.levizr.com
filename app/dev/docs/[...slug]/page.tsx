import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchDevDocMarkdown,
  fetchDevDocsNav,
  type DocEntry,
} from "@/lib/github-docs";
import { renderMarkdown } from "@/lib/markdown";
import { MarkdownContent } from "@/app/docs/MarkdownContent";
import { CodeCopyButtons } from "@/app/docs/CodeCopyButtons";

export const dynamic = "force-static";
export const revalidate = false;

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
        <Link href="/dev/docs" className="hover:text-accent transition-colors">
          Dev Docs
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
  const nav = await fetchDevDocsNav();
  const path = slug.join("/");
  const entry = nav.find(
    (d) => d.path === path || (d.file ?? "") === `dev/${path}`
  );
  const title = entry?.title ?? fallbackTitle(slug);
  return {
    title: `${title} — Morph Dev Docs`,
    description: entry?.description ?? `Morph contributor documentation: ${title}`,
    keywords: entry?.keywords,
    authors: entry?.author ? [{ name: entry.author }] : undefined,
  };
}

function PrevNext({ prev, next }: { prev?: DocEntry; next?: DocEntry }) {
  return (
    <nav className="mt-14 pt-8 border-t border-border grid grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={`/dev/docs/${prev.path}`}
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
          href={`/dev/docs/${next.path}`}
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

export default async function DevDocPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug.length === 0) notFound();

  const path = slug.join("/");
  const nav = await fetchDevDocsNav();
  // Match by slug OR by file: slugs carry the topic roots
  // (architecture/overview) while markdown relative links resolve
  // through the flat file layout (dev/overview) — both must render.
  const entry = nav.find(
    (d) => d.path === path || (d.file ?? "") === `dev/${path}`
  );
  // Resolve against the real repo layout (docs/dev/…) so relative
  // links map to the right track: dev/* → /dev/docs/*, rest → /docs/*.
  const file = (entry?.file ?? `dev/${path}`).split("/");

  const markdown = await fetchDevDocMarkdown(
    file[0] === "dev" ? file.slice(1) : file
  );
  if (!markdown) notFound();

  const descriptions = new Map<string, string>();
  for (const d of nav) {
    if (d.description) {
      descriptions.set(d.path, d.description);
      if (d.file?.startsWith("dev/")) {
        descriptions.set(d.file.slice(4), d.description);
      }
    }
  }
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
