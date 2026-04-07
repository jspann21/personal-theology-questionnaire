import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, FileText, Loader2, Menu } from "lucide-react";
import {
  generateDocumentDraft,
  normalizeDocumentFormat,
  normalizeGeneratedDocumentTitle,
  serializeDocumentToMarkdown,
  type DocumentFormat,
  type GeneratedDocument,
} from "./document";
import { questions, workbook } from "./data";
import { GeneratedDocumentWorkspace } from "./components/GeneratedDocumentWorkspace";
import { MarkdownContent } from "./components/MarkdownContent";
import { QuestionCard } from "./components/QuestionCard";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";
import { cn } from "./lib/utils";
import { normalizeVerseTranslation, type VerseTranslationCode } from "./verse-translations";

const ANSWERS_STORAGE_KEY = "theology-answers";
const NOTES_STORAGE_KEY = "theology-notes";
const DOCUMENT_STORAGE_KEY = "theology-document-draft";
const FORMAT_STORAGE_KEY = "theology-document-format";
const VERSE_TRANSLATION_STORAGE_KEY = "theology-verse-translation";

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

type AppView = "questionnaire" | "document";

function readStorage<T>(key: string, fallback: T) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readDocumentDraftFromStorage(): GeneratedDocument | null {
  const raw = readStorage<GeneratedDocument | null>(DOCUMENT_STORAGE_KEY, null);
  if (!raw) {
    return null;
  }
  const title = normalizeGeneratedDocumentTitle(raw.title);
  const format = normalizeDocumentFormat((raw as GeneratedDocument & { format?: string }).format);
  if (title === raw.title && format === raw.format) {
    return raw;
  }
  return { ...raw, title, format };
}

function getViewFromLocation(): AppView {
  const params = new URLSearchParams(window.location.search);
  return params.get("view") === "document" ? "document" : "questionnaire";
}

