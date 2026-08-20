"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, CornerDownLeft } from "lucide-react";
import type { DocIndexEntry } from "@/lib/docs-search";

interface SearchResult {
  doc: DocIndexEntry;
  score: number;
  snippet: string;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[-_/]/g, " ");
}

function scoreDoc(doc: DocIndexEntry, words: string[]): number {
  const title = normalize(doc.title);
  const text = normalize(doc.text);
  const section = normalize(doc.section);
  const description = normalize(doc.description);
  const keywords = doc.keywords.map(normalize);
  const headings = doc.headings.map(normalize);
  const full = words.join(" ");

  let score = 0;
  if (title.includes(full)) score += 50;
  if (title.startsWith(full)) score += 15;
  if (keywords.some((k) => k.includes(full) || full.includes(k))) score += 30;
  if (description.includes(full)) score += 15;
  if (section.includes(full)) score += 10;
  if (headings.some((h) => h.includes(full))) score += 8;
  if (text.includes(full)) score += 4;

  for (const w of words) {
    if (w.length < 2) continue;
    if (title.includes(w)) score += 12;
    if (title.startsWith(w)) score += 6;
    if (keywords.some((k) => k.includes(w))) score += 10;
    if (headings.some((h) => h.includes(w))) score += 5;
    if (description.includes(w)) score += 4;
    if (section.includes(w)) score += 3;
    if (text.includes(w)) score += 1;
  }

  score += Math.round((doc.priority ?? 0.5) * 8);
  return score;
}

function makeSnippet(doc: DocIndexEntry, query: string): string {
  const q = normalize(query);
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  const text = doc.text;

  const findIdx = (hay: string): number => {
    const idx = hay.toLowerCase().indexOf(q);
    if (idx >= 0) return idx;
    for (const w of words) {
      const i = hay.toLowerCase().indexOf(w);
      if (i >= 0) return i;
    }
    return -1;
  };

  const idx = findIdx(text);
  if (idx < 0) {
    if (doc.description) return doc.description;
    return text.slice(0, 140) + (text.length > 140 ? "…" : "");
  }
  const start = Math.max(0, idx - 50);
  const end = Math.min(text.length, idx + q.length + 100);
  return (
    (start > 0 ? "…" : "") +
    text.slice(start, end).trim() +
    (end < text.length ? "…" : "")
  );
}

function highlight(text: string, query: string): React.ReactNode {
  const words = normalize(query)
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (words.length === 0) return text;
  const re = new RegExp(`(${words.join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-transparent text-accent font-semibold">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<DocIndexEntry[] | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (!open) setQuery("");
  }

  const q = query.trim();

  const results = useMemo<SearchResult[]>(() => {
    if (!open) return [];
    const words = normalize(q).split(/\s+/).filter(Boolean);
    if (!q || !index) {
      return [...(index ?? [])]
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 10)
        .map((doc) => ({ doc, score: 0, snippet: doc.description }));
    }
    const scored = index
      .map((doc) => ({ doc, score: scoreDoc(doc, words) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
    return scored.map((r) => ({
      doc: r.doc,
      score: r.score,
      snippet: makeSnippet(r.doc, q),
    }));
  }, [open, q, index]);

  const [lastQuery, setLastQuery] = useState(q);
  if (lastQuery !== q) {
    setLastQuery(q);
    setActive(0);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !open && !typing) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (index) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/docs/search");
        const data = await res.json();
        if (!cancelled) setIndex(Array.isArray(data.docs) ? data.docs : []);
      } catch {
        if (!cancelled) setIndex([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, index]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      const r = results[active];
      if (r) {
        setOpen(false);
        router.push(`/docs/${r.doc.path}`);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-card text-muted hover:text-foreground hover:border-accent/40 transition-colors text-left group"
      >
        <Search className="w-4 h-4 shrink-0 group-hover:text-accent transition-colors" />
        <span className="text-sm flex-1 truncate">Search docs…</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-border bg-surface text-[11px] text-muted font-medium">
          <span>⌘</span>K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-[15vh]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search documentation…"
                className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted"
              />
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded-md border border-border bg-surface text-[11px] text-muted font-medium">
                ESC
              </kbd>
            </div>

            <div className="max-h-[55vh] overflow-y-auto py-2">
              {results.length === 0 && q ? (
                <p className="px-4 py-6 text-sm text-muted text-center">
                  No results for &quot;{query}&quot;
                </p>
              ) : (
                <ul>
                  {!q && (
                    <li className="px-4 pt-1.5 pb-2 text-[11px] uppercase tracking-wider text-muted/70">
                      Top docs
                    </li>
                  )}
                  {results.map((r, i) => (
                    <li key={r.doc.path}>
                      <button
                        onMouseEnter={() => setActive(i)}
                        onClick={() => {
                          setOpen(false);
                          router.push(`/docs/${r.doc.path}`);
                        }}
                        className={`w-full flex flex-col gap-0.5 px-4 py-2.5 text-left transition-colors ${
                          i === active
                            ? "bg-accent/10 text-foreground"
                            : "text-muted"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <FileText className="w-3.5 h-3.5 shrink-0 text-accent" />
                          <span className="truncate">
                            {highlight(r.doc.title, query)}
                          </span>
                          <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wider text-muted/70 border border-border rounded px-1.5 py-0.5">
                            {r.doc.section}
                          </span>
                          {r.doc.status !== "production" && (
                            <span className="shrink-0 text-[10px] uppercase tracking-wider text-accent border border-accent/30 rounded px-1.5 py-0.5">
                              {r.doc.status}
                            </span>
                          )}
                        </span>
                        {r.snippet && (
                          <span className="text-xs text-muted/80 line-clamp-2">
                            {highlight(r.snippet, query)}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[11px] text-muted">
              <span className="flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3" /> select
              </span>
              <span className="flex items-center gap-1">↑↓ navigate</span>
              <span className="flex items-center gap-1">esc close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}