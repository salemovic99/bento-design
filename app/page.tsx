import { Branches } from "@/components/site/branches";
import { FloatingActions } from "@/components/site/floating-actions";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { MenuSection } from "@/components/site/menu/menu-section";
import { Reservation } from "@/components/site/reservation";
import { SectionTransition } from "@/components/site/section-transition";
import { SignatureDishes } from "@/components/site/signature-dishes";
import { SkipLink } from "@/components/site/skip-link";
import { StorySection } from "@/components/site/story/story-section";

/**
 * One page, one continuous take:
 *
 *   header → hero → [bridge] → story → [bridge] → bento dishes
 *          → [bridge] → cinematic menu → [bridge] → bento branches
 *          → [bridge] → reservation → footer
 *
 * The bridges are what stop this reading as seven stacked blocks — each one is
 * a scroll-linked wipe from the outgoing ground to the incoming one. The tonal
 * arc runs dark → dark → dark → dark → cream → dark → dark, so the light
 * branches section still lands as a deliberate breath in the middle.
 *
 * Two sections pin: the story and the menu. Each holds the viewport for a few
 * screens while a film is scrubbed by the scroll, then releases into the thing
 * the film was introducing — the heritage timeline, and the card. That
 * behaviour is sealed inside `<StorySection>` and `<MenuSection>`, both built
 * on `components/site/cinematic/`; everything around them scrolls normally.
 *
 * The story sits ahead of the food on purpose: the page claims a 1930 formula,
 * and the timeline is what earns that claim before the dishes trade on it. Its
 * film ends on the house's own etched mark, which is what the timeline then
 * explains.
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
        <StorySection />
        <SectionTransition from="green-900" to="green-900" />
        <SignatureDishes />
        <SectionTransition from="green-900" to="green-900" />
        <MenuSection />
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
