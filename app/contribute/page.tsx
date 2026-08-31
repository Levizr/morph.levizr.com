"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  GitBranch,
  Cpu,
  Paintbrush,
  Bug,
  BookOpen,
  Globe,
  Zap,
  Heart,
  Terminal,
  Code2,
  Users,
  Rocket,
  Shield,
  Cog,
  Lightbulb,
  Star,
  Blocks,
} from "lucide-react";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { stagger, fadeUp } from "@/lib/animations";

const whyReasons = [
  {
    icon: Rocket,
    title: "Ship something genuinely new",
    description:
      "There is no mainstream compiler-based UI framework that turns JSX + CSS into native binaries with OpenGL rendering — and addresses the real cost of 'easy' native UIs. Morph is building it, one crate at a time. This is frontier work, not another Electron wrapper.",
  },
  {
    icon: Code2,
    title: "Deep systems-level work",
    description:
      "Morph is a full compiler stack: a JSX/TSX parser (Oxc), a CSS parser (lightningcss), an intermediate representation, C++/Rust codegen, a C++ runtime, and an OpenGL renderer. It is not a React wrapper — it is a genuine compiler you can sink your teeth into.",
  },
  {
    icon: Cpu,
    title: "Morphc: a Rust rewrite underway now",
    description:
      "The proven Python prototype is being rewritten in Rust as `morphc` — a single native binary with no Python dependency, instant `morph dev`, and parallel compilation. There is real, concrete work on the compiler, parser, and IR waiting for contributors right now.",
  },
  {
    icon: Star,
    title: "Early-stage, real impact",
    description:
      "Every contribution lands at the architectural layer — the design decisions you help make will define how developers ship native apps. Your name goes on something that thousands of people could build on. And small PRs get reviewed and merged fast.",
  },
];

const crates = [
  {
    name: "morphc",
    role: "CLI binary",
    description:
      "The `morph` command — init, install, dev, build, run, check, doctor, translate. clap-based CLI, version management, hot-reload IPC.",
  },
  {
    name: "morph-parser",
    role: "JSX/TSX + CSS parsing",
    description:
      "Oxc (3x faster than SWC, arena-allocated, spec-compliant) for JSX/TSX, lightningcss for CSS. Typed ASTs that feed the rest of the pipeline.",
  },
  {
    name: "morph-ir",
    role: "Intermediate Representation",
    description:
      "The typed IR that sits between parsing and codegen. Style registry, Tailwind resolution, IRBuilder — JSON IR wire format shared with dev mode.",
  },
  {
    name: "morph-codegen",
    role: "C++ / Rust code generation",
    description:
      "Tera templates that emit C++ (and a future Rust runtime). Feature flags, node/logic emitters, dead-code elimination.",
  },
  {
    name: "morph-build",
    role: "Build system",
    description:
      "Cross-platform builds via g++/clang++, binary output, and the .morph/build directory structure.",
  },
  {
    name: "morph-config",
    role: "Config & lock parsing",
    description:
      "morph.config.json, morph.lock, runtime versioning and compatibility checks.",
  },
];

