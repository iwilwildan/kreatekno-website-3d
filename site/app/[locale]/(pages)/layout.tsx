import { Footer } from "@/components/layout/Footer";

// Every page must be static: the build fails if a dynamic component slips in. Home sets the same.
// (Not on the [locale] layout, because the 404 catch-all can't list every unknown path.)
export const ensureStatic = "navigation";

/** Pages other than Home: content in <main>, then the site footer. Home's footer is the last story beat. */
export default function PagesLayout({ children }: LayoutProps<"/[locale]">) {
  return (
    <>
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
