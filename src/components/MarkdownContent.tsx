import { Fragment, type ReactNode } from "react";

interface MarkdownContentProps {
  markdown: string;
  className?: string;
}

const APP_BASE_URL = import.meta.env.BASE_URL;

function withBasePath(pathname: string) {
  const normalizedBase = APP_BASE_URL.endsWith("/") ? APP_BASE_URL.slice(0, -1) : APP_BASE_URL;

  if (!normalizedBase) {
    return pathname;
  }

  return `${normalizedBase}${pathname}`;
}

function getSafeHref(href: string) {
  const trimmed = href.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("#")) {
    return trimmed;
  }

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return withBasePath(trimmed);
  }

  if (/^(https?:|mailto:)/i.test(trimmed)) {
    return trimmed;
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return null;
  }

  return trimmed;
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:)/i.test(href);
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    if (!part) {
      return null;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.95em] text-slate-800">
          {part.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (linkMatch) {
      const safeHref = getSafeHref(linkMatch[2]);

      if (!safeHref) {
        return <Fragment key={index}>{linkMatch[1]}</Fragment>;
      }

      return (
        <a
          key={index}
          href={safeHref}
          className="font-medium text-blue-700 underline underline-offset-2"
          rel={isExternalHref(safeHref) ? "noreferrer noopener" : undefined}
        >
          {linkMatch[1]}
        </a>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

function createBlocks(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").trim().split("\n");
  const blocks: string[] = [];
  let currentLines: string[] = [];
  let currentType: "ul" | "ol" | "paragraph" | null = null;

  const flush = () => {
    if (currentLines.length === 0) return;
    blocks.push(currentLines.join("\n"));
    currentLines = [];
    currentType = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (currentType === "ul" || currentType === "ol") {
        continue;
      }
      flush();
      continue;
    }

    if (line === "---" || line.startsWith("# ")) {
      flush();
      blocks.push(line);
      continue;
    }

    if (/^- /.test(line)) {
      if (currentType !== "ul") {
        flush();
        currentType = "ul";
      }
      currentLines.push(line);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      if (currentType !== "ol") {
        flush();
        currentType = "ol";
      }
      currentLines.push(line);
      continue;
    }

    if (currentType !== "paragraph") {
      flush();
      currentType = "paragraph";
    }
    currentLines.push(line);
  }

  flush();
  return blocks;
}

export function MarkdownContent({ markdown, className }: MarkdownContentProps) {
  const blocks = createBlocks(markdown);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block === "---") {
          return <hr key={index} className="my-6 border-slate-200" />;
        }

        const lines = block.split("\n").map((line) => line.trim());

        if (lines.every((line) => /^- /.test(line))) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6">
              {lines.map((line, itemIndex) => (
                <li key={itemIndex}>{renderInline(line.slice(2))}</li>
              ))}
            </ul>
          );
        }

        if (lines.every((line) => /^\d+\.\s/.test(line))) {
          return (
            <ol key={index} className="list-decimal space-y-2 pl-6">
              {lines.map((line, itemIndex) => (
                <li key={itemIndex}>{renderInline(line.replace(/^\d+\.\s/, ""))}</li>
              ))}
            </ol>
          );
        }

        if (block.startsWith("### ")) {
          return (
            <h4 key={index} className="text-lg font-semibold text-slate-900">
              {renderInline(block.slice(4))}
            </h4>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <h3 key={index} className="text-xl font-bold text-slate-900">
              {renderInline(block.slice(3))}
            </h3>
          );
        }

        if (block.startsWith("# ")) {
          return (
            <h2 key={index} className="text-3xl font-extrabold tracking-tight text-slate-900">
              {renderInline(block.slice(2))}
            </h2>
          );
        }

        return (
          <p key={index} className="leading-relaxed">
            {lines.map((line, lineIndex) => {
              const children: ReactNode[] = [];

              if (lineIndex > 0) {
                children.push(<br key={`break-${lineIndex}`} />);
              }

              children.push(<Fragment key={`text-${lineIndex}`}>{renderInline(line)}</Fragment>);
              return children;
            })}
          </p>
        );
      })}
    </div>
  );
}
