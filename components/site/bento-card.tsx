"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Dish } from "@/content/dishes";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useBrandMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * One bento tile. A single component drives every tile in the grid — what
 * differs between them is data (`span`, `variant`, `focus`, `sizes`), not
 * markup.
 *
 * Scroll-in: the photograph wipes up out of a 1.06 scale, the copy rises
 * behind it, then the gold rule draws itself.
 * Hover: the photograph pushes to 1.06, the scrim deepens, the copy block
 * lifts, and the arrow badge fades in and travels.
 * All of it is transform and opacity, so a hovered grid never triggers layout.
 *
 * RTL: the badge carries `-scale-x-100`, which mirrors both the arrow glyph
 * and the direction its hover translation travels — one declaration instead of
 * a pair of competing utilities.
 */
export function BentoCard({ dish }: { dish: Dish }) {
  const { pick, t } = useLanguage();
  const m = useBrandMotion();

  const editorial = dish.variant === "editorial";
  const Icon = dish.icon;

  return (
    <motion.article
      variants={m.softScale}
      className={cn(
        "group relative isolate overflow-hidden rounded-[var(--radius-brand)]",
        "border border-gold-600/15 bg-green-800",
        "transition-colors duration-500 ease-[var(--ease-brand)]",
        "hover:border-gold-600/40 focus-within:border-gold-600/40",
        dish.span,
      )}
    >
      {/* ── Photograph ───────────────────────────────────────────────── */}
      <motion.div variants={m.imageReveal} className="absolute inset-0 -z-20">
        <Image
          src={dish.image}
          alt={editorial ? "" : pick(dish.name)}
          fill
          placeholder="blur"
          sizes={dish.sizes}
          style={{ objectPosition: dish.focus }}
          className={cn(
            "object-cover transition-transform duration-[900ms] ease-[var(--ease-brand)]",
            "motion-safe:group-hover:scale-[1.06]",
            editorial && "opacity-30 saturate-50",
          )}
        />
      </motion.div>

      {/* ── Scrim: keeps the copy past 4.5:1 over any photograph ──────── */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 transition-opacity duration-500 ease-[var(--ease-brand)]",
          editorial
            ? "bg-green-900/80"
            : "bg-linear-to-t from-green-900/94 via-green-900/50 to-green-900/10 group-hover:from-green-900/97",
        )}
      />
      {editorial ? (
        <div
          aria-hidden
          className="e-lattice absolute inset-0 -z-10 opacity-[0.07]"
        />
      ) : null}

      {/* ── Tag + price ──────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3.5 sm:p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-600/30 bg-green-900/50 px-2.5 py-1.5 text-[0.5625rem] font-medium uppercase tracking-[0.16em] text-gold-200 backdrop-blur-[2px] sm:gap-2 sm:px-3 sm:text-[0.625rem]">
          <Icon className="size-3 shrink-0 text-gold-600" aria-hidden />
          {pick(dish.tag)}
        </span>
        {dish.price !== null ? (
          <span className="e-numeric shrink-0 pt-1 text-[0.6875rem] font-medium tracking-[0.08em] text-gold-200/85 sm:text-xs">
            {dish.price}
            <span className="ms-1 text-gold-600/80">{t.dishes.priceLabel}</span>
          </span>
        ) : null}
      </div>

      {/* ── Copy ─────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col p-3.5 sm:p-5 lg:p-6",
          "transition-transform duration-500 ease-[var(--ease-brand)] motion-safe:group-hover:-translate-y-1.5",
        )}
      >
        <motion.span
          variants={m.ruleDraw}
          className="mb-2.5 block h-px w-9 origin-left bg-gold-600 sm:mb-3 sm:w-10 rtl:origin-right"
        />
        <p className="text-[0.5625rem] font-medium uppercase tracking-[0.18em] text-gold-600 sm:text-[0.6875rem] sm:tracking-[0.2em]">
          {pick(dish.kicker)}
        </p>
        <h3
          className={cn(
            "mt-1.5 font-medium leading-[1.08] tracking-[var(--track-tight)] text-white",
            editorial
              ? "text-[clamp(1.375rem,3.4vw,2.5rem)]"
              : "text-[clamp(1rem,1.9vw,1.75rem)]",
          )}
        >
          {pick(dish.name)}
        </h3>
        <p
          className={cn(
            "mt-2 max-w-[46ch] text-[0.8125rem] font-light leading-[1.55] text-gold-200/80 sm:text-sm",
            // Short tiles can only carry a line or two before the copy would
            // collide with the tag row.
            dish.compact
              ? "line-clamp-2 max-sm:hidden"
              : "line-clamp-3 sm:line-clamp-none",
          )}
        >
          {pick(dish.description)}
        </p>
      </div>

      {/* ── Corner arrow ─────────────────────────────────────────────── */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute end-3.5 bottom-3.5 grid size-9 place-items-center rounded-full sm:end-5 sm:bottom-5",
          "border border-gold-600/30 bg-green-900/40 text-gold-200 backdrop-blur-[2px]",
          "translate-y-1.5 opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-brand)]",
          "group-hover:translate-y-0 group-hover:opacity-100",
          "max-sm:hidden rtl:-scale-x-100",
        )}
      >
        <ArrowUpRight className="size-4" />
      </span>
    </motion.article>
  );
}
