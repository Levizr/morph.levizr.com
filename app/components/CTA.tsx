"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { InstallCommands } from "./InstallCommands";

export function CTA() {
  return (
    <section className="border-t border-border px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-border bg-card p-8 sm:p-12"
        >
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to go native?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-muted">
            Install Morph, scaffold a project, and build your first native app in
            under a minute.
          </p>

          <InstallCommands />

          <div className="mt-8">
            <a
              href="https://github.com/levizr/morph"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold transition-colors hover:bg-surface-hover"
            >
              View on GitHub
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