function pushView(view: AppView) {
  const url = new URL(window.location.href);

  if (view === "document") {
    url.searchParams.set("view", "document");
  } else {
    url.searchParams.delete("view");
  }

  window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => getViewFromLocation());
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>(() => readStorage(ANSWERS_STORAGE_KEY, {}));
  const [notes, setNotes] = useState<Record<string, string>>(() => readStorage(NOTES_STORAGE_KEY, {}));
  const [documentDraft, setDocumentDraft] = useState<GeneratedDocument | null>(() => readDocumentDraftFromStorage());
  const [selectedFormat, setSelectedFormat] = useState<DocumentFormat>(() => {
    const saved = localStorage.getItem(FORMAT_STORAGE_KEY);
    return normalizeDocumentFormat(saved);
  });
  const [verseTranslation, setVerseTranslation] = useState<VerseTranslationCode>(() =>
    normalizeVerseTranslation(localStorage.getItem(VERSE_TRANSLATION_STORAGE_KEY)),
  );

  useEffect(() => {
    localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (documentDraft) {
      localStorage.setItem(DOCUMENT_STORAGE_KEY, JSON.stringify(documentDraft));
      return;
    }

    localStorage.removeItem(DOCUMENT_STORAGE_KEY);
  }, [documentDraft]);

  useEffect(() => {
    localStorage.setItem(FORMAT_STORAGE_KEY, selectedFormat);
  }, [selectedFormat]);

  useEffect(() => {
    localStorage.setItem(VERSE_TRANSLATION_STORAGE_KEY, verseTranslation);
  }, [verseTranslation]);

  useEffect(() => {
    const syncView = () => {
      setCurrentView(getViewFromLocation());
    };

    window.addEventListener("popstate", syncView);
    return () => window.removeEventListener("popstate", syncView);
  }, []);

  useEffect(() => {
    if (currentView === "document" && !documentDraft) {
      setCurrentView("questionnaire");
      pushView("questionnaire");
    }
  }, [currentView, documentDraft]);

  const handleAnswerChange = (id: string, answer: "yes" | "no") => {
    setAnswers((prev) => ({ ...prev, [id]: answer }));
  };

  const handleNotesChange = (id: string, note: string) => {
    setNotes((prev) => ({ ...prev, [id]: note }));
  };

  const completedCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const isComplete = completedCount === totalCount;
  const groupedQuestions = useMemo(
    () =>
      workbook.sections.map((section) => ({
        category: section.title,
        items: section.questions,
      })),
    [],
  );
  const categories = useMemo(() => groupedQuestions.map((section) => section.category), [groupedQuestions]);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] ?? "");

  useEffect(() => {
    if (currentView !== "questionnaire") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveCategory(visibleEntries[0].target.getAttribute("data-category") || "");
        }
      },
      { rootMargin: "-20% 0px -80% 0px" },
    );

    categories.forEach((category) => {
      const element = document.getElementById(slugify(category));
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [categories, currentView]);

  const scrollToUnanswered = (direction: "next" | "prev") => {
    const unanswered = questions.filter((question) => !answers[question.id]);
    if (unanswered.length === 0) return;

    let targetId = unanswered[0].id;

    if (direction === "next") {
      const nextQuestion = unanswered.find((question) => {
        const element = document.getElementById(`question-${question.id}`);
        return element && element.getBoundingClientRect().top > 250;
      });
      targetId = nextQuestion ? nextQuestion.id : unanswered[0].id;
    } else {
      const previousQuestion = [...unanswered].reverse().find((question) => {
        const element = document.getElementById(`question-${question.id}`);
        return element && element.getBoundingClientRect().top < 150;
      });
      targetId = previousQuestion ? previousQuestion.id : unanswered[unanswered.length - 1].id;
    }

    const element = document.getElementById(`question-${targetId}`);
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.classList.add("ring-4", "ring-amber-200", "ring-offset-4", "rounded-xl", "transition-all", "duration-500");
    setTimeout(() => {
      element.classList.remove("ring-4", "ring-amber-200", "ring-offset-4", "rounded-xl");
    }, 2000);
  };

  const navigateToQuestionnaire = () => {
    setCurrentView("questionnaire");
    pushView("questionnaire");
  };

  const navigateToDocument = () => {
    setCurrentView("document");
    pushView("document");
  };

  const handleGenerateDocument = () => {
    if (!isComplete) {
      return;
    }

    setIsGeneratingDocument(true);

    try {
      const generatedDocument = generateDocumentDraft(answers, notes, selectedFormat);
      setDocumentDraft(generatedDocument);
      setIsGenerateDialogOpen(false);
      navigateToDocument();
    } finally {
      setIsGeneratingDocument(false);
    }
  };

  const handleOpenGenerateDialog = () => {
    if (!isComplete) {
      return;
    }

    setIsGenerateDialogOpen(true);
  };

  const handleExportMarkdown = () => {
    if (!documentDraft) {
      return;
    }

    downloadMarkdown("personal-theology-statement.md", serializeDocumentToMarkdown(documentDraft));
  };

  const handleUpdateSection = (sectionTitle: string, body: string) => {
    setDocumentDraft((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        sections: prev.sections.map((section) => (section.title === sectionTitle ? { ...section, body } : section)),
      };
    });
  };

  if (currentView === "document" && documentDraft) {
    return (
      <>
        <GeneratedDocumentWorkspace
          documentDraft={documentDraft}
          pendingFormat={selectedFormat}
          onPendingFormatChange={setSelectedFormat}
          onUpdateSection={handleUpdateSection}
          onBackToWorkbook={navigateToQuestionnaire}
          onRegenerate={handleOpenGenerateDialog}
          onExportMarkdown={handleExportMarkdown}
          onPrint={() => window.print()}
          isBusy={isGeneratingDocument}
        />

        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Regenerate Document</DialogTitle>
              <DialogDescription>
                Regenerating rebuilds the full draft from your saved answers and notes. Any edits in the current document draft will be replaced.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <label className="block space-y-2 text-sm font-medium text-slate-700">
                <span>Format</span>
                <select
                  value={selectedFormat}
                  onChange={(event) => setSelectedFormat(normalizeDocumentFormat(event.target.value))}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
                >
                  <option value="paragraph">Paragraph Draft</option>
                  <option value="outline">Bullet Outline</option>
                </select>
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)} disabled={isGeneratingDocument}>
                Cancel
              </Button>
              <Button onClick={handleGenerateDocument} disabled={isGeneratingDocument} className="gap-2">
                {isGeneratingDocument && <Loader2 className="h-4 w-4 animate-spin" />}
                Regenerate Draft
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm print-hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden -ml-2 shrink-0" />}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader className="mb-6 text-left">
                  <SheetTitle>Categories</SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigate through the theology workbook categories.
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  <nav className="space-y-1 pr-4">
                    {groupedQuestions.map(({ category, items }) => {
                      const unansweredCount = items.filter((question) => !answers[question.id]).length;
                      return (
                        <a
                          key={category}
                          href={`#${slugify(category)}`}
                          onClick={(event) => {
                            event.preventDefault();
                            setIsMobileMenuOpen(false);
                            setTimeout(() => {
                              const element = document.getElementById(slugify(category));
                              if (element) {
                                element.scrollIntoView({ behavior: "smooth" });
                                window.history.pushState(null, "", `#${slugify(category)}`);
                              }
                            }, 300);
                          }}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm transition-colors",
                            activeCategory === category
                              ? "bg-blue-100 font-medium text-blue-900"
                              : "text-slate-600 hover:bg-blue-50 hover:text-blue-600",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span>{category}</span>
                            {unansweredCount > 0 && (
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                  activeCategory === category ? "bg-blue-200 text-blue-800" : "bg-amber-100 text-amber-700",
                                )}
                              >
                                {unansweredCount}
                              </span>
                            )}
                          </div>
                        </a>
                      );
                    })}
                  </nav>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <FileText className="hidden h-5 w-5 shrink-0 text-blue-600 sm:block" />
            <h1 className="min-w-0 text-balance text-base font-bold leading-tight tracking-tight sm:text-lg">{workbook.title}</h1>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 text-sm font-medium text-slate-500 sm:flex">
              <span className="whitespace-nowrap">
                {completedCount} / {totalCount} Completed
              </span>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {documentDraft && (
              <Button variant="outline" size="sm" onClick={navigateToDocument} className="shrink-0 whitespace-nowrap">
                Open Draft
              </Button>
            )}

            {completedCount < totalCount && (
              <Button
                onClick={() => scrollToUnanswered("next")}
                variant="outline"
                size="sm"
                className="shrink-0 gap-2 whitespace-nowrap border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{totalCount - completedCount} Left</span>
              </Button>
            )}

            <Button onClick={handleOpenGenerateDialog} size="sm" className="shrink-0 gap-2 whitespace-nowrap" disabled={!isComplete}>
              <FileText className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Generate Document</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-12 md:flex-row">
        <aside className="sticky top-24 hidden max-h-[calc(100vh-8rem)] w-64 shrink-0 overflow-y-auto pr-4 md:block print-hidden">
          <nav className="space-y-1">
            <h3 className="mb-4 px-3 text-sm font-semibold uppercase tracking-wider text-slate-900">Categories</h3>
            {groupedQuestions.map(({ category, items }) => {
              const unansweredCount = items.filter((question) => !answers[question.id]).length;
              return (
                <a
                  key={category}
                  href={`#${slugify(category)}`}
                  onClick={(event) => {
                    event.preventDefault();
                    const element = document.getElementById(slugify(category));
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", `#${slugify(category)}`);
                    }
                  }}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    activeCategory === category
                      ? "bg-blue-100 font-medium text-blue-900"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{category}</span>
                    {unansweredCount > 0 && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold",
                          activeCategory === category ? "bg-blue-200 text-blue-800" : "bg-amber-100 text-amber-700",
                        )}
                      >
                        {unansweredCount}
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </nav>
        </aside>

        <main className="w-full max-w-3xl flex-1">
          <div className="mb-12 space-y-6">
            <h2 className="text-balance text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">{workbook.title}</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <MarkdownContent markdown={workbook.introMarkdown} className="space-y-5 text-[15px] text-slate-600 md:text-base" />
            </div>
          </div>

          <div className="space-y-16">
            {groupedQuestions.map(({ category, items }) => (
              <section key={category} id={slugify(category)} data-category={category} className="scroll-mt-24">
                <h2 className="mb-8 border-b pb-2 text-2xl font-bold text-slate-900">{category}</h2>
                <div className="space-y-12">
                  {items.map((question) => {
                    const globalIndex = questions.findIndex((item) => item.id === question.id);
                    return (
                      <div key={question.id} id={`question-${question.id}`} className="relative">
                        <div className="absolute -left-12 top-0 bottom-0 hidden w-px bg-slate-200 md:block" />
                        <div className="absolute -left-[53px] top-6 hidden h-6 w-6 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-xs font-bold text-slate-400 md:flex">
                          {globalIndex + 1}
                        </div>
                        <QuestionCard
                          question={question}
                          answer={answers[question.id]}
                          notes={notes[question.id] || ""}
                          verseTranslation={verseTranslation}
                          onVerseTranslationChange={setVerseTranslation}
                          onAnswerChange={(value) => handleAnswerChange(question.id, value)}
                          onNotesChange={(value) => handleNotesChange(question.id, value)}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 border-t pb-16 pt-8 text-center text-slate-500">
            {isComplete ? (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-6 text-green-800">
                <h3 className="mb-2 text-xl font-bold">Questionnaire Complete</h3>
                <p>Your answers are ready to be turned into a structured personal theology statement.</p>
              </div>
            ) : (
              <p>You have reached the end of the current questions.</p>
            )}

            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button onClick={handleOpenGenerateDialog} variant={isComplete ? "default" : "outline"} className="gap-2" disabled={!isComplete}>
                <FileText className="h-4 w-4" />
                Generate Document
              </Button>
              {documentDraft && (
                <Button onClick={navigateToDocument} variant="outline">
                  Open Existing Draft
                </Button>
              )}
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <MarkdownContent markdown={workbook.closingMarkdown} className="space-y-4 text-base text-slate-600" />
            </div>
          </div>
        </main>
      </div>

      {!isComplete && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 md:bottom-8 md:right-8 md:gap-3 print-hidden">
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 rounded-full border-amber-200 bg-white text-amber-600 shadow-lg transition-colors hover:bg-amber-100 hover:text-amber-800 md:h-12 md:w-12"
            onClick={() => scrollToUnanswered("prev")}
            title="Previous Unanswered"
          >
            <ChevronUp className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 rounded-full border-amber-200 bg-white text-amber-600 shadow-lg transition-colors hover:bg-amber-100 hover:text-amber-800 md:h-12 md:w-12"
            onClick={() => scrollToUnanswered("next")}
            title="Next Unanswered"
          >
            <ChevronDown className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>
      )}

      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{documentDraft ? "Regenerate Final Document" : "Generate Final Document"}</DialogTitle>
            <DialogDescription>
              {documentDraft
                ? "This will rebuild the editable theology draft from your saved answers and notes, replacing any manual edits already made."
                : "Build the finished theology document from your completed answers, then edit and export it."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Format</span>
              <select
                value={selectedFormat}
                onChange={(event) => setSelectedFormat(normalizeDocumentFormat(event.target.value))}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
              >
                <option value="paragraph">Paragraph Draft</option>
                <option value="outline">Bullet Outline</option>
              </select>
            </label>
            <p className="text-sm text-slate-500">The generated draft will keep statement references only and will not pull verse text from external APIs.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)} disabled={isGeneratingDocument}>
              Cancel
            </Button>
            <Button onClick={handleGenerateDocument} disabled={isGeneratingDocument || !isComplete} className="gap-2">
              {isGeneratingDocument && <Loader2 className="h-4 w-4 animate-spin" />}
              {documentDraft ? "Regenerate Draft" : "Generate Draft"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
