import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { PHASES, type ProofKind } from "./shots";

export const metadata: Metadata = {
  title: "Journey — Real progress, unedited screenshots | Morph",
  description:
    "28 unedited screenshots from Apr to Aug 2026: from a browser video-editor struggle to native Morph apps. Bugs kept next to fixes, hashes listed.",
};

const BADGE_STYLES: Record<ProofKind, string> = {
  origin: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  bug: "bg-red-500/15 text-red-400 border-red-500/30",
  fix: "bg-green-500/15 text-green-400 border-green-500/30",
  milestone: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "side-by-side": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  launch: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const BADGE_LABELS: Record<ProofKind, string> = {
  origin: "origin",
  bug: "bug kept",
  fix: "fix",
  milestone: "milestone",
  "side-by-side": "browser vs morph",
  launch: "launch proof",
};

export default function JourneyPage() {
  const total = PHASES.reduce((n, p) => n + p.shots.length, 0);

  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-mono text-muted">Apr 28 → Aug 29, 2026 · {total} screenshots</p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">
            The journey, with receipts.
          </h1>
          <p className="mt-4 max-w-3xl text-muted leading-relaxed">
            Every image below is an unedited original — original filenames, no
            re-encoding, bugs kept next to fixes. Why were they saved? Not to
            show off later — each one was captured to compare Morph&apos;s
            native render against what the browser renders for the same
            HTML/CSS. If you think this is fake, check the commit history:
            commits around each screenshot&apos;s date line up with the bug
            fixes and features the images show. Originals live in{" "}
            <code className="font-mono text-sm text-foreground">morph/records/</code>{" "}
            with <code className="font-mono text-sm text-foreground">manifest.json</code>.
            This page only shows byte-identical copies.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="https://github.com/Levizr/morph/tree/main/records"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium"
            >
              Inspect raw records/ folder
            </Link>
            <Link
              href="/download"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
            >
              Try Morph
            </Link>
          </div>
          <div className="mt-6 rounded-xl border border-border bg-surface/60 px-4 py-3 font-mono text-xs text-muted">
            verify: open manifest.json, then run{" "}
            <span className="text-foreground">sha256sum &quot;records/&lt;original name&gt;.png&quot;</span>{" "}
            — hashes match the copies served here. Still unsure?{" "}
            <span className="text-foreground">git log --since=2026-04-01 --until=2026-09-01</span>{" "}
            lines up with the screenshot dates and fixes.
          </div>
          <p className="mt-4 max-w-3xl text-sm text-muted leading-relaxed">
            Note: screenshots stop in August because documenting moved into{" "}
            <code className="font-mono text-sm text-foreground">docs/</code> and the
            layout engine was mostly done. These shots existed to compare
            Morph&apos;s render against the browser — with focus shifted to
            JS-to-C++ logic, states, and window management, there was nothing
            left to compare visually.
          </p>

          {PHASES.map((phase) => (
            <section key={phase.id} className="mt-14">
              <p className="font-mono text-xs text-muted">{phase.range}</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">{phase.title}</h2>
              <p className="mt-2 max-w-3xl text-sm text-muted leading-relaxed">{phase.summary}</p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {phase.shots.map((shot) => (
                  <figure
                    key={shot.file}
                    className="overflow-hidden rounded-xl border border-border bg-surface/40"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shot.src}
                      alt={`${shot.date} — ${shot.title}`}
                      loading="lazy"
                      className="w-full h-auto border-b border-border bg-black/40"
                    />
                    <figcaption className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-muted">{shot.date}</span>
                        <span
                          className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${BADGE_STYLES[shot.proof]}`}
                        >
                          {BADGE_LABELS[shot.proof]}
                        </span>
                        <span className="ml-auto font-mono text-[11px] text-muted">
                          sha {shot.shaShort}
                        </span>
                      </div>
                      <p className="mt-2 font-semibold">{shot.title}</p>
                      <p className="mt-1 text-sm text-muted leading-relaxed">{shot.caption}</p>
                      <p className="mt-2 truncate font-mono text-[11px] text-muted" title={shot.file}>
                        {shot.file}
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
