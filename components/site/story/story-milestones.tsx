"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { milestones } from "@/content/story";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useBrandMotion, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Reveal } from "../reveal";
import { SectionHeading } from "../section-heading";
import { STORY_INTRO } from "./story-timeline";

import symbolGold from "@/public/brand/symbol-gold.png";

/**
 * The heritage timeline — the thing the film was introducing.
 *
 * Geneva 1930 → the sauce → the crossing → four rooms. A single gold rail runs
 * the length of the beats and draws itself as the guest scrolls, with the house
 * monogram — the same mark the section bridges use — standing at each one.
 * Beats alternate across the rail from `lg` up, which lands the two beats that
 * carry a photograph on one side and the two that are words alone on the other:
 * the places have rooms to show, the ideas do not.
 *
 * The rail is `scaleY`, never an animated height (`lib/motion.ts`), and the
 * alternation is grid column placement rather than floats — grid columns follow
 * the writing direction, so the whole composition mirrors itself in Arabic with
 * no `rtl:` variants at all.
 *
 * It takes an optional `progress`, and that optionality is the interesting
 * part. Inside the cinematic stage this block is pulled up a full viewport and
 * sits *behind* the still-opaque film long before it is visible, so a normal
 * `whileInView` reveal would play out entirely unseen and the guest would find
 * the heading already there. With `progress` it is driven off the section's
 * scroll instead, rising exactly as the film dissolves. Without it — the
 * reduced-motion path — it falls back to `SectionHeading` like every other
 * section on the page.
 *
 * The rail's own `useScroll` is unaffected either way: it measures the `<ol>`,
 * which is in normal flow inside the lifted block.
 */
export function StoryMilestones({
  progress,
  className,
}: {
  progress?: MotionValue<number>;
  className?: string;
}) {
  const { t, pick, lang } = useLanguage();
  const m = useBrandMotion();
  const list = useRef<HTMLOListElement>(null);

  // The rail head tracks a line three-quarters down the viewport: it starts
  // drawing as the first beat crosses it and finishes on the last.
  const { scrollYProgress } = useScroll({
    target: list,
    offset: ["start 75%", "end 75%"],
  });

  // A constant stand-in so the hooks below run unconditionally in both paths.
  const settled = useMotionValue(1);
  const source = progress ?? settled;
  const introOpacity = useTransform(
    source,
    [STORY_INTRO.start, STORY_INTRO.end],
    [0, 1],
  );
  const introY = useTransform(
    source,
    [STORY_INTRO.start, STORY_INTRO.end],
    [40, 0],
  );

  return (
    <div
      className={cn(
        "mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 sm:pb-28 lg:px-10 lg:pb-36",
        className,
      )}
    >
      {/* ── Heading ────────────────────────────────────────────────────── */}
      {progress ? (
        <motion.div
          key={lang}
          style={m.reduced ? undefined : { opacity: introOpacity, y: introY }}
          className="max-w-2xl"
        >
          <p className="e-eyebrow">{t.story.eyebrow}</p>
          <h2 className="mt-4 sm:mt-5">
            {t.story.headline.map((line, index) => (
              <span
                key={index}
                className="block text-[clamp(1.875rem,4.4vw,3.25rem)] font-bold leading-[1.05] tracking-[var(--track-tight)] text-white"
              >
                {line}
              </span>
            ))}
          </h2>
          <p className="e-body-lg mt-5 text-pretty text-gold-200/80 sm:mt-6">
            {t.story.lede}
          </p>
        </motion.div>
      ) : (
        <SectionHeading
          eyebrow={t.story.eyebrow}
          lines={t.story.headline}
          lede={t.story.lede}
        />
      )}

      {/* ── The beats ──────────────────────────────────────────────────── */}
      <div className="relative mx-auto mt-12 max-w-5xl sm:mt-16 lg:mt-20">
        {/* ── The rail ─────────────────────────────────────────────────── */}
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
  );
}
