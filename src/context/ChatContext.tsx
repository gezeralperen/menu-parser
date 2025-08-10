"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMenu } from "@/context/MenuContext";
import { useLanguage } from "@/context/LanguageContext";

export type ChatRole = "user" | "assistant" | "system";
export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: number;
};

type ChatSuccess = { answer: string; suggestions: string[] };

type ChatState = {
  messages: ChatMessage[];
  suggestions: string[];
  isSending: boolean;
  addUserMessage: (text: string) => void;
  send: (text: string) => Promise<void>;
  clear: () => void;
  setSuggestions: (s: string[]) => void;
};

const ChatContext = createContext<ChatState | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { menu } = useMenu();
  const { code } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const ctrlRef = useRef<AbortController | null>(null);

  const addUserMessage = useCallback((text: string) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: text.trim(),
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const clear = useCallback(() => {
    ctrlRef.current?.abort();
    ctrlRef.current = null;
    setMessages([]);
    setSuggestions([]);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content) return;

      // Optimistically append user message
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        text: content,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);

      setIsSending(true);
      ctrlRef.current?.abort();
      const ctrl = new AbortController();
      ctrlRef.current = ctrl;

      try {
        // Prepare compact history for the API (exclude system messages)
        const history = messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({ role: m.role as "user" | "assistant", text: m.text }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            locale: code,
            question: content,
            menu, // send parsed menu for grounding
            history, // prior turns
          }),
          signal: ctrl.signal,
        });

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          // Non-JSON failure
          const fallbackText = await res.text();
          throw new Error(fallbackText || "Unexpected response");
        }

        const payload = (await res.json()) as
          | ChatSuccess
          | { error: { message: string } };

        if (!res.ok || "error" in payload) {
          const message =
            "error" in payload ? payload.error.message : "Request failed";
          const errMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            text: `⚠️ ${message}`,
            createdAt: Date.now(),
          };
          setMessages((prev) => [...prev, errMsg]);
          return;
        }

        // Success: append assistant answer and update suggestions
        const botMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: payload.answer ?? "Sorry, I couldn’t generate a response.",
          createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setSuggestions(
          Array.isArray(payload.suggestions) ? payload.suggestions : []
        );
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        const errMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "⚠️ Network error. Please try again.",
          createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsSending(false);
      }
    },
    [code, menu, messages]
  );

  const value = useMemo<ChatState>(
    () => ({
      messages,
      suggestions,
      isSending,
      addUserMessage,
      send,
      clear,
      setSuggestions,
    }),
    [messages, suggestions, isSending, addUserMessage, send, clear]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatState {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within <ChatProvider>");
  return ctx;
}
