import { assertValidWorkbookDocument } from "./workbook-schema";

export type AnswerOption = {
  label: string;
  proofTexts: string[];
};

export type Question = {
  id: string;
  category: string;
  question: string;
  whyItMatters: string;
  yes: AnswerOption;
  no: AnswerOption;
  note?: string;
  sectionTitle: string;
  sourceFile: string;
};

export type WorkbookSection = {
  title: string;
  sourceFile: string;
  questions: Question[];
};

export type WorkbookDocument = {
  title: string;
  introMarkdown: string;
  closingMarkdown: string;
  sections: WorkbookSection[];
};

const rawFiles = import.meta.glob("../questionnaire-workbook-sections/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

function normalizeNewlines(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function stripWrappedBackticks(value: string) {
  if (value.startsWith("`") && value.endsWith("`")) {
    return value.slice(1, -1);
  }

  return value;
}

function splitProofTexts(value: string) {
  return value
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getFileName(path: string) {
  const segments = path.split("/");
  return segments[segments.length - 1] ?? path;
}

function getSortKey(path: string) {
  const fileName = getFileName(path);
  const match = fileName.match(/^(\d{2})-/);

  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function extractTitleAndBody(markdown: string) {
  const normalized = normalizeNewlines(markdown);
  const lines = normalized.split("\n");
  const titleLine = lines.find((line) => line.startsWith("# "));

  if (!titleLine) {
    throw new Error("Markdown file is missing a top-level heading.");
  }

  const title = titleLine.slice(2).trim();
  const bodyStart = lines.indexOf(titleLine) + 1;
  const body = lines.slice(bodyStart).join("\n").trim();

  return { title, body };
}

function parseQuestionBlock(sectionTitle: string, sourceFile: string, block: string): Question {
  const lines = normalizeNewlines(block)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const heading = lines[0]?.match(/^### (Q\d+[A-Za-z]?)\.\s+(.+)$/);

  if (!heading) {
    throw new Error(`Invalid question heading in ${sourceFile}.`);
  }

  const [, id, question] = heading;
  const fields = new Map<string, string>();

  for (const line of lines.slice(1)) {
    if (line === "---") {
      continue;
    }

    const match = line.match(/^- ([^:]+):\s*(.*)$/);

    if (!match) {
      continue;
    }

    fields.set(match[1], match[2]);
  }

  const category = fields.get("Category");
  const whyItMatters = fields.get("Why this matters");
  const yesLabel = fields.get("Yes");
  const yesProofTexts = fields.get("Yes proof texts");
  const noLabel = fields.get("No");
  const noProofTexts = fields.get("No proof texts");

  if (!category || !whyItMatters || !yesLabel || !yesProofTexts || !noLabel || !noProofTexts) {
    throw new Error(`Question ${id} in ${sourceFile} is missing required fields.`);
  }

  return {
    id,
    category,
    question,
    whyItMatters,
    yes: {
      label: stripWrappedBackticks(yesLabel),
      proofTexts: splitProofTexts(yesProofTexts),
    },
    no: {
      label: stripWrappedBackticks(noLabel),
      proofTexts: splitProofTexts(noProofTexts),
    },
    note: fields.get("Note"),
    sectionTitle,
    sourceFile,
  };
}

function parseSection(sourceFile: string, markdown: string): WorkbookSection {
  const normalized = normalizeNewlines(markdown);
  const firstQuestionIndex = normalized.search(/^### Q\d+[A-Za-z]?\.\s+/m);

  if (firstQuestionIndex === -1) {
    throw new Error(`No questions found in ${sourceFile}.`);
  }

  const titleMatch = normalized.match(/^# (.+)$/m);

  if (!titleMatch) {
    throw new Error(`Missing section title in ${sourceFile}.`);
  }

  const title = titleMatch[1].trim();
  const questionRegion = normalized.slice(firstQuestionIndex).trim();
  const questionBlocks = questionRegion.split(/\n{2,}(?=### Q\d+[A-Za-z]?\.\s+)/g);

  return {
    title,
    sourceFile,
    questions: questionBlocks.map((block) => parseQuestionBlock(title, sourceFile, block)),
  };
}

function buildWorkbookDocument(): WorkbookDocument {
  const entries = Object.entries(rawFiles).sort(([left], [right]) => getSortKey(left) - getSortKey(right));
  const introEntry = entries.find(([path]) => getFileName(path) === "00-introduction.md");
  const closingEntry = entries.find(([path]) => getFileName(path) === "99-closing-instructions.md");

  if (!introEntry || !closingEntry) {
    throw new Error("Workbook intro or closing file is missing.");
  }

  const intro = extractTitleAndBody(introEntry[1]);
  const closing = extractTitleAndBody(closingEntry[1]);
  const sections = entries
    .filter(([path]) => /^\.\.\/questionnaire-workbook-sections\/\d{2}-.*\.md$/.test(path))
    .filter(([path]) => {
      const fileName = getFileName(path);
      return fileName !== "00-introduction.md" && fileName !== "99-closing-instructions.md";
    })
    .map(([path, markdown]) => parseSection(getFileName(path), markdown));

  return {
    title: intro.title,
    introMarkdown: intro.body,
    closingMarkdown: closing.body,
    sections,
  };
}

export const workbook = buildWorkbookDocument();
assertValidWorkbookDocument(workbook);
export const questions = workbook.sections.flatMap((section) => section.questions);