const areas = [
  {
    icon: Cpu,
    title: "The Rust compiler (morphc)",
    gradient: "from-violet-500 to-purple-600",
    difficulty: "Advanced",
    description:
      "Work where the action is: the Rust rewrite that replaces the Python toolchain. Contribute to the parser, IR, codegen, or build system — much of phases 6 and 7 (dev mode, polish, CI/CD) is still open.",
    tasks: [
      "Finish dev mode: watch + IPC, hot reload",
      "Polish: check, doctor, CI/CD, distribution",
      "Optimize compile speed and emit quality",
      "Add source maps and better error messages",
    ],
  },
  {
    icon: Paintbrush,
    title: "Layout & Rendering",
    gradient: "from-blue-500 to-cyan-500",
    difficulty: "Advanced",
    description:
      "The C++ runtime and OpenGL renderer — Flexbox layout, text shaping, CSS animations, and the compositing pipeline. The layout engine has real, named bugs listed below.",
    tasks: [
      "Fix flex margin / centering / wrap bugs",
      "Implement missing CSS properties",
      "Improve text rendering and emoji measurement",
      "Optimize GPU draw call batching",
    ],
  },
  {
    icon: BookOpen,
    title: "Docs, Story & Examples",
    gradient: "from-emerald-500 to-green-500",
    difficulty: "Beginner",
    description:
      "Morph's docs tell the real story of why it exists. Write tutorials, build example apps, expand the docs in the repo, and add architecture explainers.",
    tasks: [
      "Write a 'Build your first app' tutorial",
      "Create example projects (todo, chat, dashboard)",
      "Improve API reference and the docs site",
      "Add architecture diagrams and explainers",
    ],
  },
  {
    icon: Bug,
    title: "Bug Reports & Testing",
    gradient: "from-amber-500 to-orange-500",
    difficulty: "Beginner",
    description:
      "Morph is honest about being buggy — and a found bug is half-fixed. Confirm issues, write tests, squash bugs, and make the framework solid.",
    tasks: [
      "Reproduce and confirm reported issues",
      "Write unit tests for the parser and layout",
      "Fix bugs in the list below",
      "Improve error / panic recovery",
    ],
  },
  {
    icon: Globe,
    title: "Platform & Tooling",
    gradient: "from-teal-500 to-emerald-500",
    difficulty: "Intermediate",
    description:
      "Expand Morph's reach and the developer experience around it: Linux/macOS/Windows support, CI/CD, package distribution, and editor tooling.",
    tasks: [
      "Improve Windows support and testing",
      "Add Homebrew / AUR / package installs",
      "Build GitHub Actions for CI and releases",
      "Create a VS Code extension for .mx files",
    ],
  },
];

const knownBugs = [
  "Every flex child sits at double its left/top margin — rows drift sideways line by line",
  "`flex-grow` centering reads a stale total and lands the whole row off-center",
  "Lines that should wrap don't — the wrap test forgets the gap",
  "`margin: auto` centers against a size clamped after centering",
  "Text ignores its own padding — first glyph inside the gutter",
  "Font inheritance reaches only one level deep",
  "Emoji measure with the text font but draw with the emoji font",
  "Hot reload drops a save if one is already running",
  "Conditional rendering `{cond ? a : b}` leaks both branches' nodes on every save",
  "Signals are read across threads without synchronization where fetch() resumes",
];

const gettingStarted = [
  {
    step: 1,
    title: "Clone the repo",
    code: "git clone https://github.com/Levizr/morph.git\ncd morph",
    description: "Everything lives in the single Levizr/morph repository — no separate repos to hunt for.",
  },
  {
    step: 2,
    title: "Build the Rust compiler",
    code: "cargo build",
    description:
      "Morph's toolchain is written in Rust and compiled with cargo. Run cargo build and you have the morphc compiler binary. No Python, no pip — that's the whole point of the rewrite.",
  },
  {
    step: 3,
    title: "Find what needs a hand",
    code: "",
    description: "Pick an open issue, or dive straight into one of the crates above. The bug list below is full of places to make an immediate difference.",
  },
  {
    step: 4,
    title: "Submit a PR",
    code: "git checkout -b my-feature\ngit commit -m 'feat: add X'\ngit push origin my-feature",
    description: "Keep PRs focused, add tests where possible, and open the pull request. The maintainer reviews quickly.",
  },
];

