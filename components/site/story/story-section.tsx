"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { FilmRail } from "../cinematic/film-rail";
import { FilmScenes } from "../cinematic/film-scenes";
import { ScrollFilm } from "../cinematic/scroll-film";
import { StoryStill } from "./story-still";
import { StoryMilestones } from "./story-milestones";
import {
  STORY_CUE_OUT,
  STORY_PAN,
  STORY_POSTER_URL,
  STORY_RELEASE,
  STORY_SCENES,
  STORY_SCROLL_HEIGHT,
  STORY_SCRUB_END,
  STORY_VIDEO_URL,
} from "./story-timeline";

import brandMural from "@/public/brand/brand-mural.jpg";

/**
 * The cinematic story.
 *
 * One of two sections on the page that pin — the other is the menu, which uses
 * the same machinery in `components/site/cinematic/`. Everything else scrolls
 * normally, and nothing here reaches outside the `<section>` to change that.
 *
 *   section
 *   ├── track       360vh of scroll (220vh on a phone), z-20
 *   │   └── pin     sticky, one viewport tall — film, scenes, rail
 *   └── timeline    the four heritage beats, z-10, pulled up one viewport
 *
 * Because the timeline is lifted a full viewport, it has already risen into
 * place behind the film by the time the film starts dissolving. The stage does
 * not cut away to reveal it; it thins out and the timeline is simply there —
 * and the film's last frame, the house's own etched mark, dissolves straight
 * into the timeline that explains it. That is also why nothing in the pin is
 * interactive and the whole thing is `pointer-events-none`.
 */
export function StorySection() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <section
      id="story"
      className="on-green relative isolate scroll-mt-28 bg-green-900"
    >
      <div
        aria-hidden
        className="e-lattice pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
      />
      {reducedMotion ? <StoryStill /> : <StoryStage />}
    </section>
  );
}

/**
 * The scroll-driven half. Split out rather than early-returned so that every
 * hook below — and the `useMotionValueEvent` calls further down the tree — is
 * unconditional by construction.
 */
