"use client";

import type { Variants, Transition } from "framer-motion";

export const spring: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 0.8,
};

export const smooth: Transition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1],
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -8, scale: 0.9 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

export const heroWord: Variants = {
  hidden: { opacity: 0, y: 80, rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export const cardTilt = {
  rest: { rotateX: 0, rotateY: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  hover: { rotateX: -4, rotateY: 4, scale: 1.02, transition: { duration: 0.4, ease: "easeOut" } },
};

export const magneticHover = {
  rest: { x: 0, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  hover: (direction: { x: number; y: number }) => ({
    x: direction.x * 0.3,
    y: direction.y * 0.3,
    transition: { duration: 0.3, ease: "easeOut" },
  }),
};

export const shimmer = {
  hidden: { backgroundPosition: "-200% 0" },
  visible: {
    backgroundPosition: "200% 0",
    transition: { duration: 2, ease: "linear", repeat: Infinity, repeatDelay: 3 },
  },
};

export const glowPulse = {
  hidden: { opacity: 0.3, scale: 0.8 },
  visible: {
    opacity: [0.3, 0.7, 0.3],
    scale: [0.8, 1.1, 0.8],
    transition: { duration: 4, ease: "easeInOut" as const, repeat: Infinity },
  },
};

export const pathDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const counterVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};
