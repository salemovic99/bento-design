import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";
import { Flame, Leaf, Nut, WheatOff } from "lucide-react";
import type { Localized } from "@/lib/i18n/dictionary";

import steakMacro from "@/public/brand/steak-macro.jpg";
import realSauce from "@/public/brand/real-sauce.jpg";
import heroFormula from "@/public/brand/hero-formula.jpg";
import roomMural from "@/public/brand/room-mural.jpg";
import saladeNoix from "@/public/dishes/salade-noix.jpg";
import frites from "@/public/dishes/frites.jpg";
import dessert from "@/public/dishes/dessert.jpg";

/* ────────────────────────────────────────────────────────────────────────────
   PLACEHOLDER DATA
   The `signature` category is the real house formula. Everything in `starters`,
   `mains` and `desserts` is invented to the spirit of the room, and every price
   is a stand-in — the house has to confirm both before launch.

   Three photographs (`salade-noix`, `frites`, `dessert`) are Unsplash
   placeholders — see `public/dishes/CREDITS.md`.
   ──────────────────────────────────────────────────────────────────────────── */

export type DietaryTag = "vegetarian" | "nuts" | "gluten-free" | "spicy";

/**
 * Dietary marks are icon + label, never icon alone: an icon carries no meaning
 * to a screen reader and a colour carries none to anyone. `MenuDishCard` draws
 * the glyph and puts the label in an `sr-only` span beside it.
 */
export const DIETARY: Record<
  DietaryTag,
  { label: Localized; icon: LucideIcon }
> = {
  vegetarian: { label: { en: "Vegetarian", ar: "نباتي" }, icon: Leaf },
  nuts: { label: { en: "Contains nuts", ar: "يحتوي مكسّرات" }, icon: Nut },
  "gluten-free": {
    label: { en: "Gluten free", ar: "خالٍ من الغلوتين" },
    icon: WheatOff,
  },
  spicy: { label: { en: "Spicy", ar: "حار" }, icon: Flame },
};

export type MenuCategoryId = "signature" | "starters" | "mains" | "desserts";

export type MenuCategory = {
  id: MenuCategoryId;
  label: Localized;
  /** One editorial line that sits under the rail while the category is open. */
  note: Localized;
};

export type MenuItem = {
  id: string;
  category: MenuCategoryId;
  name: Localized;
  /** The French service note, as in `content/dishes.ts`. */
  kicker?: Localized;
  description: Localized;
  /** SAR. `null` means the item arrives as part of the formula, unpriced. */
  price: number | null;
  /**
   * Optional on purpose. A menu that photographs *some* dishes reads as a
   * restaurant; one that photographs all of them reads as an inventory list.
   * Items without an image get the monogram tile instead.
   */
  image?: StaticImageData;
  /** `object-position` for the crop. */
  focus?: string;
  dietary?: DietaryTag[];
  /** One item per category leads with a full-width photograph. */
  feature?: boolean;
};

export const menuCategories: MenuCategory[] = [
  {
    id: "signature",
    label: { en: "Signature", ar: "الوصفة" },
    note: {
      en: "Four courses, one price, no decisions. This is the whole of it.",
      ar: "أربعة أطباق، سعر واحد، ولا قرارات. هذه هي الوصفة كاملة.",
    },
  },
  {
    id: "starters",
    label: { en: "Starters", ar: "المقبّلات" },
    note: {
      en: "For a table that arrives early, or hungry.",
      ar: "لطاولة تصل مبكرًا، أو جائعة.",
    },
  },
  {
    id: "mains",
    label: { en: "Mains", ar: "الأطباق الرئيسية" },
    note: {
      en: "The entrecôte, at two weights — and the two dishes we serve to those who do not eat beef.",
      ar: "الأنتروكوت بوزنين — وطبقان لمن لا يأكل لحم البقر.",
    },
  },
  {
    id: "desserts",
    label: { en: "Desserts", ar: "الحلويات" },
    note: {
      en: "Ordered at the table, after the second serving, never before.",
      ar: "تُطلب على الطاولة بعد الدفعة الثانية، لا قبلها.",
    },
  },
];

