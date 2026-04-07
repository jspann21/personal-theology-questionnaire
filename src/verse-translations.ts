export const DEFAULT_VERSE_TRANSLATION = "ESV";

export const VERSE_TRANSLATION_OPTIONS = [
  { code: "ESV", label: "ESV", fullName: "English Standard Version" },
  { code: "NIV2011", label: "NIV", fullName: "New International Version (2011)" },
  { code: "LSB", label: "LSB", fullName: "Legacy Standard Bible" },
  { code: "NASB", label: "NASB", fullName: "New American Standard Bible (1995)" },
  { code: "NKJV", label: "NKJV", fullName: "New King James Version" },
  { code: "CSB17", label: "CSB", fullName: "Christian Standard Bible (2017)" },
  { code: "NLT", label: "NLT", fullName: "New Living Translation" },
  { code: "NET", label: "NET", fullName: "New English Translation" },
  { code: "KJV", label: "KJV", fullName: "King James Version" },
] as const;

export type VerseTranslationCode = (typeof VERSE_TRANSLATION_OPTIONS)[number]["code"];

export function normalizeVerseTranslation(value: string | null | undefined): VerseTranslationCode {
  const match = VERSE_TRANSLATION_OPTIONS.find((option) => option.code === value);
  return match?.code ?? DEFAULT_VERSE_TRANSLATION;
}

export function getVerseTranslationOption(translation: string) {
  return VERSE_TRANSLATION_OPTIONS.find((option) => option.code === translation);
}

export function getVerseTranslationLabel(translation: string) {
  return getVerseTranslationOption(translation)?.label ?? translation;
}
