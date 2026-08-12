"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll } from "framer-motion";
import { Button } from "@/components/ui/button";
import { milestones } from "@/content/story";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useBrandMotion, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

import symbolGold from "@/public/brand/symbol-gold.png";

/**
 * The heritage timeline: Geneva 1930 → the sauce → the crossing → four rooms.
 *
 * A single gold rail runs the length of the beats and draws itself as the guest
 * scrolls, with the house monogram — the same mark the section bridges use —
 * standing at each one. Beats alternate across the rail from `lg` up, which
 * lands the two beats that carry a photograph on one side and the two that are
 * words alone on the other: the places have rooms to show, the ideas do not.
 *
 * The rail is `scaleY`, never an animated height (`lib/motion.ts`), and the
 * alternation is grid column placement rather than floats — grid columns follow
 * the writing direction, so the whole composition mirrors itself in Arabic with
 * no `rtl:` variants at all.
 */
export function Story() {
  const { t, pick } = useLanguage();
  const m = useBrandMotion();
  const list = useRef<HTMLOListElement>(null);

  // The rail head tracks a line three-quarters down the viewport: it starts
  // drawing as the first beat crosses it and finishes on the last.
  const { scrollYProgress } = useScroll({
    target: list,
    offset: ["start 75%", "end 75%"],
  });

  return (
    <section
      id="story"
      className="on-green relative isolate scroll-mt-28 bg-green-900 pb-20 pt-4 sm:pb-28 lg:pb-36"
    >
      <div
        aria-hidden
        className="e-lattice pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
      />

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow={t.story.eyebrow}
          lines={t.story.headline}
          lede={t.story.lede}
        />

        <div className="relative mx-auto mt-12 max-w-5xl sm:mt-16 lg:mt-20">
          {/* ── The rail ───────────────────────────────────────────────── */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 start-4 w-px lg:start-1/2",
              // Fade both ends so the line reads as a passage rather than a
              // bar with two hard stops.
              "[mask-image:linear-gradient(to_bottom,transparent,black_5%,black_92%,transparent)]",
            )}
          >
            <div className="absolute inset-0 bg-gold-600/15" />
            {m.reduced ? null : (
              <motion.div
                style={{ scaleY: scrollYProgress }}
                className="absolute inset-0 origin-top bg-gold-600/70"
              />
            )}
          </div>

          <ol ref={list} className="space-y-14 sm:space-y-20 lg:space-y-24">
            {milestones.map((beat, index) => {
              // Even beats take the inline-start column, odd the inline-end.
              const leading = index % 2 === 0;

              return (
                <motion.li
                  key={beat.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={m.fadeUp}
                  className="relative grid lg:grid-cols-2"
                >
                  {/* The monogram standing on the rail. */}
                  <span
                    aria-hidden
                    className="absolute top-0.5 start-0 grid size-8 place-items-center rounded-full bg-green-900 ring-1 ring-gold-600/35 lg:start-1/2 lg:-ms-4"
                  >
                    <Image
                      src={symbolGold}
                      alt=""
                      sizes="32px"
                      className="h-4 w-auto"
                    />
                  </span>

                  <div
                    className={cn(
                      "ps-12 sm:ps-14 lg:ps-0",
                      leading
                        ? "lg:col-start-1 lg:pe-12 lg:text-end"
                        : "lg:col-start-2 lg:ps-12",
                    )}
                  >
                    <p className="text-[clamp(1.375rem,2.4vw,2rem)] font-light leading-none tracking-[var(--track-tight)] text-gold-600">
                      {pick(beat.anchor)}
                    </p>

                    <h3 className="e-h3 mt-3">{pick(beat.title)}</h3>

                    <p className="e-body mt-3 max-w-[52ch] text-pretty text-gold-200/80">
                      {pick(beat.body)}
                    </p>

                    {beat.image ? (
                      <motion.div
                        variants={m.imageReveal}
                        className="relative mt-6 aspect-[4/3] overflow-hidden rounded-[var(--radius-brand)] border border-gold-600/15"
                      >
                        <Image
                          // The beat's own title names the place, so a
                          // description here would only be read out twice.
                          src={beat.image}
                          alt=""
                          fill
                          placeholder="blur"
                          sizes="(min-width: 1024px) 40vw, (min-width: 640px) 80vw, 85vw"
                          style={{ objectPosition: beat.focus }}
                          className="object-cover"
                        />
                      </motion.div>
                    ) : null}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <Reveal className="mt-14 flex justify-center sm:mt-20">
          <Button asChild variant="outline" size="lg">
            <a href="#dishes">
              {t.story.cta}
              <ArrowUpRight className="rtl:-scale-x-100" />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
