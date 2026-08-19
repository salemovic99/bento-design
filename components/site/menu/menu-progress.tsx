"use client";

import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useLanguage } from "@/lib/i18n/language-provider";
import { RELEASE, SCENES } from "./menu-timeline";
import { cn } from "@/lib/utils";

/**
 * Four dots down the side, one per scene — where the guest is in the film.
 *
 * This is the only thing in the sticky stage that holds React state, and it
 * changes three times across the whole section. The functional updater returns
 * the previous value when the index has not moved, which makes React bail out
 * of the render entirely, so a scroll event that lands inside the current scene
 * costs one integer comparison and nothing else. The rail's own fade stays a
 * MotionValue and never involves React at all.
 *
 * `end-*` is logical, so the rail crosses to the left edge in Arabic without an
 * `rtl:` variant. The label is set horizontally on purpose: `vertical-rl` would
 * turn the Arabic word on its side, which that script does not do.
 */
export function MenuProgress({ progress }: { progress: MotionValue<number> }) {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);

  useMotionValueEvent(progress, "change", (value) => {
    let next = 0;
    for (let i = 0; i < SCENES.length; i += 1) {
      if (value >= SCENES[i].start) next = i;
    }
    setActive((previous) => (previous === next ? previous : next));
  });

  const opacity = useTransform(
    progress,
    [0, 0.05, RELEASE.lift, RELEASE.dissolve],
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-y-0 end-4 flex flex-col items-center justify-center gap-4 sm:end-8"
    >
      <span className="mb-1 text-[0.5625rem] font-medium uppercase tracking-[0.24em] text-gold-200/45">
        {t.menu.railLabel}
      </span>

      {SCENES.map((scene, index) => (
        <span key={scene.key} className="flex flex-col items-center gap-4">
          <span
            data-active={index === active ? "" : undefined}
            className={cn(
              "block size-[7px] rounded-full border border-gold-600/50 bg-transparent",
              "transition-[background-color,border-color,transform] duration-500 ease-[var(--ease-brand)]",
              "data-[active]:scale-125 data-[active]:border-gold-600 data-[active]:bg-gold-600",
            )}
          />
          {index < SCENES.length - 1 ? (
            <span className="block h-8 w-px bg-gold-600/20 lg:h-10" />
          ) : null}
        </span>
      ))}
    </motion.div>
  );
}
