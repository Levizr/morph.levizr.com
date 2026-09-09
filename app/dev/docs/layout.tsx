import Link from "next/link";
import { fetchDevDocsNav } from "@/lib/github-docs";
import { DocsSidebar } from "@/app/docs/DocsSidebar";
import { DocsMobileNav } from "@/app/docs/DocsMobileNav";
import { DocsSearch } from "@/app/docs/DocsSearch";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";

export default async function DevDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docs = await fetchDevDocsNav();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <DocsSearch base="/dev/docs" api="/api/dev/docs/search" />

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 mt-8">
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                <Link
                  href="/dev/docs"
                  className="block text-sm font-semibold mb-4 hover:text-accent transition-colors"
                >
                  ← Dev Docs Home
                </Link>
                <DocsSidebar docs={docs} base="/dev/docs" />
                <Link
                  href="/docs"
                  className="block text-sm text-muted mt-6 hover:text-accent transition-colors"
                >
                  → User docs
                </Link>
              </div>
            </aside>

            <main className="min-w-0 max-w-3xl">
              <div className="lg:hidden flex items-center justify-between mb-6">
                <Link
                  href="/dev/docs"
                  className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                >
                  ← All dev docs
                </Link>
                <DocsMobileNav docs={docs} base="/dev/docs" />
              </div>
              {children}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
