"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { DocsSidebar } from "./DocsSidebar";
import type { DocEntry } from "@/lib/github-docs";

export function DocsMobileNav({ docs }: { docs: DocEntry[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open docs navigation"
        className="lg:hidden inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-border bg-card text-muted hover:text-foreground hover:border-accent/40 transition-colors"
      >
        <Menu className="w-4 h-4" /> Contents
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-card border-r border-border shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold">Docs</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div
              className="flex-1 overflow-y-auto p-4"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a")) setOpen(false);
              }}
            >
              <DocsSidebar docs={docs} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}