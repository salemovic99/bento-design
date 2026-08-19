"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-provider";
import { EASE, useBrandMotion } from "@/lib/motion";

import heroImage from "@/public/brand/hero-formula.jpg";

/**
 * The opening shot. One photograph, one sentence, one action.
 *
 * On load the sequence is: image wipes up and settles out of a slow Ken Burns
 * → eyebrow → headline, line by line → lede → CTAs → scroll cue. On scroll the
 * photograph drifts and dims while the copy lifts away, so the hero hands off
 * to the bento grid instead of just ending.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const { lang, t } = useLanguage();
  const m = useBrandMotion();

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });

  // Scroll-linked departure — transforms and opacity only.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  // A second, solid layer that fades *in* on the way out — the base scrim is
  // already at full opacity, so dimming has to come from something new.
  const dimOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.55]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const still = m.reduced;

  return (
    <section
      ref={section}
      /*
        Centred rather than bottom-aligned. The padding stays asymmetric — the
        fixed header occupies the top of the frame, so an evenly padded box
        would read as sitting high; this lands the copy on the optical centre.
      */
      className="on-green relative isolate flex min-h-dvh flex-col justify-center overflow-hidden bg-green-900 pb-14 pt-32 sm:pb-20 sm:pt-40 lg:pb-24 lg:pt-48"
    >
      {/* ── The photograph ─────────────────────────────────────────────── */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={still ? undefined : { y: imageY, scale: imageScale }}
        initial={still ? false : { scale: 1.14, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-[50%_42%]"
        />
      </motion.div>

      {/* ── Scrim: dark enough that the display type clears 4.5:1 ──────── */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-green-900/85 via-green-900/45 to-green-900/95"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-green-900 via-transparent to-transparent"
      />
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 bg-green-900"
        style={still ? { opacity: 0 } : { opacity: dimOpacity }}
      />

      {/* ── Copy ───────────────────────────────────────────────────────── */}
      <motion.div
        style={still ? undefined : { y: copyY, opacity: copyOpacity }}
        className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10"
      >
        <motion.div
          key={lang}
          initial="hidden"
          animate="visible"
          variants={m.stagger(0.12, 0.5)}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.p variants={m.fadeUp} className="e-eyebrow">
            {t.hero.eyebrow}
          </motion.p>

          <h1 className="mt-5 sm:mt-7">
            {t.hero.headline.map((line, index) => (
              <span key={index} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  variants={m.lineReveal}
                  className="e-display block text-balance text-white"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            variants={m.fadeUp}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:mt-11 sm:gap-4"
          >
            <Button asChild variant="gold" size="lg">
              <a href="#reservation">
                {t.hero.primaryCta}
                <ArrowUpRight className="rtl:-scale-x-100" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#dishes">{t.hero.secondaryCta}</a>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Scroll cue ─────────────────────────────────────────────────── */}
      <motion.div
        aria-hidden
        style={still ? undefined : { opacity: cueOpacity }}
        initial={still ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 1.5 }}
        className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center sm:bottom-7"
      >
        <span className="flex items-center gap-2 text-[0.625rem] font-medium uppercase tracking-[0.24em] text-gold-200/55">
          {t.hero.scroll}
          <motion.span
            animate={still ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
            className="inline-flex"
          >
            <ArrowDown className="size-3.5" />
          </motion.span>
        </span>
      </motion.div>
    </section>
  );
}
