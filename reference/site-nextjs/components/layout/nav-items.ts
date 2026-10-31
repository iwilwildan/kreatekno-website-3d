import type { ComponentProps } from "react";
import type { Link } from "@/i18n/navigation";

type Href = ComponentProps<typeof Link>["href"];

/** Main navigation. Services and How it works are beats of the Home story. */
export const NAV_ITEMS = [
  { key: "services", href: { pathname: "/", hash: "layanan" } },
  { key: "how", href: { pathname: "/", hash: "cara-kerja" } },
  { key: "portfolio", href: "/portofolio" },
  { key: "articles", href: "/artikel" },
  { key: "about", href: "/tentang" },
] as const satisfies ReadonlyArray<{ key: string; href: Href }>;
