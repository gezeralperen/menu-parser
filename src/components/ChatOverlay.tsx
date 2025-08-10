"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useChat } from "@/context/ChatContext";
import { AnimatePresence, motion } from "framer-motion";
import type { Transition } from "framer-motion";
import "@/styles/chat.css";
import { useI18n } from "@/i18n/useI18n";

const PANEL_SPRING: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.9,
};
const ITEM_SPRING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.8,
};

const panelVariants = {
  hidden: { y: "100%" },
  visible: { y: 0 },
  exit: { y: "100%" },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, when: "beforeChildren" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: ITEM_SPRING },
};

const chipVariants = {
  hidden: { opacity: 0, y: 6, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: ITEM_SPRING },
};

export function ChatOverlay() {
  const { messages, isSending, suggestions, send } = useChat();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);
  const { t } = useI18n();

  // keep scrolled to bottom when messages change or panel opens
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    return () => cancelAnimationFrame(id);
  }, [messages, open]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await send(text);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  // prevent wheel/touch from scrolling the page when interacting with chat
  const stopScrollPropagation = (e: React.UIEvent) => e.stopPropagation();

  return (
    <>
      <motion.button
        className={clsx("chat-toggle", open && "is-open")}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="chat-panel"
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -1 }}
        transition={ITEM_SPRING}
      >
        {open ? t("chat.toggleClose") : t("chat.toggleOpen")}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.section
            id="chat-panel"
            className="chat-panel"
            aria-label="Menu assistant chat"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={PANEL_SPRING}
            onWheelCapture={stopScrollPropagation}
            onTouchMove={
              stopScrollPropagation as unknown as React.TouchEventHandler
            }
          >
            <motion.button
              className="chat-grabber"
              aria-label={t("chat.collapseAria")}
              onClick={() => setOpen(false)}
              whileTap={{ scale: 0.96 }}
              transition={ITEM_SPRING}
            />

            <header className="chat-header">
              <motion.strong
                className="chat-title"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={ITEM_SPRING}
              >
                {t("chat.assistantTitle")}
              </motion.strong>
              <motion.button
                className="chat-collapse"
                onClick={() => setOpen(false)}
                whileTap={{ scale: 0.97 }}
                transition={ITEM_SPRING}
              >
                {t("chat.collapse")}
              </motion.button>
            </header>

            <div
              className="chat-body"
              role="log"
              aria-live="polite"
              onWheelCapture={stopScrollPropagation}
              onTouchMove={
                stopScrollPropagation as unknown as React.TouchEventHandler
              }
            >
              <AnimatePresence mode="popLayout">
                {messages.length === 0 ? (
                  <motion.p
                    key="empty"
                    className="chat-empty"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={ITEM_SPRING}
                  >
                    {t("chat.empty")}
                  </motion.p>
                ) : (
                  <motion.ul
                    key="stream"
                    className="chat-stream"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {messages.map((m) => (
                      <motion.li
                        key={m.id}
                        className={clsx(
                          "chat-msg",
                          m.role === "user" ? "msg-user" : "msg-assistant"
                        )}
                        variants={itemVariants}
                        layout
                      >
                        <p>{m.text}</p>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>

              {/* suggestions */}
              <AnimatePresence>
                {suggestions.length > 0 && !isSending && (
                  <motion.div
                    className="chat-suggestions"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={PANEL_SPRING}
                  >
                    {suggestions.map((s, i) => (
                      <motion.button
                        key={`${s}-${i}`}
                        className="chat-suggestion"
                        onClick={() => setInput(s)}
                        variants={chipVariants}
                        initial="hidden"
                        animate="visible"
                        whileTap={{ scale: 0.98 }}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={endRef} />
              <div className="chat-safearea" />
            </div>

            <footer className="chat-inputbar">
              <motion.input
                className="chat-input"
                placeholder={t("chat.placeholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                onKeyDown={onKeyDown}
                disabled={isSending}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={ITEM_SPRING}
              />
              <motion.button
                className="btn btn-primary chat-send"
                onClick={handleSend}
                disabled={isSending}
                whileTap={{ scale: 0.98 }}
                transition={ITEM_SPRING}
              >
                {isSending ? t("chat.sending") : t("chat.send")}
              </motion.button>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
