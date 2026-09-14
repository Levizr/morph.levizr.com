"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  Download,
  Package,
  Terminal,
  MonitorCheck,
} from "lucide-react";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { copyToClipboard } from "@/lib/clipboard";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const CARGO_CMD = "cargo install morphc";
const CURL_CMD = "curl -fsSL https://morph.levizr.com/install.sh | sh";
const DOCTOR_CMD = "morph doctor";
const SOURCE_CMD = "git clone https://github.com/Levizr/morph.git";

function CommandBox({ cmd, label }: { cmd: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    copyToClipboard(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cmd]);

  return (
    <div className="flex w-full min-w-0 flex-col gap-1 rounded-xl border border-border bg-surface/60 px-4 py-3 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="shrink-0 font-mono text-sm text-accent">$</span>
        <code className="min-w-0 flex-1 break-all font-mono text-xs text-foreground sm:text-sm">
          {cmd}
        </code>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
        className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-500" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}

function OptionCard({
  index,
  icon: Icon,
  title,
  badge,
  description,
  children,
}: {
  index: number;
  icon: React.ElementType;
  title: string;
  badge?: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
    >
      <div className="mb-1 flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {badge && (
          <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">
            {badge}
          </span>
        )}
      </div>
      <p className="mb-5 text-sm leading-relaxed text-muted">{description}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </motion.section>
  );
}

export default function DownloadPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="pt-16">
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 50% 0%, var(--glow) 0%, transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-sm font-medium text-muted"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Download className="h-3.5 w-3.5 text-accent" />
              <span>Download Morph</span>
            </motion.div>
            <motion.h1
              className="mb-4 text-4xl font-bold tracking-tighter sm:text-6xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Install in seconds.
            </motion.h1>
            <motion.p
              className="mx-auto max-w-xl text-lg text-muted"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Pick your way in — Cargo, the one-line installer, or a prebuilt
              binary straight from GitHub releases.
            </motion.p>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            <OptionCard
              index={0}
              icon={Terminal}
              title="One-line installer"
              badge="Fastest"
              description="Auto-detects your platform and installs the latest prebuilt morph binary to ~/.local/bin. Pin a version with MORPH_VERSION or change the dir with MORPH_INSTALL_DIR."
            >
              <CommandBox cmd={CURL_CMD} label="curl installer" />
              <p className="text-xs text-muted">
                Installs the <span className="font-mono text-foreground">morph</span> binary
                and prints PATH setup if <span className="font-mono">~/.local/bin</span> is
                missing from your PATH.
              </p>
            </OptionCard>

            <OptionCard
              index={1}
              icon={Package}
              title="Install with Cargo"
              description="The morphc crate compiles to the morph binary. First build takes 1–2 minutes; after that everything is instant. Required on Intel Macs where no prebuilt binary exists."
            >
              <CommandBox cmd={CARGO_CMD} label="cargo install" />
              <p className="text-xs text-muted">
                Package <span className="font-mono text-foreground">morphc</span> provides
                binary <span className="font-mono text-foreground">morph</span>. Or build
                the latest from source with{" "}
                <span className="font-mono text-foreground">
                  cargo install --path crates/morphc
                </span>
                .
              </p>
            </OptionCard>

            <OptionCard
              index={2}
              icon={GithubIcon}
              title="Prebuilt binaries"
              badge="GitHub releases"
              description="Grab morph-{os}-{arch}.tar.gz directly, drop the morph binary on your PATH. No installer, no build step."
            >
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="divide-y divide-border font-mono text-xs sm:text-sm">
                  {[
                    "morph-linux-x64.tar.gz",
                    "morph-linux-arm64.tar.gz",
                    "morph-macos-arm64.tar.gz",
                    "morph-windows-x64.tar.gz",
                  ].map((file) => (
                    <div
                      key={file}
                      className="flex min-w-0 items-center gap-2 px-4 py-2.5"
                    >
                      <span className="min-w-0 flex-1 break-all text-foreground">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a
                href="https://github.com/Levizr/morph/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-lg shadow-accent/25"
              >
                <GithubIcon className="h-4 w-4" />
                Open releases
              </a>
              <p className="text-xs text-muted">
                Intel Macs have no prebuilt binary — use Cargo there instead.
              </p>
            </OptionCard>

            <OptionCard
              index={3}
              icon={MonitorCheck}
              title="Verify your system"
              description="Check your C++ toolchain, CMake, GLFW, OpenGL, FreeType, and HarfBuzz in one shot."
            >
              <CommandBox cmd={DOCTOR_CMD} label="morph doctor" />
              <p className="text-xs text-muted">
                Add <span className="font-mono text-foreground">-v</span> for detailed
                version info. Clone the source anytime with:
              </p>
              <CommandBox cmd={SOURCE_CMD} label="git clone" />
            </OptionCard>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
