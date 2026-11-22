import { Info, Lightbulb, ShieldCheck } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

const ICONS = { info: Info, tip: Lightbulb, safe: ShieldCheck } as const;

/** Boxed note inside long-form text: `<Callout tone="safe" title="…">…</Callout>`. */
export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: keyof typeof ICONS;
  title?: string;
  children: ReactNode;
}) {
  const Icon = ICONS[tone];
  return (
    <aside className="prose-callout" data-tone={tone}>
      <Icon aria-hidden weight="duotone" className="prose-callout-icon" />
      <div>
        {title && <p className="prose-callout-title">{title}</p>}
        {children}
      </div>
    </aside>
  );
}
