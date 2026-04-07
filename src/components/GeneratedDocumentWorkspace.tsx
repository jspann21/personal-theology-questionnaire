import { ArrowLeft, Download, Eye, FileText, Printer, RefreshCcw } from "lucide-react";
import {
  type DocumentFormat,
  type GeneratedDocument,
  normalizeGeneratedDocumentTitle,
} from "@/document";
import { MarkdownContent } from "./MarkdownContent";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";

interface GeneratedDocumentWorkspaceProps {
  documentDraft: GeneratedDocument;
  pendingFormat: DocumentFormat;
  onPendingFormatChange: (format: DocumentFormat) => void;
  onUpdateSection: (sectionTitle: string, body: string) => void;
  onBackToWorkbook: () => void;
  onRegenerate: () => void;
  onExportMarkdown: () => void;
  onPrint: () => void;
  isBusy: boolean;
}

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function GeneratedDocumentWorkspace({
  documentDraft,
  pendingFormat,
  onPendingFormatChange,
  onUpdateSection,
  onBackToWorkbook,
  onRegenerate,
  onExportMarkdown,
  onPrint,
  isBusy,
}: GeneratedDocumentWorkspaceProps) {
  const documentTitle = normalizeGeneratedDocumentTitle(documentDraft.title);

  return (
    <div className="min-h-screen bg-stone-100 text-slate-900">
      <header className="print-hidden sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-3">
          {/* Top row: back button + toolbar actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" onClick={onBackToWorkbook} className="shrink-0 gap-2 whitespace-nowrap">
              <ArrowLeft className="h-4 w-4 shrink-0" />
              Workbook
            </Button>

            <div className="hidden h-5 w-px bg-stone-200 sm:block" />

            <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-600">
              <span className="shrink-0">Format</span>
              <select
                value={pendingFormat}
                onChange={(event) => onPendingFormatChange(event.target.value as DocumentFormat)}
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
              >
                <option value="paragraph">Paragraph Draft</option>
                <option value="outline">Bullet Outline</option>
              </select>
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerate}
                className="shrink-0 gap-2 whitespace-nowrap"
                disabled={isBusy}
              >
                <RefreshCcw className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Regenerate Draft</span>
                <span className="sm:hidden">Regenerate</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onExportMarkdown}
                className="shrink-0 gap-2 whitespace-nowrap"
              >
                <Download className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Export Markdown</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button size="sm" onClick={onPrint} className="shrink-0 gap-2 whitespace-nowrap">
                <Printer className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Print / Save PDF</span>
                <span className="sm:hidden">Print / PDF</span>
              </Button>
            </div>
          </div>

          {/* Title row */}
          <div className="min-w-0 overflow-hidden border-t border-stone-100 pt-2">
            <h1 className="line-clamp-1 text-lg font-bold tracking-tight text-slate-900 sm:line-clamp-none sm:text-xl sm:text-balance">{documentTitle}</h1>
            <p className="mt-0.5 text-pretty text-sm leading-relaxed text-slate-500">
              Editable {documentDraft.format === "outline" ? "bullet outline" : "paragraph draft"} with statement references preserved inline.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row print-shell">
        <aside className="print-hidden lg:sticky lg:top-28 lg:h-[calc(100vh-8rem)] lg:w-64 lg:shrink-0 lg:overflow-y-auto">
          <Card className="border-stone-200 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Document Outline</CardTitle>
              <CardDescription>Jump between sections while editing the final document.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {documentDraft.sections.map((section) => (
                <a
                  key={section.title}
                  href={`#document-${slugify(section.title)}`}
                  className="block rounded-md px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-stone-100 hover:text-slate-900"
                >
                  {section.title}
                </a>
              ))}
            </CardContent>
          </Card>
        </aside>

        <main className="grid flex-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <section className="space-y-5 print-hidden">
            {documentDraft.sections.map((section) => (
              <Card
                key={section.title}
                id={`document-${slugify(section.title)}`}
                className="border-stone-200 bg-white shadow-sm"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-4 w-4 text-slate-500" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>Edit the generated markdown for this section before export.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={section.body}
                    onChange={(event) => onUpdateSection(section.title, event.target.value)}
                    className="min-h-[360px] resize-y font-mono text-sm leading-6"
                  />
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="print-preview rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm xl:sticky xl:top-28 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto">
            <div className="print-hidden mb-6 flex items-center gap-2 border-b border-stone-200 pb-4">
              <Eye className="h-4 w-4 text-slate-500" />
              <div>
                <h2 className="font-semibold text-slate-900">Preview</h2>
                <p className="text-sm text-slate-500">This is the print/export rendering of the current draft.</p>
              </div>
            </div>

            <article className="prose-shell space-y-8">
              <header className="space-y-2 border-b border-stone-200 pb-6">
                <h1 className="text-3xl font-extrabold tracking-tight">{documentTitle}</h1>
                <p className="text-sm text-slate-500">Format: {documentDraft.format === "outline" ? "Bullet Outline" : "Paragraph Draft"}</p>
              </header>

              {documentDraft.sections.map((section) => (
                <section key={section.title} className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">{section.title}</h2>
                  <MarkdownContent markdown={section.body} className="space-y-4 text-[15px] leading-7 text-slate-700" />
                </section>
              ))}
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
