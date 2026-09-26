import type { Metadata } from "next";
import LegalPageShell, { styles } from "@/components/LegalPageShell";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { getLegalInfo, privacyInfrastructure } from "@/lib/legal";
import {
  ApplicationFieldList,
  NoTrackingList,
  ProcessorList,
  SecurityMeasureList,
  StorageTable,
} from "@/components/PrivacyDetails";

const P = ({ children }: { children: React.ReactNode }) => (
  <span className={styles["legal-placeholder"]}>{children}</span>
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const de = locale === "de";
  return {
    title: de ? "Datenschutzerklärung | ABCN" : "Privacy Notice | ABCN",
    description: de
      ? "Datenschutzhinweise des Afropean Business & Culture Network."
      : "Privacy information for the Afropean Business & Culture Network.",
    robots: { index: true, follow: true },
    alternates: alternatesFor("/privacy", locale as Locale),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const de = locale === "de";
  const info = getLegalInfo(locale);

  if (de) {
    const toc = [
      ["verantwortlicher", "Verantwortlicher"],
      ["hosting", "Hosting & Zugriffsdaten"],
      ["cookies", "Cookies & Storage"],
      ["bewerbungen", "Veranstaltungsbewerbungen"],
      ["cms", "CMS & Administration"],
      ["empfaenger", "Empfänger & Übermittlungen"],
      ["speicherung", "Speicherdauer"],
      ["sicherheit", "Sicherheitsmaßnahmen"],
      ["rechte", "Ihre Rechte"],
      ["aufsicht", "Aufsichtsbehörde"],
    ].map(([id, label]) => ({ id, label }));

    return (
      <LegalPageShell
        kicker="Datenschutz · DSGVO"
        title="Datenschutzerklärung"
        intro="Diese Erklärung informiert transparent darüber, wie personenbezogene Daten auf der Website des Afropean Business & Culture Network (ABCN) und bei Bewerbungen zu Programmen wie FIALI verarbeitet werden."
        toc={toc}
      >
        <section id="verantwortlicher">
          <h2>1. Verantwortlicher</h2>
          <div className={styles["legal-card"]}>
            <p><strong>{info.legalEntityName}</strong> · <P>{info.legalForm}</P></p>
            <p><P>{info.streetAddress}</P><br/>{info.postalCity}<br/>{info.country}</p>
            <p>Vertreten durch: <strong>{info.representative}</strong> (Gründerin und Leitung)</p>
            <p>
              E-Mail: <a href={`mailto:${info.email}`} style={{ color: "#123f6d", fontWeight: 700 }}>{info.email}</a><br/>
              Telefon: <P>{info.phone}</P>
            </p>
          </div>
          <p>
            <strong>Datenschutzbeauftragter:</strong> {info.dpo}
          </p>
          <p>
            <strong>EU-Vertreter:</strong> {info.euRepresentative}
          </p>
        </section>

        <section id="hosting">
          <h2>2. Hosting und technische Zugriffsdaten</h2>
          <p>
            Für die Bereitstellung der Website wird derzeit <strong>{privacyInfrastructure.hosting}</strong> (Vercel Inc.) als Hosting-Plattform eingesetzt.
            Beim Aufruf werden technisch erforderliche Daten wie IP-Adresse, Datum und Uhrzeit, angeforderte URL,
            Browser-/Geräteinformationen sowie Sicherheits- und Fehlerdaten verarbeitet.
          </p>
          <p>
            Die Event- und Bewerbungsdaten werden über <strong>{privacyInfrastructure.database}</strong> (Neon, Inc.) als verwalteten PostgreSQL-Datenbankdienst verarbeitet.
            Das Datenbankprojekt läuft in der Region Frankfurt am Main (AWS eu-central-1), und die Serverfunktionen der Website sind
            ebenfalls auf Frankfurt festgelegt.
          </p>
          <p>
            <strong>Zweck &amp; Rechtsgrundlage:</strong> {info.logLegalBasis}
          </p>
          <p>
            <strong>Speicherdauer technischer Serverlogs:</strong> {info.serverLogRetention}
          </p>
        </section>

        <section id="cookies">
          <h2>3. Cookies, Local Storage und Einwilligungen</h2>
          <p>
            Diese Website setzt ausschließlich technisch notwendige Cookies und Speicherzugriffe ein. Vollständige Übersicht:
          </p>
          <StorageTable de />
          <p>
            Rechtsgrundlage für technisch notwendige Speicherung: § 25 Abs. 2 Nr. 2 TTDSG / TDDDG (unbedingt erforderlich, um den
            von Ihnen gewünschten Dienst bereitzustellen). Für diese Cookies ist keine gesonderte Einwilligung erforderlich.
          </p>
          <h3>Was diese Website nicht tut</h3>
          <NoTrackingList de />
          <p>
            Nicht erforderliche Analyse-, Marketing- oder Tracking-Technologien sind nicht eingebunden. Sollten solche
            Dienste künftig eingeführt werden, werden sie erst nach Ihrer ausdrücklichen vorherigen Einwilligung geladen.
            Ihre Auswahl können Sie jederzeit über „Cookie- &amp; Datenschutzeinstellungen“ im Footer anpassen oder widerrufen.
          </p>
        </section>

        <section id="bewerbungen">
          <h2>4. FIALI- und Veranstaltungsbewerbungen</h2>
          <p>
            Das Bewerbungsformular erhebt genau die folgenden Angaben zur Prüfung der Teilnahmeberechtigung:
          </p>
          <ApplicationFieldList de />
          <p>
            Zusätzlich werden der Zeitpunkt der Einreichung, der Bearbeitungsstatus der Bewerbung sowie interne Notizen der
            Administration gespeichert. Die Bewerbung wird der jeweiligen Veranstaltung zugeordnet.
          </p>
          <h3>Zwecke</h3>
          <ul>
            <li>Prüfung und Bearbeitung der Bewerbung auf Teilnahme am Programm;</li>
            <li>Kommunikation zum Bewerbungs- und Auswahlprozess;</li>
            <li>Planung der Workshops, Mentoring-Sessions und der eventuellen Fördermittelvergabe;</li>
            <li>interne Dokumentation und Statusverwaltung.</li>
          </ul>
          <p>
            <strong>Rechtsgrundlage:</strong> {info.applicationLegalBasis}
          </p>
          <p>
            Bewerbungsdaten werden vertraulich behandelt und nicht ohne vorherige Information an Dritte oder Programmpartner weitergegeben.
          </p>
        </section>

        <section id="cms">
          <h2>5. CMS und Administrationszugänge</h2>
          <p>
            Autorisierte ABCN-Administratoren nutzen einen geschützten CMS-Zugang, um Veranstaltungen und Bewerbungen zu verwalten.
            Dabei können Kontodaten, Sitzungsinformationen, Rollen-/Berechtigungsdaten sowie administrative Protokolldaten verarbeitet werden.
            Bewerbungsdaten sind für die Öffentlichkeit zu keinem Zeitpunkt einsehbar.
          </p>
        </section>

        <section id="empfaenger">
          <h2>6. Empfänger, Auftragsverarbeiter und internationale Übermittlungen</h2>
          <p>
            Zugriff erhalten ausschließlich autorisierte Personen und sorgfältig ausgewählte technische Dienstleister,
            soweit dies für Betrieb, Sicherheit oder Programmverwaltung zwingend erforderlich ist.
          </p>
          <ProcessorList de />
          <p>
            <strong>Auftragsverarbeitung &amp; Drittlandübermittlung:</strong> {info.dataTransfers}
          </p>
        </section>

        <section id="speicherung">
          <h2>7. Speicherdauer</h2>
          <p>
            <strong>Bewerbungsdaten:</strong> {info.applicationRetention}
          </p>
          <p>
            <strong>Technische Server-/Sicherheitslogs:</strong> {info.serverLogRetention}
          </p>
          <p>
            Daten werden gelöscht oder anonymisiert, sobald sie für den jeweiligen Zweck nicht mehr erforderlich sind und keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen.
          </p>
        </section>

        <section id="sicherheit">
          <h2>8. Technische und organisatorische Maßnahmen</h2>
          <p>
            Zum Schutz Ihrer Daten vor unberechtigtem Zugriff, Verlust oder Missbrauch sind angemessene technische und organisatorische Maßnahmen implementiert:
          </p>
          <SecurityMeasureList de />
        </section>

        <section id="rechte">
          <h2>9. Rechte betroffener Personen</h2>
          <p>
            Ihnen stehen nach den gesetzlichen Bestimmungen der DSGVO die folgenden Rechte zu:
            Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
            Datenübertragbarkeit (Art. 20), Widerspruch (Art. 21) sowie jederzeitiger Widerruf erteilter Einwilligungen.
          </p>
          <p>
            Datenschutzanfragen richten Sie bitte formlos an: <a href={`mailto:${info.email}`} style={{ color: "#123f6d", fontWeight: 700 }}>{info.email}</a>.
          </p>
        </section>

        <section id="aufsicht">
          <h2>10. Beschwerderecht bei einer Aufsichtsbehörde</h2>
          <p>
            Sie haben gemäß Art. 77 DSGVO das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.
            Die für den Sitz der Initiative zuständige Aufsichtsbehörde ist:
          </p>
          <p>
            <strong>{info.supervisoryAuthority}</strong>
          </p>
          <div className={styles["legal-actions"]}>
            <a className={styles["legal-action"] + " " + styles.primary} href="/de/impressum">Zum Impressum</a>
            <a className={styles["legal-action"]} href="/">Zur Startseite</a>
          </div>
        </section>
      </LegalPageShell>
    );
  }

  const toc = [
    ["controller", "Controller"],
    ["hosting", "Hosting & access data"],
    ["cookies", "Cookies & storage"],
    ["applications", "Event applications"],
    ["cms", "CMS & administration"],
    ["recipients", "Recipients & transfers"],
    ["retention", "Retention"],
    ["security", "Security"],
    ["rights", "Your rights"],
    ["authority", "Supervisory authority"],
  ].map(([id, label]) => ({ id, label }));

  return (
    <LegalPageShell
      kicker="Privacy · GDPR"
      title="Privacy Notice"
      intro="This notice explains transparently how personal data is processed when visiting the Afropean Business & Culture Network (ABCN) website or applying to programmes such as FIALI."
      toc={toc}
    >
      <section id="controller">
        <h2>1. Controller</h2>
        <div className={styles["legal-card"]}>
          <p><strong>{info.legalEntityName}</strong> · <P>{info.legalForm}</P></p>
          <p><P>{info.streetAddress}</P><br/>{info.postalCity}<br/>{info.country}</p>
          <p>Represented by: <strong>{info.representative}</strong> (Founder &amp; Lead)</p>
          <p>
            Email: <a href={`mailto:${info.email}`} style={{ color: "#123f6d", fontWeight: 700 }}>{info.email}</a><br/>
            Telephone: <P>{info.phone}</P>
          </p>
        </div>
        <p>
          <strong>Data Protection Officer:</strong> {info.dpo}
        </p>
        <p>
          <strong>EU Representative:</strong> {info.euRepresentative}
        </p>
      </section>

      <section id="hosting">
        <h2>2. Hosting and technical access data</h2>
        <p>
          The site currently uses <strong>{privacyInfrastructure.hosting}</strong> (Vercel Inc.) for web hosting. Technical request data may include
          IP address, date/time, requested URL, browser/device metadata, and security or error information necessary to deliver and protect the service.
        </p>
        <p>
          Event and application data is handled using <strong>{privacyInfrastructure.database}</strong> (Neon, Inc.) as the managed database service.
          The database project runs in the Frankfurt region (AWS eu-central-1), and the website&rsquo;s server functions are pinned to Frankfurt as well.
        </p>
        <p>
          <strong>Purpose &amp; Legal Basis:</strong> {info.logLegalBasis}
        </p>
        <p>
          <strong>Technical Log Retention:</strong> {info.serverLogRetention}
        </p>
      </section>

      <section id="cookies">
        <h2>3. Cookies, local storage and consent</h2>
        <p>
          This website sets strictly necessary cookies and browser storage only. The complete list:
        </p>
        <StorageTable de={false} />
        <p>
          Legal basis for strictly necessary storage: §25(2)(2) TTDSG / TDDDG (strictly necessary to provide the service you requested).
          No prior consent is required for these essential operational cookies.
        </p>
        <h3>What this website does not do</h3>
        <NoTrackingList de={false} />
        <p>
          No optional analytics, marketing or tracking technologies are currently in use. If such services are introduced later,
          they will load only after your explicit prior consent. You can change or withdraw your choice at any time via &ldquo;Cookie &amp; privacy settings&rdquo; in the footer.
        </p>
      </section>

      <section id="applications">
        <h2>4. FIALI and event applications</h2>
        <p>
          The application form collects the following information strictly to evaluate eligibility:
        </p>
        <ApplicationFieldList de={false} />
        <p>
          In addition, the time of submission, the application&rsquo;s processing status and internal administrator notes are stored.
          Each application is linked to the event it was submitted for.
        </p>
        <h3>Purposes</h3>
        <ul>
          <li>Reviewing and evaluating applications for programme participation;</li>
          <li>Communicating regarding the selection and onboarding process;</li>
          <li>Planning workshops, cohort composition, and any grant allocation;</li>
          <li>Maintaining an internal administrative record.</li>
        </ul>
        <p>
          <strong>Legal Basis:</strong> {info.applicationLegalBasis}
        </p>
        <p>
          Application data is treated in strict confidence and is not automatically shared with third-party partners.
        </p>
      </section>

      <section id="cms">
        <h2>5. CMS and administration</h2>
        <p>
          Authorised ABCN administrators use a protected CMS to manage events and applications.
          Account details, session data, role/permission data and administrative changes are processed for security and administration.
          Application data is not publicly accessible.
        </p>
      </section>

      <section id="recipients">
        <h2>6. Recipients, processors and international transfers</h2>
        <p>
          Access is limited to authorised personnel and technical service providers necessary for operation, security, and programme administration.
        </p>
        <ProcessorList de={false} />
        <p>
          <strong>Data Processing &amp; International Transfers:</strong> {info.dataTransfers}
        </p>
      </section>

      <section id="retention">
        <h2>7. Retention</h2>
        <p>
          <strong>Application Data:</strong> {info.applicationRetention}
        </p>
        <p>
          <strong>Technical / Security Logs:</strong> {info.serverLogRetention}
        </p>
        <p>
          Data is deleted or anonymised when it is no longer required for the relevant purpose unless a statutory retention obligation applies.
        </p>
      </section>

      <section id="security">
        <h2>8. Technical and organisational measures</h2>
        <p>Appropriate technical and organisational measures are in place to safeguard your data:</p>
        <SecurityMeasureList de={false} />
      </section>

      <section id="rights">
        <h2>9. Your rights</h2>
        <p>
          Under the GDPR, individuals have rights of access (Art. 15), rectification (Art. 16), erasure (Art. 17),
          restriction of processing (Art. 18), data portability (Art. 20), objection (Art. 21), and withdrawal of consent where applicable.
        </p>
        <p>
          For privacy inquiries or rights requests, contact: <a href={`mailto:${info.email}`} style={{ color: "#123f6d", fontWeight: 700 }}>{info.email}</a>.
        </p>
      </section>

      <section id="authority">
        <h2>10. Supervisory authority</h2>
        <p>
          Individuals have the right to lodge a complaint with a data protection supervisory authority (Art. 77 GDPR).
          The competent supervisory authority for the initiative&rsquo;s location is:
        </p>
        <p>
          <strong>{info.supervisoryAuthority}</strong>
        </p>
        <div className={styles["legal-actions"]}>
          <a className={styles["legal-action"] + " " + styles.primary} href="/impressum">Legal notice</a>
          <a className={styles["legal-action"]} href="/">Back to home</a>
        </div>
      </section>
    </LegalPageShell>
  );
}
