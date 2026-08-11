"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { useBrandMotion, viewportOnce } from "@/lib/motion";

type RevealProps = Omit<HTMLMotionProps<"div">, "variants" | "children"> & {
  children: ReactNode;
  /** Which variant from the shared motion vocabulary to play. */
  as?: "fadeUp" | "softScale" | "imageReveal";
};

/**
 * The single scroll-reveal wrapper. Everything that enters on scroll without
 * needing its own choreography goes through this, so timing, easing and the
 * reduced-motion fallback stay identical section to section — the difference
 * between "animated" and "choreographed".
 */
export function Reveal({ children, as = "fadeUp", ...props }: RevealProps) {
  const m = useBrandMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={m[as]}
      {...props}
    >
      {children}
    </motion.div>
  );
}
