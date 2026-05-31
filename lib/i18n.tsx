"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Lang = "ru" | "en" | "he";
export const LANGS: Lang[] = ["ru", "en", "he"];
export const RTL_LANGS: Lang[] = ["he"];

export type Localized = Record<Lang, string>;

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (entry: Localized) => string;
};

const I18nContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "3td-lang";

// Cast around a known monorepo @types/react version skew (18 vs 19) that
// otherwise trips Context.Provider's JSX element-type check.
const Provider = I18nContext.Provider as unknown as React.FC<{
  value: Ctx;
  children?: React.ReactNode;
}>;

export function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [lang, setLangState] = useState<Lang>("ru");

  // hydrate from storage / browser once on mount
  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY)) as Lang | null;
    if (stored && LANGS.includes(stored)) {
      setLangState(stored);
    } else if (typeof navigator !== "undefined") {
      const nav = navigator.language.slice(0, 2).toLowerCase();
      if (nav === "he" || nav === "iw") setLangState("he");
      else if (nav === "en") setLangState("en");
      else setLangState("ru");
    }
  }, []);

  const dir: "ltr" | "rtl" = RTL_LANGS.includes(lang) ? "rtl" : "ltr";

  // reflect lang + dir onto <html> for native RTL + a11y
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((entry: Localized) => entry[lang] ?? entry.en, [lang]);

  return <Provider value={{ lang, dir, setLang, t }}>{children}</Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/** Shorthand for inline trilingual strings. */
export const L = (ru: string, en: string, he: string): Localized => ({ ru, en, he });
