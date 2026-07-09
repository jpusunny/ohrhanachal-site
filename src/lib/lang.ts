import { cookies } from "next/headers";

export type Lang = "en" | "he";
export const LANG_COOKIE = "ohr_lang";

export async function getLang(): Promise<Lang> {
  try {
    const store = await cookies();
    return store.get(LANG_COOKIE)?.value === "he" ? "he" : "en";
  } catch {
    return "en";
  }
}

export function pickTitle(en: string, he: string | null | undefined, lang: Lang): string {
  if (lang === "he" && he && he.trim().length > 0) return he;
  return en;
}

export function isHe(lang: Lang): boolean {
  return lang === "he";
}
