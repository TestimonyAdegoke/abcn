"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const instagram = "https://www.instagram.com/afropeanbusinessnetwork/";

function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 28 28" aria-hidden="true">
      <path d="M5 14h17" />
      <path d="m16 8 6 6-6 6" />
    </svg>
  );
}

/**
 * Shared two-tier footer. Was duplicated in the homepage and /about, which
 * meant translating it twice and keeping two copies in sync.
 */
export default function SiteFooter() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer>
      <div className="footer-deck">
        <div className="footer-identity">
          <div className="footer-brand">ABCN</div>
          <p className="footer-tagline">{t("tagline")}</p>
          <p className="footer-place">{t("place")}</p>
          <a className="footer-social" href={instagram} target="_blank" rel="noreferrer">
            {t("instagram")}
            <Arrow />
          </a>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <div className="footer-col">
            <h4>{t("network")}</h4>
            <Link href="/about">{t("ourStory")}</Link>
            <Link href="/#network">{t("whatWeDo")}</Link>
            <Link href="/#founder">{t("ourFounder")}</Link>
          </div>
          <div className="footer-col">
            <h4>{t("programmes")}</h4>
            <Link href="/events">{t("allEvents")}</Link>
            <Link href="/events/fiali-frankfurt-2026">{t("fiali")}</Link>
            <Link href="/events/fiali-frankfurt-2026">{t("apply")}</Link>
          </div>
          <div className="footer-col">
            <h4>{t("legal")}</h4>
            <Link href={locale === "de" ? "/datenschutz" : "/privacy"}>{t("privacy")}</Link>
            <Link href="/impressum">{t("impressum")}</Link>
            <button
              type="button"
              className="footer-linkbtn"
              onClick={() => window.dispatchEvent(new CustomEvent("open-cookies"))}
            >
              {t("cookies")}
            </button>
          </div>
        </nav>
      </div>

      <div className="footer-bar">
        <span className="footer-copy">
          {t("copyright", { year: new Date().getFullYear() })}
        </span>
        <span className="footer-creed">{t("creed")}</span>
        <span className="footer-meta">{t("compliance")}</span>
      </div>
    </footer>
  );
}
