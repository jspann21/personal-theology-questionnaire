import type { WorkbookDocument } from "./data";
import type { SectionBlueprint, StatementTemplate } from "./document-config";

function assertUnique(values: string[], kind: string) {
  const seen = new Set<string>();

  values.forEach((value) => {
    if (seen.has(value)) {
      throw new Error(`Duplicate ${kind}: ${value}.`);
    }
    seen.add(value);
  });
}

export function assertValidDocumentConfiguration(
  workbook: WorkbookDocument,
  sectionBlueprints: SectionBlueprint[],
  questionStatements: Record<string, StatementTemplate>,
) {
  const workbookQuestionIds = workbook.sections.flatMap((section) => section.questions.map((question) => question.id));
  const blueprintQuestionIds = sectionBlueprints.flatMap((section) => section.groups.flatMap((group) => group.questionIds));
  const statementQuestionIds = Object.keys(questionStatements);

  assertUnique(blueprintQuestionIds, "document blueprint question id");
  assertUnique(statementQuestionIds, "document statement template question id");

  const missingInBlueprints = workbookQuestionIds.filter((id) => !blueprintQuestionIds.includes(id));
  const missingInStatements = workbookQuestionIds.filter((id) => !statementQuestionIds.includes(id));
  const extraInBlueprints = blueprintQuestionIds.filter((id) => !workbookQuestionIds.includes(id));
  const extraInStatements = statementQuestionIds.filter((id) => !workbookQuestionIds.includes(id));

  if (missingInBlueprints.length > 0) {
    throw new Error(`Questions missing from section blueprints: ${missingInBlueprints.join(", ")}.`);
  }

  if (missingInStatements.length > 0) {
    throw new Error(`Questions missing from statement templates: ${missingInStatements.join(", ")}.`);
  }

  if (extraInBlueprints.length > 0) {
    throw new Error(`Section blueprints reference unknown questions: ${extraInBlueprints.join(", ")}.`);
  }

  if (extraInStatements.length > 0) {
    throw new Error(`Statement templates reference unknown questions: ${extraInStatements.join(", ")}.`);
  }

  const workbookSectionTitles = new Set(workbook.sections.map((section) => section.title));
  const blueprintTitles = sectionBlueprints.map((section) => section.title);
  assertUnique(blueprintTitles, "document blueprint section title");

  blueprintTitles.forEach((title) => {
    if (!workbookSectionTitles.has(title)) {
      throw new Error(`Document blueprint section not found in workbook: ${title}.`);
    }
  });

  sectionBlueprints.forEach((section) => {
    if (section.groups.length === 0) {
      throw new Error(`Document blueprint section ${section.title} must contain at least one group.`);
    }

    section.groups.forEach((group) => {
      if (group.questionIds.length === 0) {
        throw new Error(`Document blueprint group in ${section.title} must reference at least one question.`);
      }
    });
  });
}
