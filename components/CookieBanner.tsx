"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ALLOW_ALL,
  DENY_ALL,
  OPEN_PREFERENCES_EVENT,
  readConsent,
  writeConsent,
} from "@/lib/consent";

/**
 * Consent banner for the TTDSG / GDPR opt-in.
 *
 * Deliberate design decisions, all of which are compliance requirements rather
 * than styling choices:
 *  - "Accept all" and "Reject all" sit on the first layer with identical
 *    prominence. A reject that is smaller, greyed out or one layer deeper is
 *    the dark pattern German authorities issue findings over.
 *  - Optional toggles default to off and are never pre-ticked.
 *  - There is no bare "X" or "Got it" dismissal, because closing a banner is
 *    not consent; the visitor has to make an actual choice.
 *  - The banner does not trap focus or block the page, so the imprint and
 *    privacy notice stay reachable without deciding first.
 *  - Re-openable at any time from the footer, so withdrawal is as easy as
 *    giving consent.
 */
export default function CookieBanner() {
  const locale = useLocale();
  const de = locale === "de";

  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const firstButton = useRef<HTMLButtonElement>(null);

  // Only surface the banner when there is no valid, current decision on file.
  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Footer entry point: re-open with the current decision pre-loaded.
  useEffect(() => {
    const reopen = () => {
      const existing = readConsent();
      setAnalytics(existing?.analytics ?? false);
      setMarketing(existing?.marketing ?? false);
      setShowDetails(true);
      setIsVisible(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, reopen);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (isVisible) firstButton.current?.focus();
  }, [isVisible]);

  const decide = useCallback(
    (choice: { analytics: boolean; marketing: boolean }) => {
      writeConsent(choice);
      setIsVisible(false);
      setShowDetails(false);
    },
    []
  );

  if (!isVisible) return null;

  const t = de
    ? {
        title: "Datenschutz-Einstellungen",
        body:
          "Wir verwenden nur technisch notwendige Speicherung, damit diese Website funktioniert. Optionale Analyse- oder Marketing-Technologien werden ausschließlich mit Ihrer Einwilligung geladen. Sie können Ihre Auswahl jederzeit im Footer ändern.",
        acceptAll: "Alle akzeptieren",
        rejectAll: "Alle ablehnen",
        settings: "Einstellungen",
        save: "Auswahl speichern",
        back: "Zurück",
        privacy: "Datenschutzerklärung",
        imprint: "Impressum",
        overview: "Datenschutz auf einen Blick",
        necessary: "Notwendig",
        necessaryDesc:
          "Erforderlich für Sicherheit, Spracheinstellung und Formularfunktionen. Ohne diese Speicherung funktioniert die Website nicht.",
        always: "Immer aktiv",
        analytics: "Statistik",
        analyticsDesc:
          "Hilft uns zu verstehen, wie die Website genutzt wird. Derzeit ist kein Analysedienst eingebunden; diese Einstellung gilt, sobald einer hinzukommt.",
        marketing: "Marketing & externe Inhalte",
        marketingDesc:
          "Externe Inhalte wie Karten, Videos oder Kampagnen-Pixel. Diese übertragen Daten an Dritte und werden nur nach Ihrer Einwilligung geladen.",
      }
    : {
        title: "Privacy settings",
        body:
          "We use only technically necessary storage to make this site work. Optional analytics or marketing technologies load exclusively with your consent. You can change your choice at any time from the footer.",
        acceptAll: "Accept all",
        rejectAll: "Reject all",
        settings: "Settings",
        save: "Save choices",
        back: "Back",
        privacy: "Privacy notice",
        imprint: "Legal notice",
        overview: "Privacy at a glance",
        necessary: "Necessary",
        necessaryDesc:
          "Required for security, language preference and form functionality. The site cannot work without it.",
        always: "Always active",
        analytics: "Statistics",
        analyticsDesc:
          "Helps us understand how the site is used. No analytics service is currently integrated; this setting applies the moment one is added.",
        marketing: "Marketing & external content",
        marketingDesc:
          "External content such as maps, videos or campaign pixels. These transfer data to third parties and load only after your consent.",
      };

  return (
    <div
      className={"cookie-float-bar" + (showDetails ? " cookie-expanded" : "")}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-body"
    >
      <div className="cookie-main">
        <div className="cookie-text">
          <span aria-hidden="true">◉</span>
          <div>
            <strong id="cookie-title">{t.title}</strong>
            <p id="cookie-body">{t.body}</p>
            <p className="cookie-links">
              <Link href="/privacy">{t.privacy}</Link>
              <span aria-hidden="true"> · </span>
              <Link href="/impressum">{t.imprint}</Link>
              <span aria-hidden="true"> · </span>
              {/* Second layer: the plain-language summary in GdprModal. */}
              <button
                type="button"
                className="cookie-linkbtn"
                onClick={() => window.dispatchEvent(new CustomEvent("open-gdpr"))}
              >
                {t.overview}
              </button>
            </p>
          </div>
        </div>

        {!showDetails && (
          <div className="cookie-btns">
            {/* Reject is listed first and styled identically to accept. */}
            <button
              ref={firstButton}
              type="button"
              className="cookie-btn-choice"
              onClick={() => decide(DENY_ALL)}
            >
              {t.rejectAll}
            </button>
            <button
              type="button"
              className="cookie-btn-choice"
              onClick={() => decide(ALLOW_ALL)}
            >
              {t.acceptAll}
            </button>
            <button
              type="button"
              className="cookie-btn-info"
              onClick={() => setShowDetails(true)}
            >
              {t.settings}
            </button>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="cookie-details">
          <CategoryRow
            name={t.necessary}
            description={t.necessaryDesc}
            checked
            disabled
            hint={t.always}
          />
          <CategoryRow
            name={t.analytics}
            description={t.analyticsDesc}
            checked={analytics}
            onChange={setAnalytics}
          />
          <CategoryRow
            name={t.marketing}
            description={t.marketingDesc}
            checked={marketing}
            onChange={setMarketing}
          />

          <div className="cookie-btns cookie-btns-details">
            <button
              type="button"
              className="cookie-btn-info"
              onClick={() => setShowDetails(false)}
            >
              {t.back}
            </button>
            <button
              type="button"
              className="cookie-btn-choice"
              onClick={() => decide(DENY_ALL)}
            >
              {t.rejectAll}
            </button>
            <button
              type="button"
              className="cookie-btn-choice"
              onClick={() => decide({ analytics, marketing })}
            >
              {t.save}
            </button>
            <button
              type="button"
              className="cookie-btn-choice"
              onClick={() => decide(ALLOW_ALL)}
            >
              {t.acceptAll}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryRow({
  name,
  description,
  checked,
  disabled,
  hint,
  onChange,
}: {
  name: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  hint?: string;
  onChange?: (value: boolean) => void;
}) {
  return (
    <div className="cookie-category">
      <label className="cookie-category-head">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.checked)}
        />
        <span className="cookie-category-name">{name}</span>
        {hint && <span className="cookie-category-hint">{hint}</span>}
      </label>
      <p className="cookie-category-desc">{description}</p>
    </div>
  );
}
