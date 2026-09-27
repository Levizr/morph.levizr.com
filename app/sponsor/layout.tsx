import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsor Morph — keep it free, fast, and tiny",
  description:
    "Morph is free, open-source, and built by a small independent team with no company funding behind it. Donate via Razorpay (UPI, cards, netbanking) or help with code, docs, bug reports, and examples.",
  keywords: [
    "sponsor morph",
    "donate",
    "support open source",
    "razorpay",
    "levizr",
  ],
  openGraph: {
    title: "Sponsor Morph — keep it free, fast, and tiny",
    description:
      "No company funding behind Morph. Your support pays for server costs, test devices, and full-time work on the compiler, renderer, and docs.",
    type: "website",
  },
  alternates: {
    canonical: "/sponsor",
  },
};

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
