"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useI18n } from "@/i18n/useI18n";
import { useCamera } from "@/hooks/useCamera";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/Toast";
import { useMenu } from "@/context/MenuContext";
import { useChat } from "@/context/ChatContext";

export default function Scanner() {
  const { ready, code } = useLanguage();
  const { t } = useI18n();
  const {
    videoRef,
    canvasRef,
    status,
    setStatus,
    request,
    capture,
    retake,
    toBlob,
  } = useCamera();
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { setMenu } = useMenu();
  const { setSuggestions } = useChat();
  const { addToast } = useToast();

  if (!ready) {
    // optional skeleton while language loads to avoid flash/mismatch
    return (
      <main className="container page-grid" aria-label="Scanning">
        <AppHeader />
      </main>
    );
  }

  async function handleConfirmAndUpload() {
    setStatus("processing");
    setProgress(0);

    // 1) Get JPEG blob from canvas
    const blob = await toBlob(0.9);

    // 2) Build form-data
    const fd = new FormData();
    fd.append("image", blob, "menu.jpg");
    // (optional) pass locale so backend can translate in the same language
    fd.append("locale", code); // from useLanguage()

    // 3) Show progress while uploading/processing
    const timer = setInterval(
      () => setProgress((p) => Math.min(100, p + 1)),
      250
    );

    try {
      // 4) Call your API
      const res = await fetch("/api/parse-menu", {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      const contentType = res.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        // ApiError envelope expected
        const message =
          typeof payload === "string"
            ? payload
            : payload?.error?.message || "Request failed";

        addToast({
          kind: "error",
          title: "Something Went Wrong!",
          message,
        });

        clearInterval(timer);
        setProgress(0);
        setStatus("confirm");
        return;
      }

      // 5) Stash result (simple approach) and navigate
      setMenu(payload);
      if (
        Array.isArray(payload.suggestions) &&
        payload.suggestions.length > 0
      ) {
        setSuggestions(payload.suggestions);
      } else {
        setSuggestions([]); // optional: clear if none
      }
      clearInterval(timer);
      setProgress(100);
      router.push("/menu"); // build this page to read from sessionStorage
    } catch (err) {
      console.log(err);
      clearInterval(timer);
      setProgress(0);
      addToast({
        kind: "error",
        title: "Network Error",
        message: err instanceof Error ? err.message : "Please try again.",
      });
      setStatus("confirm"); // go back to confirm so user can retake
    }
  }

  return (
    <div className="container page-grid" aria-label="Scanning">
      <AppHeader />

      <div className="stack">
        <h1 className="h1">{t("scan.title")}</h1>
        <p className="body muted">{t("scan.subtitle")}</p>
        <span className="pill">{t("scan.readySoon")}</span>
      </div>

      <section className="stack">
        <div
          className="scan-frame"
          role="region"
          aria-label={t("scan.cameraPreviewAria")}
        >
          <video
            ref={videoRef}
            className={`scan-video ${status !== "live" ? "hidden" : ""}`}
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className={`scan-canvas ${status === "live" ? "hidden" : ""}`}
            aria-label={t("scan.capturedImageAria")}
          />
        </div>
      </section>

      <footer className="footer-gradient scan-footer">
        {status === "processing" && (
          <Progress value={progress} label={t("scan.processing")} />
        )}

        <div className="scan-actions">
          {status === "permission" && (
            <>
              <Button variant="primary" onClick={request}>
                {t("scan.permissionAllow")}
              </Button>
            </>
          )}

          {status === "live" && (
            <Button variant="primary" onClick={capture}>
              {t("scan.takePhoto")}
            </Button>
          )}

          {status === "confirm" && (
            <>
              <Card>
                <div className="stack">
                  <strong className="body bold">
                    {t("scan.confirmTitle")}
                  </strong>
                  <p className="body">{t("scan.confirmLine1")}</p>
                  <p className="body muted">{t("scan.confirmLine2")}</p>
                </div>
              </Card>
              <div className="scan-actions">
                <Button onClick={retake}>{t("scan.retake")}</Button>
                <Button variant="primary" onClick={handleConfirmAndUpload}>
                  {t("scan.confirmCta")}
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="safe-area" />
      </footer>
    </div>
  );
}
