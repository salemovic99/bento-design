import type { Dictionary } from "@/lib/i18n/dictionary";

/**
 * The whole cinematic section expressed as numbers, in one place.
 *
 * Every value below is a position on the section's own scroll progress, 0 → 1,
 * where 0 is the moment the sticky stage engages and 1 is the moment it lets
 * go. The film, the four text scenes, the progress rail and the release are all
 * read off that single axis — nothing here is a duration, and nothing plays on
 * its own clock.
 *
 *   0 ──────────────────────────────────────────────────────────────────── 1
 *   [ intro ]  [ ingredients ]  [ craft ]  [ card ]
 *   film scrub 0 ─────────────────────────► 0.88, then holds its last frame
 *                                    release 0.86 ──────────────────────► 1
 *                                       menu rises 0.90 ──────────► 0.99
 *
 * Deliberately, the last scene and the release overlap: "The Menu" is still on
 * screen while the film dims and the real menu comes up behind it, so the
 * section resolves into the menu rather than cutting to it.
 */

/** Keyed off the dictionary, so a scene can never exist without its copy. */
export type SceneKey = keyof Dictionary["menu"]["scenes"];

export type Scene = {
  key: SceneKey;
  /** Fading in from here… */
  start: number;
  /** …fully legible here, held until `hold`, gone by `end`. */
  peak: number;
  hold: number;
  end: number;
};

export const SCENES: readonly Scene[] = [
  { key: "intro", start: 0.0, peak: 0.03, hold: 0.16, end: 0.22 },
  { key: "ingredients", start: 0.25, peak: 0.3, hold: 0.41, end: 0.47 },
  { key: "craft", start: 0.5, peak: 0.55, hold: 0.66, end: 0.72 },
  { key: "card", start: 0.75, peak: 0.8, hold: 0.88, end: 0.93 },
];

/**
 * Scroll progress at which the film reaches its final frame. The remaining 12%
 * is the release, and the picture holds still through it — a film that ran to
 * the very last pixel of scroll would have nothing left to resolve on.
 */
export const SCRUB_END = 0.88;

/** The "explore our menu" cue is gone almost as soon as the guest moves. */
export const CUE_OUT = 0.04;

/** The handover. */
export const RELEASE = {
  /** The film starts pulling back and the vignette starts lifting. */
  lift: 0.86,
  /** The stage begins to dissolve off the menu standing behind it. */
  dissolve: 0.9,
  /** Fully released — the stage stops compositing entirely past this. */
  done: 0.995,
} as const;

/** The real menu's own heading rises while the film is dissolving. */
export const MENU_INTRO = { start: 0.9, end: 0.99 } as const;

/**
 * The scroll distance the section claims, as static utility classes.
 *
 * It has to be a literal string: Tailwind reads source text, so a class built
 * from a runtime value — `h-[${something}]` — compiles to nothing at all. Doing
 * it as a custom property also buys the shorter mobile track for free, with no
 * JS branch and no layout shift at hydration.
 */
export const MENU_SCROLL_HEIGHT =
  "[--menu-scroll:260vh] md:[--menu-scroll:420vh]";

/** Clamp to the 0–1 the whole timeline assumes. */
export function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}
