"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/language-provider";
import { Reveal } from "../reveal";
import { StoryMilestones } from "./story-milestones";
import { STORY_SCENES } from "./story-timeline";

import storyPoster from "@/public/videos/story-poster.jpg";

/**
 * The section as it renders for a guest who has asked for reduced motion.
 *
 * This is a different composition, not the cinematic one with its animation
 * switched off. There is no scroll track, no sticky pin and — the part that
 * matters most — no `<video>` element at all, so the film is never even
 * requested. The four scene lines, which the film delivers one at a time, are
 * set here as what they always were underneath: a short stanza above the
 * timeline.
 *
 * The poster keeps its native 9:16 on a phone and is cropped to a letterbox
 * from `sm` up, which is the same crop the film gets when it plays.
 */
export function StoryStill() {
  const { t, lang } = useLanguage();

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-4 pt-16 sm:px-6 sm:pt-20 lg:px-10 lg:pt-24">
        <Reveal className="relative overflow-hidden rounded-[var(--radius-brand)]">
          <div className="relative aspect-[4/5] sm:aspect-[16/9]">
            <Image
              src={storyPoster}
              alt=""
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 90vw, 100vw"
              className="object-cover object-[50%_55%]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-green-900/85 via-green-900/25 to-green-900/45"
            />
          </div>
        </Reveal>

        <Reveal key={lang} className="mx-auto mt-12 max-w-2xl sm:mt-16">
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

      <div className="mt-16 sm:mt-24 lg:mt-28">
        <StoryMilestones />
      </div>
    </>
  );
}
