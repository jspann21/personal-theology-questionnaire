export type AnswerValue = "yes" | "no";
export type AnswersMap = Record<string, AnswerValue>;
export type NotesMap = Record<string, string>;

export type DocumentFormat = "paragraph" | "outline";
export type DocumentOptions = {
  includeReferences: boolean;
};

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
  options: DocumentOptions;
  generatedAt: string;
  sections: GeneratedSection[];
};
