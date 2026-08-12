import type { Localized } from "@/lib/i18n/dictionary";

/* ────────────────────────────────────────────────────────────────────────────
   PLACEHOLDER DATA
   The phone number is the house's real unified line. Social handles and legal
   URLs below are still plausible stand-ins, not verified business details —
   replace them with the client's real values before launch.
   ──────────────────────────────────────────────────────────────────────────── */

export type SocialKey = "instagram" | "twitter" | "facebook" | "youtube";

export const site = {
  /**
   * The unified 920 line — one number for every branch. It is a national
   * short code, so it carries no country code: `tel:920018998` is what a
   * Saudi handset dials, and `+966 920018998` is not a number it can reach.
   */
  phone: "920018998",
  phoneDisplay: "920018998",
  /**
   * WhatsApp needs a full international number; a 920 code cannot receive on
   * it. Null until the house gives us the mobile line — `FloatingActions`
   * drops the WhatsApp disc rather than shipping a dead `wa.me` link.
   */
  whatsapp: null as string | null,
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
