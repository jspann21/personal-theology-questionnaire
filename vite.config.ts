import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

function resolvePagesBasePath() {
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];

  if (process.env.PAGES_BASE_PATH) {
    return process.env.PAGES_BASE_PATH;
  }

  if (!repoName || process.env.GITHUB_ACTIONS !== "true") {
    return "/";
  }

  return repoName.endsWith(".github.io") ? "/" : `/${repoName}/`;
}

export default defineConfig(({ command }) => ({
  base: command === "build" ? resolvePagesBasePath() : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== "true",
  },
}));
