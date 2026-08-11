"use client";

import { motion } from "framer-motion";
import { LANGUAGES, type Language } from "@/lib/i18n/dictionary";
import { useLanguage } from "@/lib/i18n/language-provider";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const NATIVE_NAME: Record<Language, string> = { en: "EN", ar: "ع" };
const FULL_NAME: Record<Language, string> = { en: "English", ar: "العربية" };

/**
 * `EN · ع` rather than a dropdown — two languages never justify a menu, and a
 * visible pair lets the user see the other option before committing.
 * The gold pill is a shared `layoutId`, so it slides between the two.
 */
export function LanguageSwitcher({
  className,
  tone = "onDark",
}: {
  className?: string;
  tone?: "onDark" | "onLight";
}) {
  const { lang, setLang, t } = useLanguage();
  const onDark = tone === "onDark";

  return (
    <div
      role="group"
      aria-label={t.a11y.selectLanguage}
      className={cn(
        "relative inline-flex items-center rounded-full border p-0.5",
        onDark ? "border-gold-600/30" : "border-green-600/20",
        className,
      )}
    >
      {LANGUAGES.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => setLang(code)}
            aria-pressed={active}
            aria-label={FULL_NAME[code]}
            className={cn(
              "relative z-10 cursor-pointer rounded-full px-3.5 py-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300 ease-[var(--ease-brand)]",
              active
                ? onDark
                  ? "text-green-900"
                  : "text-cream"
                : onDark
                  ? "text-gold-200/60 hover:text-gold-200"
                  : "text-green-600/55 hover:text-green-600",
            )}
          >
            {active ? (
              <motion.span
                layoutId="language-pill"
                transition={{ duration: 0.35, ease: EASE }}
                className={cn(
                  "absolute inset-0 -z-10 rounded-full",
                  onDark ? "bg-gold-600" : "bg-green-600",
                )}
              />
            ) : null}
            <span className="relative">{NATIVE_NAME[code]}</span>
          </button>
        );
      })}
    </div>
  );
}
