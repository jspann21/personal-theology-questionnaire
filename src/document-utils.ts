export function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function ensureSentence(value: string) {
  const trimmed = normalizeWhitespace(value);

  if (!trimmed) {
    return "";
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

export function dedupe<T>(values: T[]) {
  return [...new Set(values)];
}
