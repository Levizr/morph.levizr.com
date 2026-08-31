import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { Features } from "./components/Features";
import { Architecture } from "./components/Architecture";
import { CodeExample } from "./components/CodeExample";
import { CLI } from "./components/CLI";
import { ContributeSection } from "./components/ContributeSection";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Architecture />
        <CodeExample />
        <CLI />
        <ContributeSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
