"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Bug,
  BookOpen,
  Boxes,
  Star,
  Cpu,
  Paintbrush,
  Library,
  Server,
  Heart,
  Terminal,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { DonateButton } from "@/app/components/DonateButton";
import { stagger, fadeUp } from "@/lib/animations";

const DONATE_URL = "https://razorpay.me/@levizr";
const GITHUB_URL = "https://github.com/Levizr/morph";

const funding = [
  {
    icon: Cpu,
    area: "Compiler",
    detail: "morphc, morpher",
    description: "TS→C++ coverage, faster builds, and better error messages.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Paintbrush,
    area: "Runtime",
    detail: "runtime/cpp",
    description: "Layout, text shaping, animations, and the Forge renderer.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Library,
    area: "Docs & examples",
    detail: "tutorials, guides, sample apps",
    description: "Everything that gets a new developer to a first native app.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Server,
    area: "Infra",
    detail: "CI runners, test machines",
    description:
      "Linux, macOS, and Windows machines plus morph.levizr.com hosting.",
    gradient: "from-amber-500 to-orange-500",
  },
];

const ways = [
  {
    icon: Star,
    title: "Star the repo and share what you built",
    description:
      "Visibility costs nothing and puts Morph in front of developers who are looking for exactly this.",
  },
  {
    icon: BookOpen,
    title: "Fix a bug or improve the docs",
    description:
      "The docs are the front door. A clarified paragraph or a fixed example is a real contribution — typo fixes count.",
  },
  {
    icon: Bug,
    title: "Report bugs with a minimal .mx repro",
    description:
      "A found bug is half-fixed. A minimal repro turns a vague report into a fix someone else can land the same day.",
  },
  {
    icon: Boxes,
    title: "Build an example app under examples/",
    description:
      "Working apps teach faster than any tutorial. One more example is one more path into the framework.",
  },
];

export default function SponsorPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 15%, rgba(236,72,153,0.09) 0%, transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="h-3 w-3 text-rose-500" />
              Sponsor Morph
            </motion.div>

            <motion.h1
              className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Keep Morph <span className="text-gradient">free, fast, and tiny.</span>
            </motion.h1>

            <motion.p
              className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Morph is open-source and built by{" "}
              <a
                href="https://www.levizr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Levizr Technologies
              </a>{" "}
              — a small, independent team. There is no company funding behind it,
              and there is no plan to start charging for the framework. Your support
              keeps it that way.
            </motion.p>

            <motion.div
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <DonateButton className="w-full sm:w-auto" />
              <motion.a
                href="#where-it-goes"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-8 py-4 text-base font-semibold transition-colors hover:bg-surface-hover sm:w-auto"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles className="h-4 w-4" />
                Where it goes
              </motion.a>
            </motion.div>

            <motion.p
              className="mt-6 text-sm text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              Prefer a direct link?{" "}
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-accent hover:underline"
              >
                razorpay.me/@levizr
              </a>{" "}
              — UPI, cards, or netbanking. Every amount helps.
            </motion.p>
          </div>
        </section>

        {/* Where your support goes */}
        <section
          id="where-it-goes"
          className="bg-surface/30 px-4 py-20 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <motion.div
              className="mx-auto mb-16 max-w-2xl text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Where your support goes.
              </h2>
              <p className="text-lg text-muted">
                Every amount helps — server costs, test devices, and full-time work
                on the compiler, renderer, and docs.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {funding.map((item) => (
                <motion.div
                  key={item.area}
                  className="flex gap-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
                  variants={fadeUp}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}
                  >
                    <item.icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-baseline gap-x-2">
                      <h3 className="text-lg font-semibold">{item.area}</h3>
                      <span className="font-mono text-xs text-muted">
                        {item.detail}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Not about money */}
        <section className="px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <motion.div
              className="mx-auto mb-16 max-w-2xl text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Not about money? You can also:
              </h2>
              <p className="text-lg text-muted">
                Time and attention are just as useful as a donation. Pick whichever
                one you can do today.
              </p>
            </motion.div>

            <div className="space-y-5">
              {ways.map((way, i) => (
                <motion.div
                  key={way.title}
                  className="flex gap-5 rounded-2xl border border-border bg-card p-6 sm:p-7"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
                    <way.icon className="h-5 w-5 text-rose-500" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-3">
                      <span className="font-mono text-xs text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-base font-semibold sm:text-lg">
                        {way.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted">
                      {way.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <Terminal className="h-5 w-5 text-accent" strokeWidth={2} />
                </div>
                <p className="text-sm leading-relaxed text-muted">
                  Setting up the code? Read{" "}
                  <a
                    href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent hover:underline"
                  >
                    CONTRIBUTING.md
                  </a>{" "}
                  for the toolchain —{" "}
                  <code className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground">
                    cargo build --workspace
                  </code>{" "}
                  then{" "}
                  <code className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground">
                    target/debug/morph doctor
                  </code>{" "}
                  to verify your C++ toolchain and graphics libraries.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 pb-24 sm:px-6 sm:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="absolute -inset-6 rounded-3xl opacity-40 blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(236,72,153,0.18) 0%, transparent 70%)",
                }}
                aria-hidden
              />

              <div className="relative rounded-3xl border border-border bg-card p-10 sm:p-14">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Thank you.
                </h2>
                <p className="mx-auto mb-8 max-w-lg text-lg text-muted">
                  Every contribution, no matter how small, matters. A star, a typo
                  fix, a bug report, or a donation — it all buys the next week of
                  full-time work on Morph.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <motion.a
                    href={DONATE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-accent-fg shadow-lg shadow-accent/25 sm:w-auto"
                    whileHover={{
                      scale: 1.04,
                      boxShadow: "0 20px 40px -12px rgba(109, 40, 217, 0.4)",
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Heart className="h-4 w-4" />
                    Donate — one link
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </motion.a>
                  <Link
                    href="/contribute"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-8 py-4 text-base font-semibold transition-colors hover:bg-surface-hover sm:w-auto"
                  >
                    <BookOpen className="h-4 w-4" />
                    Contribute code
                  </Link>
                </div>

                <p className="mt-8 text-xs text-muted">
                  Built with Rust and C++ · Rendered with OpenGL · No browser
                  required
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
