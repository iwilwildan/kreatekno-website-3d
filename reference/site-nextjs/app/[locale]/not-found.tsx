import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const tPages = await getTranslations("pages");

  return (
    <>
      <main id="main">
        <section className="mx-auto min-h-[70svh] max-w-(--container-site) px-6 pt-[calc(var(--nav-top)+var(--nav-h)+64px)] pb-24">
          <p className="font-display text-7xl font-bold text-purple">404</p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] text-navy">{t("title")}</h1>
          <p className="mt-4 max-w-xl text-lg text-muted">{t("body")}</p>
          <Link href="/" className="mt-8 btn btn-main">
            {tPages("back")}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
