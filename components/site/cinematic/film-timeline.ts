/**
 * The vocabulary both cinematic sections are written in.
 *
 * Every number in a section's timeline is a position on that section's own
 * scroll progress, 0 → 1, where 0 is the moment its sticky stage engages and 1
 * is the moment it lets go. Nothing here is a duration, and nothing plays on its
 * own clock — the film, the text scenes, the progress rail and the release are
 * all read off that single axis.
 *
 *   0 ──────────────────────────────────────────────────────────────────── 1
 *   [ beat ]   [ beat ]   [ beat ]   [ beat ]
 *   film scrub 0 ─────────────────────────► scrubEnd, then holds its last frame
 *                                   release.lift ──────────────────────► done
 *
 * The last beat and the release overlap on purpose in both sections: the closing
 * line is still on screen while the film dims and the real content comes up
 * behind it, so a section resolves into what follows rather than cutting to it.
 *
 * The shapes live here rather than in either section because the two would
 * otherwise drift, and the machinery that reads them — `ScrollFilm`,
 * `FilmScenes`, `FilmRail` — has to agree with both.
 */

export type Beat<K extends string = string> = {
  /**
   * Matches a key in the section's `scenes` dictionary block. Parameterised so
   * a section can derive it from the dictionary and keep that narrowing all the
   * way through — a `readonly Beat<"intro" | ...>[]` still satisfies the
   * `readonly Beat[]` the shared components ask for.
   */
  key: K;
  /** Fading in from here… */
  start: number;
  /** …fully legible here, held until `hold`, gone by `end`. */
  peak: number;
  hold: number;
  end: number;
};

/** The handover from film to content. */
export type Release = {
  /** The film starts pulling back and the vignette starts lifting. */
  lift: number;
  /** The stage begins to dissolve off the content standing behind it. */
  dissolve: number;
  /** Fully released — the stage stops compositing entirely past this. */
  done: number;
};

/** What a `scenes` block supplies for one beat. */
export type SceneCopy = { title: string; line: string };

/** Clamp to the 0–1 every timeline assumes. */
export function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}
