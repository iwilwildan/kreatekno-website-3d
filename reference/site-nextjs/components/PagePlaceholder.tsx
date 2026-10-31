import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/** Simple page shell for pages whose content comes in M7. */
export async function PagePlaceholder({ title }: { title: string }) {
  const t = await getTranslations("pages");

  return (
    <section className="mx-auto min-h-[70svh] max-w-(--container-site) px-6 pt-[calc(var(--nav-top)+var(--nav-h)+64px)] pb-24">
      <h1 className="text-[clamp(2.25rem,6vw,4.5rem)] text-navy">{title}</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{t("soon")}</p>
      <Link href="/" className="mt-8 btn btn-line text-navy">
        <ArrowLeft aria-hidden className="size-[18px]" />
        {t("back")}
      </Link>
    </section>
  );
}
