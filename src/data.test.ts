import { describe, expect, it } from "vitest";
import { workbook, questions } from "./data";
import { assertValidWorkbookDocument } from "./workbook-schema";

describe("workbook data", () => {
  it("parses the expected workbook structure", () => {
    expect(workbook.sections).toHaveLength(20);
    expect(questions).toHaveLength(135);
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length);
  });

  it("passes workbook schema validation", () => {
    expect(() => assertValidWorkbookDocument(workbook)).not.toThrow();
  });
});
