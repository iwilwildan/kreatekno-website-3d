import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { Callout } from "@/components/mdx/Callout";
import { LegalName, OfficeAddress, PrivacyEmail } from "@/components/mdx/Contact";
import { Band, Cta, PullQuote } from "@/components/mdx/Editorial";
import { slugify, textOf } from "@/lib/slug";

/**
 * Components every MDX file under content/ can use without importing them (required by @next/mdx in the App
 * Router). Styling comes from the `.prose-k` wrapper (components/mdx/prose.css), not from these elements.
 */
const components: MDXComponents = {
  // `##` headings get an id so the table of contents and shared links can point at them.
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 id={slugify(textOf(children))} {...props}>
      {children}
    </h2>
  ),
  a: ({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>
        {children}
      </a>
    );
  },
  Band,
  Callout,
  Cta,
  PullQuote,
  LegalName,
  OfficeAddress,
  PrivacyEmail,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
