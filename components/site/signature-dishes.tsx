"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dishes } from "@/content/dishes";
import { useLanguage } from "@/lib/i18n/language-provider";
import { BentoCard } from "./bento-card";
import { BentoGrid } from "./bento-grid";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/**
 * The bento showcase. Tiles are generated from `content/dishes.ts`, including
 * their spans — adding, removing or resizing a tile is a data edit.
 */
export function SignatureDishes() {
  const { t } = useLanguage();

  return (
    <section
      id="dishes"
      className="on-green relative isolate scroll-mt-28 bg-green-900 pb-20 pt-4 sm:pb-28 lg:pb-36"
    >
      {/* A very quiet lattice so the dark ground is never flat. */}
      <div
        aria-hidden
        className="e-lattice pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
      />

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow={t.dishes.eyebrow}
          lines={t.dishes.headline}
          lede={t.dishes.lede}
        />

        <BentoGrid className="mt-12 sm:mt-16 lg:mt-20">
          {dishes.map((dish) => (
            <BentoCard key={dish.id} dish={dish} />
          ))}
        </BentoGrid>

        <Reveal className="mt-10 flex justify-center sm:mt-14">
          <Button asChild variant="outline" size="lg">
            <a href="#reservation">
              {t.dishes.cta}
              <ArrowUpRight className="rtl:-scale-x-100" />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
