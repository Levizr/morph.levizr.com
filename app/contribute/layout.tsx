import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contribute to Morph — Build a native UI compiler",
  description:
    "Morph is a Rust-based compiler and native UI framework. Clone the repo, run cargo build, and help build the compiler, renderer, docs, and more. A found bug is half-fixed.",
  openGraph: {
    title: "Contribute to Morph — Build a native UI compiler",
    description:
      "Help write the Rust compiler that turns JSX + CSS into native binaries. No Python, no Electron — just cargo build and open issues.",
    type: "website",
  },
  alternates: {
    canonical: "/contribute",
  },
};

export default function ContributeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
