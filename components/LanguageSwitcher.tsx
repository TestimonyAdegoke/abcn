"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

/**
 * EN / DE switcher.
 *
 * Swaps the locale segment on the CURRENT path, so switching language on
 * /events/fiali-frankfurt-2026 keeps you on that page rather than bouncing to
 * the homepage. The previous toggle in NavExtras only set React state that
 * nothing read, so it changed nothing.
 */
export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale || isPending) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error - pathname/params are correlated at runtime
        { pathname, params },
        { locale: next }
      );
    });
  }

  return (
    <div className="lang-switch" role="group" aria-label={t("language")}>
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            className={"lang-btn" + (active ? " active" : "")}
            onClick={() => switchTo(code)}
            aria-current={active ? "true" : undefined}
            aria-label={code === "de" ? t("german") : t("english")}
            disabled={isPending}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
