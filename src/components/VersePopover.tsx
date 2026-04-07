import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { resolveVerseTexts } from "@/document";

interface VersePopoverProps {
  reference: string;
}

export function VersePopover({ reference }: VersePopoverProps) {
  const [verseText, setVerseText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && !verseText && !loading && !error) {
      setLoading(true);
      resolveVerseTexts([reference])
        .then((result) => {
          const verse = result[reference];
          if (!verse || verse.status !== "resolved") {
            throw new Error("Failed to fetch verse");
          }
          setVerseText(verse.text);
          setLoading(false);
        })
        .catch((fetchError) => {
          console.error(fetchError);
          setError("Could not load verse text.");
          setLoading(false);
        });
    }
  }, [isOpen, reference, verseText, loading, error]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none">
        {reference}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="top" align="start">
        <div className="rounded-t-md border-b bg-slate-50 px-4 py-2 text-sm font-semibold">{reference}</div>
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
