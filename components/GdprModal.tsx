"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

export default function GdprModal() {
  const locale = useLocale();
  const de = locale === "de";
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"collect" | "process" | "rights">("collect");

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-gdpr", handleOpen);
    return () => window.removeEventListener("open-gdpr", handleOpen);
  }, []);

  if (!isOpen) return null;

  const labels = de
    ? {
        title: "Datenschutz auf einen Blick",
        subtitle: "Transparente Übersicht · vollständige Erklärung mit Platzhaltern verfügbar",
        collect: "01. Erhobene Daten",
        process: "02. Verarbeitung",
        rights: "03. Ihre Rechte",
        close: "Schließen",
        full: "Datenschutzerklärung öffnen",
      }
    : {
        title: "Privacy at a glance",
        subtitle: "Transparent overview · full notice with placeholders available",
        collect: "01. Data collected",
        process: "02. Processing",
        rights: "03. Your rights",
        close: "Close",
        full: "Open full privacy notice",
      };

  return (
    <div
      className="gdpr-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gdpr-modal-title"
    >
      <div className="gdpr-dialog">
        <div className="gdpr-accent-bar" />
        <button
          onClick={() => setIsOpen(false)}
          className="gdpr-close-btn"
          aria-label={labels.close}
        >
          ✕
        </button>

        <div className="gdpr-body">
          <div className="gdpr-header">
            <div className="gdpr-icon">◉</div>
            <div className="gdpr-title">
              <h2 id="gdpr-modal-title">{labels.title}</h2>
              <p>{labels.subtitle}</p>
            </div>
          </div>

          <div className="gdpr-tabs-nav">
            <button type="button" onClick={() => setActiveTab("collect")} className={"gdpr-tab-btn " + (activeTab === "collect" ? "active" : "")}>
              {labels.collect}
            </button>
            <button type="button" onClick={() => setActiveTab("process")} className={"gdpr-tab-btn " + (activeTab === "process" ? "active" : "")}>
              {labels.process}
            </button>
            <button type="button" onClick={() => setActiveTab("rights")} className={"gdpr-tab-btn " + (activeTab === "rights" ? "active" : "")}>
              {labels.rights}
            </button>
          </div>

          <div className="gdpr-tab-pane">
            {activeTab === "collect" && (
              <div>
                <p>
                  {de
                    ? "Beim normalen Websitebesuch fallen technische Zugriffsdaten an. Wenn Sie sich für FIALI oder eine andere Veranstaltung bewerben, verarbeiten wir zusätzlich die Angaben, die Sie im Bewerbungsformular eingeben."
                    : "A normal website visit generates technical access data. If you apply to FIALI or another event, we also process the information you submit in the application form."}
                </p>
                <p className="gdpr-note">
                  {de
                    ? "Die aktuellen Formulare erfassen u. a. Kontakt-, Rollen-, Venture-, Motivations- und Programminformationen. Es werden derzeit keine Drittanbieter-Werbe- oder Analyse-Skripte absichtlich geladen."
                    : "Current forms collect contact, role, venture, motivation and programme information. The application does not currently intentionally load third-party advertising or analytics scripts."}
                </p>
              </div>
            )}

            {activeTab === "process" && (
              <div>
                <p>
                  {de
                    ? "Bewerbungsdaten werden zur Prüfung, Kommunikation, Kohortenplanung und internen Statusverwaltung verarbeitet. Die endgültigen Angaben zum Verantwortlichen, zur Rechtsgrundlage, Aufbewahrung und zu internationalen Übermittlungen sind in der Datenschutzerklärung als Platzhalter markiert, bis die Organisationsdaten vorliegen."
                    : "Application data is processed for review, communication, cohort planning and internal status management. Final controller, legal-basis, retention and international-transfer details are clearly marked as placeholders in the privacy notice until the organisation details are supplied."}
                </p>
                <p className="gdpr-note">
                  {de
                    ? "Eine Bestätigung, dass die Datenschutzhinweise gelesen wurden, ist keine pauschale Werbeeinwilligung."
                    : "Acknowledging the privacy notice is not treated as blanket marketing consent."}
                </p>
              </div>
            )}

            {activeTab === "rights" && (
              <div>
                <p>
                  {de
                    ? "Nach Maßgabe der DSGVO können insbesondere Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch und Beschwerde bei einer Aufsichtsbehörde bestehen."
                    : "Subject to the GDPR's conditions, individuals may have rights of access, rectification, erasure, restriction, portability, objection and complaint to a supervisory authority."}
                </p>
                <p className="gdpr-note">
                  {de
                    ? "Der endgültige Datenschutzkontakt und die zuständige Aufsichtsbehörde werden ergänzt, sobald die Rechts- und Organisationsdaten bestätigt sind."
                    : "The final privacy contact and competent supervisory authority will be added when the legal and organisation details are confirmed."}
                </p>
              </div>
            )}
          </div>

          <div className="gdpr-footer">
            <div className="gdpr-actions">
              <button type="button" onClick={() => setIsOpen(false)} className="gdpr-btn-dismiss">
                {labels.close}
              </button>
              <Link href="/privacy" className="gdpr-btn-accept" onClick={() => setIsOpen(false)}>
                {labels.full}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
