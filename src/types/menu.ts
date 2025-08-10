/** Localized simple fields with optional original text for traceability */
type Lstr = {
  text: string; // localized for UI
  original?: string; // original OCR text if different
};

/** Atomic, selectable dish/option */
export type MenuItem = {
  id: string;
  name: Lstr;
  description?: Lstr;
  price?: string; // keep as printed (e.g., "€12", "120₺")
  allergens?: string[]; // localized
  dietary_labels?: string[]; // localized (e.g., "vejetaryen", "helal")
  notes?: string;
};

/** A group of mutually exclusive or multi-select choices */
export type ChoiceGroup = {
  id: string;
  title?: Lstr; // e.g., "Lütfen seçiminizi yapınız"
  prompt?: Lstr; // extra UI prompt if needed
  min: number; // minimum selections required
  max: number; // maximum selections allowed
  options: MenuItem[]; // the items a passenger can choose from
};

/** Section entries can be a plain item or a choice group */
export type SectionEntry =
  | { type: "item"; item: MenuItem }
  | { type: "choice"; group: ChoiceGroup };

/** Logical grouping on the card (breakfast, mains, before landing, etc.) */
export type MenuSection = {
  id: string;
  name: Lstr;
  period?: "takeoff" | "cruise" | "before_landing"; // optional UX hint
  entries: SectionEntry[];
};

export type ParsedMenu = {
  source: "vision-llm";
  locale: string; // e.g., "tr"
  currency?: string; // optional global hint if printed
  sections: MenuSection[];
  warnings?: string[];
};
