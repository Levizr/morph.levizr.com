const OWNER = "Levizr";
const REPO = "morph";
const BRANCH = "main";
const DOCS_DIR = "docs";

export const DOCS_TAG = "morph-docs";
export const DOCS_TREE_TAG = "morph-docs-tree";
export const NAV_TAG = "navigation-menu";

export interface DocEntry {
  path: string;
  title: string;
  section: string;
  file?: string;
}

interface SidebarItem {
  title?: string;
  slug?: string;
  file?: string;
}

interface SidebarSection {
  category?: string;
  items?: SidebarItem[];
}

const headers = (): HeadersInit => {
  const token = process.env.GITHUB_TOKEN;
  const h = new Headers();
  if (token) h.set("Authorization", `Bearer ${token}`);
  return h;
};

function normalizeTitle(title: string, slug: string): string {
  if (title.trim()) return title.trim();
  return slug
    .split("/")
    .pop()!
    .replace(/\.md$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function fetchDocsNav(): Promise<DocEntry[]> {
  const res = await fetch(
    `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${DOCS_DIR}/sidebar.json`,
    {
      headers: headers(),
      cache: "force-cache",
      next: { revalidate: 60, tags: [NAV_TAG, DOCS_TREE_TAG] },
    }
  );

  if (res.ok) {
    let data: SidebarSection[] | { sections?: SidebarSection[] };
    try {
      data = await res.json();
    } catch {
      return fetchDocsTree();
    }
    const sections = Array.isArray(data) ? data : data.sections;
    if (Array.isArray(sections)) {
      const entries: DocEntry[] = [];
      for (const section of sections) {
        if (!section || !Array.isArray(section.items)) continue;
        const category = section.category ?? "General";
        for (const item of section.items) {
          if (!item || typeof item.slug !== "string") continue;
          const slug = item.slug.replace(/\.md$/, "");
          if (!slug) continue;
          const file = item.file ? item.file.replace(/\.md$/, "") : slug;
          entries.push({
            path: slug,
            file,
            title: normalizeTitle(item.title ?? "", slug),
            section: category,
          });
        }
      }
      if (entries.length > 0) return entries;
    }
  }

  return fetchDocsTree();
}

export async function fetchDocsTree(): Promise<DocEntry[]> {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`,
    {
      headers: headers(),
      cache: "force-cache",
      next: { revalidate: 60, tags: [DOCS_TREE_TAG] },
    }
  );
  if (!res.ok) return [];

  const data = (await res.json()) as { tree?: { path?: string; type?: string }[] };
  const entries = (data.tree ?? [])
    .filter(
      (item) =>
        item.type === "blob" &&
        item.path?.startsWith(`${DOCS_DIR}/`) &&
        item.path.endsWith(".md")
    )
    .map((item) => {
      const path = item.path!;
      const name = path.slice(DOCS_DIR.length + 1);
      const section = name.includes("/") ? name.split("/")[0] : "General";
      const title = name
        .split("/")
        .pop()!
        .replace(/\.md$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return { path: name.replace(/\.md$/, ""), title, section };
    })
    .sort((a, b) => a.path.localeCompare(b.path));

  return entries;
}

export async function fetchDocMarkdown(slug: string[]): Promise<string | null> {
  const repoPath = `${DOCS_DIR}/${slug.join("/")}.md`;
  const res = await fetch(
    `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${repoPath}`,
    {
      headers: headers(),
      cache: "force-cache",
      next: { revalidate: 60, tags: [DOCS_TAG, `doc-${slug.join("/")}`] },
    }
  );
  if (!res.ok) return null;
  return res.text();
}

export function normalizePath(path: string): string {
  const parts: string[] = [];
  for (const part of path.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return parts.join("/");
}

export function resolveDocLink(href: string, currentPath: string): string {
  if (/^(https?:)?\/\//.test(href) || href.startsWith("#") || href.startsWith("/")) {
    return href;
  }

  const [target, hash] = href.split("#");

  const dir = currentPath.split("/").slice(0, -1).join("/");
  const resolved = normalizePath(dir ? `${dir}/${target}` : target);

  if (target.endsWith(".md")) {
    const withoutExt = resolved.replace(/\.md$/, "");
    if (withoutExt.startsWith(DOCS_DIR)) {
      return `/docs/${withoutExt.slice(DOCS_DIR.length + 1)}${hash ? `#${hash}` : ""}`;
    }
    return `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${resolved}${
      hash ? `#${hash}` : ""
    }`;
  }

  if (resolved.startsWith(DOCS_DIR) || resolved.startsWith("assets/")) {
    return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${resolved}`;
  }

  return href;
}