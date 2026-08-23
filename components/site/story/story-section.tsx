"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";
import { Reveal } from "../reveal";
import { StoryMilestones } from "./story-milestones";
import { STORY_PANEL_HEIGHT, STORY_SCENES } from "./story-timeline";

import storyPoster from "@/public/videos/story-poster.jpg";

/**
 * The story.
 *
 * A still composition — there is no `<video>` here, no scroll track and no
 * sticky pin, so nothing in this section pins and nothing is fetched beyond the
 * one photograph. The menu is now the only section on the page that pins, on
 * the machinery in `components/site/cinematic/`.
 *
 *   section
 *   ├── frame + stanza   the house photograph, the four scene lines beside it
 *   └── timeline         the four heritage beats
 *
 * Below `lg` the frame keeps the source's native 9:16 and the stanza sits under
 * it; at `lg` the frame takes half the row at the inline-start edge, is cropped
 * to the panel height rather than stretched, and the copy runs down the column
 * beside it.
 */
export function StorySection() {
  const { t, lang } = useLanguage();

  return (
    <section
      id="story"
      className="on-green relative isolate scroll-mt-28 bg-green-900"
    >
      <div
        aria-hidden
        className="e-lattice pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
      />

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
                // source's 9:16 and crops the height, and the middle of the
                // picture is table linen.
                className="object-cover object-[50%_45%]"
              />
            </div>
          </Reveal>

          <Reveal key={lang} className="w-full max-w-2xl">
            <ul className="divide-y divide-gold-600/12">
              {STORY_SCENES.map((key) => {
                const copy = t.story.scenes[key];
                return (
                  <li key={key} className="py-5 sm:py-6">
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
    </section>
  );
}
