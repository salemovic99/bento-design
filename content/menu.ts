import type { StaticImageData } from "next/image";
import type { Localized } from "@/lib/i18n/dictionary";

import steakMacro from "@/public/brand/steak-macro.jpg";

/* ────────────────────────────────────────────────────────────────────────────
   THE CARD
   Names, descriptions, prices and macros are the house's own, as supplied.
   The Arabic was written here rather than translated word for word, and needs
   the house to verify it before launch — particularly the transliterated cut
   names, which a Saudi steakhouse may set differently.

   PHOTOGRAPHY: there is no per-cut photography in the brand kit. It holds two
   food photographs in total — the sliced-steak macro used below, and the table
   setting the Hero already carries (`real-formula.jpg` is the same frame at a
   larger size, not a second shot). Six cuts between 199 and 650 SAR cannot
   share one image without misrepresenting what arrives, so exactly one item
   carries the photograph and the rest take the monogram tile. When real
   photography lands, setting `image` on each item is the whole change.
   ──────────────────────────────────────────────────────────────────────────── */

export type Macros = {
  /**
   * Per serving. The SFDA requires calories on Saudi menus, so this is a
   * regulatory field, not a decorative one — the protein and fat beside it are
   * the house's own addition.
   */
  calories: number;
  /** Grams. */
  protein: number;
  /** Grams. */
  fat: number;
};

export type MenuItem = {
  id: string;
  name: Localized;
  description: Localized;
  /** SAR. Rendered to two decimals, the way the house writes it. */
  price: number;
  macros: Macros;
  image?: StaticImageData;
  /** `object-position` for the crop. */
  focus?: string;
  /** Leads the list with a full-width photograph. Exactly one item. */
  feature?: boolean;
};

export const menuItems: MenuItem[] = [
  {
    id: "tenderloin-black-angus",
    feature: true,
    image: steakMacro,
    focus: "50% 45%",
    name: {
      en: "Tenderloin Black Angus",
      ar: "تندرلوين بلاك أنجوس",
    },
    description: {
      en: "A premium cut of tenderloin from the Black Angus breed, renowned for producing the finest meats with a distinct flavour and exceptionally smooth texture.",
      ar: "قطعة تندرلوين فاخرة من سلالة بلاك أنجوس، المعروفة بأجود أنواع اللحوم؛ نكهة مميّزة وقوام بالغ النعومة.",
    },
    price: 390,
    macros: { calories: 880, protein: 45, fat: 75 },
  },
  {
    id: "striploin-black-angus",
    name: {
      en: "Striploin Black Angus",
      ar: "ستريبلوين بلاك أنجوس",
    },
    description: {
      en: "A hand-selected Black Angus striploin, offering deep beefy flavour with perfectly balanced tenderness and fat content.",
      ar: "ستريبلوين بلاك أنجوس مُنتقى باليد، بنكهة لحم عميقة وتوازن دقيق بين الطراوة ونسبة الدهن.",
    },
    price: 235,
    macros: { calories: 580, protein: 47, fat: 37 },
  },
  {
    id: "australian-striploin-fillet",
    name: {
      en: "Australian Striploin Fillet",
      ar: "ستريبلوين أسترالي",
    },
    description: {
      en: "A piece from the back with a strong flavour and moderate tenderness, highlighting Australian grazing quality.",
      ar: "قطعة من الظهر بنكهة قوية وطراوة معتدلة، تُبرز جودة المراعي الأسترالية.",
    },
    price: 199,
    macros: { calories: 550, protein: 47, fat: 37 },
  },
  {
    id: "australian-tenderloin",
    name: {
      en: "Australian Tenderloin",
      ar: "تندرلوين أسترالي",
    },
    description: {
      en: "Grass-fed Australian beef known for its extreme tenderness and lean profile, a classic choice for the connoisseur.",
      ar: "لحم أسترالي مُغذّى بالعشب، يشتهر بطراوته الفائقة وقلّة دهنه — خيار كلاسيكي لأصحاب الذوق.",
    },
    price: 295,
    macros: { calories: 620, protein: 48, fat: 44 },
  },
  {
    id: "wagyu-7",
    // The marble score keeps Latin digits in both languages, like every other
    // functional number on the site — prices, times, phone numbers.
    name: { en: "Wagyu Steak 7+", ar: "واغيو 7+" },
    description: {
      en: "Highly marbled Wagyu with a marble score of 7+, providing a rich, buttery texture and intense depth of flavour.",
      ar: "واغيو عالي التعريق بدرجة تعريق 7+، بقوام غنيّ زبديّ وعمق نكهة كثيف.",
    },
    price: 485,
    macros: { calories: 940, protein: 42, fat: 82 },
  },
  {
    id: "wagyu-9",
    name: { en: "Wagyu Steak 9+", ar: "واغيو 9+" },
    description: {
      en: "The ultimate dining experience. Wagyu with an elite marble score of 9+, melting on the palate with unparalleled richness.",
      ar: "قمّة التجربة. واغيو بدرجة تعريق نخبوية 9+، يذوب في الفم بثراء لا يُضاهى.",
    },
    price: 650,
    macros: { calories: 1120, protein: 40, fat: 105 },
  },
];
