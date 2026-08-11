"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { branches } from "@/content/branches";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useBrandMotion, viewportOnce } from "@/lib/motion";
import { BranchCard } from "./branch-card";
import { BranchMap } from "./branch-map";
import { SectionHeading } from "./section-heading";

/**
 * Locations, as a bento rather than a list: the drawn map holds the left two
 * rows, two branches stack beside it, and the remaining pair runs across the
 * bottom. Hover is shared state — a card and its pin light together.
 *
 * This is the one light section on the page. The cream ground is the brand's
 * warm secondary surface, and it gives the scroll somewhere to breathe between
 * two dark halves.
 */
export function Branches() {
  const { t } = useLanguage();
  const m = useBrandMotion();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section
      id="branches"
      className="relative isolate scroll-mt-28 bg-cream pb-20 pt-4 sm:pb-28 lg:pb-36"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow={t.branches.eyebrow}
          lines={t.branches.headline}
          lede={t.branches.lede}
          tone="onLight"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={m.stagger(0.09)}
          className={
            "mt-12 grid grid-cols-2 gap-2.5 sm:mt-16 sm:gap-3 md:grid-cols-6 lg:mt-20 lg:grid-cols-12 lg:gap-4 " +
            // Branch cards carry six lines of real detail plus three 44px
            // actions. `minmax` keeps the rhythm of a fixed row height but lets
            // a row grow rather than clipping when the meta line wraps.
            "auto-rows-[minmax(15rem,auto)] sm:auto-rows-[minmax(16rem,auto)] lg:auto-rows-[minmax(17rem,auto)]"
          }
        >
          <BranchMap
            activeId={activeId}
            onHover={setActiveId}
            className="col-span-2 row-span-1 md:col-span-6 md:row-span-1 lg:col-span-7 lg:row-span-2"
          />

          {branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              active={activeId === branch.id}
              onHover={setActiveId}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
