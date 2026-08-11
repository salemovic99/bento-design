import type { Localized } from "@/lib/i18n/dictionary";

/* ────────────────────────────────────────────────────────────────────────────
   PLACEHOLDER DATA
   Phone numbers, social handles and legal URLs below are plausible stand-ins,
   not verified business details. Replace them with the client's real values
   before launch.
   ──────────────────────────────────────────────────────────────────────────── */

export type SocialKey = "instagram" | "twitter" | "facebook" | "youtube";

export const site = {
  /** E.164 for `tel:` links; `phoneDisplay` is what a human reads. */
  phone: "+966112930000",
  phoneDisplay: "+966 11 293 0000",
  email: "reservations@entrecote.sa",
  socials: [
    { key: "instagram", href: "https://instagram.com/entrecotecafedeparis" },
    { key: "twitter", href: "https://x.com/entrecote_sa" },
    { key: "facebook", href: "https://facebook.com/entrecotecafedeparis" },
    { key: "youtube", href: "https://youtube.com/@entrecotecafedeparis" },
  ] satisfies { key: SocialKey; href: string }[],
  legal: {
    privacy: "/privacy",
    terms: "/terms",
  },
  /** Service window offered in the reservation form. */
  reservationTimes: [
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
  ],
  maxPartySize: 10,
  foundedIn: 1930,
} as const;

/** The line under the logo in the footer. */
export const houseLine: Localized = {
  en: "Chez Boubier · Geneva 1930 · Riyadh today",
  ar: "شيه بوبييه · جنيف ١٩٣٠ · الرياض اليوم",
};
