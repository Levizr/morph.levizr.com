"use client";

import { motion } from "framer-motion";
import {
  FileCode,
  Search,
  Paintbrush,
  LayoutGrid,
  Cpu,
  Binary,
} from "lucide-react";
import { fadeUp, stagger, spring, slideInLeft, slideInRight } from "@/lib/animations";
import { useIsMobile } from "@/lib/useIsMobile";

const steps = [
  {
    icon: FileCode,
    label: ".mx Files",
    desc: "JSX + TypeScript + CSS",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "shadow-violet-500/30",
  },
  {
    icon: Search,
    label: "Parse",
    desc: "Tree-sitter AST",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "shadow-blue-500/30",
  },
  {
    icon: Paintbrush,
    label: "Style",
    desc: "CSS + Tailwind resolve",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "shadow-cyan-500/30",
  },
  {
    icon: LayoutGrid,
    label: "Layout",
    desc: "Box model + Flexbox",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/30",
  },
  {
    icon: Cpu,
    label: "Codegen",
    desc: "C++ via Jinja2",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/30",
  },
  {
    icon: Binary,
    label: "Binary",
    desc: "Native OpenGL app",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "shadow-rose-500/30",
  },
];

export function Architecture() {
  const isMobile = useIsMobile();

  return (
    <section id="how-it-works" className="relative py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/50 text-xs font-medium text-muted mb-6 uppercase tracking-wider"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            Under the Hood
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            From JSX to native.
            <br />
            <span className="text-muted">No runtime required.</span>
          </h2>
        </motion.div>

        {/* Pipeline */}
        <div className="relative">
          {/* Animated connecting line */}
          <motion.div
            className="hidden lg:block absolute top-40 left-0 right-0 h-px -translate-y-1/2"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            style={{ transformOrigin: "left", }}
          >
            <div className="w-full h-full bg-gradient-to-r from-violet-500/40 via-blue-500/40 to-rose-500/40" />
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-3"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative flex flex-col items-center text-center group"
                variants={fadeUp}
                transition={spring}
              >
                <motion.div
                  className={`relative z-10 w-16 h-16 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mb-4`}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -5, 5, 0],
                    boxShadow: `0 8px 30px var(--tw-shadow-color, rgba(0,0,0,0.1))`,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <step.icon className={`w-6 h-6 ${step.color}`} strokeWidth={1.8} />

                  {/* Pulse ring on hover */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl ${step.border} border`}
                    initial={{ scale: 1, opacity: 0 }}
                    whileHover={{
                      scale: [1, 1.5, 1.8],
                      opacity: [0.5, 0.2, 0],
                    }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </motion.div>

                <h3 className="text-sm font-semibold mb-1">{step.label}</h3>
                <p className="text-xs text-muted leading-relaxed">{step.desc}</p>

                {i < steps.length - 1 && (
                  <motion.div
                    className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] h-px bg-border"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                    style={{ width: "calc(100% - 4rem)", transformOrigin: "left" }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dev / Build mode cards */}
        <div className="mt-20 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <motion.div
              className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-border relative overflow-hidden"
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={spring}
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute -top-20 -left-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"
                animate={isMobile ? undefined : { scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3">Dev Mode</h3>
                <p className="text-sm text-muted mb-6 leading-relaxed">
                  File changes trigger incremental recompilation. The IR is sent over a Unix
                  socket to a pre-compiled dev runtime. Only the logic shared library is
                  recompiled and hot-swapped via{" "}
                  <code className="px-1.5 py-0.5 rounded bg-surface text-foreground text-xs font-mono">
                    dlopen
                  </code>{" "}
                  — signals and effects are re-wired in place.
                </p>
                <div className="flex items-center gap-2 text-sm font-mono text-accent">
                  <motion.span
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={isMobile ? undefined : { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  morph dev
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-8 lg:p-10 relative overflow-hidden"
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={spring}
            >
              <motion.div
                className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"
                animate={isMobile ? undefined : { scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />

              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3">Build Mode</h3>
                <p className="text-sm text-muted mb-6 leading-relaxed">
                  Full compilation to a standalone native binary. TypeScript is translated to
                  C++ via tree-sitter. Jinja2 templates emit optimized C++ code with
                  feature-based dead code elimination. Optional UPX compression.
                </p>
                <div className="flex items-center gap-2 text-sm font-mono text-accent">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  morph build --static --upx
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
