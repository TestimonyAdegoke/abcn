import type { Metadata } from "next";
import LegalPageShell, { styles } from "@/components/LegalPageShell";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { getLegalInfo } from "@/lib/legal";

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
  const info = getLegalInfo(locale);

  const toc = de
    ? [
        { id: "anbieter", label: "Anbieter" },
        { id: "vertretung", label: "Vertretung" },
        { id: "kontakt", label: "Kontakt" },
        { id: "register", label: "Register & Steuern" },
        { id: "redaktion", label: "Redaktion" },
        { id: "eu", label: "EU & Streitbeilegung" },
      ]
    : [
        { id: "provider", label: "Provider" },
        { id: "representation", label: "Representation" },
        { id: "contact", label: "Contact" },
        { id: "register", label: "Register & tax" },
        { id: "editorial", label: "Editorial" },
        { id: "eu", label: "Dispute resolution" },
      ];

  if (de) {
    return (
      <LegalPageShell
        kicker="Rechtliches · § 5 DDG"
        title="Impressum"
        intro="Anbieterkennzeichnung für die ABCN-Website (Afropean Business & Culture Network)."
        toc={toc}
      >
        <section id="anbieter">
          <h2>Angaben gemäß § 5 DDG</h2>
          <div className={styles["legal-card"]}>
            <p><strong>{info.legalEntityName}</strong></p>
            <p>Rechtsform: <P>{info.legalForm}</P></p>
            <p><P>{info.streetAddress}</P><br/>{info.postalCity}<br/>{info.country}</p>
          </div>
        </section>

        <section id="vertretung">
          <h2>Vertretungsberechtigte Person</h2>
          <p><strong>{info.representative}</strong> (Gründerin und Initiativleitung)</p>
        </section>

        <section id="kontakt">
          <h2>Kontakt</h2>
          <p>
            E-Mail: <a href={`mailto:${info.email}`} style={{ color: "#123f6d", fontWeight: 700 }}>{info.email}</a><br/>
            Telefon: <P>{info.phone}</P>
          </p>
        </section>

        <section id="register">
          <h2>Register- und Steuerangaben</h2>
          <p>Register / Registergericht: <P>{info.registerCourt}</P></p>
          <p>Registernummer: <P>{info.registerNumber}</P></p>
          <p>Umsatzsteuer-Identifikationsnummer: <P>{info.vatId}</P></p>
          <p className={styles["legal-note"]}>
            Nicht einschlägige Pflichtfelder werden nach formeller Bestätigung der Registernummer bzw. des Kleinunternehmerstatus angepasst.
          </p>
        </section>

        <section id="redaktion">
          <h2>Verantwortlich für redaktionelle Inhalte</h2>
          <p>
            Verantwortlich für redaktionelle Inhalte gemäß § 18 Abs. 2 MStV:<br/>
            <strong>{info.editorialResponsible}</strong>, {info.postalCity}, {info.country}.
          </p>
        </section>

        <section id="eu">
          <h2>EU-Vertretung &amp; Verbraucherstreitbeilegung</h2>
          <p>{info.euRepresentative}</p>
          <p>{info.consumerDispute}</p>
          <div className={styles["legal-actions"]}>
            <a className={styles["legal-action"] + " " + styles.primary} href="/de/privacy">Datenschutzerklärung</a>
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
      intro="Provider information for the ABCN website (Afropean Business & Culture Network)."
      toc={toc}
    >
      <section id="provider">
        <h2>Provider details</h2>
        <div className={styles["legal-card"]}>
          <p><strong>{info.legalEntityName}</strong></p>
          <p>Legal form: <P>{info.legalForm}</P></p>
          <p><P>{info.streetAddress}</P><br/>{info.postalCity}<br/>{info.country}</p>
        </div>
      </section>

      <section id="representation">
        <h2>Authorised representative</h2>
        <p><strong>{info.representative}</strong> (Founder &amp; Initiative Lead)</p>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <p>
          Email: <a href={`mailto:${info.email}`} style={{ color: "#123f6d", fontWeight: 700 }}>{info.email}</a><br/>
          Telephone: <P>{info.phone}</P>
        </p>
      </section>

      <section id="register">
        <h2>Register and tax information</h2>
        <p>Register / register court: <P>{info.registerCourt}</P></p>
        <p>Registration number: <P>{info.registerNumber}</P></p>
        <p>VAT identification number: <P>{info.vatId}</P></p>
        <p className={styles["legal-note"]}>
          Fields that are not legally applicable will be updated upon formal confirmation of the register status.
        </p>
      </section>

      <section id="editorial">
        <h2>Editorial responsibility</h2>
        <p>
          Responsible for journalistic and editorial content pursuant to § 18(2) MStV:<br/>
          <strong>{info.editorialResponsible}</strong>, {info.postalCity}, {info.country}.
        </p>
      </section>

      <section id="eu">
        <h2>EU representation &amp; consumer dispute resolution</h2>
        <p>{info.euRepresentative}</p>
        <p>{info.consumerDispute}</p>
        <div className={styles["legal-actions"]}>
          <a className={styles["legal-action"] + " " + styles.primary} href="/privacy">Privacy notice</a>
          <a className={styles["legal-action"]} href="/">Back to home</a>
        </div>
      </section>
    </LegalPageShell>
  );
}