export const menuItems: MenuItem[] = [
  /* ── Signature — the formula itself, arriving in order ────────────────── */
  {
    id: "formule-entrecote",
    category: "signature",
    feature: true,
    image: steakMacro,
    focus: "50% 45%",
    name: { en: "L'Entrecôte", ar: "الأنتروكوت" },
    kicker: { en: "Servi deux fois", ar: "يُقدَّم مرّتين" },
    description: {
      en: "Prime rib-eye, sliced against the grain and sent out in two servings so the second reaches you as hot as the first. You choose only how it is cooked.",
      ar: "قطع ريب آي فاخرة تُشرَّح عكس اتجاه الألياف وتُقدَّم على دفعتين، لتصلك الثانية ساخنة كالأولى. أنت تختار درجة النضج فحسب.",
    },
    price: 189,
  },
  {
    id: "formule-salade",
    category: "signature",
    image: saladeNoix,
    focus: "50% 50%",
    name: { en: "La salade aux noix", ar: "السلطة بالجوز" },
    kicker: { en: "Pour commencer", ar: "للبداية" },
    description: {
      en: "Green leaves, toasted walnuts and a mustard vinaigrette shaken to order. Always first, never optional.",
      ar: "أوراق خضراء وجوز محمّص وصلصة خردل تُحضَّر عند الطلب. تأتي أولًا دائمًا، وليست خيارًا.",
    },
    price: null,
    dietary: ["vegetarian", "nuts"],
  },
  {
    id: "formule-sauce",
    category: "signature",
    image: realSauce,
    focus: "55% 50%",
    name: { en: "La sauce Café de Paris", ar: "صلصة كافيه دو باريس" },
    kicker: { en: "Recette secrète", ar: "وصفة سرّية" },
    description: {
      en: "Herb, butter, and a list of ingredients three people alive are allowed to read.",
      ar: "أعشاب وزبدة وقائمة مكوّنات لا يُسمح بقراءتها إلا لثلاثة أشخاص.",
    },
    price: null,
  },
  {
    id: "formule-frites",
    category: "signature",
    image: frites,
    focus: "50% 55%",
    name: { en: "Les frites", ar: "البطاطس المقلية" },
    kicker: { en: "À volonté", ar: "بلا حدود" },
    description: {
      en: "Cut each morning, twice-fried, refilled without being asked.",
      ar: "تُقطَّع كل صباح، وتُقلى مرّتين، وتُعاد تعبئتها دون أن تطلب.",
    },
    price: null,
    dietary: ["vegetarian"],
  },

  /* ── Starters ─────────────────────────────────────────────────────────── */
  {
    id: "salade-seule",
    category: "starters",
    feature: true,
    image: saladeNoix,
    focus: "50% 50%",
    name: { en: "La salade, seule", ar: "السلطة، منفردة" },
    kicker: { en: "Sans la formule", ar: "خارج الوصفة" },
    description: {
      en: "The same salad the formula opens with, served on its own for a table that wants a second one.",
      ar: "السلطة ذاتها التي تفتتح بها الوصفة، تُقدَّم منفردة لطاولة تريد صحنًا ثانيًا.",
    },
    price: 45,
    dietary: ["vegetarian", "nuts"],
  },
  {
    id: "soupe-du-jour",
    category: "starters",
    name: { en: "Soupe du jour", ar: "شوربة اليوم" },
    description: {
      en: "Whatever the market gave us this morning, finished with cream and a turn of pepper.",
      ar: "ما جادت به السوق هذا الصباح، تُختم بالقشدة ولمسة من الفلفل.",
    },
    price: 38,
    dietary: ["vegetarian"],
  },
  {
    id: "assiette-froide",
    category: "starters",
    name: { en: "Assiette froide", ar: "طبق بارد" },
    description: {
      en: "Cured beef, cornichons and butter, on a board meant for the middle of the table.",
      ar: "لحم بقري مقدّد وخيار صغير وزبدة، على لوح يُوضع في وسط الطاولة.",
    },
    price: 55,
  },

  /* ── Mains ────────────────────────────────────────────────────────────── */
  {
    id: "entrecote-classique",
    category: "mains",
    feature: true,
    image: heroFormula,
    focus: "50% 42%",
    name: { en: "Entrecôte classique", ar: "أنتروكوت كلاسيك" },
    kicker: { en: "220 g", ar: "٢٢٠ غم" },
    description: {
      en: "The house cut. Salad, sauce and endless frites arrive with it, in that order, without being asked for.",
      ar: "قطعة البيت. تصلك معها السلطة والصلصة والبطاطس بلا حدود، بهذا الترتيب، دون أن تطلبها.",
    },
    price: 189,
  },
  {
    id: "entrecote-double",
    category: "mains",
    name: { en: "Entrecôte double", ar: "أنتروكوت مضاعف" },
    kicker: { en: "380 g", ar: "٣٨٠ غم" },
    description: {
      en: "The same cut at nearly twice the weight, still carved into two servings.",
      ar: "القطعة ذاتها بضعف الوزن تقريبًا، ولا تزال تُشرَّح على دفعتين.",
    },
    price: 289,
  },
  {
    id: "poulet-de-paris",
    category: "mains",
    name: { en: "Poulet de Paris", ar: "دجاج باريسي" },
    description: {
      en: "Corn-fed chicken under the same sauce, for the seat at the table that does not eat beef.",
      ar: "دجاج مغذّى بالذرة تحت الصلصة ذاتها، لمن على الطاولة لا يأكل لحم البقر.",
    },
    price: 149,
  },
  {
    id: "saumon-grille",
    category: "mains",
    name: { en: "Saumon grillé", ar: "سلمون مشوي" },
    description: {
      en: "Grilled salmon, lemon, olive oil and nothing else. The sauce is served beside it, not over it.",
      ar: "سلمون مشوي وليمون وزيت زيتون، ولا شيء غير ذلك. الصلصة تُقدَّم بجانبه لا فوقه.",
    },
    price: 165,
    dietary: ["gluten-free"],
  },

  /* ── Desserts ─────────────────────────────────────────────────────────── */
  {
    id: "profiteroles",
    category: "desserts",
    feature: true,
    image: dessert,
    focus: "50% 50%",
    name: { en: "Profiteroles", ar: "بروفيترول" },
    kicker: { en: "Pour finir", ar: "للختام" },
    description: {
      en: "Choux, vanilla ice cream, and hot chocolate poured at the table so you hear it land.",
      ar: "عجين الشو وآيس كريم الفانيلا، وشوكولاتة ساخنة تُسكب على الطاولة لتسمع وقعها.",
    },
    price: 52,
    dietary: ["vegetarian"],
  },
  {
    id: "meringue-glacee",
    category: "desserts",
    name: { en: "Meringue glacée", ar: "مرينغ مثلّج" },
    description: {
      en: "Meringue, vanilla, cream whipped to order.",
      ar: "مرينغ وفانيلا وقشدة تُخفق عند الطلب.",
    },
    price: 48,
    dietary: ["vegetarian", "gluten-free"],
  },
  {
    id: "mousse-chocolat",
    category: "desserts",
    name: { en: "Mousse au chocolat", ar: "موس الشوكولاتة" },
    description: {
      en: "Dark, unsweetened, served in the bowl it set in.",
      ar: "داكنة، غير محلّاة، تُقدَّم في الوعاء الذي تماسكت فيه.",
    },
    price: 46,
    dietary: ["vegetarian"],
  },
  {
    id: "cafe-gourmand",
    category: "desserts",
    image: roomMural,
    focus: "50% 45%",
    name: { en: "Café gourmand", ar: "قهوة غورماند" },
    description: {
      en: "An espresso and three small things beside it, so the table can end without deciding.",
      ar: "إسبريسو وثلاثة أشياء صغيرة بجانبه، لتنتهي الطاولة دون أن تقرّر.",
    },
    price: 58,
    dietary: ["nuts"],
  },
];

/** The items in one category, in menu order. */
export function itemsIn(category: MenuCategoryId): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}
