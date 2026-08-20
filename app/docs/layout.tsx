import Link from "next/link";
import { fetchDocsNav } from "@/lib/github-docs";
import { DocsSidebar } from "./DocsSidebar";
import { DocsMobileNav } from "./DocsMobileNav";
import { DocsSearch } from "./DocsSearch";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docs = await fetchDocsNav();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <DocsSearch />

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 mt-8">
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                <Link
                  href="/docs"
                  className="block text-sm font-semibold mb-4 hover:text-accent transition-colors"
                >
                  ← Docs Home
                </Link>
                <DocsSidebar docs={docs} />
              </div>
            </aside>

            <main className="min-w-0 max-w-3xl">
              <div className="lg:hidden flex items-center justify-between mb-6">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                >
                  ← All docs
                </Link>
                <DocsMobileNav docs={docs} />
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