export default function ContributePage() {
  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 20%, rgba(139,92,246,0.08) 0%, transparent 60%)",
            }}
          />
          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/50 text-xs font-medium text-muted mb-6 uppercase tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="w-3 h-3 text-rose-500" />
              Contributing to Morph
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Help write a compiler
              <br />
              <span className="text-gradient">that changes {"what's"} possible.</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Morph is a Rust-based compiler and native UI framework — no browser, no
              Electron, no Python. Just your JSX and CSS compiled to a native binary with
              OpenGL rendering. It was started by a single author who refused to accept
              that {"this didn't"} exist. It {"can't"} be finished by one person. {"That's"} where
              you come in.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.a
                href="https://github.com/Levizr/morph/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-accent-fg font-semibold text-base shadow-lg shadow-accent/25"
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 20px 40px -12px rgba(109, 40, 217, 0.4)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <GitBranch className="w-4 h-4" />
                View Open Issues
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.a>
              <motion.a
                href="#getting-started"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-surface hover:bg-surface-hover font-semibold text-sm transition-colors"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Terminal className="w-4 h-4" />
                Getting Started
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* Why Contribute */}
        <section className="py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                Why contribute to Morph?
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                {"This isn't"} another open-source project looking for free labor. Morph is a
                chance to help build something that genuinely {"doesn't"} exist yet.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {whyReasons.map((reason) => (
                <motion.div
                  key={reason.title}
                  className="relative p-8 rounded-2xl border border-border bg-card"
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-accent/10 mb-5">
                    <reason.icon className="w-5 h-5 text-accent" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{reason.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{reason.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* What Morph is */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 bg-surface/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="relative rounded-3xl border border-border bg-card p-10 sm:p-14"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="absolute -inset-6 rounded-3xl blur-3xl opacity-40 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, transparent 70%)",
                }}
              />

              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                  What exactly is Morph?
                </h2>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>
                    Morph is a <strong className="text-foreground">compiler-based native UI framework</strong>. You write
                    your UI with JSX and CSS (including Tailwind), and Morph compiles it
                    into a standalone native binary — no browser, no Electron, no WebView.
                  </p>
                  <p>
                    Rendering is powered by <strong className="text-foreground">OpenGL 3.3+</strong> for GPU-accelerated
                    drawing and sub-millisecond frame times, with{" "}
                    <strong className="text-foreground">zero runtime dependencies</strong> and a binary under 1 MB thanks
                    to dead-code elimination.
                  </p>
                  <p>
                    The toolchain is written in <strong className="text-foreground">Rust</strong>. The new compiler
                    binary, <code className="px-1.5 py-0.5 rounded-md bg-surface text-foreground text-sm font-mono">morphc</code>, replaces
                    the original Python prototype: {"it's"} a single, fast binary compiled with{" "}
                    <code className="px-1.5 py-0.5 rounded-md bg-surface text-foreground text-sm font-mono">cargo build</code>, parsing
                    JSX/TSX with Oxc and CSS with lightningcss, lowering to a typed IR, and
                    emitting C++ (with a future Rust runtime).
                  </p>
                  <p>
                    The dev experience mirrors the web:{" "}
                    <code className="px-1.5 py-0.5 rounded-md bg-surface text-foreground text-sm font-mono">morph dev</code> watches
                    your files, recompiles only what changed, and hot-swaps it via{" "}
                    <code className="px-1.5 py-0.5 rounded-md bg-surface text-foreground text-sm font-mono">dlopen</code> — the window
                    never restarts.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Rust workspace */}
        <section className="py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                A Rust workspace built for contributions.
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                The whole compiler is one Cargo workspace. Pick a crate that matches your
                interests — each has a clear job.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {crates.map((c) => (
                <motion.div
                  key={c.name}
                  className="relative p-6 rounded-2xl border border-border bg-card hover:bg-surface/50 transition-colors"
                  variants={fadeUp}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10">
                      <Blocks className="w-4 h-4 text-accent" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-mono text-sm font-semibold">{c.name}</div>
                      <div className="text-xs text-muted">{c.role}</div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">{c.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Real bugs that need fixing */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 bg-surface/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                Real bugs, waiting for you.
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                The author is upfront about it: Morph is buggy. A found bug is half-fixed.
                {"Here's"} the honest list — pick one and make it disappear.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {knownBugs.map((bug) => (
                <motion.div
                  key={bug}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
                  variants={fadeUp}
                >
                  <Bug className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted leading-relaxed">{bug}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="text-center text-sm text-muted mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {"Didn't"} see a bug {"you've"} hit?{" "}
              <a
                href="https://github.com/Levizr/morph/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-medium hover:underline"
              >
                File an issue
              </a>{" "}
              — a report is a contribution too.
            </motion.p>
          </div>
        </section>

        {/* Areas to Contribute */}
        <section className="py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                Where you can make a difference.
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Every part of Morph needs help. Pick what matches your skills.
              </p>
            </motion.div>

            <div className="space-y-6">
              {areas.map((area, i) => (
                <motion.div
                  key={area.title}
                  className="group relative rounded-2xl border border-border bg-card overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  whileHover={{ scale: 1.005 }}
                >
                  <div className="p-8 sm:p-10">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${area.gradient} shadow-lg shrink-0`}
                      >
                        <area.icon className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <h3 className="text-xl font-semibold">{area.title}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-surface/50 text-muted w-fit">
                            {area.difficulty}
                          </span>
                        </div>
                        <p className="text-muted leading-relaxed mb-5">{area.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {area.tasks.map((task) => (
                            <div key={task} className="flex items-start gap-2 text-sm text-muted">
                              <Zap className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section id="getting-started" className="py-20 sm:py-28 px-4 sm:px-6 bg-surface/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                Get started in minutes.
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Four steps from zero to your first pull request — clone, build, fix, ship.
              </p>
            </motion.div>

            <div className="space-y-6">
              {gettingStarted.map((item, i) => (
                <motion.div
                  key={item.step}
                  className="relative flex gap-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-fg font-bold text-sm">
                      {item.step}
                    </div>
                    {i < gettingStarted.length - 1 && <div className="w-px flex-1 bg-border mt-3" />}
                  </div>
                  <div className="pb-8 flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted mb-3">{item.description}</p>
                    {item.code && (
                      <div className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-surface/50">
                          <Terminal className="w-3.5 h-3.5 text-muted" />
                          <span className="text-xs text-muted font-mono">terminal</span>
                        </div>
                        <pre className="px-4 py-3 text-sm font-mono text-muted overflow-x-auto">
                          <code>{item.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contribution Guidelines */}
        <section className="py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="rounded-3xl border border-border bg-card p-10 sm:p-14"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                Guidelines that keep Morph healthy.
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "Code quality matters",
                    description:
                      "Write clear, readable code and follow the existing patterns in the codebase. New Rust crates and modules follow the workspace conventions in the repo.",
                  },
                  {
                    icon: Lightbulb,
                    title: "Explain your reasoning",
                    description:
                      "In your PR, explain why the change is needed, not just what it does. Context helps reviewers approve faster.",
                  },
                  {
                    icon: Bug,
                    title: "Test what you change",
                    description:
                      "Add tests when possible. For rendering and layout changes, include before/after screenshots or reproduction steps.",
                  },
                  {
                    icon: Cog,
                    title: "Keep PRs focused",
                    description:
                      "One logical change per PR. Small, reviewable PRs get merged faster than sprawling 500-line diffs.",
                  },
                  {
                    icon: Users,
                    title: "Be kind and constructive",
                    description:
                      "A community that respects each other builds better software. Feedback is about the code, not the person.",
                  },
                ].map((rule, i) => (
                  <motion.div
                    key={rule.title}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 shrink-0 mt-0.5">
                      <rule.icon className="w-4 h-4 text-accent" strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-0.5">{rule.title}</h4>
                      <p className="text-sm text-muted leading-relaxed">{rule.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 sm:py-32 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="absolute -inset-6 rounded-3xl blur-3xl opacity-40"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(139,92,246,0.18) 0%, transparent 70%)",
                }}
              />

              <div className="relative rounded-3xl border border-border bg-card p-12 sm:p-16">
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                  It was never going to be built
                  <br />
                  <span className="text-gradient">by one person alone.</span>
                </h2>
                <p className="text-lg text-muted max-w-lg mx-auto mb-8">
                  A 17-year-old built every line so far — the parser, the compiler, the
                  renderer, the layout engine. He asked for help openly and honestly. Be
                  the person who answers that call. A found bug, a fixed flex rule, a
                  finished crate — it all adds up.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.a
                    href="https://github.com/Levizr/morph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-accent-fg font-semibold text-base shadow-lg shadow-accent/25"
                    whileHover={{
                      scale: 1.04,
                      boxShadow: "0 20px 40px -12px rgba(109, 40, 217, 0.4)",
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <GitBranch className="w-4 h-4" />
                    Start Contributing
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </motion.a>
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-surface hover:bg-surface-hover font-semibold text-sm transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Read the Docs
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
