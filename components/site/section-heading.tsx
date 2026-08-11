"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useBrandMotion, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Eyebrow → headline → lede, with the headline set line by line so each one
 * wipes up from behind its own baseline. Shared by every section so the
 * editorial rhythm is identical throughout the page.
 *
 * Keyed on `lang`, which replays the reveal when the language flips — the
 * switch reads as a deliberate cut rather than a text swap.
 */
export function SectionHeading({
  eyebrow,
  lines,
  lede,
  tone = "onDark",
  align = "start",
  className,
}: {
  eyebrow: string;
  lines: readonly string[];
  lede?: string;
  tone?: "onDark" | "onLight";
  align?: "start" | "center";
  className?: string;
}) {
  const { lang } = useLanguage();
  const m = useBrandMotion();
  const onDark = tone === "onDark";

  return (
    <motion.div
      key={lang}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={m.stagger(0.1)}
      className={cn(
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className,
      )}
    >
      <motion.p
        variants={m.fadeUp}
        className={cn("e-eyebrow", !onDark && "e-eyebrow-ink")}
      >
        {eyebrow}
      </motion.p>

      <h2 className="mt-4 sm:mt-5">
        {lines.map((line, index) => (
          <span key={index} className="block overflow-hidden pb-[0.06em]">
            <motion.span
              variants={m.lineReveal}
              className={cn(
                "block text-[clamp(1.875rem,4.4vw,3.25rem)] font-bold leading-[1.05] tracking-[var(--track-tight)]",
                onDark ? "text-white" : "text-green-600",
              )}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h2>

      {lede ? (
        <motion.p
          variants={m.fadeUp}
          className={cn(
            "e-body-lg mt-5 text-pretty sm:mt-6",
            onDark ? "text-gold-200/80" : "text-ink-muted",
            align === "center" && "mx-auto",
          )}
        >
          {lede}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
