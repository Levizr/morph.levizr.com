import Link from "next/link";
import { fetchDocsNav } from "@/lib/github-docs";

export default async function DocsNotFound() {
  const docs = await fetchDocsNav();
  const suggestions = docs.slice(0, 6);

  return (
    <div className="w-full min-w-0">
      <div className="rounded-3xl border border-border bg-card p-10 sm:p-16 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/25">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <path d="M13 2v7h7" />
            <path d="M9.5 13.5l5 5" />
            <path d="M14.5 13.5l-5 5" />
          </svg>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
          404 — Page not found
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          This page doesn&apos;t exist
        </h1>
        <p className="text-muted max-w-md leading-relaxed mb-8">
          It may have been moved, renamed, or removed from the docs. Try
          searching, or jump to one of these pages:
        </p>

        <div className="flex flex-wrap justify-center gap-2 max-w-lg">
          {suggestions.map((doc) => (
            <Link
              key={doc.path}
              href={`/docs/${doc.path}`}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover hover:border-accent/40 text-sm transition-colors"
            >
              {doc.title}
            </Link>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <Link
            href="/docs"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Browse all docs
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-surface transition-colors"
          >
            ← Home
          </Link>
        </div>
      </div>
    </div>
  );
}