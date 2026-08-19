"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image, { type StaticImageData } from "next/image";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { clamp01, type Release } from "./film-timeline";

/** A seek smaller than one frame is invisible; skip it and save the work. */
const MIN_SEEK_DELTA = 1 / 25;
/**
 * Past this jump — a smooth-scrolled anchor crossing a whole section, say —
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

export type ScrollFilmProps = {
  /** Raw scroll progress. Drives the seek. */
  progress: MotionValue<number>;
  /** Sprung scroll progress. Drives the picture's own scale. */
  smooth: MotionValue<number>;
  src: string;
  poster: string;
  /** Shown instead of the film under `saveData`, or if the file fails. */
  still: StaticImageData;
  /** `object-position` for that still. */
  stillFocus?: string;
  /** Progress at which the film reaches its final frame. */
  scrubEnd: number;
  release: Release;
  /**
   * `object-position` for the film itself. A MotionValue when the section pans
   * the crop across the scroll — which is how a portrait source survives being
   * cropped to a landscape viewport.
   */
  objectPosition?: MotionValue<string> | string;
  /**
   * How early the file is fetched, as an IntersectionObserver `rootMargin`.
   * Sections near the top of the page want this tight so the fetch does not
   * compete with the hero's own image; sections further down can be generous.
   */
  armMargin?: string;
};

/**
 * A film, scrubbed by scroll.
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
 * and drives the picture's own scale and crop. Springing the seek instead would
 * keep firing for a few hundred milliseconds after the guest stops — exactly
 * the seek thrash that stutters Safari — and would decouple the frame from the
 * finger, which is the one thing this effect cannot afford to lose.
 */
export function ScrollFilm({
  progress,
  smooth,
  src,
  poster,
  still,
  stillFocus = "50% 45%",
  scrubEnd,
  release,
  objectPosition,
  armMargin = "150% 0px",
}: ScrollFilmProps) {
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
  // Either reason lands on the same still: a decorative few megabytes is not
  // worth a metered connection, and a missing or broken file must not take the
  // section down with it.
  const showStill = failed || saveData;

  // The picture pulls back a touch as the section hands over, so the release
  // reads as a camera settling rather than a layer being switched off.
  const scale = useTransform(smooth, [0, release.lift, 1], [1.06, 1.02, 1]);

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
    targetRef.current = clamp01(progress.get() / scrubEnd) * durationRef.current;
    seek();
  }, [progress, scrubEnd, seek]);

  useMotionValueEvent(progress, "change", (value) => {
    targetRef.current = clamp01(value / scrubEnd) * durationRef.current;
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
   * The `src` is withheld until the section is close. Two things fall out of
   * that, both worth having:
   *
   * A guest who never scrolls this far never pays for the film at all. And a
   * guest who asked for reduced motion never requests it either: `useMediaQuery`
   * can only answer honestly after hydration, so this component does briefly
   * mount for them, but it mounts without a source and is replaced by the still
   * long before anything is armed.
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
      { rootMargin: armMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [armMargin]);

  return (
    <motion.div
      ref={wrapRef}
      aria-hidden
      style={{ scale, willChange: "transform" }}
      className="absolute inset-0 -z-10 origin-center"
    >
      {showStill ? (
        <Image
          src={still}
          alt=""
          fill
          priority={false}
          placeholder="blur"
          sizes="100vw"
          style={{ objectPosition: stillFocus }}
          className="object-cover"
        />
      ) : (
        /*
          `motion.video` only because `object-position` has nowhere else to
          live — it is a property of the media box itself. The scale transform
          stays on the wrapper above, where it remains a compositor job and
          framer is not handed control of the media element's own transform.
        */
        <motion.video
          ref={videoRef}
          src={armed ? src : undefined}
          poster={poster}
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          onLoadedMetadata={handleReady}
          onError={() => setFailed(true)}
          style={objectPosition ? { objectPosition } : undefined}
          className="size-full object-cover"
        />
      )}
    </motion.div>
  );
}
