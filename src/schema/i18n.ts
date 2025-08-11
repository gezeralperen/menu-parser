export type LocaleCode = string; // reuse your LanguageCode if you prefer

// Namespaced dictionary shape (add sections as your app grows)
export type Dictionary = {
  common: {
    appTitle: string;
    poweredByAi: string;
    logoAria: string;
  };
  language: {
    chooseLanguage: string;
    subtitle: string;
    searchPlaceholder: string;
    continue: string;
    listAria: string;
  };
  scan: {
    title: string;
    subtitle: string;
    takePhoto: string;
    confirmTitle: string;
    confirmLine1: string;
    confirmLine2: string;
    confirmCta: string;
    retake: string;
    processing: string;
    readySoon: string;
    permissionAllow: string;
    permissionDeny: string;
    lightingWarning: string;
    unreadableWarning: string;
    cameraPreviewAria: string;
    capturedImageAria: string;
  };
  menu: {
    title: string;
    allergensLabel: string;
    period: {
      takeoff: string;
      cruise: string;
      before_landing: string;
    };
  };
  chat: {
    toggleOpen: string;
    toggleClose: string;
    assistantTitle: string;
    collapse: string;
    collapseAria: string;
    empty: string;
    placeholder: string;
    send: string;
    sending: string;
  };
};

// Deep-partial helper for per-locale diffs
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * Get value from object by a dot-separated path.
 *
 * @param obj - Dictionary or partial dictionary
 * @param path - e.g. "scan.title"
 */
export function getByPath<T extends object>(
  obj: T,
  path: string
): string | undefined {
  return path.split(".").reduce<unknown>((o, k) => {
    if (o && typeof o === "object" && k in o) {
      return (o as Record<string, unknown>)[k];
    }
    return undefined;
  }, obj) as string | undefined;
}

/**
 * Deep merge two dictionaries (dst <- src), preserving types.
 *
 * @param dst - destination object (full dictionary)
 * @param src - partial dictionary to merge in
 */
export function deepMerge<T extends object>(dst: T, src: DeepPartial<T>): T {
  const result: T = { ...dst };
  (Object.keys(src) as Array<keyof T>).forEach((k) => {
    const sv = src[k];
    if (sv && typeof sv === "object" && !Array.isArray(sv)) {
      result[k] = deepMerge(
        result[k] as unknown as object,
        sv as object
      ) as T[typeof k];
    } else if (sv !== undefined) {
      result[k] = sv as T[typeof k];
    }
  });
  return result;
}
