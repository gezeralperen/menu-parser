// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import { LANGUAGES } from "@/lib/languages";
import { MenuItem, MenuItemGroup, ParsedMenuRuntime } from "@/schema/menu";
import { buildChatChain, ChatOutputSchema } from "@/ai/chains";

type ChatHistoryItem = { role: "user" | "assistant"; text: string };

type ChatRequest = {
  locale?: string; // "tr" | "en" | ...
  question: string; // passenger’s current question
  menu?: ParsedMenuRuntime | null; // parsed menu context
  history?: ChatHistoryItem[]; // previous turns to preserve context
};

type ChatSuccess = { answer: string; suggestions: string[] };
type ChatError = {
  error: { code: "BAD_REQUEST" | "LLM_ERROR"; message: string };
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// --- Utilities ---------------------------------------------------------------

function summarizeMenu(menu?: ParsedMenuRuntime | null): string {
  if (!menu) return "No menu context provided.";

  const sections = menu.sections.map((sec) => {
    const entries = sec.entries.map((e) => {
      if (e.type === "item") {
        return `ITEM: ${e.item.name.text}`;
      } else {
        // Handle MenuItem[] or MenuItemGroup[]
        let optionItems: MenuItem[] = [];
        if (Array.isArray(e.group.options) && e.group.options.length > 0) {
          if ("items" in e.group.options[0]) {
            // MenuItemGroup[]
            optionItems = (e.group.options as MenuItemGroup[]).flatMap(
              (g) => g.items
            );
          } else {
            // MenuItem[]
            optionItems = e.group.options as MenuItem[];
          }
        }
        const itemNames = optionItems.map((o) => o.name.text);
        return `CHOICE(${e.group.min}-${e.group.max}): ${
          e.group.title?.text ?? "Choice"
        } -> ${itemNames.join(", ")}`;
      }
    });
    return { section: sec.name.text, entries };
  });

  return JSON.stringify(sections);
}

function summarizeHistory(history: ChatHistoryItem[] = []): string {
  // Keep last ~8 turns to stay concise
  const recent = history.slice(-8);
  return recent.map((h) => `${h.role.toUpperCase()}: ${h.text}`).join("\n");
}

async function runChain({
  question,
  locale,
  menu,
  history,
}: {
  question: string;
  locale?: string;
  menu?: ParsedMenuRuntime | null;
  history?: ChatHistoryItem[];
}): Promise<z.infer<typeof ChatOutputSchema>> {
  // Dev-safe fallback if no key configured
  if (!OPENAI_API_KEY) {
    return {
      answer:
        locale === "tr"
          ? "Bu bir örnek yanıttır. Sunucu LLM yapılandırıldığında gerçek yanıtlar üretilecektir."
          : "This is a demo answer. Configure the server LLM to generate real answers.",
      suggestions:
        locale === "tr"
          ? [
              "Vejetaryen seçenekler hangileri?",
              "Alerjen içeren ürünler var mı?",
              "Ana yemekleri kısaca anlatır mısın?",
            ]
          : [
              "Which items are vegetarian?",
              "Which dishes contain common allergens?",
              "Can you summarize the main courses?",
            ],
    };
  }

  const chain = buildChatChain();

  const language = LANGUAGES.find((e) => e.code == locale) ?? LANGUAGES[1];

  const language_text = `${language.native}`;

  const invoke = {
    localeName: language_text,
    menu_outline: summarizeMenu(menu ?? null),
    history: summarizeHistory(history ?? []),
    question,
  };

  const response = await chain.invoke(invoke);
  return {
    ...response,
    suggestions: response.suggestions ?? [],
  };
}

// --- Route -------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const { question, menu, locale, history }: ChatRequest = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json<ChatError>(
        { error: { code: "BAD_REQUEST", message: "Missing 'question'." } },
        { status: 400 }
      );
    }

    const { answer, suggestions } = await runChain({
      question,
      locale,
      menu: menu ?? null,
      history: history ?? [],
    });

    return NextResponse.json<ChatSuccess>({ answer, suggestions });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json<ChatError>(
      { error: { code: "LLM_ERROR", message } },
      { status: 500 }
    );
  }
}
