"use client";

import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { branches } from "@/content/branches";
import { houseLine, site } from "@/content/site";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useBrandMotion, viewportOnce } from "@/lib/motion";
import { LanguageSwitcher } from "./language-switcher";
import { SocialLinks } from "./social-links";

import logoGold from "@/public/brand/logo-gold.png";
import logoGoldAr from "@/public/brand/logo-gold-ar.png";

/**
 * The last scene. The logo returns at full size, the practical details sit
 * underneath it, and the lattice fades out at the bottom of the page.
 */
export function Footer() {
  const { lang, t, pick } = useLanguage();
  const m = useBrandMotion();
  const logo = lang === "ar" ? logoGoldAr : logoGold;
  const year = new Date().getFullYear();

  return (
    <footer className="on-green relative isolate overflow-hidden bg-green-900 pt-20 sm:pt-28 lg:pt-32">
      <div
        aria-hidden
        className="e-lattice absolute inset-x-0 top-0 -z-10 h-64 opacity-[0.06] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        {/* ── The mark ─────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={m.stagger(0.1)}
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={m.softScale}>
            <Image
              src={logo}
              alt={t.meta.brand}
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 320px, 240px"
              className="h-auto w-[240px] sm:w-[320px] lg:w-[420px]"
            />
          </motion.div>
          <motion.p
            variants={m.fadeUp}
            className="e-numeric mt-6 text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold-600"
          >
            {pick(houseLine)}
          </motion.p>
          <motion.p
            variants={m.fadeUp}
            className="e-body mt-4 max-w-md text-balance text-gold-200/70"
          >
            {t.footer.credit}
          </motion.p>
        </motion.div>

        {/* ── Details ──────────────────────────────────────────────── */}
        <div className="mt-16 grid gap-10 border-t border-gold-600/15 pt-12 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <h2 className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-gold-600">
              {t.footer.contact}
            </h2>
            <ul className="mt-4 space-y-1">
              <li>
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex min-h-11 items-center gap-3 text-sm font-light text-gold-200/80 transition-colors duration-300 hover:text-white"
                >
                  <Phone className="size-4 shrink-0 text-gold-600" aria-hidden />
                  <span className="e-numeric" dir="ltr">
                    {site.phoneDisplay}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-11 items-center gap-3 text-sm font-light text-gold-200/80 transition-colors duration-300 hover:text-white"
                >
                  <Mail className="size-4 shrink-0 text-gold-600" aria-hidden />
                  <span dir="ltr">{site.email}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-gold-600">
              {t.branches.eyebrow}
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2">
              {branches.map((branch) => (
                <li key={branch.id}>
                  <a
                    href={`#branch-${branch.id}`}
                    className="inline-flex min-h-11 items-center gap-3 text-sm font-light text-gold-200/80 transition-colors duration-300 hover:text-white"
                  >
                    <MapPin
                      className="size-4 shrink-0 text-gold-600"
                      aria-hidden
                    />
                    <span>
                      {pick(branch.name)}
                      <span className="text-gold-200/45">
                        {" · "}
                        {pick(branch.city)}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6 lg:items-end">
            <div>
              <h2 className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-gold-600 lg:text-end">
                {t.footer.follow}
              </h2>
              <SocialLinks className="mt-2 -ms-2.5 text-gold-200/70 lg:-me-2.5 lg:ms-0 lg:justify-end" />
            </div>
            <LanguageSwitcher />
          </div>
        </div>

        {/* ── Legal ────────────────────────────────────────────────── */}
        <div className="mt-14 flex flex-col-reverse items-center gap-4 border-t border-gold-600/15 py-8 text-center sm:mt-16 sm:flex-row sm:justify-between sm:text-start">
          <p className="e-numeric text-xs font-light text-gold-200/45">
            © {year} {t.meta.brand}. {t.footer.rights}
          </p>
          <ul className="flex items-center gap-6">
            <li>
              <a
                href={site.legal.privacy}
                className="text-xs font-light text-gold-200/55 transition-colors duration-300 hover:text-gold-200"
              >
                {t.footer.legalPrivacy}
              </a>
            </li>
            <li>
              <a
                href={site.legal.terms}
                className="text-xs font-light text-gold-200/55 transition-colors duration-300 hover:text-gold-200"
              >
                {t.footer.legalTerms}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
