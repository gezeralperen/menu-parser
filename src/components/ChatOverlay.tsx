"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useChat } from "@/context/ChatContext";
import "@/styles/chat.css";

export function ChatOverlay() {
  const { messages, isSending, send } = useChat();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

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

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  // prevent wheel/touch from scrolling the page when interacting with chat
  const stopScrollPropagation = (e: React.UIEvent) => e.stopPropagation();

  return (
    <>
      <button
        className={clsx("chat-toggle", open && "is-open")}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="chat-panel"
      >
        {open ? "Close Chat" : "Ask about this menu"}
      </button>

      <section
        id="chat-panel"
        className={clsx("chat-panel", open && "is-open")}
        aria-label="Menu assistant chat"
        onWheelCapture={stopScrollPropagation}
        onTouchMove={
          stopScrollPropagation as unknown as React.TouchEventHandler
        }
      >
        <button
          className="chat-grabber"
          aria-label="Collapse chat"
          onClick={() => setOpen(false)}
        />

        <header className="chat-header">
          <strong className="chat-title">Assistant</strong>
          <button className="chat-collapse" onClick={() => setOpen(false)}>
            Collapse
          </button>
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
          {messages.length === 0 ? (
            <p className="chat-empty">
              Ask about allergens, ingredients, or suitable choices.
            </p>
          ) : (
            <ul className="chat-stream">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={clsx(
                    "chat-msg",
                    m.role === "user" ? "msg-user" : "msg-assistant"
                  )}
                >
                  <p>{m.text}</p>
                </li>
              ))}
            </ul>
          )}
          <div ref={endRef} />
          <div className="chat-safearea" />
        </div>

        <footer className="chat-inputbar">
          <textarea
            className="chat-input"
            placeholder="Type your question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            onKeyDown={onKeyDown}
            disabled={isSending}
          />
          <button
            className="btn btn-primary chat-send"
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? "Sending…" : "Send"}
          </button>
        </footer>
      </section>
    </>
  );
}
