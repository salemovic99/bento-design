import { Branches } from "@/components/site/branches";
import { FloatingActions } from "@/components/site/floating-actions";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Reservation } from "@/components/site/reservation";
import { SectionTransition } from "@/components/site/section-transition";
import { SignatureDishes } from "@/components/site/signature-dishes";
import { SkipLink } from "@/components/site/skip-link";

/**
 * One page, one continuous take:
 *
 *   header → hero → [bridge] → bento dishes → [bridge] → bento branches
 *          → [bridge] → reservation → footer
 *
 * The bridges are what stop this reading as five stacked blocks — each one is a
 * scroll-linked wipe from the outgoing ground to the incoming one. The tonal
 * arc runs dark → dark → cream → dark → dark, so the light branches section
 * lands as a deliberate breath in the middle.
 */
export default function Home() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" className="flex-1">
        <div id="top" />
        <Hero />
        <SectionTransition from="green-900" to="green-900" />
        <SignatureDishes />
        <SectionTransition from="green-900" to="cream" />
        <Branches />
        <SectionTransition from="cream" to="green-900" />
        <Reservation />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
