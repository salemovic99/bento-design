"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { branches } from "@/content/branches";
import { useLanguage } from "@/lib/i18n/language-provider";
import { EASE, useBrandMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The map tile.
 *
 * There is no Maps API key in this project, and an embedded Google iframe
 * would drag a third-party script, its own typography and a grey basemap into
 * the middle of the composition. Instead this is a drawn map: the gold lattice
 * as ground, a stylised Arabian-peninsula outline, and one pin per branch that
 * lights up in sync with the branch card being hovered.
 *
 * Pin coordinates come from `content/branches.ts` (`pin`), so the tile stays
 * data-driven alongside everything else.
 */
export function BranchMap({
  activeId,
  onHover,
  className,
}: {
  activeId: string | null;
  onHover: (id: string | null) => void;
  className?: string;
}) {
  const { t, pick } = useLanguage();
  const m = useBrandMotion();

  return (
    <motion.div
      variants={m.softScale}
      className={cn(
        "group relative isolate overflow-hidden rounded-[var(--radius-brand)] border border-green-600/15 bg-green-600",
        className,
      )}
    >
      <div aria-hidden className="e-lattice absolute inset-0 opacity-[0.09]" />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-br from-green-600 via-green-700/85 to-green-900"
      />

      {/* Stylised outline — decorative, deliberately not a survey map. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full opacity-[0.28]"
      >
        <path
          d="M9 21 L23 12 L41 10 L58 15 L69 12 L79 20 L84 33 L80 47 L86 58 L82 71 L69 82 L52 88 L36 84 L24 73 L14 58 L8 41 Z"
          fill="none"
          stroke="var(--color-gold-600)"
          strokeWidth="0.35"
          strokeLinejoin="round"
        />
        <path
          d="M30 30 L70 30 M22 50 L84 50 M30 70 L74 70 M35 12 L35 86 M62 10 L62 88"
          stroke="var(--color-gold-600)"
          strokeWidth="0.15"
          strokeDasharray="1.5 2.5"
          opacity="0.5"
        />
      </svg>

      {/* ── Pins ─────────────────────────────────────────────────────── */}
      <ul className="absolute inset-0">
        {branches.map((branch, index) => {
          const active = activeId === branch.id;
          return (
            <li
              key={branch.id}
              className="absolute"
              style={{ left: `${branch.pin.x}%`, top: `${branch.pin.y}%` }}
            >
              <motion.button
                type="button"
                onMouseEnter={() => onHover(branch.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(branch.id)}
                onBlur={() => onHover(null)}
                onClick={() =>
                  document
                    .getElementById(`branch-${branch.id}`)
                    ?.scrollIntoView({ block: "center" })
                }
                initial={m.reduced ? false : { opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  ease: EASE,
                  delay: 0.35 + index * 0.1,
                }}
                aria-label={`${pick(branch.name)} — ${pick(branch.city)}`}
                className="grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full"
              >
                {/* Halo — scales, so it costs nothing to animate. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute size-8 rounded-full bg-gold-600/20 transition-transform duration-500 ease-[var(--ease-brand)]",
                    active ? "scale-125" : "scale-75",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "relative grid size-7 place-items-center rounded-full border transition-[background-color,border-color,transform] duration-400 ease-[var(--ease-brand)]",
                    active
                      ? "-translate-y-0.5 border-gold-600 bg-gold-600 text-green-900"
                      : "border-gold-600/50 bg-green-900/70 text-gold-200",
                  )}
                >
                  <MapPin className="size-3.5" />
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>

      {/*
        Caption scrim. Satin gold only clears 3.2:1 on the mid-green of this
        gradient, so the caption gets its own deep ground to sit on.
      */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-green-900 via-green-900/80 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 lg:p-7">
        <div>
          <p className="e-eyebrow">{t.branches.mapSubtitle}</p>
          <p className="mt-1.5 text-[clamp(1.125rem,1.8vw,1.5rem)] font-medium leading-tight tracking-[var(--track-tight)] text-white">
            {t.branches.mapTitle}
          </p>
        </div>
        <p className="e-numeric shrink-0 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-gold-200/70">
          {branches.length} {t.branches.branchCount}
        </p>
      </div>
    </motion.div>
  );
}
