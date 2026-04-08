import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const sectionsDirectory = path.join(repositoryRoot, "questionnaire-workbook-sections");

const ignoredDirectories = new Set([".git", "dist", "node_modules"]);
const localMarkdownLinkPattern = /!?\[[^\]]*]\(([^)]+)\)/g;
const questionHeadingPattern = /^### (Q\d+[A-Za-z]?)\.\s+/gm;

async function collectMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const markdownFiles = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".github") {
      continue;
    }

    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) {
        continue;
      }

      markdownFiles.push(...(await collectMarkdownFiles(path.join(directory, entry.name))));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      markdownFiles.push(path.join(directory, entry.name));
    }
  }

  return markdownFiles.sort();
}

async function collectQuestionSections() {
  const entries = await readdir(sectionsDirectory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && /^\d{2}-.*\.md$/.test(entry.name))
    .filter((entry) => entry.name !== "00-introduction.md" && entry.name !== "99-closing-instructions.md")
    .map((entry) => path.join(sectionsDirectory, entry.name))
    .sort();
}

async function validateQuestionnaireStructure(errors) {
  const sectionFiles = await collectQuestionSections();
  const questionIds = [];
  const seenQuestionIds = new Set();

  for (const filePath of sectionFiles) {
    const markdown = await readFile(filePath, "utf8");

    for (const match of markdown.matchAll(questionHeadingPattern)) {
      const questionId = match[1];

      if (seenQuestionIds.has(questionId)) {
        errors.push(`Duplicate question id "${questionId}" found in ${path.relative(repositoryRoot, filePath)}.`);
        continue;
      }

      seenQuestionIds.add(questionId);
      questionIds.push(questionId);
    }
  }

  if (sectionFiles.length !== 20) {
    errors.push(`Expected 20 doctrinal section files, found ${sectionFiles.length}.`);
  }

  return {
    questionCount: questionIds.length,
    sectionCount: sectionFiles.length,
  };
}

async function validateDeclaredPromptCounts(actualQuestionCount, errors) {
  const declarations = [
    {
      filePath: path.join(sectionsDirectory, "00-introduction.md"),
      label: "questionnaire introduction",
      pattern: /(\d+)\s+yes\/no prompts/i,
    },
    {
      filePath: path.join(repositoryRoot, "personal-theology-build-guide.md"),
      label: "personal theology build guide",
      pattern: /(\d+)\s+prompts/i,
    },
  ];

  for (const declaration of declarations) {
    const markdown = await readFile(declaration.filePath, "utf8");
    const match = markdown.match(declaration.pattern);

    if (!match) {
      errors.push(`Could not find a prompt-count declaration in ${declaration.label}.`);
      continue;
    }

    const declaredCount = Number(match[1]);

    if (declaredCount !== actualQuestionCount) {
      errors.push(
        `${declaration.label} says ${declaredCount} prompts, but the questionnaire source contains ${actualQuestionCount}.`,
      );
    }
  }
}

function isExternalLink(target) {
  return /^(?:[a-z]+:)?\/\//i.test(target) || /^[a-z]+:/i.test(target);
}

function isAllowedExternalLink(target) {
  return /^(https?:|mailto:)/i.test(target);
}

function normalizeLinkTarget(target) {
  const [pathWithoutAnchor] = target.split("#", 1);
  const [pathWithoutQuery] = pathWithoutAnchor.split("?", 1);
  return decodeURIComponent(pathWithoutQuery.trim());
}

function resolveLocalLinkPath(filePath, normalizedTarget) {
  if (normalizedTarget.startsWith("/")) {
    return path.join(repositoryRoot, normalizedTarget.slice(1));
  }

  return path.resolve(path.dirname(filePath), normalizedTarget);
}

async function validateMarkdownLinks(errors) {
  const markdownFiles = await collectMarkdownFiles(repositoryRoot);

  for (const filePath of markdownFiles) {
    const markdown = await readFile(filePath, "utf8");

    for (const match of markdown.matchAll(localMarkdownLinkPattern)) {
      const target = match[1].trim();

      if (!target || target.startsWith("#")) {
        continue;
      }

      if (isExternalLink(target)) {
        if (!isAllowedExternalLink(target)) {
          errors.push(
            `Disallowed markdown link scheme in ${path.relative(repositoryRoot, filePath)}: ${target}`,
          );
        }
        continue;
      }

      const normalizedTarget = normalizeLinkTarget(target);

      if (!normalizedTarget) {
        continue;
      }

      const resolvedPath = resolveLocalLinkPath(filePath, normalizedTarget);

      if (!existsSync(resolvedPath)) {
        errors.push(
          `Broken local markdown link in ${path.relative(repositoryRoot, filePath)}: ${target}`,
        );
      }
    }
  }

  return markdownFiles.length;
}

async function main() {
  const errors = [];
  const { questionCount, sectionCount } = await validateQuestionnaireStructure(errors);
  await validateDeclaredPromptCounts(questionCount, errors);
  const markdownFileCount = await validateMarkdownLinks(errors);

  if (errors.length > 0) {
    console.error("Content validation failed:");

    for (const error of errors) {
      console.error(`- ${error}`);
    }

    process.exitCode = 1;
    return;
  }

  console.log(
    `Content validation passed: ${sectionCount} sections, ${questionCount} questions, ${markdownFileCount} markdown files checked.`,
  );
}

await main();
