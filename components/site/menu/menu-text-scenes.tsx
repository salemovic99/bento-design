"use client";

import { ArrowDown } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useLanguage } from "@/lib/i18n/language-provider";
import { CUE_OUT, SCENES, type Scene } from "./menu-timeline";

/**
 * The four lines the film is cut around, each fading up and away on its own
 * stretch of the scroll.
 *
 * Every scene owns its own hooks rather than being mapped over inline — a
 * `useTransform` inside `SCENES.map()` would be a hook in a loop. The shared
 * scroll value is passed in, so this stays a pure read: no state, no renders.
 *
 * Only opacity, y, scale and blur move. Nothing travels on the horizontal axis,
 * per the rule in `lib/motion.ts` — the composition is centred, so it needs no
 * mirroring in Arabic at all.
 *
 * The whole stage is `aria-hidden` (set by the parent). These four lines are
 * decorative repetition over a film; the section's real heading is the `<h2>`
 * in `MenuCategories`, and four floating headings in the a11y tree would be
 * read out of sequence and out of context.
 */
function MenuScene({
  scene,
  progress,
  blur,
}: {
  scene: Scene;
  progress: MotionValue<number>;
  blur: boolean;
}) {
  const { t } = useLanguage();
  const range = [scene.start, scene.peak, scene.hold, scene.end];

  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [28, 0, 0, -28]);
  const scale = useTransform(progress, range, [1.05, 1, 1, 0.985]);
  const blurPx = useTransform(progress, range, [12, 0, 0, 7]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  const copy = t.menu.scenes[scene.key];

  return (
    <motion.div
      style={blur ? { opacity, y, scale, filter } : { opacity, y, scale }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      <h3 className="max-w-[16ch] text-[clamp(2.25rem,6.4vw,4.75rem)] font-normal leading-[1.02] tracking-[var(--track-tight)] text-white">
        {copy.title}
      </h3>
      <span
        aria-hidden
        className="my-6 block h-px w-10 bg-gold-600 sm:my-8 sm:w-12"
      />
      <p className="max-w-[28ch] text-[clamp(0.9375rem,1.5vw,1.25rem)] font-light tracking-[0.02em] text-gold-200/85">
        {copy.line}
      </p>
    </motion.div>
  );
}

export function MenuTextScenes({
  progress,
  blur,
}: {
  progress: MotionValue<number>;
  /** Blur is the one expensive property here — desktop only. */
  blur: boolean;
}) {
  const { lang, t } = useLanguage();

  // The cue goes as soon as the guest moves; it has said what it needed to.
  const cueOpacity = useTransform(progress, [0, CUE_OUT], [1, 0]);

  return (
    // Keyed on language so a switch mid-section reads as a cut rather than a
    // text swap — the same treatment `SectionHeading` gives every other heading.
    // The values are derived from scroll, so the remount costs nothing.
    <div key={lang} className="pointer-events-none absolute inset-0">
      {SCENES.map((scene) => (
        <MenuScene
          key={scene.key}
          scene={scene}
          progress={progress}
          blur={blur}
        />
      ))}

      <motion.div
        style={{ opacity: cueOpacity }}
        className="absolute inset-x-0 bottom-7 flex justify-center sm:bottom-10"
      >
        <span className="flex items-center gap-2.5 text-[0.625rem] font-medium uppercase tracking-[0.24em] text-gold-200/60">
          {t.menu.cue}
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
            className="inline-flex"
          >
            <ArrowDown className="size-3.5" />
          </motion.span>
        </span>
      </motion.div>
    </div>
  );
}
