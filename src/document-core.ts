import type { DocumentFormat } from "./document-types";

export const GENERATED_DOCUMENT_TITLE = "Personal Systematic Theology Statement";

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
