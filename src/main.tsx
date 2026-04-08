import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

const GOOGLE_ANALYTICS_MEASUREMENT_ID = "G-E4LB8KTYDJ";
const GOOGLE_TAG_SCRIPT_ID = "google-tag-manager";

const initializeGoogleAnalytics = () => {
  if (window.gtag) {
    return;
  }

  if (!document.getElementById(GOOGLE_TAG_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GOOGLE_TAG_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_MEASUREMENT_ID}`;
    document.head.append(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ANALYTICS_MEASUREMENT_ID);
};

if (import.meta.env.PROD) {
  initializeGoogleAnalytics();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
