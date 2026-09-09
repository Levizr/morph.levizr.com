const OWNER = "Levizr";
const REPO = "morph";
const BRANCH = "main";
const DOCS_DIR = "docs";
const DEV_DOCS_DIR = "docs/dev";
export const DEV_BASE = "/dev/docs";

export const DOCS_TAG = "morph-docs";
export const DOCS_TREE_TAG = "morph-docs-tree";
export const NAV_TAG = "navigation-menu";
export const DEV_DOCS_TAG = "morph-dev-docs";
export const DEV_NAV_TAG = "dev-navigation-menu";

export interface DocEntry {
  path: string;
  title: string;
  section: string;
  file?: string;
  status?: string;
  author?: string;
  description?: string;
  keywords?: string[];
  lastUpdated?: string;
  publishedAt?: string;
  priority?: number;
  changefreq?: string;
}

interface SidebarItem {
  title?: string;
  slug?: string;
  file?: string;
  status?: string;
  author?: string;
  description?: string;
  keywords?: string[];
  lastUpdated?: string;
  publishedAt?: string;
  priority?: number;
  changefreq?: string;
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

function parseRegistryEntries(data: unknown): DocEntry[] {
  const sections = Array.isArray(data)
    ? (data as SidebarSection[])
    : (data as { sections?: SidebarSection[] }).sections;
  if (!Array.isArray(sections)) return [];
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
        status: item.status,
        author: item.author,
        description: item.description,
        keywords: item.keywords,
        lastUpdated: item.lastUpdated,
        publishedAt: item.publishedAt,
        priority: item.priority,
        changefreq: item.changefreq,
      });
    }
  }
  return entries;
}

async function fetchRegistryNav(
  registryFile: string,
  tags: string[]
): Promise<DocEntry[]> {
  const res = await fetch(
    `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${DOCS_DIR}/${registryFile}`,
    {
      headers: headers(),
      cache: "force-cache",
      next: { revalidate: false, tags },
    }
  );

  if (res.ok) {
    try {
      const data: unknown = await res.json();
      return parseRegistryEntries(data);
    } catch {
      return [];
    }
  }
  return [];
}

export async function fetchDocsNav(): Promise<DocEntry[]> {
  const entries = await fetchRegistryNav("docs.registry.json", [
    NAV_TAG,
    DOCS_TREE_TAG,
  ]);
  if (entries.length > 0) return entries;
  return fetchDocsTree();
}

export async function fetchDevDocsNav(): Promise<DocEntry[]> {
  const entries = await fetchRegistryNav("dev.registry.json", [DEV_NAV_TAG]);
  if (entries.length > 0) return entries;
  return fetchDevDocsTree();
}

export async function fetchDocsTree(): Promise<DocEntry[]> {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`,
    {
      headers: headers(),
      cache: "force-cache",
      next: { revalidate: false, tags: [DOCS_TREE_TAG] },
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

async function fetchMarkdownFile(
  repoPath: string,
  tags: string[]
): Promise<string | null> {
  const res = await fetch(
    `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${repoPath}`,
    {
      headers: headers(),
      cache: "force-cache",
      next: { revalidate: false, tags },
    }
  );
  if (!res.ok) return null;
  return res.text();
}

export async function fetchDocMarkdown(slug: string[]): Promise<string | null> {
  const repoPath = `${DOCS_DIR}/${slug.join("/")}.md`;
  return fetchMarkdownFile(repoPath, [DOCS_TAG, `doc-${slug.join("/")}`]);
}

export async function fetchDevDocMarkdown(
  slug: string[]
): Promise<string | null> {
  const repoPath = `${DEV_DOCS_DIR}/${slug.join("/")}.md`;
  return fetchMarkdownFile(repoPath, [DEV_DOCS_TAG, `dev-doc-${slug.join("/")}`]);
}

export async function fetchDevDocsTree(): Promise<DocEntry[]> {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`,
    {
      headers: headers(),
      cache: "force-cache",
      next: { revalidate: false, tags: [DEV_NAV_TAG] },
    }
  );
  if (!res.ok) return [];

  const data = (await res.json()) as { tree?: { path?: string; type?: string }[] };
  const entries = (data.tree ?? [])
    .filter(
      (item) =>
        item.type === "blob" &&
        item.path?.startsWith(`${DEV_DOCS_DIR}/`) &&
        item.path.endsWith(".md")
    )
    .map((item) => {
      const path = item.path!;
      const name = path.slice(DEV_DOCS_DIR.length + 1).replace(/\.md$/, "");
      const title = name
        .split("/")
        .pop()!
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return { path: name, file: `dev/${name}`, title, section: "Dev" };
    })
    .sort((a, b) => a.path.localeCompare(b.path));

  return entries;
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

/**
 * Resolves a relative link against the current docs page (currentPath is
 * relative to the docs/ directory). `escaped` is true when the link points
 * above the docs root (e.g. ../../CONTRIBUTING.md) — i.e. a repo file,
 * not a docs page.
 */
function resolveWithinDocs(
  currentPath: string,
  target: string
): { resolved: string; escaped: boolean } {
  const dir = currentPath.split("/").slice(0, -1).join("/");
  const parts = (dir ? `${dir}/${target}` : target).split("/");
  const out: string[] = [];
  let escaped = false;
  for (const part of parts) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      if (out.length > 0) out.pop();
      else escaped = true;
    } else out.push(part);
  }
  return { resolved: out.join("/"), escaped };
}

export function resolveDocLink(href: string, currentPath: string): string {
  if (/^(https?:)?\/\//.test(href) || href.startsWith("#") || href.startsWith("/")) {
    return href;
  }

  const [target, hash] = href.split("#");

  if (target.endsWith(".md")) {
    const { resolved, escaped } = resolveWithinDocs(currentPath, target);
    if (escaped) {
      return `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${resolved}${
        hash ? `#${hash}` : ""
      }`;
    }
    let page = resolved.replace(/\.md$/, "");
    if (page.startsWith(DOCS_DIR)) page = page.slice(DOCS_DIR.length + 1);
    // Pages under docs/dev/ belong to the dev track (/dev/docs/…);
    // everything else belongs to the user track (/docs/…).
    if (page === "dev" || page.startsWith("dev/")) {
      return `${DEV_BASE}/${page === "dev" ? "" : page.slice(4)}${
        hash ? `#${hash}` : ""
      }`;
    }
    return `/docs/${page}${hash ? `#${hash}` : ""}`;
  }

  const { resolved } = resolveWithinDocs(currentPath, target);
  if (resolved.startsWith(DOCS_DIR) || resolved.startsWith("assets/")) {
    return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${resolved}`;
  }

  return href;
}