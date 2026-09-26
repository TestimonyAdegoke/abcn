import { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import styles from "./LegalPage.module.css";

type TocItem = { id: string; label: string };

export default function LegalPageShell({
  title,
  kicker,
  intro,
  draftNotice,
  toc,
  children,
}: {
  title: string;
  kicker: string;
  intro: string;
  draftNotice?: string;
  toc: TocItem[];
  children: ReactNode;
}) {
  return (
    <main className={styles["legal-shell"]}>
      <header className={styles["legal-nav"]}>
        <Link className={styles["legal-brand"]} href="/">ABCN</Link>
        <nav className={styles["legal-navlinks"]} aria-label="Legal navigation">
          <Link href="/events">Events</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/impressum">Impressum</Link>
        </nav>
      </header>

      <section className={styles["legal-hero"]}>
        <span className={styles["legal-kicker"]}>{kicker}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
        {draftNotice ? <div className={styles["legal-draft"]}>{draftNotice}</div> : null}
      </section>

      <div className={styles["legal-layout"]}>
        <aside className={styles["legal-toc"]} aria-label="On this page">
          {toc.map((item) => (
            <a key={item.id} href={"#" + item.id}>{item.label}</a>
          ))}
        </aside>
        <article className={styles["legal-content"]}>{children}</article>
      </div>
    </main>
  );
}

export { styles };
