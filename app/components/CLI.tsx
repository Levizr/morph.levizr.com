"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, spring } from "@/lib/animations";

const commands = [
  { cmd: "morph init my-app", desc: "Scaffold a new project" },
  { cmd: "morph dev", desc: "Start dev server with hot reload" },
  { cmd: "morph build", desc: "Compile to native binary" },
  { cmd: "morph run", desc: "Build and run the production binary" },
  { cmd: "morph build --static --upx", desc: "Static build with UPX compression" },
  { cmd: "morph doctor", desc: "Check system dependencies" },
  { cmd: "morph translate src/logic.ts", desc: "Translate TypeScript to C++" },
];

export function CLI() {
  return (
    <section id="cli" className="relative py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/50 text-xs font-medium text-muted mb-6 uppercase tracking-wider"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            CLI
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            One CLI to rule them all.
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto">
            From scaffolding to production builds, everything you need is one command away.
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-border bg-card overflow-hidden"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <span className="text-xs text-muted ml-2 font-mono">Terminal</span>
          </div>

          <motion.div
            className="divide-y divide-border"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {commands.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 group cursor-default"
                variants={fadeUp}
                transition={spring}
                whileHover={{
                  backgroundColor: "var(--surface-hover)",
                  x: 4,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.span
                  className="text-accent font-mono text-xs sm:text-sm"
                  whileHover={{ scale: 1.2, rotate: -10 }}
                >
                  $
                </motion.span>
                <code className="text-xs sm:text-sm font-mono flex-1 overflow-x-auto whitespace-nowrap">{item.cmd}</code>
                <span className="text-xs text-muted hidden sm:block group-hover:text-foreground transition-colors">
                  {item.desc}
                </span>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100"
                  whileHover={{ scale: 1.5 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
