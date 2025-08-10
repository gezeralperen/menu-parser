// app/api/parse-menu/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import { LANGUAGES } from "@/lib/languages";
import type {
  ParsedMenu,
  MenuSection,
  SectionEntry,
  ChoiceGroup,
  MenuItem,
  MenuItemGroup,
} from "@/types/menu";
import type { ApiError } from "@/types/api";
import { parsedMenuTR } from "@/lib/dummy_menu";
import { number } from "zod/v4";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// ---- Zod schema mirrors your Typescript types (strict, no `any`) ----
const LstrSchema = z.object({
  text: z.string(),
  original: z.string().optional(),
});

const MenuItemSchema: z.ZodType<MenuItem> = z.object({
  id: z.string(),
  name: LstrSchema,
  description: LstrSchema.optional(),
  price: z.string().optional(),
  allergens: z.array(z.string()).optional(),
  dietary_labels: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

const MenuItemGroupSchema: z.ZodType<MenuItemGroup> = z.object({
  id: z.string(),
  items: z.array(MenuItemSchema),
});

const ChoiceGroupSchema: z.ZodType<ChoiceGroup> = z.object({
  id: z.string(),
  title: LstrSchema.optional(),
  prompt: LstrSchema.optional(),
  min: z.number(),
  max: z.number(),
  options: z.union([z.array(MenuItemSchema), z.array(MenuItemGroupSchema)]),
});

const SectionEntrySchema: z.ZodType<SectionEntry> = z.discriminatedUnion(
  "type",
  [
    z.object({ type: z.literal("item"), item: MenuItemSchema }),
    z.object({ type: z.literal("choice"), group: ChoiceGroupSchema }),
  ]
);

const MenuSectionSchema: z.ZodType<MenuSection> = z.object({
  id: z.string().min(1),
  name: LstrSchema,
  period: z.enum(["takeoff", "cruise", "before_landing"]).optional(),
  entries: z.array(SectionEntrySchema),
});

// ---- 1) Schema the MODEL should return (no `source`) ----
const ModelParsedMenuSchema = z.object({
  locale: z.string().min(1),
  currency: z.string().optional(),
  sections: z.array(MenuSectionSchema).default([]),
  warnings: z.array(z.string()).optional(),
  suggestions: z.array(z.string()).optional(),
});

// (Optional) keep a validator for your final runtime object if you want
// to double-check after stamping `source`:
const ParsedMenuRuntimeSchema = z.object({
  source: z.literal("vision-llm"),
  locale: z.string().min(1),
  currency: z.string().optional(),
  sections: z.array(MenuSectionSchema),
  warnings: z.array(z.string()).optional(),
  suggestions: z.array(z.string()).optional(),
});

// ---- Prompt helper (kept concise; model returns ONLY JSON per schema) ----
function systemPrompt(languageText: string) {
  return [
    "You are an in-flight menu parsing assistant.",
    "Read the printed menu from the provided image and return a clean, structured JSON object.",
    "",
    "LANGUAGE:",
    `- The UI locale is "${languageText}". ALL user-visible strings in the output MUST be in "${languageText}".`,
    "- If the menu text is in another language, TRANSLATE section names, item names, descriptions, allergens, and dietary labels.",
    '- Preserve original text (if different) in "original" fields of name/description.',
    "",
    "CONTENT RULES:",
    "- Detect sections/categories and translate their names.",
    "- Extract items with name, description (if present), and any visible price (keep price as seen).",
    "- Detect allergens and dietary labels (vegetarian, vegan, halal, gluten-free) when stated or strongly implied.",
    "- If unsure, omit the field rather than guessing.",
    '- Include a "suggestions" array with 2–5 short follow-up questions the user might tap, relevant to THIS menu and the user’s request.',
    "",
    "OUTPUT:",
    'Return ONLY a single JSON object with EXACTLY these top-level keys and shapes. Do NOT wrap in any extra object (no { "menu": ... }). Do NOT include null values; if unknown, omit the field entirely.',
    "",
    "{",
    '  "locale": "string",',
    '    // REQUIRED. BCP-47 language code of the localized UI (e.g., "tr" for Turkish).',
    "    // MUST exactly match the target UI locale passed in the request, not detected from text.",
    "",
    '  "currency": "string"?,',
    '    // OPTIONAL. ISO 4217 currency code (e.g., "USD", "EUR", "TRY").',
    "    // Extract from menu prices if consistently printed. If unclear or mixed, omit.",
    "    // Never output null; omit if not certain.",
    "",
    '  "sections": [',
    "    // REQUIRED. Array of menu sections, in printed order.",
    "    {",
    '      "id": "string",',
    "        // REQUIRED. Stable kebab-case identifier for the section, derived from the section's localized name.",
    '        // e.g., "before-landing" for "İnişten Önce".',
    "",
    '      "name": {',
    '        "text": "string",',
    "          // REQUIRED. Localized display name for this section, in target UI language.",
    '        "original": "string"?',
    "          // OPTIONAL. Original OCR text exactly as printed, if different from localized.",
    "      },",
    "",
    '      "period": "takeoff" | "cruise" | "before_landing"?,',
    "        // OPTIONAL. Logical service phase hint (only if clearly implied by menu).",
    "",
    '      "entries": [',
    "        // REQUIRED. Items within the section, in printed order.",
    "        {",
    '          "type": "item",',
    '          "item": {',
    '            "id": "string",',
    "              // REQUIRED. Stable kebab-case ID from item name (unique in this menu).",
    "",
    '            "name": {',
    '              "text": "string",',
    "                // REQUIRED. Localized item name for display.",
    '              "original": "string"?',
    "                // OPTIONAL. Original OCR text if different from localized.",
    "            },",
    "",
    '            "description": {',
    '              "text": "string",',
    "                // REQUIRED if present in menu. Localized description text.",
    '              "original": "string"?',
    "                // OPTIONAL. Original OCR text if different from localized.",
    "            }?,",
    "",
    '            "price": "string"?,',
    '              // OPTIONAL. As printed, including currency symbol/spacing (e.g., "€12", "120₺").',
    "",
    '            "allergens": ["string"]?,',
    '              // OPTIONAL. Localized allergen names (e.g., ["gluten", "balık"]).',
    "",
    '            "dietary_labels": ["string"]?,',
    '              // OPTIONAL. Localized dietary labels (e.g., "vejetaryen", "helal").',
    "",
    '            "notes": "string"?',
    "              // OPTIONAL. Any other short notes printed alongside the item.",
    "          }",
    "        }",
    "        |",
    "        {",
    '          "type": "choice",',
    '          "group": {',
    '            "id": "string",',
    "              // REQUIRED. Stable kebab-case identifier for the choice group title/prompt.",
    "",
    '            "title": {',
    '              "text": "string",',
    "                // REQUIRED if present in menu. Localized choice group title.",
    '              "original": "string"?',
    "                // OPTIONAL. Original OCR text if different.",
    "            }?,",
    "",
    '            "prompt": {',
    '              "text": "string",',
    '              "original": "string"?',
    "            }?,",
    "              // OPTIONAL. Extra UI prompt text if present (distinct from title).",
    "",
    '            "min": number,',
    "              // REQUIRED. Minimum selections allowed in this group.",
    '            "max": number,',
    "              // REQUIRED. Maximum selections allowed in this group.",
    "",
    '             "options": [',
    "              // REQUIRED. Can be EITHER:",
    "              //  1) An array of MenuItem objects, where each object directly represents a selectable item.",
    "              //       MenuItem object shape:",
    "              //       {",
    '              //         "id": "string",              // REQUIRED. Stable kebab-case identifier from item name.',
    '              //         "name": {',
    '              //           "text": "string",          // REQUIRED. Localized option name.',
    '              //           "original": "string"?      // OPTIONAL. Original OCR text if different.',
    "              //         },",
    '              //         "description": {',
    '              //           "text": "string",',
    '              //           "original": "string"?',
    "              //         }?,",
    '              //         "price": "string"?,           // OPTIONAL. As printed, including currency symbol.',
    '              //         "allergens": ["string"]?,     // OPTIONAL. Localized allergen names.',
    '              //         "dietary_labels": ["string"]?,// OPTIONAL. Localized dietary labels.',
    '              //         "notes": "string"?            // OPTIONAL. Short notes printed alongside.',
    "              //       }",
    "              //  2) An array of MenuItemGroup objects, where each group contains:",
    "              //       {",
    '              //         "id": "string",        // REQUIRED. Stable kebab-case identifier for the group.',
    '              //         "items": MenuItem[]    // REQUIRED. Array of MenuItem objects belonging to this group.',
    "              //       }",
    "              // Use MenuItemGroup if the printed menu explicitly groups selectable options under subheadings within a choice group.",
    "              // Do NOT mix MenuItem and MenuItemGroup within the same array; choose one format consistently for this choice group.",
    "            ]",
    "          }",
    "        }",
    "      ]",
    "    }",
    "  ],",
    "",
    '  "warnings": ["string"]?,',
    "    // OPTIONAL. Localized cautionary or service notes explicitly printed in the menu.",
    '    // Example: "Bazı yemekler iniş sırasında servis dışı olabilir."',
    "    // Omit if none.",
    "",
    '  "suggestions": ["string"],',
    "    // REQUIRED. 2–5 short, localized follow-up questions relevant to THIS menu and THIS user's request.",
    '    // Example: "Hangi seçenekler vejetaryen?", "Tatlı var mı?"',
    "    // Keep questions short enough for tap UI. Never generic or unrelated.",
    "}",
    "",
    "STRICT RULES:",
    "- Output JSON ONLY (no markdown, no comments, no prose).",
    "- Do NOT output null; omit missing fields entirely.",
    "- Do NOT fabricate items, sections, or data not visible in the source image.",
    "- Preserve printed order for sections and entries.",
    "- Translate all `text` fields into target UI language; preserve original in `original` only if different.",
    "- Ensure `locale` exactly equals the UI language code provided in the request.",
  ].join("\n");
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function POST(req: NextRequest) {
  await delay(3000);
  return NextResponse.json<ParsedMenu>(parsedMenuTR, { status: 200 });

  try {
    const form = await req.formData();
    const file = form.get("image") as File | null;
    const locale = (form.get("locale") as string | null) ?? "en";

    const language = LANGUAGES.find((e) => e.code === locale);
    if (!language) {
      return NextResponse.json<ApiError>(
        {
          error: {
            code: "LOCALE_UNSUPPORTED",
            message: "Locale is not supported",
          },
        },
        { status: 400 }
      );
    }
    if (!file) {
      return NextResponse.json<ApiError>(
        { error: { code: "BAD_REQUEST", message: "image is required" } },
        { status: 400 }
      );
    }
    if (!OPENAI_API_KEY) {
      return NextResponse.json<ApiError>(
        { error: { code: "SERVER_CONFIG", message: "OPENAI_API_KEY missing" } },
        { status: 500 }
      );
    }

    // Read file → data URL (no disk writes)
    const bytes = Buffer.from(await file.arrayBuffer());
    const b64 = bytes.toString("base64");
    const dataUrl = `data:${file.type || "image/jpeg"};base64,${b64}`;

    const languageText = `${language.english} / ${language.native}`;

    // Vision LLM with structured output (JSON forced)
    const base = new ChatOpenAI({
      apiKey: OPENAI_API_KEY,
      model: MODEL,
      temperature: 0.2,
      maxTokens: 2000,
      // Helps OpenAI produce valid JSON objects
      modelKwargs: { response_format: { type: "json_object" } },
    });

    // Ask model to emit exactly ParsedMenuSchema
    const llm = base.withStructuredOutput(ModelParsedMenuSchema, {
      name: "parsed_menu_schema",
      // optional: give short schema description to the model
      method: "jsonMode",
    });

    const sys = new SystemMessage(systemPrompt(languageText));
    const user = new HumanMessage({
      content: [
        { type: "text", text: `UI locale: ${locale} (${languageText})` },
        { type: "image_url", image_url: { url: dataUrl } }, // ✅ wrap as object
        { type: "text", text: "Return ONLY the JSON object per the schema." },
      ],
    });

    const result = await llm.invoke([sys, user]); // <- parsed & typed by Zod

    // Ensure required fields and stamp source/locale
    const parsed: ParsedMenu = {
      source: "vision-llm",
      locale, // override with the requested locale to be safe
      currency: result.currency,
      sections: result.sections ?? [],
      warnings: result.warnings,
      suggestions: result.suggestions ?? [],
    };

    ParsedMenuRuntimeSchema.parse(parsed);

    return NextResponse.json<ParsedMenu>(parsed, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json<ApiError>(
      { error: { code: "UNEXPECTED", message } },
      { status: 500 }
    );
  }
}
