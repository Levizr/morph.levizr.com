"use client";

import { motion } from "framer-motion";
import { ArrowRight, Copy, Check, Zap } from "lucide-react";
import { useState, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { InstallCommands } from "./InstallCommands";
import { copyToClipboard } from "@/lib/clipboard";
import { fadeUp, smooth } from "@/lib/animations";

const heroCode = `import { CSS, morphState } from 'morph'

CSS.load("./style.css")

export const windowConfig = {
  title: "Counter",
  width: 400,
  height: 300,
}

export default function App() {
  const [count, setCount] = morphState(0);

  return (
    <body>
      <div className="counter">
        <div className="count">{count}</div>
        <button onClick={() => setCount(count + 1)}>
          Clicked {count} times
        </button>
      </div>
    </body>
  );
}`;

export function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    copyToClipboard(heroCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <section className="relative overflow-x-clip px-4 pb-16 pt-32 sm:px-6 sm:pt-40">
      {/* Single static backdrop — no canvas, no animated orbs */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, var(--glow) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-4xl text-center">
        <motion.div
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-sm font-medium text-muted"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <span>Native UI from JSX + CSS</span>
        </motion.div>

        <h1 className="mb-6 text-5xl font-bold leading-[1.02] tracking-tighter sm:text-7xl">
          Write web code.
          <br />
          <span className="text-gradient">Ship native apps.</span>
        </h1>

        <motion.p
          className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...smooth, delay: 0.15 }}
        >
          Morph compiles{" "}
          <code className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-sm text-foreground">
            .mx
          </code>{" "}
          files into lightweight native binaries with OpenGL rendering. No browser.
          No Electron. Under 1 MB.
        </motion.p>

        <motion.p
          className="mx-auto mb-10 max-w-2xl text-sm text-muted"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...smooth, delay: 0.25 }}
        >
          A compiler, not an interpreter — Oxc + lightningcss → Tera C++ → native OpenGL binary.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...smooth, delay: 0.3 }}
          className="mb-6"
        >
          <InstallCommands />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...smooth, delay: 0.4 }}
        >
          <a
            href="#code"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-fg font-semibold text-sm shadow-lg shadow-accent/25"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        {/* Single code preview — always-dark window so it matches both themes */}
        <motion.div
          className="mt-14 w-full min-w-0 text-left"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...smooth, delay: 0.5 }}
        >
          <div
            id="code"
            className="relative w-full min-w-0 scroll-mt-24 overflow-hidden rounded-xl border border-border shadow-xl"
            style={{ background: "#0d1117" }}
          >
            <div
              className="flex items-center justify-between border-b px-3 py-3 sm:px-4"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex shrink-0 gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <span className="ml-2 truncate font-mono text-xs text-neutral-400">App.mx</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-400" />
                    <span className="hidden sm:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
            <Highlight theme={themes.dracula} code={heroCode} language="tsx">
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className} overflow-x-auto p-4 text-left text-xs leading-relaxed sm:p-6 sm:text-sm`}
                  style={{ ...style, margin: 0, background: "transparent" }}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
