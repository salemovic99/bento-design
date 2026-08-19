"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { RELEASE, SCRUB_END, clamp01 } from "./menu-timeline";

import steakMacro from "@/public/brand/steak-macro.jpg";

/** Where the film lives. One file — see `public/videos/README.md`. */
const MENU_VIDEO_URL = "/videos/menu.mp4";
const MENU_POSTER_URL = "/videos/menu-poster.jpg";

/** A seek smaller than one frame is invisible; skip it and save the work. */
const MIN_SEEK_DELTA = 1 / 25;
/**
 * Past this jump — a smooth-scrolled anchor crossing the whole section, say —
 * landing on the nearest keyframe instantly beats landing exactly a beat late.
 */
const FAST_SEEK_DELTA = 1.25;

/**
 * Never seek into bytes that have not arrived. Asking for an unbuffered time
 * stalls the element and, on iOS, can leave it blank until the range request
 * lands; holding at the buffered edge instead makes a slow connection look
 * like a film that is catching up rather than one that is broken.
 */
function clampToBuffered(video: HTMLVideoElement, time: number): number {
  const ranges = video.buffered;
  for (let i = 0; i < ranges.length; i += 1) {
    if (time >= ranges.start(i) && time <= ranges.end(i)) return time;
  }
  return ranges.length > 0 ? ranges.end(0) : 0;
}

/** Never subscribes — `saveData` is a preference, not a stream of events. */
const noopSubscribe = () => () => {};

/**
 * Whether the browser has asked us to spare the guest's data.
 *
 * Read through `useSyncExternalStore` rather than an effect, so the server
 * snapshot and the first client render agree and the real answer arrives in an
 * ordinary post-hydration render — the same shape as `useMediaQuery` and the
 * language provider. Reading it during render is also what lets the `<video>`
 * never mount in the first place: deciding in an effect would be deciding after
 * the fetch had already started, which is the opposite of the point.
 */
function useSaveData(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () =>
      Boolean(
        (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection?.saveData,
      ),
    () => false,
  );
}

/**
 * The film, scrubbed by scroll.
 *
 * The entire mechanism is: scroll progress → `video.currentTime`. It is never
 * played. `play()` appears exactly once below, and only to work around iOS
 * refusing to paint a frame from a video that has never started.
 *
 * Two rules keep it cheap. Nothing in the seek path touches React state, so a
 * scroll never causes a render — the progress MotionValue is read through
 * `useMotionValueEvent` and everything else is a ref. And there is no standing
 * rAF loop: a frame is requested only when the value actually changed, and at
 * most one `currentTime` write happens per frame. Idle costs nothing.
 *
 * `progress` is the raw scroll value and drives the seek. `smooth` is sprung
 * and drives the picture's own scale and fade. Springing the seek instead would
 * keep firing for a few hundred milliseconds after the guest stops — exactly
 * the seek thrash that stutters Safari — and would decouple the frame from the
 * finger, which is the one thing this effect cannot afford to lose.
 */
export function CinematicMenuVideo({
  progress,
  smooth,
}: {
  progress: MotionValue<number>;
  smooth: MotionValue<number>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);
  const targetRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const readyRef = useRef(false);
  const primedRef = useRef(false);
  const [failed, setFailed] = useState(false);
  const [armed, setArmed] = useState(false);
  const saveData = useSaveData();
  // Either reason lands on the same still: a decorative two megabytes is not
  // worth a metered connection, and a missing or broken file must not take the
  // section down with it.
  const showStill = failed || saveData;

  // The picture pulls back a touch as the section hands over, so the release
  // reads as a camera settling rather than a layer being switched off.
  const scale = useTransform(smooth, [0, RELEASE.lift, 1], [1.06, 1.02, 1]);

  const seek = useCallback(() => {
    frameRef.current = null;

    const video = videoRef.current;
    const duration = durationRef.current;
    if (!video || !readyRef.current) return;
    if (!Number.isFinite(duration) || duration <= 0) return;

    const time = clampToBuffered(video, targetRef.current);
    const delta = Math.abs(video.currentTime - time);
    if (delta < MIN_SEEK_DELTA) return;

    if (delta > FAST_SEEK_DELTA && typeof video.fastSeek === "function") {
      video.fastSeek(time);
      return;
    }
    // Deliberately not gated on `video.seeking`: skipping while a seek is in
    // flight drops the newest target and the picture freezes mid-scroll. Write
    // the latest position every frame and let the browser coalesce them.
    video.currentTime = time;
  }, []);

  const handleReady = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    durationRef.current = Number.isFinite(video.duration) ? video.duration : 0;
    readyRef.current = video.readyState >= 1; // HAVE_METADATA

    // iOS paints the poster and nothing else until the element has played once.
    // It is muted, inline and carries no audio track, so this is permitted —
    // and if a policy blocks it anyway, the poster is still standing there.
    if (!primedRef.current) {
      primedRef.current = true;
      void video
        .play()
        .then(() => video.pause())
        .catch(() => {});
    }

    // A reload or a deep link can land mid-section; put the film on the right
    // frame rather than on frame 0.
    targetRef.current = clamp01(progress.get() / SCRUB_END) * durationRef.current;
    seek();
  }, [progress, seek]);

  useMotionValueEvent(progress, "change", (value) => {
    targetRef.current = clamp01(value / SCRUB_END) * durationRef.current;
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(seek);
    }
  });

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  useEffect(() => {
    // A cached film can reach HAVE_METADATA before the handler is attached, in
    // which case `loadedmetadata` never fires and the picture would sit dead on
    // frame 0. Checked on arming, since that is when a source first exists.
    if (!armed) return;
    const video = videoRef.current;
    if (video && video.readyState >= 1) handleReady();
  }, [armed, handleReady]);

  /**
   * The `src` is withheld until the section is roughly a screen and a half
   * away. Two things fall out of that, both worth having:
   *
   * A guest who never scrolls this far never pays for the film at all — it sits
   * below three full sections. And a guest who asked for reduced motion never
   * requests it either: `useMediaQuery` can only answer honestly after
   * hydration, so this component does briefly mount for them, but it mounts
   * without a source and is replaced by the still long before anything is
   * armed.
   */
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={wrapRef}
      aria-hidden
      style={{ scale, willChange: "transform" }}
      className="absolute inset-0 -z-10 origin-center"
    >
      {showStill ? (
        <Image
          src={steakMacro}
          alt=""
          fill
          priority={false}
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-[50%_45%]"
        />
      ) : (
        /*
          Kept a plain <video> inside the motion wrapper on purpose: `motion.video`
          would put framer in charge of the media element's own style, and the
          transform belongs on a layer above it, where it stays a compositor job.
        */
        <video
          ref={videoRef}
          src={armed ? MENU_VIDEO_URL : undefined}
          poster={MENU_POSTER_URL}
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          onLoadedMetadata={handleReady}
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      )}
    </motion.div>
  );
}
