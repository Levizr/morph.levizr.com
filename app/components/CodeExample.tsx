"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";

const tabs = [
  {
    id: "app",
    label: "App.mx",
    language: "tsx" as const,
    code: `import { CSS, morphState } from 'morph'

CSS.load("style.css")

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
        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={() => setCount(count + 1)}
          >
            +1
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setCount(0)}
          >
            Reset
          </button>
        </div>
      </div>
    </body>
  );
}`,
  },
  {
    id: "style",
    label: "style.css",
    language: "css" as const,
    code: `.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 100;
}

.count {
  font-size: 48px;
  font-weight: bold;
  color: black;
  margin: auto;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn {
  color: rgb(255, 255, 255);
  padding: 8px 16px;
  border-radius: 8px;
  transition: transform 0.2s ease,
  background-color 0.2s ease;
  cursor: pointer;
}

.btn:hover {
  transform: scale(1.05);
  color: #3f3f46
}

.btn:active {
  transform: scale(0.95);
}

.btn-primary {
  background-color: #7c3aed;
}

.btn-secondary {
  background-color: #3f3f46;
}`,
  },
  {
    id: "async",
    label: "fetch.mx",
    language: "tsx" as const,
    code: `import { morphState, morphEffect } from 'morph'

export const windowConfig = {
  title: "Data Loader",
  width: 400,
  height: 300,
}

export default function App() {
  const [data, setData] = morphState("");
  const [loading, setLoading] = morphState(0);

  async function loadData() {
    setLoading(1);
    let res = await fetch(
      "https://api.example.com/data"
    );
    let body = res.text();
    setData(body);
    setLoading(0);
  }

  morphEffect(() => {
    loadData();
  }, []);

  return (
    <body>
      <div className="container">
        {loading === 1 && <span>Loading...</span>}
        {loading === 0 && <div>{data}</div>}
      </div>
    </body>
  );
}`,
  },
];

function CodeBlock({ code, language }: { code: string; language: "tsx" | "css" }) {
  return (
    <Highlight theme={themes.dracula} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} p-4 sm:p-6 text-xs sm:text-sm leading-relaxed`}
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
  );
}

export function CodeExample() {
  const [activeTab, setActiveTab] = useState("app");
  const [copied, setCopied] = useState(false);
  const active = tabs.find((t) => t.id === activeTab)!;

  const handleCopy = useCallback(() => {
    copyToClipboard(active.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [active.code]);

  return (
    <section id="code" className="relative py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/50 text-xs font-medium text-muted mb-6 uppercase tracking-wider"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            Code Examples
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Familiar syntax.
            <br />
            <span className="text-muted">Native power.</span>
          </h2>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl shadow-black/5 dark:shadow-black/20"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/30">
            <div className="flex items-center gap-1 overflow-x-auto">
              <div className="flex gap-1.5 mr-4 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-accent/10 text-accent"
                      : "text-muted hover:text-foreground hover:bg-surface"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.label}
                </motion.button>
              ))}
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

          <div className="overflow-x-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <CodeBlock code={active.code} language={active.language} />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
