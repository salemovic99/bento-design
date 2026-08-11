"use client";

import Image from "next/image";
import { Phone } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { site } from "@/content/site";
import { useLanguage } from "@/lib/i18n/language-provider";
import { EASE, useBrandMotion } from "@/lib/motion";
import { LanguageSwitcher } from "./language-switcher";
import { SocialLinks } from "./social-links";

import logoGold from "@/public/brand/logo-gold.png";
import logoGoldAr from "@/public/brand/logo-gold-ar.png";

/** Scroll distance over which the header condenses. */
const CONDENSE = 140;
/** How much of its height the green bar keeps once condensed. */
const CONDENSED_GROUND = 0.73;

/**
 * Fixed, logo-led header. There is no navigation menu by design — the page is
 * one continuous story, and the only decisions on offer are "call", "switch
 * language" and "reserve".
 *
 * Everything in the condense-on-scroll is `scale`, `opacity` or
 * `backdrop-filter`. The header's own box height never changes, so no frame of
 * the scroll costs a layout pass:
 *
 *   logo scales 1.5 → 1     (transform, origin top)
 *   green ground scaleY 1 → 0.73, with the hairline counter-scaled to stay 1px
 *   ground opacity 0 → 0.94 and blur 0 → 14px
 *   side rails drift up to stay optically centred in the shorter bar
 */
export function Header() {
  const { lang, t } = useLanguage();
  const { reduced } = useBrandMotion();
  const { scrollY } = useScroll();

  const range = [0, CONDENSE];

  const logoScale = useTransform(scrollY, range, [1.5, 1]);
  const groundScaleY = useTransform(scrollY, range, [1, CONDENSED_GROUND]);
  const hairlineScaleY = useTransform(groundScaleY, (v) => 1 / v);
  const groundOpacity = useTransform(scrollY, range, [0, 0.94]);
  const blur = useTransform(scrollY, range, [0, 14]);
  const backdropFilter = useMotionTemplate`blur(${blur}px)`;
  const lineOpacity = useTransform(scrollY, range, [0, 1]);
  const railY = useTransform(scrollY, range, [0, -11]);

  const logo = lang === "ar" ? logoGoldAr : logoGold;

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
    >
      {/* ── Ground ─────────────────────────────────────────────────────── */}
      <motion.div
        aria-hidden
        style={
          reduced
            ? { opacity: 0.94 }
            : {
                opacity: groundOpacity,
                scaleY: groundScaleY,
                backdropFilter,
                WebkitBackdropFilter: backdropFilter,
              }
        }
        className="absolute inset-0 origin-top bg-green-900/95"
      >
        <motion.div
          style={reduced ? undefined : { scaleY: hairlineScaleY, opacity: lineOpacity }}
          className="absolute inset-x-0 bottom-0 h-px origin-bottom bg-linear-to-r from-transparent via-gold-600/50 to-transparent"
        />
      </motion.div>

      <div className="pointer-events-auto relative mx-auto flex h-16 max-w-[1600px] items-start justify-between px-4 sm:h-21 sm:px-6 lg:h-26 lg:px-10">
        {/* ── Left rail: contact + social. Desktop only. ──────────────── */}
        <motion.div
          style={reduced ? undefined : { y: railY }}
          className="hidden h-16 items-center gap-2 text-gold-200 sm:h-21 lg:flex lg:h-26"
        >
          <a
            href={`tel:${site.phone}`}
            className="group inline-flex h-11 items-center gap-2.5 rounded-full pe-2 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-gold-200/70 transition-colors duration-300 hover:text-white"
          >
            <Phone className="size-4 transition-transform duration-300 ease-[var(--ease-brand)] group-hover:-rotate-12" />
            <span className="e-numeric" dir="ltr">
              {site.phoneDisplay}
            </span>
          </a>
          <span aria-hidden className="h-4 w-px bg-gold-600/25" />
          <SocialLinks size="sm" className="text-gold-200/70" />
        </motion.div>

        {/*
          The logo is centred by an overlay rather than by the flex row, so it
          stays optically centred in the viewport in both LTR and RTL and never
          gets pushed off-centre by rails of different widths.
        */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
          <motion.a
            href="#top"
            aria-label={t.a11y.logo}
            style={reduced ? undefined : { scale: logoScale }}
            className="pointer-events-auto mt-2.5 origin-top sm:mt-3.5 lg:mt-4.5"
          >
            <Image
              src={logo}
              alt={t.meta.brand}
              priority
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 240px, 160px"
              className="h-[26px] w-auto sm:h-[38px] lg:h-[52px]"
            />
          </motion.a>
        </div>

        {/* ── Right rail: language ────────────────────────────────────── */}
        <motion.div
          style={reduced ? undefined : { y: railY }}
          className="ms-auto flex h-16 items-center sm:h-21 lg:h-26"
        >
          <LanguageSwitcher />
        </motion.div>
      </div>
    </motion.header>
  );
}
