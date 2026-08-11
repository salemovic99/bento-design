"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Direction } from "radix-ui";
import {
  DATE_LOCALE,
  DIRECTION,
  LANGUAGES,
  LOCALE,
  dictionary,
  plural,
  type Dictionary,
  type Language,
  type Localized,
} from "./dictionary";

const STORAGE_KEY = "ecdp.lang";

function isLanguage(value: string | null): value is Language {
  return value !== null && (LANGUAGES as readonly string[]).includes(value);
}

/* ────────────────────────────────────────────────────────────────────────────
   The chosen language lives outside React, in localStorage.
   `useSyncExternalStore` is the right tool for that: it renders the server
   snapshot ("en") during hydration and swaps to the stored preference
   immediately afterwards, without a setState-inside-an-effect cascade.
   ──────────────────────────────────────────────────────────────────────────── */

const listeners = new Set<() => void>();
/** getSnapshot must return a referentially stable value, so it is cached. */
let snapshot: Language | null = null;

function readLanguage(): Language {
  if (snapshot) return snapshot;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) {
      snapshot = stored;
      return snapshot;
    }
  } catch {
    // Private mode / blocked storage — fall through to the browser preference.
  }
  snapshot = window.navigator.language?.toLowerCase().startsWith("ar")
    ? "ar"
    : "en";
  return snapshot;
}

function writeLanguage(next: Language) {
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // The language still switches; it just will not survive a reload.
  }
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Keep other tabs of the site in step.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    if (isLanguage(event.newValue)) {
      snapshot = event.newValue;
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const getServerSnapshot = (): Language => "en";

type LanguageContextValue = {
  lang: Language;
  dir: "ltr" | "rtl";
  locale: string;
  /** Gregorian + Latin digits, even in Arabic — see `DATE_LOCALE`. */
  dateLocale: string;
  t: Dictionary;
  setLang: (next: Language) => void;
  /** Reads the active language out of a `{ en, ar }` content field. */
  pick: <T>(value: Localized<T>) => T;
  /** CLDR-correct plural form for a count. */
  plural: (count: number, forms: Parameters<typeof plural>[1]) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(
    subscribe,
    readLanguage,
    getServerSnapshot,
  );

  // `<html lang>` / `<html dir>` are the real source of truth for the browser,
  // assistive tech and every logical CSS property on the page.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = DIRECTION[lang];
  }, [lang]);

  const setLang = useCallback((next: Language) => writeLanguage(next), []);

  const value = useMemo<LanguageContextValue>(() => {
    const dir = DIRECTION[lang];
    return {
      lang,
      dir,
      locale: LOCALE[lang],
      dateLocale: DATE_LOCALE[lang],
      t: dictionary[lang],
      setLang,
      pick: (value) => value[lang],
      plural: (count, forms) => plural(count, forms, lang),
    };
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={value}>
      {/*
        Radix reads direction from this provider: it drives popper placement,
        arrow-key behaviour in Select, and swipe direction in every primitive.
      */}
      <Direction.Provider dir={value.dir}>{children}</Direction.Provider>
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return context;
}
