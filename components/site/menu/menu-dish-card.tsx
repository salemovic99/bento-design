"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { MenuItem } from "@/content/menu";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useBrandMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

import symbolGold from "@/public/brand/symbol-gold.png";

/**
 * One line of the menu — a row, not a product tile.
 *
 * The distinction is the whole brief: a card with a border, a shadow and a
 * button reads as an e-commerce grid; a name, a line of prose and a price on a
 * ruled line reads as a menu. So there is no card here at all. The rows are
 * separated by hairlines drawn by the list, and the only enclosed shapes are
 * the photographs.
 *
 * The `feature` item leads with a wide photograph above the row. Exactly one,
 * because the brand kit holds exactly one usable steak photograph — see the
 * note at the top of `content/menu.ts`. The rest take the monogram tile.
 *
 * RTL: the grid mirrors itself. Every offset is logical (`ms-*`, `text-end`)
 * and the rule uses `origin-left rtl:origin-right`, so nothing is positioned
 * by hand for Arabic.
 */
export function MenuDishCard({ item }: { item: MenuItem }) {
  const { pick, t } = useLanguage();
  const m = useBrandMotion();

  const name = pick(item.name);

  return (
    <motion.li variants={m.fadeUp} className="group/row py-7 sm:py-9">
      {item.feature && item.image ? (
        <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-[var(--radius-brand)] sm:mb-8 sm:aspect-[21/9]">
          <Image
            src={item.image}
            alt={name}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 62vw, 100vw"
            style={{ objectPosition: item.focus }}
            className="object-cover transition-transform duration-[900ms] ease-[var(--ease-brand)] motion-safe:group-hover/row:scale-[1.03]"
          />
          {/* Just enough to sit the photograph on the ground rather than cut it out of it. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-green-900/55 via-transparent to-transparent"
          />
        </div>
      ) : null}

      <div className="grid grid-cols-[1fr_auto] items-start gap-x-5 gap-y-3 sm:grid-cols-[auto_1fr_auto] sm:gap-x-6">
        {/* ── Thumbnail, or the house monogram where there is no photograph ── */}
        {!item.feature ? (
          <div className="col-start-1 row-start-1 hidden size-20 shrink-0 overflow-hidden rounded-[var(--radius-brand-sm)] sm:block lg:size-24">
            {item.image ? (
              <Image
                src={item.image}
                alt=""
                width={96}
                height={96}
                placeholder="blur"
                sizes="96px"
                style={{ objectPosition: item.focus }}
                className="size-full object-cover"
              />
            ) : (
              <span className="grid size-full place-items-center border border-gold-600/20 bg-green-800/60">
                <Image
                  src={symbolGold}
                  alt=""
                  sizes="28px"
                  className="h-7 w-auto opacity-35"
                />
              </span>
            )}
          </div>
        ) : null}

        {/* ── The line itself ──────────────────────────────────────────── */}
        <div className={cn("min-w-0", item.feature && "sm:col-span-2")}>
          <h4
            className={cn(
              "font-medium leading-[1.15] tracking-[var(--track-tight)] text-white",
              item.feature
                ? "text-[clamp(1.25rem,2.4vw,1.875rem)]"
                : "text-[clamp(1.0625rem,1.4vw,1.3125rem)]",
            )}
          >
            {name}
          </h4>

          <p className="mt-2 max-w-[58ch] text-[0.875rem] font-light leading-[1.6] text-gold-200/75 sm:text-[0.9375rem]">
            {pick(item.description)}
          </p>

          {/*
            Calories are a legal requirement on a Saudi menu, not a flourish,
            so they are set as data rather than as a caption: a dotted rule,
            tabular figures, and `w-fit` so the rule measures the numbers
            instead of running the width of the column.

            The slashes are punctuation and are hidden from assistive tech —
            "45 g slash" three times per cut is noise, and the labels already
            say what each number is.
          */}
          <ul className="e-numeric mt-4 flex w-fit items-center gap-3 border-t border-dotted border-gold-600/25 pt-3 text-[0.625rem] font-medium uppercase tracking-[0.16em] text-gold-200/55 sm:gap-4">
            <li>
              {item.macros.calories} {t.menu.macros.calories}
            </li>
            <li aria-hidden className="opacity-30">
              /
            </li>
            <li>
              {t.menu.macros.protein} {item.macros.protein}
              {t.menu.macros.gram}
            </li>
            <li aria-hidden className="opacity-30">
              /
            </li>
            <li>
              {t.menu.macros.fat} {item.macros.fat}
              {t.menu.macros.gram}
            </li>
          </ul>
        </div>

        {/* ── Price ────────────────────────────────────────────────────── */}
        <p className="col-start-2 row-start-1 shrink-0 pt-0.5 text-end sm:col-start-3">
          {/* Two decimals, as the house writes its prices. */}
          <span className="e-numeric text-[0.9375rem] font-medium tracking-[0.06em] text-gold-200 sm:text-base">
            {item.price.toFixed(2)}
            <span className="ms-1.5 text-[0.75em] text-gold-600/85">
              {t.dishes.priceLabel}
            </span>
          </span>
        </p>
      </div>
    </motion.li>
  );
}
