import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download Morph — cargo, curl, or GitHub releases",
  description:
    "Install Morph with cargo install morphc, the one-line curl installer, or a prebuilt binary from GitHub releases. Then run morph doctor to verify your system.",
  openGraph: {
    title: "Download Morph — cargo, curl, or GitHub releases",
    description:
      "Every way to install Morph: Cargo, one-line installer, or prebuilt binaries for Linux, macOS, and Windows.",
    type: "website",
  },
  alternates: {
    canonical: "/download",
  },
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
