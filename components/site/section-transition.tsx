"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useBrandMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

import symbolGold from "@/public/brand/symbol-gold.png";

type Tone = "green-900" | "cream";

const GROUND: Record<Tone, string> = {
  "green-900": "bg-green-900",
  cream: "bg-cream",
};

/**
 * The connective tissue between sections.
 *
 * Rather than stacking sections edge to edge, each boundary is a short
 * scroll-linked bridge: the incoming ground rises behind a `clip-path` wipe,
 * a band of the gold lattice drifts across, and the house monogram passes
 * through on its own parallax. The result reads as one continuous take.
 *
 * Everything here is decorative, so it is `aria-hidden` and collapses to a
 * plain colour block under `prefers-reduced-motion`.
 */
export function SectionTransition({
  from,
  to,
  className,
}: {
  from: Tone;
  to: Tone;
  className?: string;
}) {
  const bridge = useRef<HTMLDivElement>(null);
  const { reduced } = useBrandMotion();

  const { scrollYProgress } = useScroll({
    target: bridge,
    offset: ["start end", "end start"],
  });

  // The incoming ground wipes upward across the bridge.
  const wipe = useTransform(
    scrollYProgress,
    [0.15, 0.85],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );
  const latticeX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const latticeOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 0.16, 0],
  );
  const markY = useTransform(scrollYProgress, [0, 1], ["55%", "-55%"]);
  const markOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.5, 0.9],
    [0, 0.5, 0],
  );

  if (reduced) {
    return <div aria-hidden className={cn("h-10", GROUND[to], className)} />;
  }

  return (
    <div
      ref={bridge}
      aria-hidden
      className={cn(
        "relative isolate h-28 overflow-hidden sm:h-36 lg:h-44",
        GROUND[from],
        className,
      )}
    >
      <motion.div
        style={{ clipPath: wipe }}
        className={cn("absolute inset-0", GROUND[to])}
      />

      <motion.div
        style={{ x: latticeX, opacity: latticeOpacity }}
        className="e-lattice absolute inset-y-0 inset-x-[-10%]"
      />

      <motion.div
        style={{ y: markY, opacity: markOpacity }}
        className="absolute inset-0 grid place-items-center"
      >
        <Image
          src={symbolGold}
          alt=""
          sizes="72px"
          className="h-12 w-auto sm:h-14 lg:h-16"
        />
      </motion.div>

      {/* A single gold hairline riding the seam. */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-linear-to-r from-transparent via-gold-600/25 to-transparent" />
    </div>
  );
}
