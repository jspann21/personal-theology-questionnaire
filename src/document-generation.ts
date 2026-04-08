import { questions, type AnswerOption, type Question } from "./data";
import { DEFAULT_DOCUMENT_OPTIONS, GENERATED_DOCUMENT_TITLE, normalizeDocumentOptions, normalizeGeneratedDocumentTitle } from "./document-core";
import { QUESTION_STATEMENTS, SECTION_BLUEPRINTS, type SectionBlueprint, type SectionGroupBlueprint } from "./document-config";
import type { AnswerValue, AnswersMap, DocumentFormat, DocumentOptions, GeneratedDocument, NotesMap } from "./document-types";
import { dedupe, ensureSentence } from "./document-utils";

const QUESTION_LOOKUP = new Map(questions.map((question) => [question.id, question]));
const DEFAULT_SECTION_REFERENCE_LIMIT = 4;

const SBL_BOOK_ABBREVIATIONS: Array<{ names: string[]; abbreviation: string }> = [
  { names: ["1 Thessalonians"], abbreviation: "1 Thess" },
  { names: ["2 Thessalonians"], abbreviation: "2 Thess" },
  { names: ["1 Corinthians"], abbreviation: "1 Cor" },
  { names: ["2 Corinthians"], abbreviation: "2 Cor" },
  { names: ["1 Chronicles"], abbreviation: "1 Chr" },
  { names: ["2 Chronicles"], abbreviation: "2 Chr" },
  { names: ["1 Timothy"], abbreviation: "1 Tim" },
  { names: ["2 Timothy"], abbreviation: "2 Tim" },
  { names: ["1 Samuel"], abbreviation: "1 Sam" },
  { names: ["2 Samuel"], abbreviation: "2 Sam" },
  { names: ["1 Kings"], abbreviation: "1 Kgs" },
  { names: ["2 Kings"], abbreviation: "2 Kgs" },
  { names: ["1 Peter"], abbreviation: "1 Pet" },
  { names: ["2 Peter"], abbreviation: "2 Pet" },
  { names: ["1 John"], abbreviation: "1 John" },
  { names: ["2 John"], abbreviation: "2 John" },
  { names: ["3 John"], abbreviation: "3 John" },
  { names: ["Song of Solomon", "Song of Songs"], abbreviation: "Song" },
  { names: ["Ecclesiastes"], abbreviation: "Eccl" },
  { names: ["Lamentations"], abbreviation: "Lam" },
  { names: ["Deuteronomy"], abbreviation: "Deut" },
  { names: ["Leviticus"], abbreviation: "Lev" },
  { names: ["Numbers"], abbreviation: "Num" },
  { names: ["Genesis"], abbreviation: "Gen" },
  { names: ["Exodus"], abbreviation: "Exod" },
  { names: ["Joshua"], abbreviation: "Josh" },
  { names: ["Judges"], abbreviation: "Judg" },
  { names: ["Ruth"], abbreviation: "Ruth" },
  { names: ["Ezra"], abbreviation: "Ezra" },
  { names: ["Nehemiah"], abbreviation: "Neh" },
  { names: ["Esther"], abbreviation: "Esth" },
  { names: ["Job"], abbreviation: "Job" },
  { names: ["Psalms", "Psalm"], abbreviation: "Ps" },
  { names: ["Proverbs"], abbreviation: "Prov" },
  { names: ["Isaiah"], abbreviation: "Isa" },
  { names: ["Jeremiah"], abbreviation: "Jer" },
  { names: ["Ezekiel"], abbreviation: "Ezek" },
  { names: ["Daniel"], abbreviation: "Dan" },
  { names: ["Hosea"], abbreviation: "Hos" },
  { names: ["Joel"], abbreviation: "Joel" },
  { names: ["Amos"], abbreviation: "Amos" },
  { names: ["Obadiah"], abbreviation: "Obad" },
  { names: ["Jonah"], abbreviation: "Jonah" },
  { names: ["Micah"], abbreviation: "Mic" },
  { names: ["Nahum"], abbreviation: "Nah" },
  { names: ["Habakkuk"], abbreviation: "Hab" },
  { names: ["Zephaniah"], abbreviation: "Zeph" },
  { names: ["Haggai"], abbreviation: "Hag" },
  { names: ["Zechariah"], abbreviation: "Zech" },
  { names: ["Malachi"], abbreviation: "Mal" },
  { names: ["Matthew"], abbreviation: "Matt" },
  { names: ["Mark"], abbreviation: "Mark" },
  { names: ["Luke"], abbreviation: "Luke" },
  { names: ["John"], abbreviation: "John" },
  { names: ["Acts"], abbreviation: "Acts" },
  { names: ["Romans"], abbreviation: "Rom" },
  { names: ["Galatians"], abbreviation: "Gal" },
  { names: ["Ephesians"], abbreviation: "Eph" },
  { names: ["Philippians"], abbreviation: "Phil" },
  { names: ["Colossians"], abbreviation: "Col" },
  { names: ["Titus"], abbreviation: "Titus" },
  { names: ["Philemon"], abbreviation: "Phlm" },
  { names: ["Hebrews"], abbreviation: "Heb" },
  { names: ["James"], abbreviation: "Jas" },
  { names: ["Jude"], abbreviation: "Jude" },
  { names: ["Revelation"], abbreviation: "Rev" },
];

const SBL_BOOK_MATCHERS = SBL_BOOK_ABBREVIATIONS.flatMap((entry) =>
  entry.names.map((name) => ({
    name,
    abbreviation: entry.abbreviation,
  })),
).sort((left, right) => right.name.length - left.name.length);

type GeneratedClaim = {
  summary: string;
  paragraphStatement: string;
  outlineStatement: string;
  references: string[];
};

