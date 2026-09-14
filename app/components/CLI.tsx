"use client";

import { motion } from "framer-motion";

const commands = [
  { cmd: "morph new my-app", desc: "Scaffold a new project" },
  { cmd: "morph install", desc: "Download the C++ runtime" },
  { cmd: "morph dev", desc: "Dev window with hot reload" },
  { cmd: "morph run", desc: "Build and run the binary" },
  { cmd: "morph build --static", desc: "Self-contained release binary" },
];

export function CLI() {
  return (
    <section id="cli" className="border-t border-border px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 inline-block rounded-full border border-border bg-surface/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted">
            CLI
          </p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            One CLI to rule them all.
          </h2>
          <p className="mx-auto max-w-xl text-muted">
            From scaffolding to production builds, everything you need is one command away.
          </p>
        </motion.div>

        <motion.div
          className="overflow-hidden rounded-xl border border-border bg-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 border-b border-border bg-surface/30 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400/80" />
              <div className="h-3 w-3 rounded-full bg-amber-400/80" />
              <div className="h-3 w-3 rounded-full bg-green-400/80" />
            </div>
            <span className="ml-2 font-mono text-xs text-muted">Terminal</span>
          </div>

          <div className="divide-y divide-border">
            {commands.map((item) => (
              <div
                key={item.cmd}
                className="flex min-w-0 flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4 sm:px-6"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="shrink-0 font-mono text-sm text-accent">$</span>
                  <code className="min-w-0 flex-1 break-all font-mono text-xs sm:text-sm">
                    {item.cmd}
                  </code>
                </div>
                <span className="shrink-0 text-xs text-muted sm:text-right">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="mt-6 text-center text-sm text-muted">
          Full reference:{" "}
          <a href="/docs/cli/commands" className="text-accent hover:underline">
            morph check, update, cache and file morphing →
          </a>
        </p>
      </div>
    </section>
  );
}
