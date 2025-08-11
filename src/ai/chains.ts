// src/ai/chains.ts
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { chatPrompt } from "./prompts";
import { ModelParsedMenuSchema } from "@/schema/menu";
import { z } from "zod";

export const ChatOutputSchema = z.object({
  answer: z.string().min(1),
  suggestions: z.array(z.string().min(1)).optional().default([]),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

/** Central LLM factory (single place for model/temperature/tokens). */
export function getChatLLM(opts?: {
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}) {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const temperature = opts?.temperature ?? 0.2;
  const maxTokens = opts?.maxTokens ?? 800;

  return new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model,
    temperature,
    maxTokens,
    // When jsonMode is needed, enable OpenAI's JSON mode hint
    ...(opts?.jsonMode
      ? { modelKwargs: { response_format: { type: "json_object" } } }
      : {}),
  });
}

/** Builder: vision parsing chain that emits the shared Zod schema. */
export function buildParseMenuChain() {
  const llm = getChatLLM({ temperature: 0.2, maxTokens: 2000, jsonMode: true });
  return llm.withStructuredOutput(ModelParsedMenuSchema, {
    name: `parsed_menu_schema`,
    method: "jsonMode",
  });
}

/** Builder: chat Q&A chain (text out). */
export function buildChatChain() {
  const llm = getChatLLM({
    temperature: 0.2,
    maxTokens: 600,
    jsonMode: true, // important for OpenAI JSON mode
  });

  // Pipe the prompt into an LLM that enforces the schema
  return chatPrompt.pipe(
    llm.withStructuredOutput(ChatOutputSchema, {
      name: "chat_output",
      method: "jsonMode",
    })
  );
}

/** Helpers to construct LangChain messages for the parse chain. */
export function makeParseMessages(
  systemText: string,
  dataUrl: string,
  locale: string
) {
  const sys = new SystemMessage(systemText);
  const user = new HumanMessage({
    content: [
      { type: "text", text: `UI locale: ${locale}` },
      // NOTE: OpenAI Responses expects an object for images in LangChain:
      { type: "image_url", image_url: { url: dataUrl } },
      { type: "text", text: "Return ONLY the JSON object per the schema." },
    ],
  });
  return [sys, user] as const;
}
