import type { Locale } from "@/lib/data";

export function pick(locale: Locale, ar?: string, en?: string) {
  return locale === "en" ? en || ar || "" : ar || en || "";
}

export function pickList(locale: Locale, ar?: string[], en?: string[]) {
  return locale === "en" ? en?.length ? en : ar || [] : ar?.length ? ar : en || [];
}

export function getLocaleFromDocument(): Locale {
  if (typeof document === "undefined") return "ar";
  return document.documentElement.dir === "ltr" ? "en" : "ar";
}


export function cleanWhatsAppPhone(phone?: string) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits || "97400000000";
}
