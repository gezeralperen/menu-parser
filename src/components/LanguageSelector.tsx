"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGES } from "@/lib/languages";
import { useI18n } from "@/i18n/useI18n";
import { AppHeader } from "@/components/AppHeader";

export default function LanguageSelector() {
  const router = useRouter();
  const { code, setCode, ready } = useLanguage();
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (l) =>
        l.native.toLowerCase().includes(q) ||
        l.english.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [query]);

  if (!ready) {
    return (
      <div className="container page-grid">
        <AppHeader />
      </div>
    );
  }

  return (
    <div
      aria-label={t("language.chooseLanguage")}
      className="container page-grid"
    >
      <AppHeader />

      <div className="stack">
        <h1 className="h1">{t("language.chooseLanguage")}</h1>
        <p className="body muted">{t("language.subtitle")}</p>
      </div>

      <section className="stack">
        <input
          id="lang-search"
          type="search"
          inputMode="search"
          placeholder={t("language.searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input"
          onKeyDown={(e) => {
            if (e.key === "Enter" && list.length === 1) {
              setCode(list[0].code);
            }
          }}
          aria-label={t("language.searchPlaceholder")}
        />

        <div role="listbox" aria-label="Languages" className="grid-auto-min">
          {list.map((lang) => {
            const isSelected = code === lang.code;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => setCode(lang.code)}
                className="option"
              >
                <span className="flag emoji" aria-hidden>
                  {lang.flag}
                </span>
                <span className="option-text">
                  <span className="option-title">{lang.native}</span>
                  <span className="option-meta">
                    {lang.english} · {lang.code.toUpperCase()}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="footer-gradient">
        <button
          onClick={() => router.push("/scan")}
          className="btn btn-primary"
        >
          {t("language.continue")}
        </button>
        <div style={{ height: "var(--space-4)" }} />
      </footer>
    </div>
  );
}