function StoryStage() {
  const track = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // "start start" → "end end" maps onto exactly the pinned travel: 0 when the
  // pin engages, 1 when it lets go.
  const { scrollYProgress: progress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });

  // Sprung for the look, raw for the seek — see `cinematic/scroll-film.tsx`.
  const smooth = useSpring(progress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
    restDelta: 0.001,
  });

  // Blur is the one costly property in the scene transitions; phones do without.
  const wide = useMediaQuery("(min-width: 768px)");

  // The crop pan — see STORY_PAN for why a portrait film needs one.
  const panY = useTransform(smooth, [...STORY_PAN.at], [...STORY_PAN.to]);
  const objectPosition = useMotionTemplate`50% ${panY}`;

  const stageOpacity = useTransform(
    smooth,
    [STORY_RELEASE.dissolve, STORY_RELEASE.done],
    [1, 0],
  );
  // Once released, stop compositing a full-screen video layer behind the whole
  // remaining scroll of the timeline.
  const stageVisibility = useTransform(smooth, (value) =>
    value > STORY_RELEASE.done ? "hidden" : "visible",
  );
  const vignetteOpacity = useTransform(
    smooth,
    [0, STORY_RELEASE.lift, STORY_RELEASE.dissolve],
    [1, 1, 0.35],
  );

  return (
    <>
      <div
        ref={track}
        /*
          `pointer-events-none` on the track, not just on the pin: the track's
          own box overlaps the top viewport of the timeline below it, and an
          element with no background still swallows clicks across its whole box.
        */
        className={cn(
          "e-film-track pointer-events-none relative z-20",
          STORY_SCROLL_HEIGHT,
          "h-(--story-scroll)",
        )}
      >
        <motion.div
          aria-hidden
          style={{ opacity: stageOpacity, visibility: stageVisibility }}
          /*
            `svh` for the pin and `svh` for the pull-up below, so the two always
            agree. `dvh` would resize as a mobile URL bar hides, re-measuring
            the track mid-scroll and jumping the film. Change one and you must
            change the other.
          */
          className="e-film-pin pointer-events-none sticky top-0 h-svh overflow-hidden"
        >
          {/*
            Two compositions, one video element, switched entirely in CSS.

            The film is 720×1280. Below `lg` it runs full-bleed, which on a
            portrait phone is close to its native size and is the right frame
            for it. From `lg` up, filling a landscape viewport would mean
            stretching 720 px across 1920 — a 2.67× upscale, and it looks it.
            So at `lg` the film moves into a panel at the inline-start edge,
            sized so it renders at or below native width, and the copy runs
            down the column beside it.

            Both boxes below use the same trick: `absolute inset-0` while the
            layout is an overlay, `relative` once it becomes a column. Nothing
            re-mounts across the breakpoint, so the film never reloads and the
            scrub never resets.
          */}
          <div className="relative mx-auto flex h-full w-full max-w-[1600px] items-center lg:gap-12 lg:px-10 xl:gap-20">
            <div
              className={cn(
                "absolute inset-0",
                "lg:relative lg:inset-auto lg:aspect-[9/16] lg:h-[min(78svh,46rem)] lg:w-auto lg:shrink-0",
                // The house treatment for a photograph — the same radius and
                // hairline the timeline's own images carry.
                "lg:overflow-hidden lg:rounded-[var(--radius-brand)] lg:border lg:border-gold-600/15",
              )}
            >
              <ScrollFilm
                progress={progress}
                smooth={smooth}
                src={STORY_VIDEO_URL}
                poster={STORY_POSTER_URL}
                still={brandMural}
                stillFocus="50% 45%"
                scrubEnd={STORY_SCRUB_END}
                release={STORY_RELEASE}
                objectPosition={objectPosition}
                /*
                  Tighter than the menu's default 150%. This section starts
                  exactly one viewport down, so a 150% margin would arm the film
                  at scroll zero and put a 4 MB fetch in competition with the
                  hero's own `priority` photograph. At 80% it cannot fire until
                  the guest has started moving, and it is still a full screen
                  ahead of need.
                */
                armMargin="80% 0px"
              />
            </div>

            {/*
              Only the overlay needs a vignette. In the panel layout the copy
              sits on the section's own dark ground, which already clears 4.5:1
              without darkening the film.
            */}
            <motion.div
              style={{ opacity: vignetteOpacity }}
              className="e-film-vignette absolute inset-0 lg:hidden"
            />

            <div className="absolute inset-0 lg:relative lg:inset-auto lg:h-[min(78svh,46rem)] lg:flex-1">
              <FilmScenes
                progress={smooth}
                beats={STORY_SCENES}
                copy={t.story.scenes}
                cue={t.story.cue}
                cueOut={STORY_CUE_OUT}
                blur={wide}
                // `items-start`/`text-start` are logical: the panel sits at the
                // inline-start edge, so the whole composition mirrors in Arabic
                // with no `rtl:` variant and no JS.
                sceneClassName="lg:items-start lg:px-0 lg:pe-12 lg:text-start"
                // Smaller in a column than it can afford to be across a full
                // frame — 6.4vw would run to 76px against a 400px panel.
                titleClassName="lg:text-[clamp(2rem,3.2vw,3.25rem)]"
                cueClassName="lg:justify-start lg:px-0"
              />
            </div>
          </div>

          <FilmRail
            progress={progress}
            beats={STORY_SCENES}
            label={t.story.railLabel}
            release={STORY_RELEASE}
          />
        </motion.div>
      </div>

      {/*
        Lifted exactly one viewport, so its top lands on the viewport top at the
        instant the pin releases. The padding keeps the heading clear of the
        fixed header, and means the heading is still just below the fold as the
        film starts to go, leaving it something to rise into.
      */}
      <div className="relative z-10 mt-[-100svh] pt-28 sm:pt-36 lg:pt-44">
        <StoryMilestones progress={smooth} />
      </div>
    </>
  );
}
