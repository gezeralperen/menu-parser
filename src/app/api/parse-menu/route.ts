// app/api/parse-menu/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LANGUAGES } from "@/lib/languages";

import type { ApiError } from "@/schema/api";
import { ParsedMenuRuntimeSchema } from "@/schema/menu";
import { buildParseMenuChain, makeParseMessages } from "@/ai/chains";
import { parseMenuSystemPrompt } from "@/ai/prompts";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export async function POST(req: NextRequest) {
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

    const chain = buildParseMenuChain();
    const sysText = parseMenuSystemPrompt(languageText);
    const [sys, user] = makeParseMessages(sysText, dataUrl, locale);
    const result = await chain.invoke([sys, user]);

    // Ensure required fields and stamp source/locale
    const parsed = {
      source: "vision-llm",
      locale, // override with the requested locale to be safe
      currency: result.currency,
      sections: result.sections ?? [],
      warnings: result.warnings,
      suggestions: result.suggestions ?? [],
    };

    ParsedMenuRuntimeSchema.parse(parsed);

    return NextResponse.json(parsed, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json<ApiError>(
      { error: { code: "UNEXPECTED", message } },
      { status: 500 }
    );
  }
}
