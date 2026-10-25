export type Localized = Record<"ru" | "en" | "he", string>;
export const L = (ru: string, en: string, he: string): Localized => ({ ru, en, he });
