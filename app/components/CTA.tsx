"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/lib/useIsMobile";

export function CTA() {
  const isMobile = useIsMobile();

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Soft pulsing glow behind */}
          <motion.div
            className="absolute -inset-6 rounded-3xl blur-3xl opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(139,92,246,0.18) 0%, transparent 70%)",
            }}
            animate={
              isMobile
                ? undefined
                : {
                    opacity: [0.4, 0.6, 0.4],
                    scale: [0.97, 1.03, 0.97],
                  }
            }
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative rounded-3xl border border-border bg-card p-12 sm:p-16">
            <motion.h2
              className="text-3xl sm:text-5xl font-bold tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Ready to go native?
            </motion.h2>

            <motion.p
              className="text-lg text-muted mb-8 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Install Morph, scaffold a project, and build your first native app in
              under a minute.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface text-sm font-mono text-muted"
                whileHover={{
                  scale: 1.05,
                  borderColor: "var(--accent)",
                  boxShadow: "0 8px 30px rgba(139,92,246,0.15)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  className="text-accent"
                  animate={isMobile ? undefined : { opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  $
                </motion.span>
                <span>pip install levizr-morph</span>
              </motion.div>

              <motion.a
                href="https://github.com/levizr/morph"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-surface hover:bg-surface-hover font-semibold text-sm"
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                View on GitHub
                <motion.span
                  className="inline-block"
                  animate={isMobile ? undefined : { x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
