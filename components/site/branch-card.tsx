"use client";

import Image from "next/image";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { mapsUrl, type Branch } from "@/content/branches";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useBrandMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A branch tile. Photograph as ground, details stacked over a scrim, and one
 * real action — open directions. The number is deliberately absent: every
 * branch answers on the same 920 line, which the header, footer and floating
 * discs already carry. Hovering the card lights its pin on the map tile and
 * vice versa, which is what turns a grid of four cards into a single location
 * section.
 */
export function BranchCard({
  branch,
  active,
  onHover,
}: {
  branch: Branch;
  active: boolean;
  onHover: (id: string | null) => void;
}) {
  const { t, pick } = useLanguage();
  const m = useBrandMotion();

  return (
    <motion.article
      id={`branch-${branch.id}`}
      variants={m.softScale}
      onMouseEnter={() => onHover(branch.id)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "group relative isolate flex scroll-mt-28 flex-col justify-end overflow-hidden rounded-[var(--radius-brand)]",
        "border bg-green-800 transition-[border-color,box-shadow] duration-500 ease-[var(--ease-brand)]",
        active
          ? "border-gold-600/55 shadow-brand-gold"
          : "border-green-600/15 shadow-brand-md",
        branch.span,
      )}
    >
      <motion.div variants={m.imageReveal} className="absolute inset-0 -z-20">
        <Image
          src={branch.image}
          alt=""
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
          style={{ objectPosition: branch.focus }}
          className={cn(
            "object-cover transition-transform duration-[900ms] ease-[var(--ease-brand)]",
            "motion-safe:group-hover:scale-[1.05]",
            active && "motion-safe:scale-[1.05]",
          )}
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-green-900/96 via-green-900/62 to-green-900/15 transition-opacity duration-500"
      />

      {/* City chip */}
      <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-gold-600/30 bg-green-900/50 px-3 py-1.5 text-[0.5625rem] font-medium uppercase tracking-[0.16em] text-gold-200 backdrop-blur-[2px] sm:start-5 sm:top-5 sm:text-[0.625rem]">
        <MapPin className="size-3 shrink-0 text-gold-600" aria-hidden />
        {pick(branch.city)}
      </span>

      <div className="relative flex flex-col gap-4 p-4 sm:p-5 lg:p-6">
        <div className="transition-transform duration-500 ease-[var(--ease-brand)] motion-safe:group-hover:-translate-y-1">
          <p className="text-[0.5625rem] font-medium uppercase tracking-[0.18em] text-gold-600 sm:text-[0.6875rem] sm:tracking-[0.2em]">
            {pick(branch.district)}
          </p>
          <h3 className="mt-1.5 text-[clamp(1.25rem,2.2vw,1.875rem)] font-bold leading-[1.06] tracking-[var(--track-tight)] text-white">
            {pick(branch.name)}
          </h3>
          <p className="mt-2 max-w-[42ch] text-[0.8125rem] font-light leading-[1.5] text-gold-200/75">
            {pick(branch.address)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-gold-600/15 pt-4">
          <p className="inline-flex items-center gap-2 text-[0.75rem] font-light text-gold-200/80">
            <Clock className="size-3.5 shrink-0 text-gold-600" aria-hidden />
            <span className="sr-only">{t.branches.hours}: </span>
            <span className="e-numeric">{pick(branch.hours)}</span>
          </p>

          <a
            href={mapsUrl(branch)}
            target="_blank"
            rel="noreferrer noopener"
            className="group/link ms-auto inline-flex min-h-11 items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-gold-600 transition-colors duration-300 hover:text-gold-300"
          >
            {t.branches.directions}
            <span aria-hidden className="rtl:-scale-x-100">
              <ArrowUpRight className="size-4 transition-transform duration-300 ease-[var(--ease-brand)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </span>
            <span className="sr-only">— {t.a11y.openInMaps}</span>
          </a>
        </div>
      </div>
    </motion.article>
  );
}
