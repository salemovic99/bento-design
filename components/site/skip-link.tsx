"use client";

import { useLanguage } from "@/lib/i18n/language-provider";

/**
 * There is no navigation menu to tab through, but the header still holds six
 * focusable elements before the hero — enough to be worth skipping.
 */
export function SkipLink() {
  const { t } = useLanguage();

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:inline-flex focus:h-11 focus:items-center focus:rounded-full focus:bg-gold-600 focus:px-6 focus:text-xs focus:font-medium focus:uppercase focus:tracking-[0.16em] focus:text-green-900"
    >
      {t.nav.skipToContent}
    </a>
  );
}
