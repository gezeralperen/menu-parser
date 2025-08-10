// app/api/parse-menu/route.ts
import { parsedMenuTR } from "@/lib/dummy_menu";
import { LANGUAGES } from "@/lib/languages";
import { ApiError, toApiErrorFromProvider } from "@/types/api";
import { ParsedMenu } from "@/types/menu";
import { NextRequest, NextResponse } from "next/server";

// Tip: set your key in .env.local as OPENAI_API_KEY=xxxxx
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export async function POST(req: NextRequest) {
  return NextResponse.json(parsedMenuTR, { status: 200 });
  try {
    // 1) Parse multipart form
    const form = await req.formData();
    const file = form.get("image") as File | null;
    const locale = (form.get("locale") as string | null) ?? "en";

    const language = LANGUAGES.find((e) => e.code == locale);
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
    const language_text = `${language.code} : ${language.english} / ${language.native}`;

    if (!file) {
      return NextResponse.json({ error: "image is required" }, { status: 400 });
    }

    // 2) Read into base64 data URL (no server-side file writes)
    const bytes = Buffer.from(await file.arrayBuffer());
    const b64 = bytes.toString("base64");
    const dataUrl = `data:${file.type || "image/jpeg"};base64,${b64}`;

    // 3) Compose the prompt (no OCR libs; ask the model to read text)
    const system = `
You are an in-flight menu parsing assistant.

GOAL:
Read the printed menu from the provided image and return a clean, structured JSON object.

LANGUAGE:
- The UI locale is "${language_text}". ALL user-visible strings in the output MUST be in "${language_text}".
- If the menu text is in another language, TRANSLATE section names, item names, descriptions, allergens, and dietary labels into "${language_text}".
- Preserve the original text (if different) in optional fields: "original_name" and "original_description".

CONTENT RULES:
- Detect sections/categories (e.g., Starters, Mains, Desserts, Drinks) and translate section names into "${language_text}".
- Extract items with name, description (if present), and any visible price (keep price as seen, including currency symbol).
- Detect allergens and dietary labels (e.g., vegetarian, vegan, halal, gluten-free). Translate these labels into "${language_text}".
- If unsure about a value, OMIT the field rather than guessing.

OUTPUT FORMAT:
Return JSON ONLY, matching this shape exactly (no markdown, no commentary):

{
  "source": "vision-llm",
  "locale": "${language_text}",
  "sections": [
    {
      "name": "string (localized)",
      "items": [
        {
          "name": "string (localized)",
          "description": "string (localized, optional)",
          "allergens": ["string (localized)"]?,
          "dietary_labels": ["string (localized)"]?,
          "notes": "string (optional)"
        }
      ]
    }
  ],
  "warnings": ["string"]?
}
- Do not include keys with null/empty values.
- Do not include any text outside the JSON object.
`;

    // 4) Ask the model to return a strict JSON object
    // If you're using OpenAI Responses API with image input:
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // any vision-capable JSON model you have access to
        text: { format: { type: "json_object" } },
        input: [
          {
            role: "system",
            content: [
              { type: "input_text", text: system }, // use "text" here
            ],
          },
          {
            role: "user",
            content: [
              { type: "input_text", text: `UI locale to use: ${locale}` },
              { type: "input_image", image_url: dataUrl },
              {
                type: "input_text",
                text: "Return ONLY the JSON object per the schema. No markdown, no comments.",
              },
            ],
          },
        ],
        // Optional: mild temperature for precision
        temperature: 0.2,
      }),
    });

    if (!resp.ok) {
      const apiErr = await toApiErrorFromProvider(resp);
      // surface provider status if available; default to 502
      const status = resp.status && resp.status >= 400 ? resp.status : 502;
      return NextResponse.json<ApiError>(apiErr, { status });
    }

    const data = (await resp.json()) as {
      output?: Array<{ content?: Array<{ type: string; text?: string }> }>;
    };

    // 5) Pull the JSON string from the model’s response
    const fullText =
      data?.output
        ?.map((item) =>
          (item.content ?? []) // safe default
            .filter((c) => c.type === "output_text")
            .map((c) => c.text)
            .join("\n")
        )
        .join("\n") ?? "";

    // Find the first JSON block
    const match = fullText.match(/\{[\s\S]*?\}/);
    const jsonStr = match ? match[0] : "{}";
    // 6) Validate & coerce to our ParsedMenu shape
    let parsed: ParsedMenu;
    try {
      parsed = JSON.parse(jsonStr) as ParsedMenu;
    } catch {
      return NextResponse.json<ApiError>(
        {
          error: {
            code: "INVALID_MODEL_JSON",
            message: "Model did not return valid JSON.",
          },
        },
        { status: 502 }
      );
    }

    // Ensure required fields exist
    if (!parsed.sections) parsed.sections = [];
    parsed.source = "vision-llm";
    parsed.locale = locale;

    return NextResponse.json(parsed, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json<ApiError>(
      { error: { code: "UNEXPECTED", message } },
      { status: 500 }
    );
  }
}
