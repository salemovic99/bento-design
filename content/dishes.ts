import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";
import { Beef, CakeSlice, Croissant, Leaf, Quote, Utensils } from "lucide-react";
import type { Localized } from "@/lib/i18n/dictionary";

import steakMacro from "@/public/brand/steak-macro.jpg";
import realSauce from "@/public/brand/real-sauce.jpg";
import storyHeritage from "@/public/brand/story-heritage.jpg";
import saladeNoix from "@/public/dishes/salade-noix.jpg";
import frites from "@/public/dishes/frites.jpg";
import dessert from "@/public/dishes/dessert.jpg";

/* ────────────────────────────────────────────────────────────────────────────
   PLACEHOLDER DATA
   Dish copy is written to the real house formula.

   PRICES: none. This section tells the story of the formula in the order it is
   served; the priced card lives in `content/menu.ts` and is the only place a
   number appears, so there is nothing to keep in sync between the two. The
   `price` field stays on the type — `BentoCard` still renders it when set, and
   the tiles may carry prices again.

   Three photographs (`salade-noix`, `frites`, `dessert`) are Unsplash
   placeholders — see `public/dishes/CREDITS.md`.
   ──────────────────────────────────────────────────────────────────────────── */

export type DishVariant = "photo" | "editorial";

export type Dish = {
  id: string;
  variant: DishVariant;
  image: StaticImageData;
  icon: LucideIcon;
  name: Localized;
  /** Small French service note under the name. */
  kicker: Localized;
  description: Localized;
  tag: Localized;
  /** SAR; `null` for tiles that carry no price. */
  price: number | null;
  /**
   * Bento placement. The desktop grid is 12 columns; tablet collapses to 6 and
   * mobile to 2, each with its own row-span so the composition is rebuilt per
   * breakpoint rather than shrunk.
   */
  span: string;
  /** `object-position` for the crop, since tile aspect ratios differ wildly. */
  focus?: string;
  /** `sizes` for next/image, derived from how wide the tile actually renders. */
  sizes: string;
  /** Short tiles clamp their description; tall ones can breathe. */
  compact?: boolean;
};

export const dishes: Dish[] = [
  {
    id: "entrecote",
    variant: "photo",
    image: steakMacro,
    icon: Beef,
    name: { en: "L'Entrecôte", ar: "الأنتروكوت" },
    kicker: { en: "Servi deux fois", ar: "يُقدَّم مرّتين" },
    description: {
      en: "Prime rib-eye, sliced against the grain and sent out in two servings so the second reaches you as hot as the first.",
      ar: "قطع ريب آي فاخرة تُشرَّح عكس اتجاه الألياف وتُقدَّم على دفعتين، لتصلك الثانية ساخنة كالأولى تمامًا.",
    },
    tag: { en: "The main", ar: "الطبق الرئيسي" },
    price: null,
    span: "col-span-2 row-span-2 md:col-span-6 md:row-span-2 lg:col-span-6 lg:row-span-2",
    focus: "50% 45%",
    sizes: "(min-width: 1024px) 50vw, (min-width: 768px) 100vw, 100vw",
  },
  {
    id: "sauce",
    variant: "photo",
    image: realSauce,
    icon: Utensils,
    name: { en: "La sauce", ar: "الصلصة" },
    kicker: { en: "Recette secrète", ar: "وصفة سرّية" },
    description: {
      en: "Herb, butter and a list of ingredients three people alive are allowed to read.",
      ar: "أعشاب وزبدة وقائمة مكوّنات لا يُسمح بقراءتها إلا لثلاثة أشخاص.",
    },
    tag: { en: "Since 1930", ar: "منذ ١٩٣٠" },
    price: null,
    span: "col-span-1 row-span-1 md:col-span-3 md:row-span-1 lg:col-span-3 lg:row-span-1",
    focus: "55% 50%",
    sizes: "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 50vw",
    compact: true,
  },
  {
    id: "salade",
    variant: "photo",
    image: saladeNoix,
    icon: Leaf,
    name: { en: "La salade aux noix", ar: "السلطة بالجوز" },
    kicker: { en: "Pour commencer", ar: "للبداية" },
    description: {
      en: "Green leaves, toasted walnuts and a mustard vinaigrette shaken to order. Always first, never optional.",
      ar: "أوراق خضراء وجوز محمّص وصلصة خردل تُحضَّر عند الطلب. تأتي أولًا دائمًا، وليست خيارًا.",
    },
    tag: { en: "First course", ar: "الطبق الأول" },
    price: null,
    span: "col-span-1 row-span-2 md:col-span-3 md:row-span-2 lg:col-span-3 lg:row-span-2",
    focus: "50% 50%",
    sizes: "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 50vw",
  },
  {
    id: "frites",
    variant: "photo",
    image: frites,
    icon: Croissant,
    name: { en: "Les frites", ar: "البطاطس المقلية" },
    kicker: { en: "À volonté", ar: "بلا حدود" },
    description: {
      en: "Cut each morning, twice-fried, refilled without being asked.",
      ar: "تُقطَّع كل صباح، وتُقلى مرّتين، وتُعاد تعبئتها دون أن تطلب.",
    },
    tag: { en: "Endless", ar: "بلا نهاية" },
    price: null,
    span: "col-span-1 row-span-1 md:col-span-3 md:row-span-1 lg:col-span-3 lg:row-span-1",
    focus: "50% 55%",
    sizes: "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 50vw",
    compact: true,
  },
  {
    id: "dessert",
    variant: "photo",
    image: dessert,
    icon: CakeSlice,
    name: { en: "Le dessert", ar: "الحلوى" },
    kicker: { en: "Pour finir", ar: "للختام" },
    description: {
      en: "Profiteroles, meringue glacée or the chocolate that arrives without a name.",
      ar: "بروفيترول أو مرينغ مثلّج أو تلك الشوكولاتة التي تصل بلا اسم.",
    },
    tag: { en: "To finish", ar: "الختام" },
    price: null,
    span: "col-span-2 row-span-1 md:col-span-6 md:row-span-1 lg:col-span-4 lg:row-span-1",
    focus: "50% 50%",
    sizes: "(min-width: 1024px) 34vw, 100vw",
    compact: true,
  },
  {
    id: "heritage",
    variant: "editorial",
    image: storyHeritage,
    icon: Quote,
    name: { en: "Une seule formule", ar: "وصفة واحدة" },
    kicker: { en: "Depuis 1930", ar: "منذ ١٩٣٠" },
    description: {
      en: "Boubier wrote it down once, in Geneva, and nobody has been brave enough to edit it since.",
      ar: "دوّنها بوبييه مرّة واحدة في جنيف، ولم يجرؤ أحد على تعديلها منذ ذلك الحين.",
    },
    tag: { en: "The house", ar: "البيت" },
    price: null,
    span: "col-span-2 row-span-2 md:col-span-6 md:row-span-1 lg:col-span-8 lg:row-span-1",
    focus: "50% 40%",
    sizes: "(min-width: 1024px) 67vw, 100vw",
  },
];
