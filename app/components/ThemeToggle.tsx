"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={cycle}
      aria-label="Toggle theme"
      className="relative w-9 h-9 rounded-lg border border-border bg-surface hover:bg-surface-hover flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <span className="absolute transition-all duration-300" style={{ opacity: theme === "light" ? 1 : 0, transform: theme === "light" ? "scale(1) rotate(0deg)" : "scale(0) rotate(90deg)" }}>
        <Sun className="w-4 h-4 text-amber-500" />
      </span>
      <span className="absolute transition-all duration-300" style={{ opacity: theme === "dark" ? 1 : 0, transform: theme === "dark" ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)" }}>
        <Moon className="w-4 h-4 text-blue-400" />
      </span>
      <span className="absolute transition-all duration-300" style={{ opacity: theme === "system" ? 1 : 0, transform: theme === "system" ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)" }}>
        <Monitor className="w-4 h-4 text-muted" />
      </span>
    </button>
  );
}
