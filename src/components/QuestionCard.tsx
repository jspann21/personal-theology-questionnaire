import { BookOpen } from "lucide-react";
import { Question } from "@/data";
import { VersePopover } from "./VersePopover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { VerseTranslationCode } from "@/verse-translations";

interface QuestionCardProps {
  question: Question;
  answer: "yes" | "no" | undefined;
  notes: string;
  verseTranslation: VerseTranslationCode;
  onVerseTranslationChange: (translation: VerseTranslationCode) => void;
  onAnswerChange: (answer: "yes" | "no") => void;
  onNotesChange: (notes: string) => void;
}

export function QuestionCard({ question, answer, notes, verseTranslation, onVerseTranslationChange, onAnswerChange, onNotesChange }: QuestionCardProps) {
  return (
    <Card className="mb-8 border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="secondary" className="text-xs font-medium uppercase tracking-wider">
            {question.category}
          </Badge>
          <div className="flex items-center gap-3">
            {!answer && (
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-[10px] uppercase tracking-wider text-amber-600">
                Unanswered
              </Badge>
            )}
            <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">{question.id}</span>
          </div>
        </div>
        <CardTitle className="text-xl font-semibold leading-tight text-slate-900">{question.question}</CardTitle>
        <CardDescription className="mt-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Why this matters:</span> {question.whyItMatters}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={answer || ""} onValueChange={(value) => onAnswerChange(value as "yes" | "no")} className="space-y-4">
          <div
            className={cn(
              "flex items-start space-x-3 rounded-lg border p-4 transition-colors",
              answer === "yes" ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-slate-100 bg-slate-50 hover:bg-slate-100/50",
            )}
          >
            <RadioGroupItem value="yes" id={`yes-${question.id}`} className="mt-1" />
            <div className="flex-1 space-y-2">
              <Label htmlFor={`yes-${question.id}`} className={cn("cursor-pointer text-base font-medium", answer === "yes" ? "text-blue-900" : "text-slate-900")}>
                Yes: {question.yes.label}
              </Label>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <BookOpen className="h-3.5 w-3.5" />
                </span>
                {question.yes.proofTexts.map((reference, index) => (
                  <span key={reference} className="inline-flex items-center">
                    <VersePopover reference={reference} translation={verseTranslation} onTranslationChange={onVerseTranslationChange} />
                    {index < question.yes.proofTexts.length - 1 && <span className="ml-1 text-slate-400">,</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div
            className={cn(
              "flex items-start space-x-3 rounded-lg border p-4 transition-colors",
              answer === "no" ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-slate-100 bg-slate-50 hover:bg-slate-100/50",
            )}
          >
            <RadioGroupItem value="no" id={`no-${question.id}`} className="mt-1" />
            <div className="flex-1 space-y-2">
              <Label htmlFor={`no-${question.id}`} className={cn("cursor-pointer text-base font-medium", answer === "no" ? "text-blue-900" : "text-slate-900")}>
                No: {question.no.label}
              </Label>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <BookOpen className="h-3.5 w-3.5" />
                </span>
                {question.no.proofTexts.map((reference, index) => (
                  <span key={reference} className="inline-flex items-center">
                    <VersePopover reference={reference} translation={verseTranslation} onTranslationChange={onVerseTranslationChange} />
                    {index < question.no.proofTexts.length - 1 && <span className="ml-1 text-slate-400">,</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </RadioGroup>
        {question.note && (
          <div className="rounded-r-md border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-800">
            <span className="font-bold">Note:</span> {question.note}
          </div>
        )}
        <div className="space-y-2 pt-2">
          <Label htmlFor={`notes-${question.id}`} className="text-sm font-semibold text-slate-700">
            Personal Notes & Qualifications
          </Label>
          <Textarea
            id={`notes-${question.id}`}
            placeholder="Record any additional notes, qualifications, or distinctions here..."
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            className="min-h-[100px] resize-y bg-white"
          />
        </div>
      </CardContent>
    </Card>
  );
}
