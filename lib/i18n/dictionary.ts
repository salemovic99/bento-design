/**
 * All chrome copy for the site, in both languages.
 * Dish and branch copy lives in `content/` alongside its data.
 *
 * The Arabic is written as Arabic rather than translated word-for-word:
 * headline rhythm and line length are tuned for the RTL composition, and
 * guest counts use real Arabic plural categories (see `plural()` below).
 *
 * `en` is the source of truth for the shape — `ar` is typed as `Dictionary`,
 * so a missing or misspelled Arabic key is a compile error.
 */

export const LANGUAGES = ["en", "ar"] as const;
export type Language = (typeof LANGUAGES)[number];

export const DIRECTION: Record<Language, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

export const LOCALE: Record<Language, string> = {
  en: "en-SA",
  ar: "ar-SA",
};

/**
 * Dates get their own locale tag. Plain `ar-SA` resolves to the Umm al-Qura
 * calendar with Arabic-Indic digits, which is correct for a Saudi *calendar*
 * but wrong for a table booking — the guest picks a Gregorian day and reads it
 * back on a Gregorian confirmation. So: Arabic month and weekday names,
 * Gregorian calendar, Latin digits, matching the times and phone numbers
 * everywhere else on the page.
 */
export const DATE_LOCALE: Record<Language, string> = {
  en: "en-GB",
  ar: "ar-SA-u-ca-gregory-nu-latn",
};

/** CLDR plural categories. Arabic uses all six; English uses two. */
type PluralForms = Partial<
  Record<Intl.LDMLPluralRule, string>
> & { other: string };

const en = {
  meta: {
    brand: "Entrecôte Café de Paris",
    tagline: "Chez Boubier — 1930",
  },
  nav: {
    call: "Call us",
    switchTo: "العربية",
    skipToContent: "Skip to content",
  },
  hero: {
    eyebrow: "Riyadh · AlUla",
    headline: ["One formula.", "Unchanged", "since 1930."],
    lede: "A green salad with walnuts. Entrecôte carved twice. The sauce nobody has ever copied. Nothing else — because nothing else is needed.",
    primaryCta: "Reserve a table",
    secondaryCta: "See the formula",
    scroll: "Scroll",
  },
  story: {
    eyebrow: "The house",
    headline: ["A recipe only ever", "passed by hand."],
    lede: "Four moments stand between a Geneva corner in 1930 and the table waiting for you tonight. Nothing in the formula changed along the way.",
    cta: "See the formula",
  },
  dishes: {
    eyebrow: "The formula",
    headline: ["Everything we serve,", "in the order we serve it."],
    lede: "There is no menu to read. You choose only how your entrecôte is cooked — the rest arrives, twice, without being asked for.",
    cta: "Reserve a table",
    priceLabel: "SAR",
  },
  /**
   * The cinematic menu section. `scenes` is a keyed object rather than an array
   * on purpose: `ar` is typed as `Dictionary`, so a keyed object makes a missing
   * scene a compile error, and `SceneKey` in the section's timeline is derived
   * from these keys so the copy and the scroll ranges can never drift apart.
   */
  menu: {
    eyebrow: "The card",
    headline: ["Everything around", "the formula."],
    lede: "The formula itself never changes. What sits either side of it does — a first course, a sweet, something cold while the second serving comes.",
    cue: "Explore our menu",
    railLabel: "Menu",
    scenes: {
      intro: { title: "Our Menu", line: "A journey of flavour." },
      ingredients: {
        title: "Exceptional Ingredients",
        line: "Selected with care.",
      },
      craft: { title: "Crafted With Precision", line: "Every detail matters." },
      card: { title: "The Menu", line: "Discover our signature dishes." },
    },
    categoriesLabel: "Menu categories",
    dietaryLabel: "Dietary notes",
    included: "In the formula",
    note: "Prices in Saudi riyals, inclusive of VAT.",
    cta: "Reserve a table",
  },
  branches: {
    eyebrow: "Where to find us",
    headline: ["Four rooms.", "The same table."],
    lede: "From the towers of Riyadh to the sandstone of AlUla — the same mural, the same sconces, the same sauce.",
    hours: "Hours",
    phone: "Phone",
    directions: "Directions",
    mapTitle: "Our locations",
    mapSubtitle: "Kingdom of Saudi Arabia",
    branchCount: "branches",
  },
  reservation: {
    eyebrow: "Reserve",
    headline: "Reserve a table",
    lede: "Choose your preferred location and we will keep it warm.",
    branch: "Location",
    branchPlaceholder: "Choose a branch",
    date: "Date",
    datePlaceholder: "Pick a date",
    time: "Time",
    timePlaceholder: "Choose a time",
    guests: "Guests",
    guestsPlaceholder: "How many",
    guestCount: { one: "guest", other: "guests" } as PluralForms,
    guestsMore: "More than 5",
    largePartyTitle: "More than 5 guests?",
    largePartyBody:
      "Larger tables are arranged by our call center rather than online — one call and it is done.",
    name: "Full name",
    namePlaceholder: "Your name",
    phone: "Mobile number",
    phonePlaceholder: "05X XXX XXXX",
    notes: "Notes (optional)",
    notesPlaceholder:
      "Allergies, a high chair, a celebration — anything we should know.",
    submit: "Reserve",
    submitting: "Reserving…",
    errorName: "Please tell us who the table is for.",
    errorPhone: "Please enter a valid Saudi mobile number.",
    errorBranch: "Please choose a location.",
    errorDate: "Please choose a date.",
    errorTime: "Please choose a time.",
    errorGuests: "Please choose the number of guests.",
    confirmTitle: "Your table is requested",
    confirmLede:
      "We will call you shortly to confirm. This is a demonstration form — no booking has been sent.",
    confirmClose: "Done",
    note: "Tables are held for 15 minutes past the reserved time.",
  },
  footer: {
    contact: "Contact",
    follow: "Follow",
    legalPrivacy: "Privacy",
    legalTerms: "Terms",
    rights: "All rights reserved.",
    credit: "One formula, since 1930.",
  },
  a11y: {
    logo: "Entrecôte Café de Paris — home",
    instagram: "Entrecôte Café de Paris on Instagram",
    facebook: "Entrecôte Café de Paris on Facebook",
    twitter: "Entrecôte Café de Paris on X",
    youtube: "Entrecôte Café de Paris on YouTube",
    selectLanguage: "Select language",
    openInMaps: "Open in Google Maps (opens in a new tab)",
    whatsapp:
      "Message Entrecôte Café de Paris on WhatsApp (opens in a new tab)",
  },
};

