"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { FilmRail } from "../cinematic/film-rail";
import { FilmScenes } from "../cinematic/film-scenes";
import { ScrollFilm } from "../cinematic/scroll-film";
import { MenuList } from "./menu-list";
import { MenuStill } from "./menu-still";
import {
  MENU_CUE_OUT,
  MENU_POSTER_URL,
  MENU_RELEASE,
  MENU_SCENES,
  MENU_SCROLL_HEIGHT,
  MENU_SCRUB_END,
  MENU_VIDEO_URL,
} from "./menu-timeline";

import steakMacro from "@/public/brand/steak-macro.jpg";

/**
 * The cinematic menu.
 *
 * One of two sections on the page that pin — the other is the story, which uses
 * the same machinery in `components/site/cinematic/`. Everything else — hero,
 * bento, branches, reservation — scrolls normally, and nothing here reaches
 * outside the `<section>` to change that. The pin lives on a child of a fixed
 * scroll track, so the page's own scrolling is untouched; the guest simply
 * spends a few screens' worth of it inside a film.
 *
 * The structure that makes the ending work:
 *
 *   section
 *   ├── track        420vh of scroll (260vh on a phone), z-20
 *   │   └── pin      sticky, one viewport tall — film, scenes, rail
 *   └── menu         the real menu, z-10, pulled up by exactly one viewport
 *
 * Because the menu is lifted a full viewport, it has already risen into place
 * behind the film by the time the film starts dissolving. The stage does not
 * cut away to reveal the menu; it thins out and the menu is simply there. That
 * is also why nothing in the pin is interactive and the whole thing is
 * `pointer-events-none` — the instant the menu is legible, it is clickable.
 */
export function MenuSection() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <section
      id="menu"
      className="on-green relative isolate scroll-mt-28 bg-green-900"
    >
      {reducedMotion ? <MenuStill /> : <MenuStage />}
    </section>
  );
}

/**
 * The scroll-driven half. Split out rather than early-returned so that every
 * hook below — `useScroll`, `useSpring`, and the `useMotionValueEvent` calls
 * further down the tree — is unconditional by construction.
 */
function MenuStage() {
  const track = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // "start start" → "end end" maps onto exactly the pinned travel: 0 when the
  // track's top reaches the viewport top and the pin engages, 1 when its bottom
  // reaches the viewport bottom and the pin lets go. The offset used elsewhere
  // on this page ("start end" → "end start") starts counting as the track rises
  // into view, which would run the film a quarter through before it is even
  // on screen.
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

  const stageOpacity = useTransform(
    smooth,
    [MENU_RELEASE.dissolve, MENU_RELEASE.done],
    [1, 0],
  );
  // Once released, stop compositing a full-screen video layer behind the whole
  // remaining scroll of the menu.
  const stageVisibility = useTransform(smooth, (value) =>
    value > MENU_RELEASE.done ? "hidden" : "visible",
  );
  const vignetteOpacity = useTransform(
    smooth,
    [0, MENU_RELEASE.lift, MENU_RELEASE.dissolve],
    [1, 1, 0.35],
  );

  return (
    <>
      <div
        ref={track}
        /*
          `pointer-events-none` on the track, not just on the pin: the track's
          own box overlaps the top viewport of the menu below it, and an
          element with no background still swallows clicks across its whole
          box. Nothing in here is interactive, so nothing is lost.
        */
        className={cn(
          "e-film-track pointer-events-none relative z-20",
          MENU_SCROLL_HEIGHT,
          "h-(--menu-scroll)",
        )}
      >
        <motion.div
          aria-hidden
          style={{ opacity: stageOpacity, visibility: stageVisibility }}
          /*
            `svh` for the pin and `svh` for the pull-up below, so the two always
            agree. `dvh` would resize as a mobile URL bar hides, re-measuring the
            track mid-scroll and jumping the film. The cost is that the pin can
            unstick about a URL bar early — which lands inside the release fade,
            where it cannot be seen. Change one of these and you must change the
            other.
          */
          className="e-film-pin pointer-events-none sticky top-0 h-svh overflow-hidden"
        >
          <ScrollFilm
            progress={progress}
            smooth={smooth}
            src={MENU_VIDEO_URL}
            poster={MENU_POSTER_URL}
            still={steakMacro}
            stillFocus="50% 45%"
            scrubEnd={MENU_SCRUB_END}
            release={MENU_RELEASE}
          />

          {/* Keeps the display type past 4.5:1 wherever the frame is bright. */}
          <motion.div
            style={{ opacity: vignetteOpacity }}
            className="e-film-vignette absolute inset-0"
          />

          <FilmScenes
            progress={smooth}
            beats={MENU_SCENES}
            copy={t.menu.scenes}
            cue={t.menu.cue}
            cueOut={MENU_CUE_OUT}
            blur={wide}
          />
          <FilmRail
            progress={progress}
            beats={MENU_SCENES}
            label={t.menu.railLabel}
            release={MENU_RELEASE}
          />
        </motion.div>
      </div>

      {/*
        Lifted exactly one viewport, so its top lands on the viewport top at the
        instant the pin releases. The padding is what keeps the heading clear of
        the fixed header — and it means the heading is still just below the fold
        as the film starts to go, leaving it something to rise into.
      */}
      <div className="relative z-10 mt-[-100svh] pt-28 sm:pt-36 lg:pt-44">
        <MenuList progress={smooth} />
      </div>
    </>
  );
}
