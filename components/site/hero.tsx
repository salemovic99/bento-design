"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-provider";
import { DUR, EASE, useBrandMotion } from "@/lib/motion";

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
        Type at the two edges, photograph in between: the eyebrow sits under
        the header padding at the top, the headline and actions are pushed to
        the foot by `mt-auto`, and everything between them is picture. The
        bottom padding carries the scroll cue beneath the buttons, so it is
        deeper than the visual gap suggests.
      */
      className="on-green relative isolate flex min-h-dvh flex-col overflow-hidden bg-green-900 pb-24 pt-32 sm:pb-28 sm:pt-40 lg:pb-32 lg:pt-48"
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

      {/* ── Eyebrow: the head of the frame ──────────────────────────────── */}
      <motion.div
        style={still ? undefined : { y: copyY, opacity: copyOpacity }}
        className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10"
      >
        <motion.p
          key={lang}
          initial={still ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR, ease: EASE, delay: 0.4 }}
          className="e-eyebrow text-center"
        >
          {t.hero.eyebrow}
        </motion.p>
      </motion.div>

      {/*
        Nothing between here and the foot. The photograph is the reason the
        section exists, and `mt-auto` on the block below hands the whole middle
        of the frame back to it — the type sits at the two edges instead of
        across the picture.
      */}

      {/* ── Headline + actions: the foot of the frame ───────────────────── */}
      <motion.div
        style={still ? undefined : { y: copyY, opacity: copyOpacity }}
        className="mx-auto mt-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10"
      >
        <motion.div
          key={lang}
          initial="hidden"
          animate="visible"
          variants={m.stagger(0.12, 0.55)}
          className="text-center"
        >
          <h1>
            {t.hero.headline.map((line, index) => (
              <span key={index} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  variants={m.lineReveal}
                  /*
                    The size follows the viewport rather than the type scale.
                    A 34-character sentence cannot both wrap and stay on one
                    line, so holding one line means the width dictates the
                    size — `min()` lets it grow with the frame and stop at the
                    top of the display scale. `e-display` still supplies the
                    weight, leading, tracking and colour; only the size is
                    overridden, and utilities outrank components in v4.
                  */
                  className="e-display block whitespace-nowrap text-[min(4.6vw,4.75rem)] text-white"
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
