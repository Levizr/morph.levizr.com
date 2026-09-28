"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Star,
  Bug,
  BookOpen,
  Boxes,
  Sparkles,
} from "lucide-react";
import { stagger, fadeUp } from "@/lib/animations";

const MotionLink = motion.create(Link);

const DONATE_URL = "https://razorpay.me/@levizr";

const ways = [
  {
    icon: Star,
    title: "Star and share",
    description: "Star the repo and show off what you built with Morph.",
  },
  {
    icon: BookOpen,
    title: "Fix a bug or improve the docs",
    description: "A typo fix counts. Every doc PR ships.",
  },
  {
    icon: Bug,
    title: "Report a bug with a repro",
    description: "A minimal .mx repro is worth its weight in gold.",
  },
  {
    icon: Boxes,
    title: "Build an example app",
    description: "Add a project under examples/ so others learn faster.",
  },
];

export function SponsorSection() {
  return (
    <section id="sponsor" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(236,72,153,0.07) 0%, transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          className="mx-auto mb-14 max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <Heart className="h-3 w-3 text-rose-500" />
            Sponsor
          </motion.div>

          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Free, open-source, and{" "}
            <span className="text-gradient">funded by you.</span>
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-muted">
            Morph is built by{" "}
            <a
              href="https://www.levizr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Levizr Technologies
            </a>{" "}
            — a small, independent team with no company funding behind it. Your
            support keeps Morph fast, tiny, and free.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mb-14 flex max-w-3xl flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <MotionLink
            href="/sponsor"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-accent-fg shadow-lg shadow-accent/25 sm:w-auto"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 20px 40px -12px rgba(109, 40, 217, 0.4)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <Heart className="h-4 w-4" />
            Donate — pick an amount
          </MotionLink>
          <MotionLink
            href="/sponsor#where-it-goes"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-8 py-4 text-base font-semibold transition-colors hover:bg-surface-hover sm:w-auto"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Sparkles className="h-4 w-4" />
            Where support goes
          </MotionLink>
        </motion.div>

        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <p className="text-sm text-muted">
            Every amount helps — server costs, test devices, and full-time work on
            the compiler, renderer, and docs. Prefer a direct link?{" "}
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-accent hover:underline"
            >
              razorpay.me/@levizr
            </a>{" "}
            — UPI, cards, or netbanking.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {ways.map((way) => (
            <motion.div
              key={way.title}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-surface/50"
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
                <way.icon className="h-5 w-5 text-rose-500" strokeWidth={2} />
              </div>
              <h3 className="mb-1.5 text-base font-semibold">{way.title}</h3>
              <p className="text-sm leading-relaxed text-muted">
                {way.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="mt-10 text-center text-sm text-muted"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Want to write code instead?{" "}
          <Link
            href="/contribute"
            className="font-medium text-accent hover:underline"
          >
            See how to contribute →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
