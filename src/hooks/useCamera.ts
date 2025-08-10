"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Status = "permission" | "live" | "confirm" | "processing";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>("permission");

  // request camera with iOS fallbacks
  const request = useCallback(async () => {
    const v = videoRef.current;
    if (v) {
      v.setAttribute("playsinline", "true");
      v.setAttribute("muted", "true");
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      setStream(s);
      setStatus("live");
    } catch {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(s);
        setStatus("live");
      } catch {
        setStatus("permission");
      }
    }
  }, []);

  // attach stream
  useEffect(() => {
    const v = videoRef.current;
    if (v && stream) {
      v.srcObject = stream;
      v.play().catch(() => {});
    }
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  // capture current frame to canvas, then show confirm state
  const capture = useCallback(async () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;

    if (v.readyState < 2) {
      await new Promise<void>((res) => {
        const onCanPlay = () => {
          v.removeEventListener("canplay", onCanPlay);
          res();
        };
        v.addEventListener("canplay", onCanPlay, { once: true });
      });
    }

    const w = v.videoWidth || v.clientWidth || 1080;
    const h = v.videoHeight || v.clientHeight || 1440;
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, w, h);
    setStatus("confirm");
  }, []);

  const retake = useCallback(() => {
    setStatus(stream ? "live" : "permission");
  }, [stream]);

  const toBlob = useCallback(async (quality = 0.9) => {
    const c = canvasRef.current!;
    return await new Promise<Blob>((resolve) =>
      c.toBlob((b) => resolve(b as Blob), "image/jpeg", quality)
    );
  }, []);

  return {
    videoRef,
    canvasRef,
    status,
    setStatus,
    request,
    capture,
    retake,
    toBlob,
  };
}
