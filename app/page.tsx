import { Branches } from "@/components/site/branches";
import { FloatingActions } from "@/components/site/floating-actions";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Reservation } from "@/components/site/reservation";
import { SectionTransition } from "@/components/site/section-transition";
import { SignatureDishes } from "@/components/site/signature-dishes";
import { SkipLink } from "@/components/site/skip-link";
import { Story } from "@/components/site/story";

/**
 * One page, one continuous take:
 *
 *   header → hero → [bridge] → story → [bridge] → bento dishes
 *          → [bridge] → bento branches → [bridge] → reservation → footer
 *
 * The bridges are what stop this reading as six stacked blocks — each one is a
 * scroll-linked wipe from the outgoing ground to the incoming one. The tonal
 * arc runs dark → dark → dark → cream → dark → dark, so the light branches
 * section lands as a deliberate breath in the middle.
 *
 * The story sits ahead of the food on purpose: the page claims a 1930 formula,
 * and the timeline is what earns that claim before the dishes trade on it.
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
        <Story />
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
