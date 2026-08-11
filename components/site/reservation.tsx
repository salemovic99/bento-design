"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useBrandMotion, viewportOnce } from "@/lib/motion";
import { ParallaxImage } from "./parallax-image";
import { ReservationForm } from "./reservation-form";

import roomMural from "@/public/brand/room-mural.jpg";

/**
 * The conversion point, staged as a scene rather than a form page: the Mucha
 * mural of the dining room runs full-bleed behind a heavy green scrim, and a
 * single cream panel sits on top of it holding the whole booking.
 */
export function Reservation() {
  const { t, lang } = useLanguage();
  const m = useBrandMotion();

  return (
    <section
      id="reservation"
      className="relative isolate scroll-mt-28 overflow-hidden bg-green-900 py-20 sm:py-28 lg:py-36"
    >
      <ParallaxImage
        src={roomMural}
        alt=""
        sizes="100vw"
        strength={0.16}
        focus="50% 40%"
        className="absolute inset-0 -z-20"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-green-900/88"
      />
      <div
        aria-hidden
        className="e-lattice absolute inset-0 -z-10 opacity-[0.05]"
      />

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={m.softScale}
          className="mx-auto max-w-4xl rounded-[var(--radius-brand)] border border-gold-600/25 bg-cream p-6 shadow-brand-lg sm:p-10 lg:p-14"
        >
          <motion.div
            key={lang}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={m.stagger(0.1)}
          >
            <motion.p variants={m.fadeUp} className="e-eyebrow e-eyebrow-ink">
              {t.reservation.eyebrow}
            </motion.p>
            <h2 className="mt-4">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span variants={m.lineReveal} className="e-h1 block">
                  {t.reservation.headline}
                </motion.span>
              </span>
            </h2>
            <motion.p
              variants={m.fadeUp}
              className="e-body-lg mt-4 max-w-lg text-pretty text-ink-muted"
            >
              {t.reservation.lede}
            </motion.p>
          </motion.div>

          <ReservationForm />
        </motion.div>
      </div>
    </section>
  );
}
