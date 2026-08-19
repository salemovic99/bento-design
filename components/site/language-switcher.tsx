"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { DIRECTION, LANGUAGES, type Language } from "@/lib/i18n/dictionary";
import { useLanguage } from "@/lib/i18n/language-provider";
import { EASE, useBrandMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Each language named in its own script, which is how a guest recognises the
 * one they want without reading the other. `عربي` rather than the bare letter
 * `ع` the earlier version used: a single disconnected Arabic letter reads as a
 * glyph, not a word, and it sat visually much lighter than the two Latin
 * capitals beside it.
 */
const LABEL: Record<Language, string> = { en: "EN", ar: "عربي" };

/** The accessible name — the full endonym, never the two-letter abbreviation. */
const FULL_NAME: Record<Language, string> = { en: "English", ar: "العربية" };

/**
 * The language control: a segmented pill, both options always visible.
 *
 * Two languages never justify a dropdown, and showing the pair lets a guest see
 * what they are switching *to* before committing — a menu would hide exactly
 * the thing they are looking for. The gold marker is a shared-layout element,
 * so it travels between the two rather than blinking across.
 *
 * Three details that are easy to get wrong here:
 *
 * **Arabic must not be letterspaced.** Arabic is a connected script and
 * `letter-spacing` prises the joins apart, so the brand's wide tracking — and
 * `uppercase`, which is meaningless in a unicase script — are applied to the
 * Latin label only. The Arabic label also asks for `font-arabic` explicitly:
 * while the page is in English the document is LTR and would otherwise set
 * `عربي` in Montserrat, which has no Arabic glyphs and falls back to whatever
 * the OS offers.
 *
 * **The marker's `layoutId` is per-instance.** The header and the footer both
 * render one of these at the same time, and a hard-coded id would make framer
 * treat the two markers as the same element and fly it down the page.
 *
 * **It is a radio group, not two toggles.** Choosing a language is one choice
 * among a set, so the set is what gets announced, arrow keys move through it,
 * and only the selected option is in the tab order.
 */
export function LanguageSwitcher({
  className,
  tone = "onDark",
}: {
  className?: string;
  tone?: "onDark" | "onLight";
}) {
  const { lang, setLang, t } = useLanguage();
  const { reduced } = useBrandMotion();
  const onDark = tone === "onDark";
  const markerId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  /**
   * Arrow keys select as they move, which is the expected behaviour for a radio
   * group. With two options every key lands on the other one regardless, but
   * the direction is resolved properly anyway so this keeps working if a third
   * language is ever added — in Arabic, ArrowRight means *previous*.
   */
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const rtl = DIRECTION[lang] === "rtl";
    let step: number;

    switch (event.key) {
      case "ArrowRight":
        step = rtl ? -1 : 1;
        break;
      case "ArrowLeft":
        step = rtl ? 1 : -1;
        break;
      case "ArrowDown":
        step = 1;
        break;
      case "ArrowUp":
        step = -1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const next = (index + step + LANGUAGES.length) % LANGUAGES.length;
    setLang(LANGUAGES[next]);
    buttons.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={t.a11y.selectLanguage}
      className={cn(
        "relative inline-flex items-center rounded-full border p-1",
        /*
          Translucent rather than solid: in the header this sits over the hero
          photograph, and a blurred ground holds the labels legible over
          whatever the picture is doing without stamping a hard chip onto it.
          Against the footer's flat green it simply disappears into the ground
          and the hairline does the defining, which is the intent there.
        */
        "backdrop-blur-md transition-colors duration-300 ease-[var(--ease-brand)]",
        onDark
          ? "border-gold-600/25 bg-green-900/40"
          : "border-green-600/15 bg-white/55",
        className,
      )}
    >
      {LANGUAGES.map((code, index) => {
        const active = code === lang;
        const latin = DIRECTION[code] === "ltr";

        return (
          <motion.button
            key={code}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="radio"
            lang={code}
            aria-checked={active}
            aria-label={FULL_NAME[code]}
            // Roving tabindex: the group is one tab stop, not one per language.
            tabIndex={active ? 0 : -1}
            onClick={() => setLang(code)}
            onKeyDown={(event) => onKeyDown(event, index)}
            whileTap={reduced ? undefined : { scale: 0.94 }}
            transition={{ duration: 0.18, ease: EASE }}
            className={cn(
              "relative z-10 flex h-8 cursor-pointer items-center justify-center rounded-full px-3.5 leading-none sm:h-9 sm:px-4",
              "transition-colors duration-300 ease-[var(--ease-brand)]",
              active
                ? onDark
                  ? "text-green-900"
                  : "text-cream"
                : onDark
                  ? "text-gold-200/55 hover:text-gold-100"
                  : "text-green-600/60 hover:text-green-700",
            )}
          >
            {active ? (
              <motion.span
                aria-hidden
                layoutId={`language-marker-${markerId}`}
                transition={{ duration: reduced ? 0 : 0.42, ease: EASE }}
                className={cn(
                  "absolute inset-0 -z-10 rounded-full",
                  onDark
                    ? "bg-gold-600 shadow-[0_2px_12px_rgb(187_157_90/0.35)]"
                    : "bg-green-600 shadow-[0_2px_12px_rgb(0_89_79/0.28)]",
                )}
              />
            ) : null}

            <span
              className={cn(
                "relative",
                latin
                  ? /*
                      The trailing letterspace of the last character would push
                      the word off-centre inside the pill; `ps-[0.18em]` gives
                      it back, so `EN` sits optically centred rather than
                      measurably centred.
                    */
                    "text-[0.6875rem] font-medium uppercase tracking-[0.18em] ps-[0.18em]"
                  : // A connected script: no tracking, no case, and a step up in
                    // size so it carries the same weight as the Latin capitals.
                    "font-arabic text-[0.8125rem] font-medium",
              )}
            >
              {LABEL[code]}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
