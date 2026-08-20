"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";
import { Reveal } from "../reveal";
import { StoryMilestones } from "./story-milestones";
import { STORY_PANEL_HEIGHT, STORY_SCENES } from "./story-timeline";

import storyPoster from "@/public/videos/story-poster.jpg";

/**
 * The section as it renders for a guest who has asked for reduced motion.
 *
 * This is a different composition, not the cinematic one with its animation
 * switched off. There is no scroll track, no sticky pin and — the part that
 * matters most — no `<video>` element at all, so the film is never even
 * requested. The four scene lines, which the film delivers one at a time, are
 * set here as what they always were underneath: a short stanza beside the
 * poster, above the timeline.
 *
 * It holds the same shape the cinematic path resolves to at `lg` — the frame
 * taking half the row at the inline-start edge, copy in the column beside it —
 * so the two paths read as the same section rather than two different ones.
 * Below `lg` the poster keeps the source's native 9:16; at `lg` it takes the
 * panel's height and is cropped to it, never stretched.
 */
export function StoryStill() {
  const { t, lang } = useLanguage();

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-4 pt-16 sm:px-6 sm:pt-20 lg:px-10 lg:pt-24">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-12 xl:gap-20">
          <Reveal className="w-full max-w-sm shrink-0 lg:w-1/2 lg:max-w-none">
            <div
              className={cn(
                "relative aspect-[9/16] overflow-hidden rounded-[var(--radius-brand)] border border-gold-600/15 lg:aspect-auto",
                STORY_PANEL_HEIGHT,
              )}
            >
              <Image
                src={storyPoster}
                alt=""
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 50vw, 24rem"
                // 45% rather than centre: at `lg` the frame is wider than the
                // source's 9:16 and crops the height, and the middle of this
                // first frame is table linen. See `STORY_PAN`, which is the
                // same decision made across the whole film.
                className="object-cover object-[50%_45%]"
              />
            </div>
          </Reveal>

          <Reveal key={lang} className="w-full max-w-2xl">
            <ul className="divide-y divide-gold-600/12">
              {STORY_SCENES.map((scene) => {
                const copy = t.story.scenes[scene.key];
                return (
                  <li key={scene.key} className="py-5 sm:py-6">
                    <h3 className="text-[clamp(1.125rem,1.8vw,1.5rem)] font-medium leading-[1.2] tracking-[var(--track-tight)] text-white">
                      {copy.title}
                    </h3>
                    <p className="mt-1.5 text-[0.9375rem] font-light text-gold-200/70">
                      {copy.line}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>

      <div className="mt-16 sm:mt-24 lg:mt-28">
        <StoryMilestones />
      </div>
    </>
  );
}
