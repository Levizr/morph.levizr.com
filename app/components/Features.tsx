"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Zap,
  Binary,
  Paintbrush,
  Gauge,
  Code2,
  Cpu,
} from "lucide-react";
import { fadeUp, stagger, spring } from "@/lib/animations";
import { useIsMobile } from "@/lib/useIsMobile";

const features = [
  {
    icon: Binary,
    title: "Native Binaries",
    description: "Compile to standalone native binaries under 1 MB. No browser runtime, no Electron, no WebView — just raw OpenGL.",
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20",
  },
  {
    icon: Paintbrush,
    title: "Full CSS + Tailwind",
    description: "Write styles with standard CSS or 500+ Tailwind utilities. Flexbox, animations, transforms, transitions — all supported.",
    gradient: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/20",
  },
  {
    icon: Zap,
    title: "Instant Hot Reload",
    description: "Dev mode watches your files, recompiles only the logic, and hot-swaps it via dlopen. Window never restarts.",
    gradient: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20",
  },
  {
    icon: Code2,
    title: "JSX + TypeScript",
    description: "Build UIs with familiar JSX syntax and TypeScript logic. Your JS is translated to C++ at compile time.",
    gradient: "from-emerald-500 to-green-500",
    shadow: "shadow-emerald-500/20",
  },
  {
    icon: Cpu,
    title: "C++ Interop",
    description: "Import C++ functions directly into your JSX. Full access to native libraries with zero-cost FFI.",
    gradient: "from-rose-500 to-pink-500",
    shadow: "shadow-rose-500/20",
  },
  {
    icon: Gauge,
    title: "Dead Code Elimination",
    description: "Feature-based tree-shaking at compile time. Only link what you use — text, flex, animation, transforms.",
    gradient: "from-teal-500 to-emerald-500",
    shadow: "shadow-teal-500/20",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const isMobile = useIsMobile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.06) 0%, transparent 60%)`
  );

  const borderGlow = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(139,92,246,0.15) 0%, transparent 50%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="group relative"
      variants={fadeUp}
      transition={spring}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onMouseLeave={isMobile ? undefined : handleMouseLeave}
      style={
        isMobile
          ? undefined
          : {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }
      }
    >
      <motion.div
        className="relative p-6 rounded-2xl border border-border bg-card h-full overflow-hidden cursor-default"
        whileHover={isMobile ? undefined : { scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glare effect */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: glareBackground }}
          />
        )}

        {/* Hover border glow */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: borderGlow }}
          />
        )}

        <div
          className={`relative z-10 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.shadow} mb-5`}
        >
          <feature.icon className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <h3 className="relative z-10 text-lg font-semibold mb-2">{feature.title}</h3>
        <p className="relative z-10 text-sm leading-relaxed text-muted">{feature.description}</p>
      </motion.div>
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-32 px-4 sm:px-6">
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
            Why Morph
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Everything you love about the web.
            <br />
            <span className="text-muted">Everything you need for native.</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
