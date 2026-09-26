import type { Metadata } from "next";
import LegalPageShell, { styles } from "@/components/LegalPageShell";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { legalPlaceholders, legalReviewNotice, privacyInfrastructure } from "@/lib/legal";
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

  if (de) {
    const toc = [
      ["verantwortlicher", "Verantwortlicher"],
      ["hosting", "Hosting & Zugriffsdaten"],
      ["cookies", "Cookies & Speicher"],
      ["bewerbungen", "FIALI-Bewerbungen"],
      ["cms", "CMS & Administration"],
      ["empfaenger", "Empfänger & Transfers"],
      ["speicherung", "Speicherdauer"],
      ["sicherheit", "Sicherheit"],
      ["rechte", "Ihre Rechte"],
      ["aufsicht", "Aufsichtsbehörde"],
    ].map(([id, label]) => ({ id, label }));

    return (
      <LegalPageShell
        kicker="Datenschutz · DSGVO"
        title="Datenschutzerklärung"
        intro="Diese Seite beschreibt transparent, welche personenbezogenen Daten beim Besuch der ABCN-Website und bei Bewerbungen für Programme wie FIALI verarbeitet werden."
        draftNotice={legalReviewNotice.de}
        toc={toc}
      >
        <section id="verantwortlicher">
          <h2>1. Verantwortlicher</h2>
          <div className={styles["legal-card"]}>
            <p><strong><P>{legalPlaceholders.legalEntityName}</P></strong> · <P>{legalPlaceholders.legalForm}</P></p>
            <p><P>{legalPlaceholders.streetAddress}</P><br/><P>{legalPlaceholders.postalCity}</P><br/><P>{legalPlaceholders.country}</P></p>
            <p>Vertreten durch: <P>{legalPlaceholders.representative}</P></p>
            <p>E-Mail: <P>{legalPlaceholders.email}</P><br/>Telefon: <P>{legalPlaceholders.phone}</P></p>
          </div>
          <p>
            Datenschutzbeauftragte/r, sofern gesetzlich erforderlich oder bestellt: <P>{legalPlaceholders.dpo}</P>.
            Falls ABCN ausschließlich von einem Verantwortlichen außerhalb der EU betrieben wird und Art. 27 DSGVO anwendbar ist,
            wird hier zusätzlich der EU-Vertreter ergänzt: <P>{legalPlaceholders.euRepresentative}</P>.
          </p>
        </section>

        <section id="hosting">
          <h2>2. Hosting und technische Zugriffsdaten</h2>
          <p>
            Für die Bereitstellung der Website wird derzeit <strong>{privacyInfrastructure.hosting}</strong> als Hosting-Plattform eingesetzt.
            Bei Abrufen können technisch erforderliche Daten wie IP-Adresse, Datum und Uhrzeit, angeforderte URL,
            Browser-/Geräteinformationen sowie Sicherheits- und Fehlerdaten verarbeitet werden.
          </p>
          <p>
            Die Event- und Bewerbungsdaten werden über <strong>{privacyInfrastructure.database}</strong> als verwalteten Datenbankdienst verarbeitet.
            Das Datenbankprojekt läuft in der Region Frankfurt am Main (AWS eu-central-1), und die Serverfunktionen der Website sind
            ebenfalls auf Frankfurt festgelegt. Dies bedeutet jedoch nicht automatisch, dass sämtliche Verarbeitung durch die Anbieter
            und deren Unterauftragsverarbeiter ausschließlich im EWR stattfindet; maßgeblich sind die in Abschnitt 6 genannten Angaben.
          </p>
          <p>
            Zweck und endgültige Rechtsgrundlage für technische Protokolle: <P>[FINALEN ZWECK / RECHTSGRUNDLAGE BESTÄTIGEN]</P>.
            Speicherdauer technischer Logs: <P>{legalPlaceholders.serverLogRetention}</P>.
          </p>
        </section>

        <section id="cookies">
          <h2>3. Cookies, Local Storage und Einwilligungen</h2>
          <p>
            Diese Website setzt ausschließlich technisch notwendige Cookies. Vollständige Übersicht:
          </p>
          <StorageTable de />
          <p>
            Rechtsgrundlage für technisch notwendige Speicherung: § 25 Abs. 2 Nr. 2 TTDSG (unbedingt erforderlich, um den
            von Ihnen gewünschten Dienst bereitzustellen). Für diese Cookies ist keine Einwilligung erforderlich.
          </p>
          <h3>Was diese Website nicht tut</h3>
          <NoTrackingList de />
          <p>
            Nicht erforderliche Analyse-, Marketing- oder Tracking-Technologien sind derzeit nicht eingebunden. Sollten solche
            Dienste künftig eingeführt werden, werden sie erst nach Ihrer ausdrücklichen Einwilligung geladen; die Einwilligung
            wird über das Datenschutz-Banner eingeholt, das Ablehnen genauso einfach macht wie Zustimmen. Ihre Auswahl können
            Sie jederzeit über „Cookie- &amp; Datenschutzeinstellungen“ im Footer ändern oder widerrufen.
          </p>
          <p className={styles["legal-note"]}>
            Vor Aktivierung von Google Analytics, Meta Pixel, eingebetteten Marketingtools oder vergleichbaren Diensten muss diese Erklärung
            um Anbieter, Zwecke, Speicherdauer, Rechtsgrundlage und Widerrufsmöglichkeit ergänzt werden.
          </p>
        </section>

        <section id="bewerbungen">
          <h2>4. FIALI- und Veranstaltungsbewerbungen</h2>
          <p>
            Das Bewerbungsformular erhebt genau die folgenden Angaben - keine weiteren:
          </p>
          <ApplicationFieldList de />
          <p>
            Zusätzlich werden der Zeitpunkt der Einreichung, der Bearbeitungsstatus der Bewerbung sowie interne Notizen der
            Administration gespeichert. Die Bewerbung wird der jeweiligen Veranstaltung zugeordnet.
          </p>
          <h3>Zwecke</h3>
          <ul>
            <li>Prüfung und Verwaltung der Bewerbung;</li>
            <li>Kommunikation zum Bewerbungs- und Auswahlprozess;</li>
            <li>Planung des Programms, der Kohorte und gegebenenfalls der Fördermittelvergabe;</li>
            <li>interne Dokumentation des Bewerbungsstatus.</li>
          </ul>
          <p>
            Rechtsgrundlage: <P>[RECHTSGRUNDLAGE DURCH VERANTWORTLICHEN / RECHTSBERATUNG BESTÄTIGEN]</P>.
            Das Formular verlangt derzeit eine Bestätigung, dass diese Datenschutzhinweise gelesen wurden.
            Diese Bestätigung wird nicht als pauschale Einwilligung für Werbung oder andere unabhängige Zwecke verwendet.
          </p>
          <p>
            Bewerbungsdaten werden nicht automatisch mit Programmpartnern geteilt. Falls eine Weitergabe an Partner für einen konkreten
            Programmschritt erforderlich wird, muss dies vorab transparent gemacht und rechtlich eingeordnet werden.
          </p>
        </section>

        <section id="cms">
          <h2>5. CMS und Administrationszugänge</h2>
          <p>
            Autorisierte ABCN-Administratoren nutzen einen geschützten CMS-Zugang, um Veranstaltungen und Bewerbungen zu verwalten.
            Dabei können Kontodaten, Sitzungsinformationen, Rollen-/Berechtigungsdaten sowie administrative Änderungsdaten verarbeitet werden.
            Zugriff auf Bewerbungsdaten ist für die öffentliche Website nicht vorgesehen.
          </p>
        </section>

        <section id="empfaenger">
          <h2>6. Empfänger, Auftragsverarbeiter und internationale Übermittlungen</h2>
          <p>
            Zugriff erhalten nur Personen und Dienstleister, soweit dies für Betrieb, Sicherheit oder Programmverwaltung erforderlich ist.
            Eingesetzt werden ausschließlich die folgenden technischen Anbieter:
          </p>
          <ProcessorList de />
          <p>
            Je nach Anbieterstruktur und Unterauftragsverarbeitern können Daten außerhalb des Europäischen Wirtschaftsraums verarbeitet werden.
            Vor öffentlichem Launch werden die tatsächlich eingesetzten Auftragsverarbeitungsverträge, Unterauftragsverarbeiter,
            Übermittlungsmechanismen und gegebenenfalls Standardvertragsklauseln hier abschließend dokumentiert:
            <P>[DPA / SCC / TRANSFERANGABEN ERGÄNZEN]</P>.
          </p>
        </section>

        <section id="speicherung">
          <h2>7. Speicherdauer</h2>
          <p>
            Bewerbungsdaten: <P>{legalPlaceholders.applicationRetention}</P>.
            Technische Server-/Sicherheitslogs: <P>{legalPlaceholders.serverLogRetention}</P>.
          </p>
          <p>
            Daten werden gelöscht oder anonymisiert, sobald sie für den jeweiligen Zweck nicht mehr erforderlich sind und keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen. Die endgültigen Fristen sind vor Launch durch den Verantwortlichen festzulegen.
          </p>
        </section>

        <section id="sicherheit">
          <h2>8. Technische und organisatorische Maßnahmen</h2>
          <p>
            Zum Schutz Ihrer Daten sind unter anderem die folgenden Maßnahmen eingerichtet:
          </p>
          <SecurityMeasureList de />
        </section>

        <section id="rechte">
          <h2>9. Rechte betroffener Personen</h2>
          <p>
            Soweit die gesetzlichen Voraussetzungen erfüllt sind, bestehen insbesondere Rechte auf Auskunft, Berichtigung, Löschung,
            Einschränkung der Verarbeitung, Datenübertragbarkeit, Widerspruch sowie Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft.
          </p>
          <p>Datenschutzanfragen richten Sie an: <P>{legalPlaceholders.email}</P>.</p>
        </section>

        <section id="aufsicht">
          <h2>10. Beschwerderecht bei einer Aufsichtsbehörde</h2>
          <p>
            Betroffene Personen haben das Recht, sich bei einer zuständigen Datenschutzaufsichtsbehörde zu beschweren.
            Zuständige Behörde für den endgültigen Verantwortlichen: <P>{legalPlaceholders.supervisoryAuthority}</P>.
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
      intro="This notice explains how personal data is handled when people use the ABCN website or apply to programmes such as FIALI."
      draftNotice={legalReviewNotice.en}
      toc={toc}
    >
      <section id="controller">
        <h2>1. Controller</h2>
        <div className={styles["legal-card"]}>
          <p><strong><P>{legalPlaceholders.legalEntityName}</P></strong> · <P>{legalPlaceholders.legalForm}</P></p>
          <p><P>{legalPlaceholders.streetAddress}</P><br/><P>{legalPlaceholders.postalCity}</P><br/><P>{legalPlaceholders.country}</P></p>
          <p>Represented by: <P>{legalPlaceholders.representative}</P></p>
          <p>Email: <P>{legalPlaceholders.email}</P><br/>Telephone: <P>{legalPlaceholders.phone}</P></p>
        </div>
        <p>
          Data Protection Officer, if applicable: <P>{legalPlaceholders.dpo}</P>.
          If Article 27 GDPR requires an EU representative for the final controller, that representative will be listed here:
          <P>{legalPlaceholders.euRepresentative}</P>.
        </p>
      </section>

      <section id="hosting">
        <h2>2. Hosting and technical access data</h2>
        <p>
          The site currently uses <strong>{privacyInfrastructure.hosting}</strong> for web hosting. Technical request data may include
          IP address, date/time, requested URL, browser/device metadata, and security or error information necessary to deliver and protect the service.
        </p>
        <p>
          Event and application data is handled using <strong>{privacyInfrastructure.database}</strong> as the managed database service.
          The database project runs in the Frankfurt region (AWS eu-central-1), and the website&rsquo;s server functions are pinned to
          Frankfurt as well. This alone does not mean every provider or subprocessor activity occurs exclusively in the EEA; see
          section 6 for the details.
        </p>
        <p>
          Final purpose/legal basis for technical logs: <P>[CONFIRM FINAL PURPOSE / LEGAL BASIS]</P>.
          Technical log retention: <P>{legalPlaceholders.serverLogRetention}</P>.
        </p>
      </section>

      <section id="cookies">
        <h2>3. Cookies, local storage and consent</h2>
        <p>
          This website sets strictly necessary cookies only. The complete list:
        </p>
        <StorageTable de={false} />
        <p>
          Legal basis for strictly necessary storage: §25(2)(2) TTDSG (strictly necessary to provide the service you requested).
          No consent is required for these cookies.
        </p>
        <h3>What this website does not do</h3>
        <NoTrackingList de={false} />
        <p>
          No optional analytics, marketing or tracking technologies are currently in use. If such services are introduced later,
          they will load only after your explicit consent, collected through the privacy banner, which makes rejecting as easy as
          accepting. You can change or withdraw your choice at any time via &ldquo;Cookie &amp; privacy settings&rdquo; in the footer.
        </p>
        <p className={styles["legal-note"]}>
          Before Google Analytics, Meta Pixel, marketing embeds or similar tools are enabled, this notice must be updated with the provider,
          purpose, storage duration, legal basis and withdrawal controls.
        </p>
      </section>

      <section id="applications">
        <h2>4. FIALI and event applications</h2>
        <p>
          The application form collects exactly the following information, and nothing further:
        </p>
        <ApplicationFieldList de={false} />
        <p>
          In addition, the time of submission, the application&rsquo;s processing status and internal administrator notes are stored.
          Each application is linked to the event it was submitted for.
        </p>
        <h3>Purposes</h3>
        <ul>
          <li>reviewing and administering applications;</li>
          <li>communicating about selection and programme participation;</li>
          <li>planning the cohort, programme activities and any grant-selection process;</li>
          <li>maintaining an internal application status record.</li>
        </ul>
        <p>
          Legal basis: <P>[TO BE CONFIRMED BY THE CONTROLLER / LEGAL REVIEW]</P>.
          The form currently requires acknowledgement that this privacy notice has been read.
          That acknowledgement is not intended to bundle unrelated marketing consent.
        </p>
        <p>
          The current implementation does not automatically disclose application records to programme partners.
          If partner sharing becomes necessary for a specific programme step, the relevant disclosure and legal basis must be documented before it occurs.
        </p>
      </section>

      <section id="cms">
        <h2>5. CMS and administration</h2>
        <p>
          Authorised ABCN administrators use a protected CMS to manage events and applications.
          Account details, session data, role/permission data and administrative changes may be processed for security and administration.
          Application data is not intended to be publicly accessible.
        </p>
      </section>

      <section id="recipients">
        <h2>6. Recipients, processors and international transfers</h2>
        <p>
          Access is limited to people and service providers that require it for operation, security or programme administration.
          The following technical providers are the only ones in use:
        </p>
        <ProcessorList de={false} />
        <p>
          Depending on provider and subprocessor arrangements, processing outside the EEA may occur.
          Before public launch, the final controller should document applicable processor agreements, subprocessors,
          transfer mechanisms and any Standard Contractual Clauses here: <P>[ADD DPA / SCC / TRANSFER DETAILS]</P>.
        </p>
      </section>

      <section id="retention">
        <h2>7. Retention</h2>
        <p>
          Application data: <P>{legalPlaceholders.applicationRetention}</P>.
          Technical/security logs: <P>{legalPlaceholders.serverLogRetention}</P>.
        </p>
        <p>
          Data will be deleted or anonymised when it is no longer required for the relevant purpose unless a legal retention obligation applies.
          The final retention periods must be approved by the controller before launch.
        </p>
      </section>

      <section id="security">
        <h2>8. Technical and organisational measures</h2>
        <p>The following measures are in place to protect your data:</p>
        <SecurityMeasureList de={false} />
      </section>

      <section id="rights">
        <h2>9. Your rights</h2>
        <p>
          Subject to the applicable legal conditions, individuals may have rights of access, rectification, erasure,
          restriction, data portability, objection and withdrawal of consent for the future where processing is based on consent.
        </p>
        <p>Privacy requests: <P>{legalPlaceholders.email}</P>.</p>
      </section>

      <section id="authority">
        <h2>10. Supervisory authority</h2>
        <p>
          Individuals may lodge a complaint with a competent data protection supervisory authority.
          Authority applicable to the final controller: <P>{legalPlaceholders.supervisoryAuthority}</P>.
        </p>
        <div className={styles["legal-actions"]}>
          <a className={styles["legal-action"] + " " + styles.primary} href="/impressum">Legal notice</a>
          <a className={styles["legal-action"]} href="/">Back to home</a>
        </div>
      </section>
    </LegalPageShell>
  );
}
