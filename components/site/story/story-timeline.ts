import type { Beat, Release } from "@/components/site/cinematic/film-timeline";
import type { Dictionary } from "@/lib/i18n/dictionary";

/**
 * The cinematic story expressed as numbers, in one place.
 *
 * Positions on the section's own scroll progress — see
 * `components/site/cinematic/film-timeline.ts` for what that axis is.
 *
 *   0 ──────────────────────────────────────────────────────────────────── 1
 *   [ room ]   [ light ]   [ walls ]   [ mark ]
 *   film scrub 0 ─────────────────────────► 0.88, then holds its last frame
 *                                    release 0.86 ──────────────────────► 1
 *                                   timeline rises 0.90 ──────────► 0.99
 *
 * The film is one continuous 9.81 s push-in with no cuts: the dining room
 * before service → the banquettes under the lamps → the mural → the etched
 * glass carrying the house's own name and date. Progress maps onto it at
 * roughly `progress × 11.15` seconds, which is where each beat's comment below
 * comes from — the copy is cut to the picture, not spaced evenly.
 */

/** Keyed off the dictionary, so a scene can never exist without its copy. */
export type StorySceneKey = keyof Dictionary["story"]["scenes"];

export const STORY_SCENES: readonly Beat<StorySceneKey>[] = [
  // t ≈ 0.0–2.5 s — the set table, the room at night
  { key: "room", start: 0.0, peak: 0.03, hold: 0.16, end: 0.22 },
  // t ≈ 2.8–5.2 s — green banquettes, lamps, the mural coming into view
  { key: "light", start: 0.25, peak: 0.3, hold: 0.41, end: 0.47 },
  // t ≈ 5.6–8.0 s — the mural filling the frame
  { key: "walls", start: 0.5, peak: 0.55, hold: 0.66, end: 0.72 },
  // t ≈ 8.4–9.8 s — the etched glass: Geneva, since 1930
  { key: "mark", start: 0.75, peak: 0.8, hold: 0.88, end: 0.93 },
];

/**
 * Scroll progress at which the film reaches its final frame. The remaining 12%
 * is the release, and the picture holds still through it.
 */
export const STORY_SCRUB_END = 0.88;

/** The cue is gone almost as soon as the guest moves. */
export const STORY_CUE_OUT = 0.04;

/** The handover. */
export const STORY_RELEASE: Release = {
  lift: 0.86,
  dissolve: 0.9,
  done: 0.995,
};

/** The timeline's own heading rises while the film is dissolving. */
export const STORY_INTRO = { start: 0.9, end: 0.99 } as const;

/**
 * The scroll distance the section claims, as static utility classes. Shorter
 * than the menu's 260/420 — the film is 9.8 s against the menu's 14.5 s, and
 * this section sits second on the page where a long pin is felt more.
 *
 * It has to be a literal string: Tailwind reads source text, so a class built
 * from a runtime value — `h-[${something}]` — compiles to nothing at all.
 */
export const STORY_SCROLL_HEIGHT =
  "[--story-scroll:220vh] md:[--story-scroll:360vh]";

/**
 * The vertical crop, panned across the scroll.
 *
 * The source is 720×1280. `object-cover` on a landscape viewport keeps the full
 * width and shows roughly the middle third of the height, and the film's
 * subjects do not sit at one height: the set table reads at 55%, the figure
 * past the mahogany column at 45%, the mural's face at 34% (at 50% it is cut at
 * the chin), and the etched mark at 59% (higher and "GENEVA" is clipped away).
 *
 * So the crop lifts to find the face and settles back down onto the mark, which
 * reads as a camera rather than a slider, and holds at 59% through the release
 * so the last thing on screen is the house's own name. On a portrait phone the
 * source nearly fills the viewport, there is no overflow to move within, and
 * the percentage becomes a no-op — the pan disables itself where it is not
 * wanted, at no cost.
 */
export const STORY_PAN = {
  at: [0, 0.3, 0.55, 0.84, 1],
  to: ["55%", "45%", "34%", "59%", "59%"],
} as const;

export const STORY_VIDEO_URL = "/videos/story.mp4";
export const STORY_POSTER_URL = "/videos/story-poster.jpg";
