"use client";

import { useReducedMotion, type Transition, type Variants } from "framer-motion";

/**
 * One motion vocabulary for the whole site, so the page reads as a single
 * cinematic take rather than a stack of independently animated sections.
 *
 * Rules baked in here:
 *  - `EASE` and `DUR` come straight from the brand tokens (`--ease`, `--dur`).
 *  - Only `transform`, `opacity` and `clip-path` are animated. Never width,
 *    height, top or left — those force layout on every frame.
 *  - Nothing here moves on the horizontal axis. Direction-dependent motion is
 *    expressed in CSS with logical properties and `rtl:` variants, which flip
 *    with the document instead of needing a JS mirror.
 *  - Under `prefers-reduced-motion` every variant collapses to a plain fade.
 */

/** Brand `--ease`: a gentle, refined ease-out. */
export const EASE = [0.22, 0.61, 0.36, 1] as const;
/** Brand `--dur`, in seconds. */
export const DUR = 0.36;
/** Cinematic beats (image reveals, section bridges) run slower on purpose. */
export const DUR_CINEMA = 0.9;

export const transition: Transition = { duration: DUR, ease: EASE };
export const cinematic: Transition = { duration: DUR_CINEMA, ease: EASE };

/** Viewport config shared by every scroll reveal: fire once, slightly early. */
export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: EASE } },
};

export type BrandMotion = {
  reduced: boolean;
  /** Content rising into place. */
  fadeUp: Variants;
  /** A parent that releases its children one after another. */
  stagger: (stepSeconds?: number, delaySeconds?: number) => Variants;
  /** Image tiles: a soft scale-up under a clip-path wipe. */
  imageReveal: Variants;
  /** Cards settling in from 0.95. */
  softScale: Variants;
  /** Headline lines wiping up from behind their own baseline. */
  lineReveal: Variants;
  /** A gold rule drawing itself along the inline axis. */
  ruleDraw: Variants;
};

export function useBrandMotion(): BrandMotion {
  const reduced = useReducedMotion() ?? false;

  if (reduced) {
    const still: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    return {
      reduced,
      fadeUp: fadeOnly,
      stagger: () => ({
        hidden: {},
        visible: { transition: { staggerChildren: 0.02 } },
      }),
      imageReveal: still,
      softScale: fadeOnly,
      lineReveal: fadeOnly,
      ruleDraw: still,
    };
  }

  return {
    reduced,
    fadeUp: {
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition },
    },
    stagger: (step = 0.08, delay = 0) => ({
      hidden: {},
      visible: {
        transition: { staggerChildren: step, delayChildren: delay },
      },
    }),
    imageReveal: {
      hidden: { opacity: 0, scale: 1.06, clipPath: "inset(0% 0% 100% 0%)" },
      visible: {
        opacity: 1,
        scale: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        transition: cinematic,
      },
    },
    softScale: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: EASE },
      },
    },
    lineReveal: {
      hidden: { opacity: 0, y: "110%" },
      visible: {
        opacity: 1,
        y: "0%",
        transition: { duration: 0.75, ease: EASE },
      },
    },
    ruleDraw: {
      hidden: { scaleX: 0 },
      visible: {
        scaleX: 1,
        transition: { duration: 0.7, ease: EASE, delay: 0.15 },
      },
    },
  };
}
