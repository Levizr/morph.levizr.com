"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

export function MarkdownContent({ html }: { html: string }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href?.startsWith("/") || anchor.target === "_blank") return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    router.push(href);
  };

  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (href?.startsWith("/")) router.prefetch(href);
  };

  return (
    <div
      ref={ref}
      className="docs-content w-full min-w-0"
      onClick={handleClick}
      onMouseEnter={handleHover}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}