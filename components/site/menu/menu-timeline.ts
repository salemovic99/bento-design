import type { Beat, Release } from "@/components/site/cinematic/film-timeline";
import type { Dictionary } from "@/lib/i18n/dictionary";

/**
 * The cinematic menu expressed as numbers, in one place.
 *
 * Positions on the section's own scroll progress — see
 * `components/site/cinematic/film-timeline.ts` for what that axis is and how
 * the four values of a `Beat` are read.
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
export type MenuSceneKey = keyof Dictionary["menu"]["scenes"];

export const MENU_SCENES: readonly Beat<MenuSceneKey>[] = [
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
export const MENU_SCRUB_END = 0.88;

/** The "explore our menu" cue is gone almost as soon as the guest moves. */
export const MENU_CUE_OUT = 0.04;

/** The handover. */
export const MENU_RELEASE: Release = {
  lift: 0.86,
  dissolve: 0.9,
  done: 0.995,
};

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

/** Where the film lives. One file — see `public/videos/README.md`. */
export const MENU_VIDEO_URL = "/videos/menu.mp4";
export const MENU_POSTER_URL = "/videos/menu-poster.jpg";
