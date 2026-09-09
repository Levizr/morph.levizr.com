import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code2,
  Compass,
  Cpu,
  FolderTree,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { fetchDevDocsNav, type DocEntry } from "@/lib/github-docs";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Dev Docs — How Morph Works",
  description:
    "Contributor and internals documentation for Morph: architecture, translator internals, pipelines, and the docs system.",
};

const START_HERE = [
  "architecture/overview",
  "contributing/overview",
  "architecture/repo-map",
];

const SECTION_ICONS: Record<string, LucideIcon> = {
  Architecture: Cpu,
  Morpher: Code2,
  Runtime: FolderTree,
  Contributing: Wrench,
};

function SectionCard({ section, docs }: { section: string; docs: DocEntry[] }) {
  const sorted = [...docs].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  const visible = sorted.slice(0, 8);
  const rest = sorted.length - visible.length;
  const Icon = SECTION_ICONS[section] ?? BookOpen;

  return (
    <div className="p-5 rounded-2xl border border-border bg-card flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-accent shrink-0" />
        <h3 className="font-semibold text-sm uppercase tracking-wider truncate">
          {section}
        </h3>
        <span className="text-xs text-muted/60 ml-auto shrink-0">
          {sorted.length} docs
        </span>
      </div>
      <ul className="flex flex-col gap-1">
        {visible.map((doc) => (
          <li key={doc.path}>
            <Link
              href={`/dev/docs/${doc.path}`}
              className="group flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
            >
              <span className="truncate">{doc.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      {rest > 0 && (
        <p className="text-xs text-muted/60">+{rest} more in the sidebar</p>
      )}
    </div>
  );
}

export default async function DevDocsIndex() {
  const docs = await fetchDevDocsNav();

  const bySection = new Map<string, DocEntry[]>();
  for (const doc of docs) {
    const list = bySection.get(doc.section) ?? [];
    list.push(doc);
    bySection.set(doc.section, list);
  }

  const startHere = docs.filter((d) => START_HERE.includes(d.path));

  return (
    <div className="w-full min-w-0">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Dev Docs
        </h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          How Morph works, for contributors and the deeply curious — architecture,
          translator internals, pipelines, and the runtime. For building apps, see the{" "}
          <Link href="/docs" className="text-accent hover:underline">
            user docs
          </Link>
          .
        </p>
      </div>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Start here
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {startHere.map((doc) => (
            <Link
              key={doc.path}
              href={`/dev/docs/${doc.path}`}
              className="group p-5 rounded-2xl border border-border bg-card hover:border-accent/40 hover:bg-surface transition-colors flex flex-col gap-2"
            >
              <span className="font-semibold group-hover:text-accent transition-colors">
                {doc.title}
              </span>
              <span className="text-sm text-muted leading-relaxed line-clamp-2">
                {doc.description ?? `docs/dev/${doc.file ?? doc.path}.md`}
              </span>
              <span className="mt-auto flex items-center gap-1 text-sm text-accent font-medium pt-2">
                Read{" "}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Browse by topic
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...bySection.entries()].map(([section, entries]) => (
            <SectionCard key={section} section={section} docs={entries} />
          ))}
        </div>
      </section>
    </div>
  );
}
