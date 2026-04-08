import type { DocumentFormat, DocumentOptions } from "./document-types";

export const GENERATED_DOCUMENT_TITLE = "Personal Systematic Theology Statement";
export const DEFAULT_DOCUMENT_OPTIONS: DocumentOptions = {
  includeReferences: true,
};

/** Corrects legacy titles produced by a bad replace on the workbook heading. */
export function normalizeGeneratedDocumentTitle(title: string): string {
  if (title === "Personal Systematic Theology Personal Theology Statement") {
    return GENERATED_DOCUMENT_TITLE;
  }
  return title;
}

export function normalizeDocumentFormat(format: string | null | undefined): DocumentFormat {
  return format === "outline" ? "outline" : "paragraph";
}

export function normalizeDocumentOptions(options: Partial<DocumentOptions> | null | undefined): DocumentOptions {
  return {
    includeReferences: options?.includeReferences ?? DEFAULT_DOCUMENT_OPTIONS.includeReferences,
  };
}
