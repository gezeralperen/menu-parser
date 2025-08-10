"use client";
import Logo from "./Logo";
import { Badge } from "./ui/Badge";
import { useI18n } from "@/i18n/useI18n";

export function AppHeader() {
  const { t } = useI18n();
  return (
    <header className="scan-header">
      <div className="cluster">
        <Logo aria-label="Airline logo" className="logo" />
        <strong className="body bold">{t("common.appTitle")}</strong>
      </div>
      <Badge>{t("common.poweredByAi")}</Badge>
    </header>
  );
}
