"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { LanguageCode } from "@/lib/languages";

type LanguageState = {
  code: LanguageCode;
  setCode: (c: LanguageCode) => void;
  ready: boolean;
  dir: "ltr" | "rtl";
};

const DEFAULT_LANG: LanguageCode = "en";
const STORAGE_KEY = "ux_lang_code";
const RTL_LANGS = new Set<LanguageCode>(["ar", "he", "fa"]); // extend if you add Urdu etc.

const LanguageContext = createContext<LanguageState | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<LanguageCode>(DEFAULT_LANG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCode(saved as LanguageCode);
      } else {
        const nav = navigator.language?.slice(0, 2).toLowerCase();
        if (nav) setCode(nav as LanguageCode);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
      // Optional: persist as cookie for SSR later
      document.cookie = `${STORAGE_KEY}=${code};path=/;max-age=31536000`;
    } catch {}
    // Reflect language + dir on <html>
    const html = document.documentElement;
    html.lang = code;
    html.dir = RTL_LANGS.has(code) ? "rtl" : "ltr";
  }, [code]);

  const value = useMemo(
    () => ({
      code,
      setCode,
      ready,
      dir: RTL_LANGS.has(code) ? "rtl" : ("ltr" as "rtl" | "ltr"),
    }),
    [code, ready]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useLanguage must be used within <LanguageProvider>");
  return ctx;
}
