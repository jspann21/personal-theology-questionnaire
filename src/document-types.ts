export type AnswerValue = "yes" | "no";
export type AnswersMap = Record<string, AnswerValue>;
export type NotesMap = Record<string, string>;

export type DocumentFormat = "paragraph" | "outline";

export type GeneratedVerseStatus = "resolved" | "error";

export type GeneratedVerse = {
  reference: string;
  text: string;
  status: GeneratedVerseStatus;
};

export type GeneratedSection = {
  title: string;
  intro?: string;
  body: string;
  referencesUsed: string[];
};

export type GeneratedDocument = {
  title: string;
  format: DocumentFormat;
  generatedAt: string;
  sections: GeneratedSection[];
};
