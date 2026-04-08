import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { generateDocumentDraft, type DocumentFormat, type DocumentOptions, type GeneratedDocument } from "./document";
import { GeneratedDocumentWorkspace } from "./components/GeneratedDocumentWorkspace";
import { SAMPLE_GENERATED_AT, sampleAnswers, sampleNotes } from "./sample-report-data";
import "./index.css";

function buildSampleDocument(format: DocumentFormat, options: DocumentOptions): GeneratedDocument {
  return {
    ...generateDocumentDraft(sampleAnswers, sampleNotes, format, options),
    generatedAt: SAMPLE_GENERATED_AT,
  };
}

function SampleReportApp() {
  const [selectedFormat, setSelectedFormat] = useState<DocumentFormat>("paragraph");
  const [includeReferences, setIncludeReferences] = useState(true);
  const documentDraft = useMemo(
    () => buildSampleDocument(selectedFormat, { includeReferences }),
    [includeReferences, selectedFormat],
  );

  return (
    <GeneratedDocumentWorkspace
      documentDraft={documentDraft}
      pendingFormat={selectedFormat}
      onPendingFormatChange={setSelectedFormat}
      pendingIncludeReferences={includeReferences}
      onPendingIncludeReferencesChange={setIncludeReferences}
      mode="sample"
      homeHref={import.meta.env.BASE_URL}
      homeLabel="Home"
    />
  );
}

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <SampleReportApp />
  </StrictMode>,
);
