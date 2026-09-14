"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";

export const CURL_CMD = "curl -fsSL https://morph.levizr.com/install.sh | sh";

export function InstallCommands() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    copyToClipboard(CURL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-fit max-w-full min-w-0 flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 font-mono text-sm text-accent">$</span>
          <code className="min-w-0 break-all font-mono text-xs text-foreground sm:text-sm">
            {CURL_CMD}
          </code>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy install command"
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
      <Link
        href="/download"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        See the <span className="text-accent">download page</span> for more options →
      </Link>
    </div>
  );
}
