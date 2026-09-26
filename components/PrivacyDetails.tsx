import styles from "./LegalPage.module.css";
import {
  APPLICATION_FIELDS,
  DIRECT_BROWSER_CONNECTIONS,
  NO_TRACKING_FACTS,
  PROCESSORS,
  SECURITY_MEASURES,
  STORAGE_INVENTORY,
  type Bilingual,
} from "@/lib/privacy-facts";

/**
 * Renders the factual sections of the privacy notice from lib/privacy-facts.ts.
 *
 * Both language versions use these components, so the German and English texts
 * cannot drift apart or end up describing different systems - a real risk when
 * two long legal texts are maintained as separate prose.
 */

type Props = { de: boolean };

const pick = (value: Bilingual, de: boolean) => (de ? value.de : value.en);

/** Cookies and browser storage, with purpose and lifetime. */
export function StorageTable({ de }: Props) {
  return (
    <div className={styles["legal-tablewrap"]}>
      <table className={styles["legal-table"]}>
        <thead>
          <tr>
            <th>{de ? "Name" : "Name"}</th>
            <th>{de ? "Zweck" : "Purpose"}</th>
            <th>{de ? "Speicherdauer" : "Duration"}</th>
          </tr>
        </thead>
        <tbody>
          {STORAGE_INVENTORY.map((item) => (
            <tr key={item.name}>
              <td>
                <code>{item.name}</code>
                <span className={styles["legal-tag"]}>
                  {de ? "Notwendig" : "Necessary"}
                </span>
              </td>
              <td>
                {pick(item.purpose, de)}
                <br />
                <em>{pick(item.party, de)}</em>
              </td>
              <td>{pick(item.duration, de)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Exactly which fields the application form submits. */
export function ApplicationFieldList({ de }: Props) {
  const required = APPLICATION_FIELDS.filter((f) => f.required);
  const optional = APPLICATION_FIELDS.filter((f) => !f.required);

  return (
    <>
      <h3>{de ? "Pflichtangaben" : "Required information"}</h3>
      <ul>
        {required.map((field) => (
          <li key={field.label.en}>{pick(field.label, de)}</li>
        ))}
      </ul>

      <h3>{de ? "Freiwillige Angaben" : "Optional information"}</h3>
      <ul>
        {optional.map((field) => (
          <li key={field.label.en}>{pick(field.label, de)}</li>
        ))}
      </ul>
    </>
  );
}

/** Named processors with their role and the region they are configured for. */
export function ProcessorList({ de }: Props) {
  return (
    <div className={styles["legal-tablewrap"]}>
      <table className={styles["legal-table"]}>
        <thead>
          <tr>
            <th>{de ? "Anbieter" : "Provider"}</th>
            <th>{de ? "Funktion" : "Function"}</th>
            <th>{de ? "Verarbeitungsort" : "Processing location"}</th>
          </tr>
        </thead>
        <tbody>
          {PROCESSORS.map((processor) => (
            <tr key={processor.name}>
              <td>
                <strong>{processor.name}</strong>
                <br />
                <a href={processor.privacyUrl} target="_blank" rel="noreferrer noopener">
                  {de ? "Datenschutzerklärung" : "Privacy policy"}
                </a>
              </td>
              <td>{pick(processor.role, de)}</td>
              <td>{pick(processor.region, de)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{pick(DIRECT_BROWSER_CONNECTIONS, de)}</p>
    </div>
  );
}

/** What the site deliberately does not load. */
export function NoTrackingList({ de }: Props) {
  return (
    <ul>
      {NO_TRACKING_FACTS.map((fact) => (
        <li key={fact.en}>{pick(fact, de)}</li>
      ))}
    </ul>
  );
}

/** Configured technical and organisational measures. */
export function SecurityMeasureList({ de }: Props) {
  return (
    <ul>
      {SECURITY_MEASURES.map((measure) => (
        <li key={measure.en}>{pick(measure, de)}</li>
      ))}
    </ul>
  );
}
