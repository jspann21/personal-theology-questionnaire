import type { WorkbookDocument } from "./data";

function assertNonEmpty(value: string, message: string) {
  if (!value.trim()) {
    throw new Error(message);
  }
}

export function assertValidWorkbookDocument(workbook: WorkbookDocument) {
  assertNonEmpty(workbook.title, "Workbook title is required.");
  assertNonEmpty(workbook.introMarkdown, "Workbook intro markdown is required.");
  assertNonEmpty(workbook.closingMarkdown, "Workbook closing markdown is required.");

  if (workbook.sections.length === 0) {
    throw new Error("Workbook must contain at least one section.");
  }

  const seenSectionTitles = new Set<string>();
  const seenQuestionIds = new Set<string>();

  workbook.sections.forEach((section) => {
    assertNonEmpty(section.title, `Workbook section title is required for ${section.sourceFile}.`);

    if (seenSectionTitles.has(section.title)) {
      throw new Error(`Duplicate workbook section title: ${section.title}.`);
    }
    seenSectionTitles.add(section.title);

    if (section.questions.length === 0) {
      throw new Error(`Workbook section ${section.title} must include at least one question.`);
    }

    section.questions.forEach((question) => {
      if (seenQuestionIds.has(question.id)) {
        throw new Error(`Duplicate workbook question id: ${question.id}.`);
      }
      seenQuestionIds.add(question.id);

      assertNonEmpty(question.question, `Question text is required for ${question.id}.`);
      assertNonEmpty(question.whyItMatters, `Why this matters is required for ${question.id}.`);
      assertNonEmpty(question.yes.label, `Yes label is required for ${question.id}.`);
      assertNonEmpty(question.no.label, `No label is required for ${question.id}.`);

      if (question.sectionTitle !== section.title) {
        throw new Error(`Question ${question.id} is assigned to ${question.sectionTitle} instead of ${section.title}.`);
      }

      if (question.sourceFile !== section.sourceFile) {
        throw new Error(`Question ${question.id} source file mismatch: ${question.sourceFile} vs ${section.sourceFile}.`);
      }

      if (question.yes.proofTexts.length === 0 || question.no.proofTexts.length === 0) {
        throw new Error(`Question ${question.id} must include proof texts for both answers.`);
      }
    });
  });
}
