import { marked } from "marked";
import hljs from "highlight.js";
import { resolveDocLink } from "@/lib/github-docs";

interface RenderMeta {
  description?: string;
  descriptions?: Map<string, string>;
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function codeRenderer({ text, lang }: { text: string; lang?: string }) {
  const language = lang && hljs.getLanguage(lang) ? lang : "";
  const highlighted = language
    ? hljs.highlight(text, { language }).value
    : hljs.highlightAuto(text).value;
  return `<pre><code class="hljs language-${language || "plaintext"}">${highlighted}</code></pre>`;
}

export function renderMarkdown(
  markdown: string,
  currentPath: string,
  meta: RenderMeta = {}
): string {
  const renderer = new marked.Renderer();

  renderer.link = ({ href, title, tokens }) => {
    const text = tokens.map((t) => t.raw).join("");
    const target = resolveDocLink(href, currentPath);
    const external = /^https?:\/\//.test(target);
    let linkTitle = title;
    if (!linkTitle && target.startsWith("/docs/")) {
      const page = target.replace(/^\/docs\//, "").split("#")[0];
      linkTitle = meta.descriptions?.get(page) ?? "";
    }
    const attrs = [
      external ? 'target="_blank" rel="noopener noreferrer"' : "",
      linkTitle ? `title="${escapeAttr(linkTitle)}"` : "",
    ]
      .filter(Boolean)
      .join(" ");
    return `<a href="${escapeAttr(target)}"${attrs ? ` ${attrs}` : ""}>${text}</a>`;
  };

  renderer.image = ({ href, title, text }) => {
    const alt = text || meta.description || "";
    const attrs = [
      `src="${escapeAttr(href)}"`,
      `alt="${escapeAttr(alt)}"`,
      title ? `title="${escapeAttr(title)}"` : "",
      'loading="lazy"',
    ]
      .filter(Boolean)
      .join(" ");
    return `<img ${attrs} />`;
  };

  renderer.code = codeRenderer;

  return marked.parse(markdown, {
    gfm: true,
    renderer,
  }) as string;
}