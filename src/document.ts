import { workbook } from "./data";
import { GENERATED_DOCUMENT_TITLE, normalizeDocumentFormat, normalizeGeneratedDocumentTitle } from "./document-core";
import { QUESTION_STATEMENTS, SECTION_BLUEPRINTS } from "./document-config";
import { assertValidDocumentConfiguration } from "./document-schema";
import type { GeneratedVerse } from "./document-types";
import { dedupe, normalizeWhitespace } from "./document-utils";
import { DEFAULT_VERSE_TRANSLATION, normalizeVerseTranslation, type VerseTranslationCode } from "./verse-translations";

type VerseCacheRecord = Record<string, GeneratedVerse>;

type ParsedReference =
  | {
      kind: "chapter";
      bookId: number;
      bookName: string;
      chapter: number;
      raw: string;
    }
  | {
      kind: "verses";
      bookId: number;
      bookName: string;
      chapter: number;
      verseSpec: string;
      raw: string;
    }
  | {
      kind: "chapterRange";
      bookId: number;
      bookName: string;
      startChapter: number;
      endChapter: number;
      raw: string;
    }
  | {
      kind: "crossChapterRange";
      bookId: number;
      bookName: string;
      startChapter: number;
      startVerseSpec: string;
      endChapter: number;
      endVerseSpec: string;
      raw: string;
    };

type ChapterVerse = {
  pk?: number;
  chapter?: number;
  verse: number;
  text: string;
};

type ChapterResponse = ChapterVerse[];

const VERSE_CACHE_STORAGE_KEY = "theology-verse-cache";
const VERSE_FETCH_TIMEOUT_MS = 10000;

const BOOK_ALIASES: Array<{ id: number; names: string[]; singleChapter?: boolean }> = [
  { id: 1, names: ["Genesis"] },
  { id: 2, names: ["Exodus"] },
  { id: 3, names: ["Leviticus"] },
  { id: 4, names: ["Numbers"] },
  { id: 5, names: ["Deuteronomy"] },
  { id: 6, names: ["Joshua"] },
  { id: 7, names: ["Judges"] },
  { id: 8, names: ["Ruth"] },
  { id: 9, names: ["1 Samuel", "1Sam", "I Samuel"] },
  { id: 10, names: ["2 Samuel", "2Sam", "II Samuel"] },
  { id: 11, names: ["1 Kings", "1Kgs", "I Kings"] },
  { id: 12, names: ["2 Kings", "2Kgs", "II Kings"] },
  { id: 13, names: ["1 Chronicles", "1Chr", "I Chronicles"] },
  { id: 14, names: ["2 Chronicles", "2Chr", "II Chronicles"] },
  { id: 15, names: ["Ezra"] },
  { id: 16, names: ["Nehemiah"] },
  { id: 17, names: ["Esther"] },
  { id: 18, names: ["Job"] },
  { id: 19, names: ["Psalms", "Psalm"] },
  { id: 20, names: ["Proverbs"] },
  { id: 21, names: ["Ecclesiastes"] },
  { id: 22, names: ["Song of Solomon", "Song of Songs"] },
  { id: 23, names: ["Isaiah"] },
  { id: 24, names: ["Jeremiah"] },
  { id: 25, names: ["Lamentations"] },
  { id: 26, names: ["Ezekiel"] },
  { id: 27, names: ["Daniel"] },
  { id: 28, names: ["Hosea"] },
  { id: 29, names: ["Joel"] },
  { id: 30, names: ["Amos"] },
  { id: 31, names: ["Obadiah"], singleChapter: true },
  { id: 32, names: ["Jonah"] },
  { id: 33, names: ["Micah"] },
  { id: 34, names: ["Nahum"] },
  { id: 35, names: ["Habakkuk"] },
  { id: 36, names: ["Zephaniah"] },
  { id: 37, names: ["Haggai"] },
  { id: 38, names: ["Zechariah"] },
  { id: 39, names: ["Malachi"] },
  { id: 40, names: ["Matthew"] },
  { id: 41, names: ["Mark"] },
  { id: 42, names: ["Luke"] },
  { id: 43, names: ["John"] },
  { id: 44, names: ["Acts"] },
  { id: 45, names: ["Romans"] },
  { id: 46, names: ["1 Corinthians", "1Cor", "I Corinthians"] },
  { id: 47, names: ["2 Corinthians", "2Cor", "II Corinthians"] },
  { id: 48, names: ["Galatians"] },
  { id: 49, names: ["Ephesians"] },
  { id: 50, names: ["Philippians"] },
  { id: 51, names: ["Colossians"] },
  { id: 52, names: ["1 Thessalonians", "1Thess", "I Thessalonians"] },
  { id: 53, names: ["2 Thessalonians", "2Thess", "II Thessalonians"] },
  { id: 54, names: ["1 Timothy", "1Tim", "I Timothy"] },
  { id: 55, names: ["2 Timothy", "2Tim", "II Timothy"] },
  { id: 56, names: ["Titus"] },
  { id: 57, names: ["Philemon"], singleChapter: true },
  { id: 58, names: ["Hebrews"] },
  { id: 59, names: ["James"] },
  { id: 60, names: ["1 Peter", "1Pet", "I Peter"] },
  { id: 61, names: ["2 Peter", "2Pet", "II Peter"] },
  { id: 62, names: ["1 John", "I John"] },
  { id: 63, names: ["2 John", "II John"], singleChapter: true },
  { id: 64, names: ["3 John", "III John"], singleChapter: true },
  { id: 65, names: ["Jude"], singleChapter: true },
  { id: 66, names: ["Revelation"] },
];

