"use client";

import { motion } from "framer-motion";
import {
  GitBranch,
  Cpu,
  Paintbrush,
  BookOpen,
  Bug,
  ArrowRight,
  Heart,
} from "lucide-react";
import { useIsMobile } from "@/lib/useIsMobile";
import { stagger, fadeUp } from "@/lib/animations";

const areas = [
  {
    icon: Cpu,
    title: "The Rust Compiler",
    description: "Work on morphc — the Rust rewrite of the toolchain. Parsing, IR, codegen, and build system all need contributors right now.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Paintbrush,
    title: "Layout & Rendering",
    description: "Help build the OpenGL-based layout and rendering pipeline in C++. Flexbox, text shaping, animations — the works.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bug,
    title: "Bug Fixes & Testing",
    description: "Morph is honest about being buggy. Find and squash bugs, or confirm reported ones — a found bug is half-fixed.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: BookOpen,
    title: "Docs & Examples",
    description: "Write tutorials, build example apps, expand the docs — help new developers get up to speed with the framework fast.",
    gradient: "from-emerald-500 to-green-500",
  },
];

export function ContributeSection() {
  const isMobile = useIsMobile();

  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
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
            <Heart className="w-3 h-3 text-rose-500" />
            Open Source
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Shape the future of
            <br />
            <span className="text-gradient">native UI development.</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Morph is a Rust-based compiler and native UI framework in early development. Your
            contribution to the compiler, renderer, or docs directly shapes what developers
            will use.
          </p>
        </motion.div>

        {/* Contribution areas */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {areas.map((area) => (
            <motion.div
              key={area.title}
              className="group relative p-6 rounded-2xl border border-border bg-card hover:bg-surface/50 transition-colors"
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${area.gradient} shadow-lg mb-4`}
              >
                <area.icon className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-base font-semibold mb-1.5">{area.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{area.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.a
            href="/contribute"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-accent-fg font-semibold text-base shadow-lg shadow-accent/25"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 20px 40px -12px rgba(109, 40, 217, 0.4)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <GitBranch className="w-4 h-4" />
            Learn How to Contribute
            <motion.span
              className="inline-block"
              animate={isMobile ? undefined : { x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.a>
          <p className="mt-4 text-sm text-muted">
            First-time contributor? <span className="text-accent font-medium">Clone the repo, run cargo build,</span> and find an issue to fix.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
