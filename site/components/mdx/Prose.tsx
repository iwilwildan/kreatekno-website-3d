import type { ReactNode } from "react";
import "./prose.css";

/** Wrapper that styles rendered MDX (headings, paragraphs, lists, links, callouts). Shared by legal pages and articles. */
export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`prose-k ${className}`.trim()}>{children}</div>;
}
