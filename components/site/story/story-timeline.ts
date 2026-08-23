import type { Dictionary } from "@/lib/i18n/dictionary";

/**
 * The story section's shared constants.
 *
 * The section used to run a scroll-scrubbed film, and everything that film
 * needed — its scrub end, its release handover, its crop pan, its source URL —
 * lived here. The film is gone; what is left is the order of the four scene
 * lines and the height the frame and the copy column share.
 */

/** Keyed off the dictionary, so a scene can never exist without its copy. */
export type StorySceneKey = keyof Dictionary["story"]["scenes"];

/**
 * The four beats of the house's own room, in the order they are read:
 * the dining room before service → the banquettes under the lamps → the mural →
 * the etched glass carrying the house's name and date.
 */
export const STORY_SCENES: readonly StorySceneKey[] = [
  "room",
  "light",
  "walls",
  "mark",
];

/**
 * The height of the picture frame at `lg`, and of the copy column beside it.
 *
 * One constant because the two must agree: the frame and the column are
 * siblings in a centred flex row, and if their heights drift apart the copy
 * stops sitting level with the picture.
 *
 * It has to be a literal string: Tailwind reads source text, so a class built
 * from a runtime value — `h-[${something}]` — compiles to nothing at all.
 */
export const STORY_PANEL_HEIGHT = "lg:h-[min(84svh,50rem)]";
