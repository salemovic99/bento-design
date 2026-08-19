"use client";

import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/content/menu";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useBrandMotion, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Reveal } from "../reveal";
import { SectionHeading } from "../section-heading";
import { MENU_INTRO } from "./menu-timeline";
import { MenuDishCard } from "./menu-dish-card";

/**
 * The card itself — the thing the film was introducing.
 *
 * Six cuts, one list, no categories: the house serves one formula and a choice
 * of cut, so a tab rail would be four labels invented to organise a list that
 * is already short enough to read straight down.
 *
 * It takes an optional `progress`, and that optionality is the interesting
 * part. Inside the cinematic stage this block is pulled up a full viewport and
 * sits *behind* the still-opaque film long before it is visible, so a normal
 * `whileInView` reveal would play out entirely unseen and the guest would find
 * the heading already there. With `progress` it is driven off the section's
 * scroll instead, rising exactly as the film dissolves. Without it — the
 * reduced-motion path — it falls back to `SectionHeading` and `Reveal` like
 * every other section on the page.
 */
export function MenuList({
  progress,
  className,
}: {
  progress?: MotionValue<number>;
  className?: string;
}) {
  const { t, lang } = useLanguage();
  const m = useBrandMotion();

  // A constant stand-in so the hooks below run unconditionally in both paths.
  const settled = useMotionValue(1);
  const source = progress ?? settled;
  const introOpacity = useTransform(
    source,
    [MENU_INTRO.start, MENU_INTRO.end],
    [0, 1],
  );
  const introY = useTransform(
    source,
    [MENU_INTRO.start, MENU_INTRO.end],
    [40, 0],
  );

  return (
    <div
      className={cn(
        "mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 sm:pb-28 lg:px-10 lg:pb-36",
        className,
      )}
    >
      {/* ── Heading ──────────────────────────────────────────────────────── */}
      {progress ? (
        <motion.div
          key={lang}
          style={m.reduced ? undefined : { opacity: introOpacity, y: introY }}
          className="max-w-2xl"
        >
          <p className="e-eyebrow">{t.menu.eyebrow}</p>
          <h2 className="mt-4 sm:mt-5">
            {t.menu.headline.map((line, index) => (
              <span
                key={index}
                className="block text-[clamp(1.875rem,4.4vw,3.25rem)] font-bold leading-[1.05] tracking-[var(--track-tight)] text-white"
              >
                {line}
              </span>
            ))}
          </h2>
          <p className="e-body-lg mt-5 text-pretty text-gold-200/80 sm:mt-6">
            {t.menu.lede}
          </p>
        </motion.div>
      ) : (
        <SectionHeading
          eyebrow={t.menu.eyebrow}
          lines={t.menu.headline}
          lede={t.menu.lede}
        />
      )}

      {/* ── The cuts ─────────────────────────────────────────────────────── */}
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={m.stagger(0.07)}
        className="mt-12 divide-y divide-gold-600/12 border-b border-gold-600/12 sm:mt-16 lg:mt-20"
      >
        {menuItems.map((item) => (
          <MenuDishCard key={item.id} item={item} />
        ))}
      </motion.ul>

      {/* ── Footnote + the one action ────────────────────────────────────── */}
      <Reveal className="mt-10 flex flex-col items-center gap-8 sm:mt-14">
        <p className="e-caption text-center text-gold-200/45">{t.menu.note}</p>
        <Button asChild variant="outline" size="lg">
          <a href="#reservation">
            {t.menu.cta}
            <ArrowUpRight className="rtl:-scale-x-100" />
          </a>
        </Button>
      </Reveal>
    </div>
  );
}
