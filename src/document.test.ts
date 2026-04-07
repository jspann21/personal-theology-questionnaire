import { describe, expect, it } from "vitest";
import { questions, workbook } from "./data";
import { QUESTION_STATEMENTS, SECTION_BLUEPRINTS } from "./document-config";
import { assertValidDocumentConfiguration } from "./document-schema";
import { collectSelectedReferences, generateDocumentDraft, serializeDocumentToMarkdown } from "./document";
import type { AnswersMap, NotesMap } from "./document-types";

function buildAnswers(value: "yes" | "no"): AnswersMap {
  return Object.fromEntries(questions.map((question) => [question.id, value])) as AnswersMap;
}

describe("document generation", () => {
  it("keeps config aligned with the workbook", () => {
    expect(() => assertValidDocumentConfiguration(workbook, SECTION_BLUEPRINTS, QUESTION_STATEMENTS)).not.toThrow();
  });

  it("builds a complete paragraph draft from answered questions", () => {
    const answers = buildAnswers("yes");
    const notes: NotesMap = {
      Q1: "I am using this as a sample qualifier.",
    };

    const draft = generateDocumentDraft(answers, notes, "paragraph");

    expect(draft.sections).toHaveLength(workbook.sections.length);
    expect(draft.sections.every((section) => section.body.trim().length > 0)).toBe(true);
    expect(draft.sections.some((section) => section.body.includes("sample qualifier"))).toBe(true);
  });

  it("serializes outline drafts with markdown headings", () => {
    const draft = generateDocumentDraft(buildAnswers("no"), {}, "outline");
    const markdown = serializeDocumentToMarkdown(draft);

    expect(markdown).toContain("# Personal Systematic Theology Statement");
    expect(markdown).toContain("## Scripture And Revelation");
    expect(markdown).toContain("- Format: Bullet Outline");
  });

  it("collects unique references from selected answers", () => {
    const references = collectSelectedReferences(buildAnswers("yes"));

    expect(references.length).toBeGreaterThan(0);
    expect(new Set(references).size).toBe(references.length);
  });
});
