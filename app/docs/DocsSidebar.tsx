"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocEntry } from "@/lib/github-docs";

export function DocsSidebar({ docs }: { docs: DocEntry[] }) {
  const pathname = usePathname();

  const sections = docs.reduce<Record<string, DocEntry[]>>((acc, doc) => {
    (acc[doc.section] ??= []).push(doc);
    return acc;
  }, {});

  return (
    <nav className="flex flex-col gap-6 text-sm">
      {Object.entries(sections).map(([section, entries]) => (
        <div key={section}>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            {section}
          </div>
          <ul className="flex flex-col gap-1">
            {entries.map((doc) => {
              const href = `/docs/${doc.path}`;
              const active = pathname === href;
              return (
                <li key={doc.path}>
                  <Link
                    href={href}
                    className={`block px-3 py-1.5 rounded-lg transition-colors ${
                      active
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-muted hover:text-foreground hover:bg-surface"
                    }`}
                  >
                    {doc.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}