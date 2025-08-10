// src/components/ui/Toast.tsx
"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import clsx from "clsx";
import {
  AnimatePresence,
  motion,
  Transition,
  useReducedMotion,
} from "framer-motion";

type ToastKind = "info" | "success" | "warning" | "error";
export type ToastItem = {
  id: string;
  kind: ToastKind;
  title?: string;
  message: string;
  timeout?: number; // ms
};

type ToastCtx = {
  addToast: (t: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = crypto.randomUUID();
      const toast: ToastItem = { id, timeout: 5000, ...t };
      setItems((prev) => [toast, ...prev]);
      if (toast.timeout) {
        const timer = setTimeout(() => removeToast(id), toast.timeout);
        // optional: store timer if you want to pause on hover later
        void timer;
      }
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({ addToast, removeToast }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport items={items} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

/* -------------------- Animated viewport -------------------- */

function ToastViewport({
  items,
  onClose,
}: {
  items: ToastItem[];
  onClose: (id: string) => void;
}) {
  const reduce = useReducedMotion();

  const itemVariants = {
    initial: { opacity: 0, y: reduce ? 0 : 16, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: reduce ? 0 : 16, scale: 0.98 },
  };

  const spring: Transition = {
    type: "spring",
    stiffness: 500,
    damping: 40,
    mass: 0.8,
  };

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      <AnimatePresence initial={false}>
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            role="status"
            className={clsx("toast", `toast-${t.kind}`)}
            variants={itemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={spring}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 80) onClose(t.id);
            }}
            whileHover={{ scale: reduce ? 1 : 1.01 }}
          >
            {t.title && <strong className="toast-title">{t.title}</strong>}
            <div className="toast-message">{t.message}</div>
            <button
              className="toast-close"
              aria-label="Close"
              onClick={() => onClose(t.id)}
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