function getSelectedOption(question: Question, answer: AnswerValue | undefined): AnswerOption | undefined {
  if (!answer) {
    return undefined;
  }

  return question[answer];
}

function abbreviateReference(reference: string) {
  const matcher = SBL_BOOK_MATCHERS.find(({ name }) => reference.startsWith(`${name} `) || reference === name);
  if (!matcher) {
    return reference;
  }

  return `${matcher.abbreviation}${reference.slice(matcher.name.length)}`;
}

function formatReferenceList(references: string[]) {
  return references.map(abbreviateReference).join("; ");
}

function appendParentheticalReferences(text: string, referenceText: string) {
  if (!referenceText) {
    return text;
  }

  const trimmed = text.trim();
  const punctuationMatch = trimmed.match(/([.!?])$/);
  const punctuation = punctuationMatch?.[1] ?? ".";
  const content = punctuationMatch ? trimmed.slice(0, -1) : trimmed;

  return `${content} (${referenceText})${punctuation}`;
}

function buildClaim(question: Question, answer: AnswerValue, note: string | undefined, options: DocumentOptions) {
  const selected = question[answer];
  const references = dedupe(selected.proofTexts).slice(0, DEFAULT_SECTION_REFERENCE_LIMIT);
  const referenceText = options.includeReferences ? formatReferenceList(references) : "";
  const qualifier = note ? ` I would qualify this by saying: ${ensureSentence(note)}` : "";
  const template = QUESTION_STATEMENTS[question.id];
  const baseStatement =
    template?.[answer] ??
    (answer === "yes"
      ? `I affirm ${selected.label.toLowerCase()}`
      : `I deny the opposite claim and instead affirm ${selected.label.toLowerCase()}`);
  const statementWithReferences = appendParentheticalReferences(`${ensureSentence(baseStatement)}${qualifier}`, referenceText);

  return {
    summary: selected.label,
    paragraphStatement: statementWithReferences,
    outlineStatement: statementWithReferences,
    references,
  } satisfies GeneratedClaim;
}

function buildGroupClaims(group: SectionGroupBlueprint, answers: AnswersMap, notes: NotesMap, options: DocumentOptions) {
  return group.questionIds
    .map((questionId) => QUESTION_LOOKUP.get(questionId))
    .filter((question): question is Question => Boolean(question))
    .map((question) => {
      const answer = answers[question.id];
      if (!answer) {
        return null;
      }

      return buildClaim(question, answer, notes[question.id]?.trim(), options);
    })
    .filter((claim): claim is GeneratedClaim => Boolean(claim));
}

function buildSectionBody(
  sectionBlueprint: SectionBlueprint,
  answers: AnswersMap,
  notes: NotesMap,
  format: DocumentFormat,
  options: DocumentOptions,
) {
  const blocks: string[] = [];
  const referencesUsed: string[] = [];

  sectionBlueprint.groups.forEach((group) => {
    const claims = buildGroupClaims(group, answers, notes, options);
    if (claims.length === 0) {
      return;
    }

    referencesUsed.push(...claims.flatMap((claim) => claim.references));

    if (group.heading) {
      blocks.push(`### ${group.heading}`);
    }

    if (format === "outline") {
      blocks.push(
        claims
          .map((claim) => `- ${claim.summary}: ${claim.outlineStatement}`)
          .join("\n"),
      );
      return;
    }

    blocks.push(claims.map((claim) => claim.paragraphStatement).join(" "));
  });

  return {
    body: blocks.join("\n\n"),
    referencesUsed: dedupe(referencesUsed),
  };
}

export function collectSelectedReferences(answers: AnswersMap) {
  return dedupe(
    SECTION_BLUEPRINTS.flatMap((section) =>
      section.groups.flatMap((group) =>
        group.questionIds
          .map((questionId) => QUESTION_LOOKUP.get(questionId))
          .filter((question): question is Question => Boolean(question))
          .map((question) => getSelectedOption(question, answers[question.id]))
          .filter((option): option is AnswerOption => Boolean(option))
          .flatMap((option) => option.proofTexts)
          .slice(0, group.maxReferences ?? DEFAULT_SECTION_REFERENCE_LIMIT),
      ),
    ),
  );
}

export function generateDocumentDraft(
  answers: AnswersMap,
  notes: NotesMap,
  format: DocumentFormat,
  options: DocumentOptions = DEFAULT_DOCUMENT_OPTIONS,
) {
  const normalizedOptions = normalizeDocumentOptions(options);
  const generatedAt = new Date().toISOString();
  const sections = SECTION_BLUEPRINTS.map((sectionBlueprint) => {
    const sectionContent = buildSectionBody(sectionBlueprint, answers, notes, format, normalizedOptions);
    return {
      title: sectionBlueprint.title,
      intro: sectionBlueprint.intro,
      body: sectionContent.body,
      referencesUsed: sectionContent.referencesUsed,
    };
  });

  return {
    title: GENERATED_DOCUMENT_TITLE,
    format,
    options: normalizedOptions,
    generatedAt,
    sections,
  } satisfies GeneratedDocument;
}

export function serializeDocumentToMarkdown(document: GeneratedDocument) {
  const title = normalizeGeneratedDocumentTitle(document.title);
  const headerLines = [
    `# ${title}`,
    "",
    `- Format: ${document.format === "outline" ? "Bullet Outline" : "Paragraph Draft"}`,
    `- Verse references: ${document.options.includeReferences ? "Included" : "Hidden"}`,
    `- Generated: ${new Date(document.generatedAt).toLocaleString()}`,
  ];

  const sectionBlocks = document.sections.map((section) => `## ${section.title}\n\n${section.body}`);

  return [...headerLines, "", ...sectionBlocks].join("\n");
}
