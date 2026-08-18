"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Copy, Check, Zap } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { ParticleGrid } from "./ParticleGrid";
import { useIsMobile } from "@/lib/useIsMobile";
import { copyToClipboard } from "@/lib/clipboard";
import {
  fadeUp,
  scaleIn,
  smooth,
  glowPulse,
} from "@/lib/animations";

const heroCode = `import { morphState } from 'morph'

export default function App() {
  const [count, setCount] = morphState(0);

  return (
    <body>
      <div className="app">
        <div className="title">Hello, {count}!</div>
        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>
      </div>
    </body>
  );
}`;

export function Hero() {
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();

  const handleCopy = useCallback(() => {
    copyToClipboard(heroCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-x-clip px-4 py-10 sm:p-16 mb-10">
      <ParticleGrid />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-20 left-[15%] w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] rounded-full blur-[60px] sm:blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",  }}
        animate={isMobile ? undefined : { x: [0, 30, -20, 0] }}
        transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-[10%] w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] rounded-full blur-[80px] sm:blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)", }}
        animate={isMobile ? undefined : { x: [0, -40, 30, 0] }}
        transition={{ duration: 25, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[700px] sm:h-[700px] rounded-full blur-[80px] sm:blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }}
        variants={glowPulse}
        initial={isMobile ? false : "hidden"}
        animate={isMobile ? undefined : "visible"}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full min-w-0 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24"
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface/80 backdrop-blur-sm text-sm font-medium text-muted mb-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <motion.span
            animate={isMobile ? undefined : { rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </motion.span>
          <span>Native UI from JSX + CSS</span>
        </motion.div>

        {/* Animated heading */}
        <h1
          className="text-3xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] mb-6"
          style={{ perspective: 1000 }}
        >

          Write web code.
          <br className="hidden sm:block" />
          <span className="text-gradient">
            <span className="mr-[0.3em]"> Ship


              native
            </span>
            apps.
          </span>
        </h1>

        <motion.p
          className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...smooth, delay: 0.7 }}
        >
          Morph compiles{" "}
          <code className="px-1.5 py-0.5 rounded-md bg-surface text-foreground text-sm font-mono">
            .mx
          </code>{" "}
          files into lightweight native binaries with OpenGL rendering. No browser.
          No Electron. Under 1 MB.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ ...smooth, delay: 0.85 }}
        >
          <motion.a
            href="#code"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-accent-fg font-semibold text-base shadow-lg shadow-accent/25"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 20px 40px -12px rgba(109, 40, 217, 0.4)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.a>

          <motion.div
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm text-xs sm:text-sm font-mono text-muted cursor-pointer min-w-0 max-w-full overflow-x-auto"
            whileHover={{ scale: 1.03, borderColor: "var(--accent)" }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              className="text-accent shrink-0"
              animate={isMobile ? undefined : { opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              $
            </motion.span>
            <span className="whitespace-nowrap">pip install levizr-morph</span>
          </motion.div>
        </motion.div>

        {/* Code preview - fixed visibility on scroll */}
        <motion.div
          className="mt-16 relative w-full min-w-0"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          transition={{ ...smooth, delay: 1.1 }}
        >
          <motion.div
            className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl"
            animate={isMobile ? undefined : { opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative rounded-xl border border-border bg-card overflow-hidden shadow-2xl w-full min-w-0">
            <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-border bg-surface/50">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <span className="text-xs text-muted ml-2 font-mono truncate">App.mx</span>
              </div>
              <motion.button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-muted hover:text-foreground hover:bg-surface transition-all shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="hidden sm:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </motion.button>
            </div>
            <Highlight theme={themes.dracula} code={heroCode} language="tsx">
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className} p-4 sm:p-6 text-left overflow-x-auto text-xs sm:text-sm leading-relaxed`}
                  style={{ ...style, margin: 0 }}
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
      </motion.div>
    </section>
  );
}
