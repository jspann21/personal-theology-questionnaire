import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { resolveVerseTexts } from "@/document";
import { getVerseTranslationLabel, VERSE_TRANSLATION_OPTIONS, type VerseTranslationCode } from "@/verse-translations";

interface VersePopoverProps {
  reference: string;
  translation: VerseTranslationCode;
  onTranslationChange: (translation: VerseTranslationCode) => void;
}

export function VersePopover({ reference, translation, onTranslationChange }: VersePopoverProps) {
  const [verseText, setVerseText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const translationLabel = getVerseTranslationLabel(translation);
  const contentKey = `${translation}:${reference}`;

  useEffect(() => {
    if (!isOpen || loadedKey === contentKey) {
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);
    setVerseText(null);

    resolveVerseTexts([reference], translation)
      .then((result) => {
        if (cancelled) {
          return;
        }
        const verse = result[reference];
        if (!verse || verse.status !== "resolved") {
          throw new Error("Failed to fetch verse");
        }
        setVerseText(verse.text);
        setLoadedKey(contentKey);
      })
      .catch((fetchError) => {
        if (cancelled) {
          return;
        }
        console.error(fetchError);
        setError("Could not load verse text.");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [contentKey, isOpen, loadedKey, reference, translation]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none">
        {reference}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="top" align="start">
        <div className="flex items-center justify-between gap-3 rounded-t-md border-b bg-slate-50 px-4 py-2">
          <div className="min-w-0 text-sm font-semibold">
            {reference} <span className="font-medium text-slate-500">({translationLabel})</span>
          </div>
          <select
            value={translation}
            onChange={(event) => onTranslationChange(event.target.value as VerseTranslationCode)}
            aria-label="Verse reference translation"
            className="h-8 shrink-0 rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none"
          >
            {VERSE_TRANSLATION_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <ScrollArea className="max-h-60 h-max p-4 text-sm leading-relaxed">
          {loading ? (
            <div className="flex items-center justify-center py-4 text-slate-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading verse...
            </div>
          ) : error ? (
            <div className="py-2 text-red-500">{error}</div>
          ) : (
            <div className="text-slate-700">{verseText}</div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