const BOOK_NAME_MATCHERS = BOOK_ALIASES.flatMap((book) =>
  book.names.map((name) => ({
    ...book,
    name,
  })),
).sort((left, right) => right.name.length - left.name.length);

function getVerseCache() {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(VERSE_CACHE_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as VerseCacheRecord;
  } catch {
    return {};
  }
}

function setVerseCache(cache: VerseCacheRecord) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(VERSE_CACHE_STORAGE_KEY, JSON.stringify(cache));
}

function getVerseCacheKey(reference: string, translation: VerseTranslationCode) {
  return `${translation}:${reference}`;
}

function cleanVerseText(text: string) {
  const withoutTags = text.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ");
  if (typeof window !== "undefined") {
    const element = window.document.createElement("textarea");
    element.innerHTML = withoutTags;
    return normalizeWhitespace(element.value.replace(/\n/g, " "));
  }
  return normalizeWhitespace(withoutTags.replace(/\n/g, " "));
}

function parseVerseNumbers(verseSpec: string) {
  const verses = new Set<number>();

  for (const part of verseSpec.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) {
      continue;
    }

    const rangeMatch = trimmed.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      const from = Math.min(start, end);
      const to = Math.max(start, end);
      for (let verse = from; verse <= to; verse += 1) {
        verses.add(verse);
      }
      continue;
    }

    const verse = Number(trimmed);
    if (Number.isFinite(verse)) {
      verses.add(verse);
    }
  }

  return verses;
}

function getChapterKey(bookId: number, chapter: number, translation: VerseTranslationCode) {
  return `${translation}:${bookId}:${chapter}`;
}

async function fetchChapter(
  bookId: number,
  chapter: number,
  translation: VerseTranslationCode,
  chapterCache: Map<string, Promise<ChapterResponse>>,
) {
  const key = getChapterKey(bookId, chapter, translation);

  if (!chapterCache.has(key)) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), VERSE_FETCH_TIMEOUT_MS);

    chapterCache.set(
      key,
      fetch(`https://bolls.life/get-text/${translation}/${bookId}/${chapter}/`, {
        credentials: "omit",
        referrerPolicy: "no-referrer",
        signal: controller.signal,
      })
        .then((response) => {
          window.clearTimeout(timeoutId);
          if (!response.ok) {
            throw new Error(`Failed chapter lookup for ${bookId} ${chapter}`);
          }
          return response.json() as Promise<ChapterResponse>;
        })
        .catch((error) => {
          window.clearTimeout(timeoutId);
          chapterCache.delete(key);
          throw error;
        }),
    );
  }

  return chapterCache.get(key)!;
}

