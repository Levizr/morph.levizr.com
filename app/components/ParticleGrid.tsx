"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/lib/useIsMobile";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

export function ParticleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const isMobile = useIsMobile();

  const initParticles = useCallback((w: number, h: number) => {
    const spacing = isMobile ? 90 : 60;
    const particles: Particle[] = [];
    for (let x = 0; x < w; x += spacing) {
      for (let y = 0; y < h; y += spacing) {
        particles.push({
          x: x + Math.random() * 10 - 5,
          y: y + Math.random() * 10 - 5,
          vx: 0,
          vy: 0,
          size: 1.2,
          opacity: 0.15,
          hue: 260 + Math.random() * 40,
        });
      }
    }
    particlesRef.current = particles;
  }, [isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = resolvedTheme === "dark";

    const resize = () => {
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(window.innerWidth, window.innerHeight);
      if (isMobile) drawStatic();
    };

    const drawStatic = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${isDark ? 0.12 : 0.08})`;
        ctx.fill();
      }
    };

    if (isMobile) {
      resize();
      window.addEventListener("resize", resize);
      return () => {
        cancelAnimationFrame(animRef.current);
        window.removeEventListener("resize", resize);
      };
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particlesRef.current) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;

        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 30;
          p.vx -= (dx / dist) * force * 0.02;
          p.vy -= (dy / dist) * force * 0.02;
          p.opacity = Math.min(1, p.opacity + 0.05);
        } else {
          p.opacity += (0.15 - p.opacity) * 0.05;
        }

        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const alpha = isDark ? p.opacity * 0.8 : p.opacity * 0.5;
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const alpha = (1 - dist / 80) * (isDark ? 0.15 : 0.08);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(260, 60%, 60%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [resolvedTheme, initParticles, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
