import type { Metadata } from "next";
import LegalPageShell, { styles } from "@/components/LegalPageShell";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { legalPlaceholders } from "@/lib/legal";

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
    title: de ? "Impressum | ABCN" : "Legal Notice / Impressum | ABCN",
    description: de
      ? "Anbieterkennzeichnung und rechtliche Angaben zu ABCN."
      : "Legal provider information for ABCN.",
    robots: { index: true, follow: true },
    alternates: alternatesFor("/impressum", locale as Locale),
  };
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const de = locale === "de";

  const toc = de
    ? [
        { id: "anbieter", label: "Anbieter" },
        { id: "vertretung", label: "Vertretung" },
        { id: "kontakt", label: "Kontakt" },
        { id: "register", label: "Register & Steuern" },
        { id: "redaktion", label: "Redaktion" },
        { id: "eu", label: "EU-Vertreter" },
      ]
    : [
        { id: "provider", label: "Provider" },
        { id: "representation", label: "Representation" },
        { id: "contact", label: "Contact" },
        { id: "register", label: "Register & tax" },
        { id: "editorial", label: "Editorial" },
        { id: "eu", label: "EU representative" },
      ];

  if (de) {
    return (
      <LegalPageShell
        kicker="Rechtliches · § 5 DDG"
        title="Impressum"
        intro="Anbieterkennzeichnung für die ABCN-Website. Die Pflichtangaben werden ergänzt, sobald die endgültigen Organisationsdaten vorliegen."
        toc={toc}
      >
        <section id="anbieter">
          <h2>Angaben gemäß § 5 DDG</h2>
          <div className={styles["legal-card"]}>
            <p><strong><P>{legalPlaceholders.legalEntityName}</P></strong></p>
            <p>Rechtsform: <P>{legalPlaceholders.legalForm}</P></p>
            <p><P>{legalPlaceholders.streetAddress}</P><br/><P>{legalPlaceholders.postalCity}</P><br/><P>{legalPlaceholders.country}</P></p>
          </div>
        </section>

        <section id="vertretung">
          <h2>Vertretungsberechtigte Person</h2>
          <p><P>{legalPlaceholders.representative}</P></p>
        </section>

        <section id="kontakt">
          <h2>Kontakt</h2>
          <p>Telefon: <P>{legalPlaceholders.phone}</P><br/>E-Mail: <P>{legalPlaceholders.email}</P></p>
        </section>

        <section id="register">
          <h2>Register- und Steuerangaben</h2>
          <p>Register / Registergericht: <P>{legalPlaceholders.registerCourt}</P></p>
          <p>Registernummer: <P>{legalPlaceholders.registerNumber}</P></p>
          <p>Umsatzsteuer-Identifikationsnummer, falls vorhanden: <P>{legalPlaceholders.vatId}</P></p>
          <p className={styles["legal-note"]}>
            Nicht einschlägige Pflichtfelder werden nach Bestätigung der Rechtsform entfernt; erforderliche Angaben werden vollständig ergänzt.
          </p>
        </section>

        <section id="redaktion">
          <h2>Verantwortlich für redaktionelle Inhalte</h2>
          <p>
            Falls für die veröffentlichten journalistisch-redaktionellen Inhalte eine gesonderte Verantwortlichkeit anzugeben ist:
            <P>{legalPlaceholders.editorialResponsible}</P>.
          </p>
        </section>

        <section id="eu">
          <h2>EU-Vertreter, falls erforderlich</h2>
          <p>
            Sofern der endgültige Verantwortliche außerhalb der EU niedergelassen ist und eine Vertreterpflicht nach Art. 27 DSGVO besteht:
            <P>{legalPlaceholders.euRepresentative}</P>.
          </p>
          <p>Verbraucherstreitbeilegung / sonstige Pflichtangaben, falls einschlägig: <P>[ANGABEN NACH RECHTLICHER PRÜFUNG ERGÄNZEN]</P>.</p>
          <div className={styles["legal-actions"]}>
            <a className={styles["legal-action"] + " " + styles.primary} href="/de/datenschutz">Datenschutzerklärung</a>
            <a className={styles["legal-action"]} href="/">Zur Startseite</a>
          </div>
        </section>
      </LegalPageShell>
    );
  }

  return (
    <LegalPageShell
      kicker="Legal notice · German provider disclosure"
      title="Legal Notice / Impressum"
      intro="Provider information for the ABCN website. Mandatory legal details will be completed when the final operating entity is confirmed."
      toc={toc}
    >
      <section id="provider">
        <h2>Provider details</h2>
        <div className={styles["legal-card"]}>
          <p><strong><P>{legalPlaceholders.legalEntityName}</P></strong></p>
          <p>Legal form: <P>{legalPlaceholders.legalForm}</P></p>
          <p><P>{legalPlaceholders.streetAddress}</P><br/><P>{legalPlaceholders.postalCity}</P><br/><P>{legalPlaceholders.country}</P></p>
        </div>
      </section>

      <section id="representation">
        <h2>Authorised representative</h2>
        <p><P>{legalPlaceholders.representative}</P></p>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <p>Telephone: <P>{legalPlaceholders.phone}</P><br/>Email: <P>{legalPlaceholders.email}</P></p>
      </section>

      <section id="register">
        <h2>Register and tax information</h2>
        <p>Register / register court: <P>{legalPlaceholders.registerCourt}</P></p>
        <p>Registration number: <P>{legalPlaceholders.registerNumber}</P></p>
        <p>VAT identification number, if applicable: <P>{legalPlaceholders.vatId}</P></p>
        <p className={styles["legal-note"]}>
          Fields that are not legally applicable will be removed after the legal entity is confirmed; mandatory details will be completed before launch.
        </p>
      </section>

      <section id="editorial">
        <h2>Editorial responsibility</h2>
        <p>
          Where a separate responsible person must be identified for journalistic/editorial content:
          <P>{legalPlaceholders.editorialResponsible}</P>.
        </p>
      </section>

      <section id="eu">
        <h2>EU representative, if required</h2>
        <p>
          If the final controller is established outside the EU and Article 27 GDPR requires a representative:
          <P>{legalPlaceholders.euRepresentative}</P>.
        </p>
        <p>Consumer dispute-resolution or other mandatory disclosures, if applicable: <P>[ADD AFTER LEGAL REVIEW]</P>.</p>
        <div className={styles["legal-actions"]}>
          <a className={styles["legal-action"] + " " + styles.primary} href="/privacy">Privacy notice</a>
          <a className={styles["legal-action"]} href="/">Back to home</a>
        </div>
      </section>
    </LegalPageShell>
  );
}
