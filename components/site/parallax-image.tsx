"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useBrandMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A full-bleed photograph that drifts against the scroll.
 *
 * The inner wrapper is grown past the frame on both edges by `strength`, then
 * moved on `y` alone — a single compositor transform, no layout and no repaint
 * per frame. The travel is scaled to the grown height so the drift can never
 * expose an edge. Under `prefers-reduced-motion` it renders as a still image.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imageClassName,
  sizes = "100vw",
  priority = false,
  /** Overscan on each edge, as a fraction of the frame height. */
  strength = 0.12,
  focus = "50% 50%",
}: {
  src: StaticImageData | string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  strength?: number;
  focus?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const { reduced } = useBrandMotion();

  const { scrollYProgress } = useScroll({
    target: frame,
    offset: ["start end", "end start"],
  });

  // Framer reads a percentage `y` against the moving element's own height,
  // which is (1 + 2·strength) frames tall — so scale the travel to match.
  const travel = (strength / (1 + 2 * strength)) * 100;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-travel}%`, `${travel}%`],
  );

  const edge = `${-strength * 100}%`;

  return (
    <div ref={frame} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-x-0"
        style={
          reduced
            ? { top: 0, bottom: 0 }
            : { top: edge, bottom: edge, y, willChange: "transform" }
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={typeof src === "string" ? undefined : "blur"}
          className={cn("object-cover", imageClassName)}
          style={{ objectPosition: focus }}
        />
      </motion.div>
    </div>
  );
}
