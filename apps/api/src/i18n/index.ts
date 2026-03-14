import { en, MessageKey } from "./en";

const messages = { en } as const;

type Locale = keyof typeof messages;

let currentLocale: Locale = "en";

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function t(key: MessageKey): string {
  return messages[currentLocale][key];
}
