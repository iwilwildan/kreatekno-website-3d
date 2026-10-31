import { Footer } from "@/components/layout/Footer";

/** Pages other than Home: content in <main>, then the site footer. Home's footer is the last story beat. */
export default function PagesLayout({ children }: LayoutProps<"/[locale]">) {
  return (
    <>
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
