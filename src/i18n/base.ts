import type { Dictionary } from "@/schema/i18n";

export const EN_BASE: Dictionary = {
  common: {
    appTitle: "In-Flight Menu Assistant",
    poweredByAi: "Powered by AI",
    logoAria: "Airline logo",
  },
  language: {
    chooseLanguage: "Choose Your Language",
    subtitle:
      "We’ll talk in the language you know best. You can change this later in Settings.",
    searchPlaceholder: "Type or find your language…",
    continue: "Continue →",
    listAria: "Languages",
  },
  scan: {
    title: "Scan the Printed Menu",
    subtitle: "Point your camera at the menu text.",
    takePhoto: "Take Picture",
    confirmTitle: "Is this photo usable?",
    confirmLine1: "Is all the text readable and the entire menu in frame?",
    confirmLine2: "If not, please retake the photo before we process it.",
    confirmCta: "Yes, looks good",
    retake: "Retake",
    processing: "Processing…",
    readySoon: "Your menu will be ready in seconds.",
    permissionAllow: "Allow camera",
    permissionDeny: "Not now",
    lightingWarning: "Tip: Move to better light for best results.",
    unreadableWarning: "Text looks hard to read. Try moving closer.",
    cameraPreviewAria: "Camera preview",
    capturedImageAria: "Captured menu image",
  },
  menu: {
    title: "Your In-Flight Menu",
    allergensLabel: "Allergens",
    period: {
      takeoff: "Takeoff",
      cruise: "Cruise",
      before_landing: "Before landing",
    },
  },
  chat: {
    toggleOpen: "Ask about this menu",
    toggleClose: "Close Chat",
    assistantTitle: "Assistant",
    collapse: "Collapse",
    collapseAria: "Collapse chat",
    empty: "Ask about allergens, ingredients, or suitable choices.",
    placeholder: "Type your question…",
    send: "Send",
    sending: "Sending…",
  },
};
