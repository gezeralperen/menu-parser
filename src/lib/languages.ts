export type LanguageCode =
  | "tr" // Turkish
  | "en" // English
  | "ru" // Russian
  | "de" // German
  | "ar" // Arabic
  | "fr" // French
  | "it" // Italian
  | "es" // Spanish
  | "nl" // Dutch
  | "uk" // Ukrainian
  | "fa" // Persian (Farsi)
  | "az" // Azerbaijani
  | "bg" // Bulgarian
  | "ro" // Romanian
  | "pl" // Polish
  | "ka" // Georgian
  | "hy" // Armenian
  | "sr" // Serbian
  | "bs" // Bosnian
  | "hr" // Croatian
  | "sq" // Albanian
  | "hu" // Hungarian
  | "kk" // Kazakh
  | "uz" // Uzbek
  | "ky" // Kyrgyz
  | "zh" // Chinese
  | "ja" // Japanese
  | "ko" // Korean
  | "sv" // Swedish
  | "no" // Norwegian
  | "da" // Danish
  | "fi" // Finnish
  | "cs" // Czech
  | "el" // Greek
  | "he" // Hebrew
  | "th" // Thai
  | "vi" // Vietnamese
  | "id" // Indonesian
  | "ms" // Malay
  | "pt" // Portuguese
  | "hi" // Hindi
  | "bn" // Bengali
  | "pa" // Punjabi
  | "mn"; // Mongolian

export type LangInfo = {
  code: LanguageCode;
  native: string;
  english: string;
  flag: string;
};

export const LANGUAGES: LangInfo[] = [
  { code: "tr", native: "Türkçe", english: "Turkish", flag: "🇹🇷" },
  { code: "en", native: "English", english: "English", flag: "🇬🇧" },
  { code: "ru", native: "Русский", english: "Russian", flag: "🇷🇺" },
  { code: "de", native: "Deutsch", english: "German", flag: "🇩🇪" },
  { code: "ar", native: "العربية", english: "Arabic", flag: "🇸🇦" },
  { code: "fr", native: "Français", english: "French", flag: "🇫🇷" },
  { code: "it", native: "Italiano", english: "Italian", flag: "🇮🇹" },
  { code: "es", native: "Español", english: "Spanish", flag: "🇪🇸" },
  { code: "nl", native: "Nederlands", english: "Dutch", flag: "🇳🇱" },
  { code: "uk", native: "Українська", english: "Ukrainian", flag: "🇺🇦" },
  { code: "fa", native: "فارسی", english: "Persian", flag: "🇮🇷" },
  { code: "az", native: "Azərbaycan dili", english: "Azerbaijani", flag: "🇦🇿" },
  { code: "bg", native: "Български", english: "Bulgarian", flag: "🇧🇬" },
  { code: "ro", native: "Română", english: "Romanian", flag: "🇷🇴" },
  { code: "pl", native: "Polski", english: "Polish", flag: "🇵🇱" },
  { code: "ka", native: "ქართული", english: "Georgian", flag: "🇬🇪" },
  { code: "hy", native: "Հայերեն", english: "Armenian", flag: "🇦🇲" },
  { code: "sr", native: "Српски", english: "Serbian", flag: "🇷🇸" },
  { code: "bs", native: "Bosanski", english: "Bosnian", flag: "🇧🇦" },
  { code: "hr", native: "Hrvatski", english: "Croatian", flag: "🇭🇷" },
  { code: "sq", native: "Shqip", english: "Albanian", flag: "🇦🇱" },
  { code: "hu", native: "Magyar", english: "Hungarian", flag: "🇭🇺" },
  { code: "kk", native: "Қазақ тілі", english: "Kazakh", flag: "🇰🇿" },
  { code: "uz", native: "Oʻzbekcha", english: "Uzbek", flag: "🇺🇿" },
  { code: "ky", native: "Кыргызча", english: "Kyrgyz", flag: "🇰🇬" },
  { code: "zh", native: "中文", english: "Chinese", flag: "🇨🇳" },
  { code: "ja", native: "日本語", english: "Japanese", flag: "🇯🇵" },
  { code: "ko", native: "한국어", english: "Korean", flag: "🇰🇷" },
  { code: "sv", native: "Svenska", english: "Swedish", flag: "🇸🇪" },
  { code: "no", native: "Norsk", english: "Norwegian", flag: "🇳🇴" },
  { code: "da", native: "Dansk", english: "Danish", flag: "🇩🇰" },
  { code: "fi", native: "Suomi", english: "Finnish", flag: "🇫🇮" },
  { code: "cs", native: "Čeština", english: "Czech", flag: "🇨🇿" },
  { code: "el", native: "Ελληνικά", english: "Greek", flag: "🇬🇷" },
  { code: "he", native: "עברית", english: "Hebrew", flag: "🇮🇱" },
  { code: "th", native: "ไทย", english: "Thai", flag: "🇹🇭" },
  { code: "vi", native: "Tiếng Việt", english: "Vietnamese", flag: "🇻🇳" },
  { code: "id", native: "Bahasa Indonesia", english: "Indonesian", flag: "🇮🇩" },
  { code: "ms", native: "Bahasa Melayu", english: "Malay", flag: "🇲🇾" },
  { code: "pt", native: "Português", english: "Portuguese", flag: "🇵🇹" },
  { code: "hi", native: "हिन्दी", english: "Hindi", flag: "🇮🇳" },
  { code: "bn", native: "বাংলা", english: "Bengali", flag: "🇧🇩" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi", flag: "🇮🇳" },
  { code: "mn", native: "Монгол", english: "Mongolian", flag: "🇲🇳" },
];
