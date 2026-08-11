"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useBrandMotion, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The bento container.
 *
 * The composition is rebuilt per breakpoint rather than shrunk: 12 columns on
 * desktop, 6 on tablet, 2 on mobile, each with its own row height so the tiles
 * keep their intended proportions. Tile spans live in the content data, so the
 * asymmetry is authored rather than hard-coded into JSX.
 */
export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const m = useBrandMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={m.stagger(0.09)}
      className={cn(
        "grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-6 lg:grid-cols-12 lg:gap-4",
        "auto-rows-[10.5rem] sm:auto-rows-[12rem] md:auto-rows-[13rem] lg:auto-rows-[14.5rem] xl:auto-rows-[16rem]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
