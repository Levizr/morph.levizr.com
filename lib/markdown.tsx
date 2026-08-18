import { marked } from "marked";
import hljs from "highlight.js";
import { resolveDocLink } from "@/lib/github-docs";

function codeRenderer({ text, lang }: { text: string; lang?: string }) {
  const language = lang && hljs.getLanguage(lang) ? lang : "";
  const highlighted = language
    ? hljs.highlight(text, { language }).value
    : hljs.highlightAuto(text).value;
  return `<pre><code class="hljs language-${language || "plaintext"}">${highlighted}</code></pre>`;
}

export function renderMarkdown(markdown: string, currentPath: string): string {
  const renderer = new marked.Renderer();

  renderer.link = ({ href, title, tokens }) => {
    const text = tokens.map((t) => t.raw).join("");
    const target = resolveDocLink(href, currentPath);
    const external = /^https?:\/\//.test(target);
    const attrs = [
      external ? 'target="_blank" rel="noopener noreferrer"' : "",
      title ? `title="${title}"` : "",
    ]
      .filter(Boolean)
      .join(" ");
    return `<a href="${target}"${attrs ? ` ${attrs}` : ""}>${text}</a>`;
  };

  renderer.code = codeRenderer;

  return marked.parse(markdown, {
    gfm: true,
    renderer,
  }) as string;
}