async function resolveViaChapterData(
  parsed: ParsedReference,
  translation: VerseTranslationCode,
  chapterCache: Map<string, Promise<ChapterResponse>>,
) {
  if (parsed.kind === "chapter") {
    const chapter = await fetchChapter(parsed.bookId, parsed.chapter, translation, chapterCache);
    return cleanVerseText(chapter.map((verse) => verse.text).join(" "));
  }

  if (parsed.kind === "verses") {
    const chapter = await fetchChapter(parsed.bookId, parsed.chapter, translation, chapterCache);
    const verseNumbers = parseVerseNumbers(parsed.verseSpec);
    const verses = chapter.filter((verse) => verseNumbers.has(verse.verse));
    return cleanVerseText(verses.map((verse) => verse.text).join(" "));
  }

  if (parsed.kind === "chapterRange") {
    const chapters = await Promise.all(
      Array.from({ length: parsed.endChapter - parsed.startChapter + 1 }, (_, index) =>
        fetchChapter(parsed.bookId, parsed.startChapter + index, translation, chapterCache),
      ),
    );
    return cleanVerseText(chapters.flatMap((chapter) => chapter).map((verse) => verse.text).join(" "));
  }

  const chapters = await Promise.all(
    Array.from({ length: parsed.endChapter - parsed.startChapter + 1 }, (_, index) =>
      fetchChapter(parsed.bookId, parsed.startChapter + index, translation, chapterCache),
    ),
  );
  const startVerses = parseVerseNumbers(parsed.startVerseSpec);
  const endVerses = parseVerseNumbers(parsed.endVerseSpec);
  const startFloor = startVerses.size > 0 ? Math.min(...startVerses) : 1;
  const endCeiling = endVerses.size > 0 ? Math.max(...endVerses) : Number.POSITIVE_INFINITY;

  const verses = chapters.flatMap((chapter, index) => {
    const chapterNumber = parsed.startChapter + index;

    if (parsed.startChapter === parsed.endChapter) {
      return chapter.filter((verse) => verse.verse >= startFloor && verse.verse <= endCeiling);
    }

    if (chapterNumber === parsed.startChapter) {
      return chapter.filter((verse) => verse.verse >= startFloor);
    }

    if (chapterNumber === parsed.endChapter) {
      return chapter.filter((verse) => verse.verse <= endCeiling);
    }

    return chapter;
  });

  return cleanVerseText(verses.map((verse) => verse.text).join(" "));
}

function matchBookName(reference: string) {
  return BOOK_NAME_MATCHERS.find((book) => reference.startsWith(`${book.name} `) || reference === book.name);
}

