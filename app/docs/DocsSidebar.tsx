"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocEntry } from "@/lib/github-docs";

interface TreeNode {
  name: string;
  doc?: DocEntry;
  children: TreeNode[];
}

function buildTree(docs: DocEntry[], dropFirst: boolean): TreeNode[] {
  const root: TreeNode = { name: "", children: [] };
  for (const doc of docs) {
    const parts = doc.path.split("/");
    const segs = dropFirst && parts.length > 1 ? parts.slice(1) : parts;
    let node = root;
    for (let i = 0; i < segs.length; i++) {
      const name = segs[i];
      const isLeaf = i === segs.length - 1;
      let child = node.children.find((c) => c.name === name);
      if (!child) {
        child = { name, children: [] };
        node.children.push(child);
      }
      if (isLeaf) child.doc = doc;
      node = child;
    }
  }
  return root.children;
}

function nodeHasActive(node: TreeNode, activePath: string): boolean {
  if (node.doc) return node.doc.path === activePath;
  return node.children.some((c) => nodeHasActive(c, activePath));
}

function pretty(name: string): string {
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`w-3 h-3 shrink-0 transition-transform ${
        open ? "rotate-90" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DocsSidebar({ docs }: { docs: DocEntry[] }) {
  const pathname = usePathname();
  const activePath = pathname.replace(/^\/docs\//, "");

  const sections = useMemo(
    () =>
      [...new Map(docs.map((d) => [d.section, d.section])).keys()].map(
        (section) => {
          const entries = docs.filter((d) => d.section === section);
          const firsts = entries.map((d) => d.path.split("/")[0]);
          const dropFirst =
            new Set(firsts).size === 1 &&
            entries.every((d) => d.path.includes("/"));
          return { section, tree: buildTree(entries, dropFirst) };
        }
      ),
    [docs]
  );

  const activeSection = useMemo(
    () =>
      sections.find(({ tree }) =>
        tree.some((n) => nodeHasActive(n, activePath))
      )?.section ?? null,
    [sections, activePath]
  );

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [lastActive, setLastActive] = useState<string | null>(null);

  if (lastActive !== activePath) {
    setLastActive(activePath);
    if (activePath) {
      setExpanded((prev) => {
        const next = new Set(prev);
        const parts = activePath.split("/");
        let acc = "";
        for (let i = 0; i < parts.length; i++) {
          acc = acc ? `${acc}/${parts[i]}` : parts[i];
          for (const { section } of sections) next.add(`${section}/${acc}`);
        }
        return next;
      });
    }
  }

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const renderNode = (
    node: TreeNode,
    section: string,
    parentPath: string
  ): React.ReactNode => {
    const path = parentPath ? `${parentPath}/${node.name}` : node.name;
    const key = `${section}/${path}`;

    if (node.doc) {
      const href = `/docs/${node.doc.path}`;
      const active = pathname === href;
      return (
        <Link
          key={node.doc.path}
          href={href}
          className={`block px-2 py-1.5 rounded-lg transition-colors ${
            active
              ? "border-l-2 border-accent text-accent font-semibold"
              : "text-muted hover:text-foreground hover:bg-surface"
          }`}
        >
          {node.doc.title}
        </Link>
      );
    }

    const open = expanded.has(key);
    const containsActive = node.children.some((c) =>
      nodeHasActive(c, activePath)
    );
    return (
      <div key={key}>
        <button
          onClick={() => toggle(key)}
          className={`flex items-center gap-1.5 w-full px-1 py-1 rounded-lg text-[13px] transition-colors text-left ${
            containsActive
              ? "text-accent font-medium"
              : "text-muted hover:text-foreground hover:bg-surface"
          }`}
        >
          <Chevron open={open} />
          <span className="truncate">{pretty(node.name)}</span>
        </button>
        {open && (
          <div className="ml-3 border-l border-border pl-2 flex flex-col gap-0.5">
            {node.children.map((c) => renderNode(c, section, path))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="flex flex-col gap-1 text-sm">
      {sections.map(({ section, tree }) => {
        const sectionKey = `section:${section}`;
        const open = expanded.has(sectionKey);
        const active = section === activeSection;
        return (
          <div key={section} className="flex flex-col">
            <button
              onClick={() => toggle(sectionKey)}
              className={`flex items-center gap-1.5 w-full px-2 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors text-left ${
                active
                  ? "text-accent"
                  : "text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              <Chevron open={open} />
              <span className="truncate">{section}</span>
            </button>
            {open && (
              <div className="flex flex-col gap-0.5 ml-2 border-l border-border pl-2">
                {tree.map((n) => renderNode(n, section, ""))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}