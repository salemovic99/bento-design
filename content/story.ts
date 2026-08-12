import type { StaticImageData } from "next/image";
import type { Localized } from "@/lib/i18n/dictionary";

import brandMural from "@/public/brand/brand-mural.jpg";
import roomSconces from "@/public/brand/room-sconces.jpg";

/* ────────────────────────────────────────────────────────────────────────────
   PLACEHOLDER DATA
   Only "1930" and "Geneva" are treated as fact here — both already appear
   elsewhere on the site. Every other beat is written to the spirit of the house
   rather than to a verified record: no succession dates, no opening years, no
   named people. Have the client verify and replace this copy before launch.
   ──────────────────────────────────────────────────────────────────────────── */

export type Milestone = {
  id: string;
  /**
   * The rail label. Deliberately an editorial anchor and not a `year` field —
   * we have no verified dates beyond 1930, so the middle beats are named rather
   * than dated. Localized because Arabic editorial copy sets Arabic-Indic
   * digits (`١٩٣٠`), per the numeral split documented in the README.
   */
  anchor: Localized;
  title: Localized;
  body: Localized;
  /**
   * Two of the four beats carry a photograph and two stand as text alone, so
   * the rail keeps a rhythm instead of reading as a picture list.
   */
  image?: StaticImageData;
  /** `object-position` for the crop, as in `content/dishes.ts`. */
  focus?: string;
};

export const milestones: Milestone[] = [
  {
    id: "geneva",
    anchor: { en: "1930", ar: "١٩٣٠" },
    title: { en: "Geneva", ar: "جنيف" },
    body: {
      en: "A corner room opens with a menu of one dish. No choosing, no ordering — a green salad with walnuts, entrecôte carved twice, and a sauce nobody outside the kitchen has seen written down.",
      ar: "قاعة على ناصية شارع تفتح أبوابها بقائمة من طبق واحد. لا اختيار ولا طلب — سلطة خضراء بالجوز، وأنتروكوت يُشرَّح مرّتين، وصلصة لم يرَ أحد خارج المطبخ وصفتها مكتوبة.",
    },
    image: brandMural,
    focus: "50% 45%",
  },
  {
    id: "sauce",
    anchor: { en: "The sauce", ar: "الصلصة" },
    title: { en: "Never written down", ar: "لم تُكتب قط" },
    body: {
      en: "It has been copied on four continents and matched on none. What travels is not a list of ingredients but a way of working — which is why it has only ever moved between hands, never onto paper.",
      ar: "قُلِّدت في أربع قارّات ولم يبلغها أحد. فما ينتقل ليس قائمة مكوّنات بل طريقة عمل — ولهذا لم تنتقل يومًا إلا بين الأيدي، لا على ورق.",
    },
  },
  {
    id: "crossing",
    anchor: { en: "The crossing", ar: "العبور" },
    title: { en: "Riyadh", ar: "الرياض" },
    body: {
      en: "The formula arrives in the Kingdom intact. Nothing was localised, softened or extended — the same salad, the same two servings, the same refusal to print a menu.",
      ar: "تصل الوصفة إلى المملكة كما هي. لم يُحلَّ منها شيء ولم يُخفَّف ولم يُضَف — السلطة ذاتها، والتقديمتان ذاتهما، والرفض ذاته لطباعة قائمة طعام.",
    },
    image: roomSconces,
    focus: "50% 40%",
  },
  {
    id: "today",
    anchor: { en: "Today", ar: "اليوم" },
    title: { en: "Four rooms", ar: "أربع قاعات" },
    body: {
      en: "From the towers of Riyadh to the sandstone of AlUla, four rooms set the same table. The only question anyone will ask you is how you like your entrecôte.",
      ar: "من أبراج الرياض إلى حجر العُلا الرملي، أربع قاعات تُعدّ الطاولة ذاتها. والسؤال الوحيد الذي ستُسأله: كيف تحبّ أنتروكوتك.",
    },
  },
];
