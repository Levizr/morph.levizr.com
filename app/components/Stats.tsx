"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { counterVariants } from "@/lib/animations";

interface CounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function AnimatedCounter({ target, suffix = "", prefix = "", decimals = 0 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now();
    const duration = 1500;

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, target]);

  return (
    <motion.span
      ref={ref}
      className="text-gradient"
      variants={counterVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {prefix}{value.toFixed(decimals)}{suffix}
    </motion.span>
  );
}

const stats = [
  { value: 1, suffix: " MB", prefix: "<", decimals: 0, label: "Binary size" },
  { value: 0, suffix: "", prefix: "", decimals: 0, label: "Runtime deps" },
  { value: 500, suffix: "+", prefix: "", decimals: 0, label: "Tailwind utils" },
  { value: 3.3, suffix: "", prefix: "", decimals: 1, label: "OpenGL core" },
];

export function Stats() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center p-6 rounded-2xl border border-border bg-card"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -6,
                scale: 1.03,
                transition: { duration: 0.3 },
              }}
            >
              <div className="text-3xl sm:text-4xl font-bold mb-1">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  decimals={stat.decimals}
                />
              </div>
              <div className="text-sm text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
