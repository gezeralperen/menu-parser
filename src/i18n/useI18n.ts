"use client";

import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { isSupportedLocale, LOCALES, SupportedLocale } from "./dictionaries";
import { EN_BASE } from "./base";
import { deepMerge, getByPath, type Dictionary } from "@/schema/i18n";

// Build merged dictionary for current locale (fallback to EN)
function resolveDictionary(locale: string): Dictionary {
  const merged = JSON.parse(JSON.stringify(EN_BASE)) as Dictionary;
  const key: SupportedLocale = isSupportedLocale(locale) ? locale : "en";
  const override = LOCALES[key];
  return override ? deepMerge(merged, override) : merged;
}

export function useI18n() {
  const { code } = useLanguage();

  const dict = useMemo(() => resolveDictionary(code), [code]);

  function t(path: keyof Dictionary extends never ? string : string): string {
    const v = getByPath(dict, path);
    // Dev aid: warn for missing keys so translators can fill gaps
    if (process.env.NODE_ENV !== "production" && v === undefined) {
      console.warn(`[i18n] Missing key: "${path}" for locale "${code}"`);
    }
    return (v as string) ?? path;
  }

  return { t, code, dict };
}
