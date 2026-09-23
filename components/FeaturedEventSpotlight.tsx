"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { neon } from "@/lib/neon";
import { EventRecord, FIALI_FALLBACK, fallbackEvent, normaliseEvent } from "@/lib/events";
import LogoMarquee from "@/components/LogoMarquee";
import styles from "./FeaturedEventSpotlight.module.css";

export default function FeaturedEventSpotlight() {
  const locale = useLocale();
  const t = useTranslations("spotlight");
  const [event, setEvent] = useState<EventRecord>(() => fallbackEvent(locale));

  useEffect(() => {
    let live = true;
    neon
      .from("events")
      .select("*")
      .eq("status", "published")
      .eq("show_on_home", true)
      .order("priority", { ascending: false })
      .limit(1)
      .then(
        ({ data }) => {
          if (live && data?.[0]) setEvent(normaliseEvent(data[0] as Partial<EventRecord>, locale));
        },
        () => {}
      );
    return () => { live = false; };
  }, []);

  const isFiali = event.slug === FIALI_FALLBACK.slug;
  const factItems = isFiali
    ? [
        [t("fact1Value"), t("fact1Label")],
        [t("fact2Value"), t("fact2Label")],
        [t("fact3Value"), t("fact3Label")],
        [t("fact4Value"), t("fact4Label")],
      ]
    : (event.highlights || []).slice(0, 4).map((item, index) => [String(index + 1).padStart(2, "0"), item]);

  return (
    <section className={styles.wrap} id="featured-event" aria-label={t("ariaLabel")}>
      <div className={styles.topline}>
        <span className={styles.kicker}>{t("kicker")}</span>
        <span className={styles.date}>{event.date_label || t("dateFallback")}</span>
      </div>
      <div className={styles.grid}>
        <h2 className={styles.title}>
          {isFiali ? (
            <>Female Innovation<br /><em>Afropean Leadership</em><br />Initiative</>
          ) : (
            event.title
          )}
        </h2>
        <div className={styles.copy}>
          <p>{event.short_description}</p>
          <div className={styles.actions}>
            {event.application_open ? (
              <Link className={styles.primary} href={"/events/" + event.slug + "#apply"}>{event.application_cta || t("applyNow")} →</Link>
            ) : (
              <Link className={styles.primary} href={"/events/" + event.slug}>{isFiali ? t("explore") : t("exploreGeneric")} →</Link>
            )}
            <Link className={styles.secondary} href={"/events/" + event.slug}>{t("programmeDetails")}</Link>
          </div>
          {event.application_deadline && <div className={styles.urgency}>{event.application_deadline}</div>}
        </div>
      </div>
      {isFiali && (
        <div style={{ marginTop: "44px", position: "relative", zIndex: 2 }}>
          <LogoMarquee
            logos={event.partners}
            theme="dark"
            speed="normal"
            label={t("partnerLabel")}
            tagline={t("partnerTagline")}
          />
        </div>
      )}
      {factItems.length > 0 && (
        <div className={styles.facts}>
          {factItems.map(([value, label]) => (
            <div className={styles.fact} key={value + label}><strong>{value}</strong><span>{label}</span></div>
          ))}
        </div>
      )}
    </section>
  );
}
