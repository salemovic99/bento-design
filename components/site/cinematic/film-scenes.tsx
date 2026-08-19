"use client";

import { ArrowDown } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useLanguage } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";
import type { Beat, SceneCopy } from "./film-timeline";

/**
 * The lines a film is cut around, each fading up and away on its own stretch of
 * the scroll.
 *
 * Every scene owns its own hooks rather than being mapped over inline — a
 * `useTransform` inside `beats.map()` would be a hook in a loop. The shared
 * scroll value is passed in, so this stays a pure read: no state, no renders.
 *
 * Only opacity, y, scale and blur move. Nothing travels on the horizontal axis,
 * per the rule in `lib/motion.ts` — the composition is centred, so it needs no
 * mirroring in Arabic at all.
 *
 * The whole stage is `aria-hidden` (set by the parent). These lines are
 * decorative repetition over a film; the section's real heading is the `<h2>` in
 * the content it releases into, and a handful of floating headings in the a11y
 * tree would be read out of sequence and out of context.
 */
function FilmScene({
  beat,
  copy,
  progress,
  blur,
  sceneClassName,
  titleClassName,
}: {
  beat: Beat;
  copy: SceneCopy;
  progress: MotionValue<number>;
  blur: boolean;
  sceneClassName?: string;
  titleClassName?: string;
}) {
  const range = [beat.start, beat.peak, beat.hold, beat.end];

  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [28, 0, 0, -28]);
  const scale = useTransform(progress, range, [1.05, 1, 1, 0.985]);
  const blurPx = useTransform(progress, range, [12, 0, 0, 7]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.div
      style={blur ? { opacity, y, scale, filter } : { opacity, y, scale }}
      className={cn(
        "absolute inset-0 flex flex-col justify-center px-6",
        "items-center text-center",
        sceneClassName,
      )}
    >
      <h3
        className={cn(
          "max-w-[16ch] text-[clamp(2.25rem,6.4vw,4.75rem)] font-normal leading-[1.02] tracking-[var(--track-tight)] text-white",
          titleClassName,
        )}
      >
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

export function FilmScenes({
  progress,
  beats,
  copy,
  cue,
  cueOut,
  blur,
  sceneClassName,
  titleClassName,
  cueClassName,
}: {
  progress: MotionValue<number>;
  beats: readonly Beat[];
  /** Keyed by `Beat.key`, so a beat can never exist without its copy. */
  copy: Record<string, SceneCopy>;
  cue: string;
  /** Progress at which the cue is gone — it has said what it needed to. */
  cueOut: number;
  /** Blur is the one expensive property here — desktop only. */
  blur: boolean;
  /**
   * The three hooks a section needs to set its lines somewhere other than the
   * middle of the frame. Default to the centred overlay the menu uses; the
   * story overrides them at `lg`, where the film sits in a panel and the copy
   * runs down the column beside it. Alignment is set with logical utilities
   * (`text-start`, `items-start`) so it mirrors in Arabic on its own.
   */
  sceneClassName?: string;
  titleClassName?: string;
  cueClassName?: string;
}) {
  const { lang } = useLanguage();

  const cueOpacity = useTransform(progress, [0, cueOut], [1, 0]);

  return (
    // Keyed on language so a switch mid-section reads as a cut rather than a
    // text swap — the same treatment `SectionHeading` gives every other heading.
    // The values are derived from scroll, so the remount costs nothing.
    <div key={lang} className="pointer-events-none absolute inset-0">
      {beats.map((beat) => (
        <FilmScene
          key={beat.key}
          beat={beat}
          copy={copy[beat.key]}
          progress={progress}
          blur={blur}
          sceneClassName={sceneClassName}
          titleClassName={titleClassName}
        />
      ))}

      <motion.div
        style={{ opacity: cueOpacity }}
        className={cn(
          "absolute inset-x-0 bottom-7 flex px-6 sm:bottom-10",
          "justify-center",
          cueClassName,
        )}
      >
        <span className="flex items-center gap-2.5 text-center text-[0.625rem] font-medium uppercase tracking-[0.24em] text-gold-200/60">
          {cue}
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
