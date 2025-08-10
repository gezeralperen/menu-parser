// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { ParsedMenu } from "@/types/menu";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  StringOutputParser,
  StructuredOutputParser,
} from "@langchain/core/output_parsers";
import { z } from "zod";
import { OutputFixingParser } from "langchain/output_parsers";
import { LANGUAGES } from "@/lib/languages";

type ChatHistoryItem = { role: "user" | "assistant"; text: string };

type ChatRequest = {
  locale?: string; // "tr" | "en" | ...
  question: string; // passenger’s current question
  menu?: ParsedMenu | null; // parsed menu context
  history?: ChatHistoryItem[]; // previous turns to preserve context
};

type ChatSuccess = { answer: string; suggestions: string[] };
type ChatError = {
  error: { code: "BAD_REQUEST" | "LLM_ERROR"; message: string };
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// --- Utilities ---------------------------------------------------------------

function summarizeMenu(menu?: ParsedMenu | null): string {
  if (!menu) return "No menu context provided.";
  const sections = menu.sections.map((sec) => {
    const entries = sec.entries.map((e) =>
      e.type === "item"
        ? `ITEM: ${e.item.name.text}`
        : `CHOICE(${e.group.min}-${e.group.max}): ${
            e.group.title?.text ?? "Choice"
          } -> ${e.group.options.map((o) => o.name.text).join(", ")}`
    );
    return { section: sec.name.text, entries };
  });
  return JSON.stringify(sections);
}

function summarizeHistory(history: ChatHistoryItem[] = []): string {
  // Keep last ~8 turns to stay concise
  const recent = history.slice(-8);
  return recent.map((h) => `${h.role.toUpperCase()}: ${h.text}`).join("\n");
}

// --- LangChain pipeline (structured output) ----------------------------------

const OutputSchema = z.object({
  answer: z.string().min(1),
  suggestions: z.array(z.string().min(1)).min(2).max(5), // keep it tidy
});

const parser = StructuredOutputParser.fromZodSchema(OutputSchema);

export const prompt = new PromptTemplate({
  template: `SYSTEM:
You are an in-flight MENU assistant for passengers. Use ONLY the provided menu context as your primary source.
OUTPUT LANGUAGE: {localeName}. Always respond only in {localeName}, even if history used other languages.

TONE:
- Be warm, concise, and practical—like a helpful seat neighbor.
- If details are missing, it's OK to infer typical preparation with gentle hedging (e.g., "genellikle", "muhtemelen", "çoğu zaman böyle yapılır").
- When you infer, mark it clearly as a general expectation (e.g., "genelde", "tipik olarak") and avoid confident claims.

GUIDANCE:
- If the user states a preference/restriction (low-fat, not spicy, vegetarian, halal, gluten-free, nut allergy, etc.), recommend items that best match from THIS MENU.
- Use cooking hints when available (e.g., grilled/steamed ≈ lighter; fried/creamy/buttery ≈ richer).
- If information is not in the menu, you may add brief, widely-known context about that dish’s usual style—clearly marked as typical, not guaranteed.
- For health/allergen certainty or exact preparation, add a soft disclaimer like: "Kesin bilgi için kabin ekibine danışın."
- Do NOT invent prices or availability not shown. If something isn’t listed, say it’s not specified.

MENU (compact JSON):
{menu_outline}

CHAT HISTORY (most recent last):
{history}

USER QUESTION:
{question}

OUTPUT SHAPE:
Return ONE JSON object with:
{format_instructions}

NOTES:
- "answer": Give the full answer directly addressing the user’s question, including any gentle, clearly-labeled inference when helpful, plus a short "kabin ekibi" disclaimer if relevant.
- "suggestions": 2–5 short follow-up questions the user might tap, relevant to THIS menu and the user’s request.
- Do not include extra commentary, code fences, or text outside the JSON.`,
  inputVariables: [
    "localeName",
    "menu_outline",
    "history",
    "question",
    "format_instructions",
  ] as const,
});

async function runChain({
  question,
  locale,
  menu,
  history,
}: {
  question: string;
  locale?: string;
  menu?: ParsedMenu | null;
  history?: ChatHistoryItem[];
}): Promise<z.infer<typeof OutputSchema>> {
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

  const llm = new ChatOpenAI({
    apiKey: OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.2,
    maxTokens: 3000,
    modelKwargs: { response_format: { type: "json_object" } },
  });

  const rawChain = RunnableSequence.from([
    prompt,
    llm,
    new StringOutputParser(),
  ]);

  const language = LANGUAGES.find((e) => e.code == locale) ?? LANGUAGES[1];

  const language_text = `${language.native}`;

  const invoke = {
    localeName: language_text,
    menu_outline: summarizeMenu(menu ?? null),
    history: summarizeHistory(history ?? []),
    question,
    // Strong instruction to return ONLY JSON
    format_instructions: parser.getFormatInstructions(),
  };
  console.log(invoke);
  const raw = await rawChain.invoke(invoke);

  // 2) Try strict parse; if it fails, run through a fixer model once
  try {
    return await parser.parse(raw);
  } catch (_e) {
    // Attempt to coerce to the schema using the same LLM
    const fixer = OutputFixingParser.fromLLM(llm, parser);
    try {
      return await fixer.parse(raw);
    } catch (e2) {
      // Final safety: return a minimal, valid structure to avoid 500s
      if (process.env.NODE_ENV !== "production") {
        console.error(
          `⚠️ Failed to parse. Text: ${JSON.stringify(raw)}. Error: ${String(
            e2
          )} Troubleshooting URL: https://js.langchain.com/docs/troubleshooting/errors/OUTPUT_PARSING_FAILURE/`
        );
      }
      return {
        answer:
          locale === "tr"
            ? "Üzgünüm, şu anda yanıtı biçimlendiremedim."
            : "Sorry, I couldn’t format the answer right now.",
        suggestions:
          locale === "tr"
            ? [
                "Ana yemekleri görebilir miyim?",
                "Vejetaryen seçenekler hangileri?",
              ]
            : ["Can I see the main courses?", "Which items are vegetarian?"],
      };
    }
  }
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
