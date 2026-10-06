import { CursorLight } from "@/components/cursor-light";
import { Navigation } from "@/components/navigation";
import { ScrollProgress } from "@/components/scroll-progress";
import { Hero } from "@/components/hero";
import { Story } from "@/components/story";
import { Symbolism } from "@/components/symbolism";
import { Gallery } from "@/components/gallery";
import { BloomSection } from "@/components/bloom-section";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[80] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <CursorLight />
      <Navigation />
      <main id="main" className="flex flex-1 flex-col">
        <Hero />
        <Story />
        <Symbolism />
        <Gallery />
        <BloomSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