function parseReference(reference: string): ParsedReference | null {
  if (/\bread\b/i.test(reference)) {
    return null;
  }

  const match = matchBookName(reference);
  if (!match) {
    return null;
  }

  const remainder = reference.slice(match.name.length).trim();
  if (!remainder) {
    return null;
  }

  if (match.singleChapter && /^\d+(?:[-,]\s*\d+)*$/.test(remainder)) {
    return {
      kind: "verses",
      bookId: match.id,
      bookName: match.name,
      chapter: 1,
      verseSpec: remainder.replace(/\s+/g, ""),
      raw: reference,
    };
  }

  const crossChapterMatch = remainder.match(/^(\d+):([\d,\-\s]+)-(\d+):([\d,\-\s]+)$/);
  if (crossChapterMatch) {
    return {
      kind: "crossChapterRange",
      bookId: match.id,
      bookName: match.name,
      startChapter: Number(crossChapterMatch[1]),
      startVerseSpec: crossChapterMatch[2].replace(/\s+/g, ""),
      endChapter: Number(crossChapterMatch[3]),
      endVerseSpec: crossChapterMatch[4].replace(/\s+/g, ""),
      raw: reference,
    };
  }

  const chapterWithVersesMatch = remainder.match(/^(\d+):([\d,\-\s]+)$/);
  if (chapterWithVersesMatch) {
    return {
      kind: "verses",
      bookId: match.id,
      bookName: match.name,
      chapter: Number(chapterWithVersesMatch[1]),
      verseSpec: chapterWithVersesMatch[2].replace(/\s+/g, ""),
      raw: reference,
    };
  }

  const chapterRangeMatch = remainder.match(/^(\d+)-(\d+)$/);
  if (chapterRangeMatch) {
    return {
      kind: "chapterRange",
      bookId: match.id,
      bookName: match.name,
      startChapter: Number(chapterRangeMatch[1]),
      endChapter: Number(chapterRangeMatch[2]),
      raw: reference,
    };
  }

  const chapterMatch = remainder.match(/^(\d+)$/);
  if (chapterMatch) {
    return {
      kind: "chapter",
      bookId: match.id,
      bookName: match.name,
      chapter: Number(chapterMatch[1]),
      raw: reference,
    };
  }

  return null;
}

async function resolveSingleReference(
  reference: string,
  translation: VerseTranslationCode,
  chapterCache: Map<string, Promise<ChapterResponse>>,
) {
  const parsed = parseReference(reference);

  if (parsed) {
    try {
      const text = await resolveViaChapterData(parsed, translation, chapterCache);
      if (text) {
        return {
          reference,
          text,
          status: "resolved" as const,
        };
      }
    } catch {
      // Unsupported shapes fall through to the placeholder result below.
    }
  }

  return {
    reference,
    text: "Verse text unavailable; retry fetch.",
    status: "error" as const,
  };
}

async function runInBatches<TInput, TOutput>(
  items: TInput[],
  batchSize: number,
  worker: (item: TInput) => Promise<TOutput>,
) {
  const results: TOutput[] = [];

  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize);
    const batchResults = await Promise.all(batch.map(worker));
    results.push(...batchResults);
  }

  return results;
}

export async function resolveVerseTexts(references: string[], translation = DEFAULT_VERSE_TRANSLATION) {
  const normalizedTranslation = normalizeVerseTranslation(translation);
  const dedupedReferences = dedupe(references);
  const cache = getVerseCache();
  const chapterCache = new Map<string, Promise<ChapterResponse>>();
  const result: Record<string, GeneratedVerse> = {};
  const missing = dedupedReferences.filter((reference) => {
    const cached = cache[getVerseCacheKey(reference, normalizedTranslation)];
    if (cached?.status === "resolved") {
      result[reference] = cached;
      return false;
    }
    if (cached) {
      delete cache[getVerseCacheKey(reference, normalizedTranslation)];
    }
    return true;
  });

  const resolved = await runInBatches(missing, 4, async (reference) => {
    const verse = await resolveSingleReference(reference, normalizedTranslation, chapterCache);
    if (verse.status === "resolved") {
      cache[getVerseCacheKey(reference, normalizedTranslation)] = verse;
    }
    result[reference] = verse;
    return verse;
  });

  if (resolved.length > 0) {
    setVerseCache(cache);
  }

  return result;
}

assertValidDocumentConfiguration(workbook, SECTION_BLUEPRINTS, QUESTION_STATEMENTS);

export { GENERATED_DOCUMENT_TITLE, normalizeDocumentFormat, normalizeGeneratedDocumentTitle } from "./document-core";
export * from "./document-generation";
export * from "./document-types";
export * from "./verse-translations";
