// app/menu/MenuView.tsx
"use client";
import { AppHeader } from "@/components/AppHeader";
import type { ParsedMenu } from "@/types/menu";
import "@/styles/menu.css";

export function MenuView({ menu }: { menu: ParsedMenu }) {
  return (
    <main className="container menu--clean">
      <AppHeader />

      <header className="menu-hero">
        <h1 className="menu-title">
          {menu.locale === "tr" ? "Uçuş Menünüz" : "Your In-Flight Menu"}
        </h1>
        {menu.warnings?.length ? (
          <ul className="menu-warnings">
            {menu.warnings.map((w, i) => (
              <li key={i} className="pill pill-muted">
                {w}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className="menu-grid">
        {menu.sections.map((sec) => (
          <section key={sec.id} className="menu-section">
            <div className="section-head">
              <h2 className="section-title">{sec.name.text}</h2>
              {sec.period && (
                <span className="pill pill-ghost">
                  {labelForPeriod(sec.period, menu.locale)}
                </span>
              )}
            </div>

            <ul className="section-entries">
              {sec.entries.map((entry) => {
                if (entry.type === "item") {
                  const it = entry.item;
                  return (
                    <li key={it.id} className="entry-row">
                      <div className="entry-main">
                        <strong className="entry-name">{it.name.text}</strong>
                        {it.description?.text && (
                          <p className="entry-desc">{it.description.text}</p>
                        )}
                      </div>
                      <div className="entry-meta">
                        {it.price && <span className="price">{it.price}</span>}
                        <div className="tags">
                          {it.dietary_labels?.map((d) => (
                            <span key={d} className="pill pill-soft">
                              {d}
                            </span>
                          ))}
                          {it.allergens?.map((a) => (
                            <span key={a} className="pill pill-outline">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </li>
                  );
                }

                // choice group
                const g = entry.group;
                const range =
                  g.min === g.max
                    ? choose1Label(menu.locale, g.min)
                    : chooseRangeLabel(g.min, g.max, menu.locale);

                return (
                  <li key={g.id} className="choice">
                    <div className="choice-head">
                      <div className="stack">
                        <strong className="choice-title">
                          {g.title?.text ?? range}
                        </strong>
                        {g.prompt?.text && (
                          <p className="choice-prompt">{g.prompt.text}</p>
                        )}
                      </div>
                      <span className="pill pill-brand">{range}</span>
                    </div>

                    <ul className="choice-grid">
                      {g.options.map((opt) => (
                        <li key={opt.id} className="option-row">
                          <div className="option-main">
                            <span className="option-name">{opt.name.text}</span>
                            {opt.description?.text && (
                              <span className="option-desc">
                                {opt.description.text}
                              </span>
                            )}
                          </div>
                          <div className="option-meta">
                            {opt.price && (
                              <span className="price">{opt.price}</span>
                            )}
                            <div className="tags">
                              {opt.dietary_labels?.map((d) => (
                                <span key={d} className="pill pill-soft">
                                  {d}
                                </span>
                              ))}
                              {opt.allergens?.map((a) => (
                                <span key={a} className="pill pill-outline">
                                  {a}
                                </span>
                              ))}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <div className="safe-area" />
    </main>
  );
}

function labelForPeriod(
  p: NonNullable<ParsedMenu["sections"][number]["period"]>,
  locale?: string
) {
  if (locale === "tr") {
    return p === "takeoff"
      ? "Kalkış"
      : p === "before_landing"
      ? "İnişten Önce"
      : "Uçuş";
  }
  return p === "takeoff"
    ? "Takeoff"
    : p === "before_landing"
    ? "Before landing"
    : "Cruise";
}
function choose1Label(locale?: string, n: number = 1) {
  return locale === "tr" ? `Seçim: ${n}` : `Choose ${n}`;
}
function chooseRangeLabel(min: number, max: number, locale?: string) {
  return locale === "tr" ? `Seçim: ${min}–${max}` : `Choose ${min}–${max}`;
}