export type Dictionary = typeof en;

const ar: Dictionary = {
  meta: {
    brand: "أنتروكوت كافيه دو باريس",
    tagline: "شيه بوبييه — ١٩٣٠",
  },
  nav: {
    call: "اتصل بنا",
    switchTo: "English",
    skipToContent: "تخطَّ إلى المحتوى",
  },
  hero: {
    eyebrow: "الرياض · العُلا",
    headline: ["وصفة واحدة.", "لم تتغيّر", "منذ ١٩٣٠."],
    lede: "سلطة خضراء بالجوز. أنتروكوت يُقدَّم على مرّتين. وصلصة لم يستطع أحد تقليدها. لا شيء غير ذلك — لأن لا شيء غيره يلزم.",
    primaryCta: "احجز طاولتك",
    secondaryCta: "تعرّف على الوصفة",
    scroll: "مرِّر",
  },
  story: {
    eyebrow: "الدار",
    headline: ["وصفة لم تنتقل", "إلا بين الأيدي."],
    lede: "أربع محطات تفصل بين ناصية في جنيف عام ١٩٣٠ والطاولة التي تنتظرك الليلة. ولم يتغيّر في الوصفة شيء على طول الطريق.",
    cta: "تعرّف على الوصفة",
  },
  dishes: {
    eyebrow: "الوصفة",
    headline: ["كل ما نقدّمه،", "بالترتيب الذي نقدّمه به."],
    lede: "لا قائمة طعام تُقرأ. أنت تختار درجة نضج الأنتروكوت فحسب — وما تبقّى يصلك، مرّتين، دون أن تطلبه.",
    cta: "احجز طاولتك",
    priceLabel: "ر.س",
  },
  menu: {
    eyebrow: "القائمة",
    headline: ["كل ما يحيط", "بالوصفة."],
    lede: "الوصفة نفسها لا تتغيّر. أمّا ما يسبقها وما يليها فيتبدّل — طبق أوّل، وحلوى، وشيء بارد تشربه ريثما تصل الدفعة الثانية.",
    cue: "استكشف القائمة",
    railLabel: "القائمة",
    scenes: {
      intro: { title: "قائمتنا", line: "رحلة في النكهة." },
      ingredients: {
        title: "مكوّنات استثنائية",
        line: "مختارة بعناية.",
      },
      craft: { title: "صُنعت بإتقان", line: "كل تفصيل له حساب." },
      card: { title: "القائمة", line: "اكتشف أطباقنا المميّزة." },
    },
    categoriesLabel: "أقسام القائمة",
    dietaryLabel: "ملاحظات غذائية",
    included: "ضمن الوصفة",
    note: "الأسعار بالريال السعودي، شاملة ضريبة القيمة المضافة.",
    cta: "احجز طاولتك",
  },
  branches: {
    eyebrow: "أين تجدنا",
    headline: ["أربع قاعات.", "الطاولة ذاتها."],
    lede: "من أبراج الرياض إلى حجر العُلا الرملي — الجدارية ذاتها، والإضاءة ذاتها، والصلصة ذاتها.",
    hours: "أوقات العمل",
    phone: "الهاتف",
    directions: "الاتجاهات",
    mapTitle: "فروعنا",
    mapSubtitle: "المملكة العربية السعودية",
    branchCount: "فروع",
  },
  reservation: {
    eyebrow: "الحجز",
    headline: "احجز طاولتك",
    lede: "اختر الفرع الأقرب إليك ونحن نبقيها بانتظارك.",
    branch: "الفرع",
    branchPlaceholder: "اختر الفرع",
    date: "التاريخ",
    datePlaceholder: "اختر التاريخ",
    time: "الوقت",
    timePlaceholder: "اختر الوقت",
    guests: "عدد الضيوف",
    guestsPlaceholder: "كم شخصًا",
    guestCount: {
      zero: "ضيوف",
      one: "ضيف",
      two: "ضيفان",
      few: "ضيوف",
      many: "ضيفًا",
      other: "ضيف",
    },
    guestsMore: "أكثر من 5",
    largePartyTitle: "أكثر من 5 ضيوف؟",
    largePartyBody:
      "الطاولات الكبيرة يرتّبها مركز الاتصال بدلًا من الحجز الإلكتروني — مكالمة واحدة ويتم الأمر.",
    name: "الاسم الكامل",
    namePlaceholder: "اسمك",
    phone: "رقم الجوال",
    phonePlaceholder: "05X XXX XXXX",
    notes: "ملاحظات (اختياري)",
    notesPlaceholder:
      "حساسية، كرسي أطفال، مناسبة خاصة — أي شيء يهمّنا معرفته.",
    submit: "احجز",
    submitting: "جارٍ الحجز…",
    errorName: "أخبرنا باسم صاحب الطاولة.",
    errorPhone: "الرجاء إدخال رقم جوال سعودي صحيح.",
    errorBranch: "الرجاء اختيار الفرع.",
    errorDate: "الرجاء اختيار التاريخ.",
    errorTime: "الرجاء اختيار الوقت.",
    errorGuests: "الرجاء اختيار عدد الضيوف.",
    confirmTitle: "تم استلام طلب حجزك",
    confirmLede:
      "سنتصل بك قريبًا للتأكيد. هذا نموذج تجريبي — لم يُرسل أي حجز فعلي.",
    confirmClose: "تم",
    note: "نحتفظ بالطاولة لمدة 15 دقيقة بعد الموعد المحجوز.",
  },
  footer: {
    contact: "التواصل",
    follow: "تابعنا",
    legalPrivacy: "الخصوصية",
    legalTerms: "الشروط",
    rights: "جميع الحقوق محفوظة.",
    credit: "وصفة واحدة، منذ ١٩٣٠.",
  },
  a11y: {
    logo: "أنتروكوت كافيه دو باريس — الصفحة الرئيسية",
    instagram: "أنتروكوت كافيه دو باريس على إنستغرام",
    facebook: "أنتروكوت كافيه دو باريس على فيسبوك",
    twitter: "أنتروكوت كافيه دو باريس على إكس",
    youtube: "أنتروكوت كافيه دو باريس على يوتيوب",
    selectLanguage: "اختر اللغة",
    openInMaps: "افتح في خرائط جوجل (يفتح في تبويب جديد)",
    whatsapp: "راسل أنتروكوت كافيه دو باريس على واتساب (يفتح في تبويب جديد)",
  },
};

export const dictionary: Record<Language, Dictionary> = { en, ar };

/** A field carrying both languages, used throughout `content/`. */
export type Localized<T = string> = Record<Language, T>;

/**
 * Resolves a count against real CLDR plural categories, so Arabic gets its
 * dual ("ضيفان") and its 11–99 accusative ("ضيفًا") rather than an English
 * one/other split wearing Arabic words.
 */
export function plural(
  count: number,
  forms: PluralForms,
  lang: Language,
): string {
  const rule = new Intl.PluralRules(LOCALE[lang]).select(count);
  return forms[rule] ?? forms.other;
}
