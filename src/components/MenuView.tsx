// app/menu/MenuView.tsx
"use client";

import { AppHeader } from "@/components/AppHeader";
import type {
  ChoiceGroup,
  MenuItem,
  MenuItemGroup,
  ParsedMenu,
} from "@/types/menu";
import "@/styles/menu.css";
import { useI18n } from "@/i18n/useI18n";
import { motion, Variants } from "framer-motion";

export function MenuView({ menu }: { menu: ParsedMenu }) {
  const { t } = useI18n();

  // ---- animation variants ----
  const containerStagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
  };
  const itemFade: Variants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  };
  const heroFade: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  // ---- helpers ----
  function isMenuItemGroupArray(
    options: ChoiceGroup["options"]
  ): options is MenuItemGroup[] {
    return (
      Array.isArray(options) && options.length > 0 && "items" in options[0]!
    );
  }

  function optionInner(it: MenuItem) {
    return (
      <>
        <div className="option-main">
          <span className="option-name">{it.name.text}</span>
          {it.description?.text && (
            <span className="option-desc">{it.description.text}</span>
          )}
        </div>
        <div className="option-meta">
          {it.price && <span>{it.price}</span>}
          {it.dietary_labels?.length ? (
            <span> · {it.dietary_labels.join(", ")}</span>
          ) : null}
          {it.allergens?.length ? (
            <span>
              {" "}
              · {t("menu.allergensLabel")}: {it.allergens.join(", ")}
            </span>
          ) : null}
        </div>
      </>
    );
  }

  function labelForPeriod(
    p: NonNullable<ParsedMenu["sections"][number]["period"]>
  ) {
    return p === "takeoff"
      ? t("menu.period.takeoff")
      : p === "before_landing"
      ? t("menu.period.before_landing")
      : t("menu.period.cruise");
  }
  function choose1Label(n: number = 1) {
    return `Choose ${n}`;
  }
  function chooseRangeLabel(min: number, max: number) {
    return `Choose ${min}–${max}`;
  }

  // ---- render ----
  return (
    <motion.div
      className="container menu--clean"
      variants={containerStagger}
      initial="hidden"
      animate="show"
    >
      <AppHeader />

      <motion.header className="menu-hero" variants={heroFade}>
        <h1 className="menu-title">{t("menu.title")}</h1>
        {menu.warnings?.length ? (
          <ul className="menu-warnings">
            {menu.warnings.map((w, i) => (
              <li key={i} className="pill pill-muted">
                {w}
              </li>
            ))}
          </ul>
        ) : null}
      </motion.header>

      <motion.div className="menu-grid" variants={containerStagger}>
        {menu.sections.map((sec) => (
          <motion.section
            key={sec.id}
            className="menu-section"
            variants={itemFade}
          >
            <div className="section-head">
              <h2 className="section-title">{sec.name.text}</h2>
              {sec.period && (
                <span className="pill pill-ghost">
                  {labelForPeriod(sec.period)}
                </span>
              )}
            </div>

            <motion.ul className="section-entries" variants={containerStagger}>
              {sec.entries.map((entry) => {
                if (entry.type === "item") {
                  const it = entry.item;
                  return (
                    <motion.li
                      key={it.id}
                      className="entry-row"
                      variants={itemFade}
                    >
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
                    </motion.li>
                  );
                }

                // choice group
                const g = entry.group;
                const range =
                  g.min === g.max
                    ? choose1Label(g.min)
                    : chooseRangeLabel(g.min, g.max);

                return (
                  <motion.li key={g.id} className="choice" variants={itemFade}>
                    <div className="choice-head">
                      <strong className="choice-title">
                        {g.title?.text ?? range}
                      </strong>
                      <span className="pill pill-outline">{range}</span>
                    </div>

                    {isMenuItemGroupArray(g.options) ? (
                      <motion.ul
                        className="choice-grid"
                        variants={containerStagger}
                      >
                        {g.options.map((grp) => (
                          <motion.li key={grp.id} variants={itemFade}>
                            <div className="choice-prompt">
                              {grp.id.replace(/[-_]/g, " ")}
                            </div>
                            <motion.ul
                              className="section-entries"
                              variants={containerStagger}
                            >
                              {grp.items.map((opt) => (
                                <motion.li
                                  key={opt.id}
                                  className="option-row"
                                  variants={itemFade}
                                >
                                  {optionInner(opt)}
                                </motion.li>
                              ))}
                            </motion.ul>
                          </motion.li>
                        ))}
                      </motion.ul>
                    ) : (
                      <motion.ul
                        className="choice-grid"
                        variants={containerStagger}
                      >
                        {g.options.map((opt) => (
                          <motion.li
                            key={opt.id}
                            className="option-row"
                            variants={itemFade}
                          >
                            {optionInner(opt)}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.section>
        ))}
      </motion.div>

      <div style={{ height: "40vh" }} />
      <div className="safe-area" />
    </motion.div>
  );
}
