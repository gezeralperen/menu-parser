// src/schema/menu.ts
import { z } from "zod";

/** Localized simple fields with optional original text for traceability */
export const LstrSchema = z.object({
  text: z.string().min(1),
  original: z.string().min(1).optional(),
});

/** Atomic, selectable dish/option */
export const MenuItemSchema = z.object({
  id: z.string().min(1),
  name: LstrSchema,
  description: LstrSchema.optional(),
  price: z.string().optional(), // keep as printed (e.g., "€12", "120₺")
  allergens: z.array(z.string().min(1)).optional(), // localized
  dietary_labels: z.array(z.string().min(1)).optional(), // localized (e.g., "vejetaryen", "helal")
  notes: z.string().optional(),
});

/** Group of items (for grouped choices like "sides" / "breads") */
export const MenuItemGroupSchema = z.object({
  id: z.string().min(1),
  items: z.array(MenuItemSchema).min(1),
});

/** options can be EITHER MenuItem[] OR MenuItemGroup[] (no mixing) */
export const ChoiceOptionsSchema = z.union([
  z.array(MenuItemSchema).min(1),
  z.array(MenuItemGroupSchema).min(1),
]);

/** Choice group (mutually exclusive or multi-select) */
export const ChoiceGroupSchema = z.object({
  id: z.string().min(1),
  title: LstrSchema.optional(),
  prompt: LstrSchema.optional(),
  min: z.number().int().nonnegative(),
  max: z.number().int().positive(),
  options: ChoiceOptionsSchema,
});

/** Section entries: item OR choice group */
export const SectionEntrySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("item"), item: MenuItemSchema }),
  z.object({ type: z.literal("choice"), group: ChoiceGroupSchema }),
]);

/** Logical grouping (breakfast, mains, before landing, etc.) */
export const MenuSectionSchema = z.object({
  id: z.string().min(1),
  name: LstrSchema,
  period: z.enum(["takeoff", "cruise", "before_landing"]).optional(),
  entries: z.array(SectionEntrySchema),
});

/**
 * Model-facing schema (what LLM should output).
 * No `source` field here — we’ll stamp that server-side.
 */
export const ModelParsedMenuSchema = z.object({
  locale: z.string().min(1),
  currency: z.string().optional(),
  sections: z.array(MenuSectionSchema).default([]),
  warnings: z.array(z.string()).optional(),
  suggestions: z.array(z.string()).optional(),
});

/** Final runtime schema used by the app (after stamping `source`) */
export const ParsedMenuRuntimeSchema = z.object({
  source: z.literal("vision-llm"),
  locale: z.string().min(1),
  currency: z.string().optional(),
  sections: z.array(MenuSectionSchema),
  warnings: z.array(z.string()).optional(),
  suggestions: z.array(z.string()).default([]),
});

export type Lstr = z.infer<typeof LstrSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type MenuItemGroup = z.infer<typeof MenuItemGroupSchema>;
export type ChoiceGroup = z.infer<typeof ChoiceGroupSchema>;
export type SectionEntry = z.infer<typeof SectionEntrySchema>;
export type MenuSection = z.infer<typeof MenuSectionSchema>;
export type ParsedMenuModelOut = z.infer<typeof ModelParsedMenuSchema>;
export type ParsedMenuRuntime = z.infer<typeof ParsedMenuRuntimeSchema>;
