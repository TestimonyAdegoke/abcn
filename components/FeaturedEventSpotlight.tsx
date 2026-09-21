"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { neon } from "@/lib/neon";
import { EventRecord, FIALI_FALLBACK, normaliseEvent } from "@/lib/events";
import LogoMarquee from "@/components/LogoMarquee";
import styles from "./FeaturedEventSpotlight.module.css";

export default function FeaturedEventSpotlight() {
  const [event, setEvent] = useState<EventRecord>(FIALI_FALLBACK);

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
          if (live && data?.[0]) setEvent(normaliseEvent(data[0] as Partial<EventRecord>));
        },
        () => {}
      );
    return () => { live = false; };
  }, []);

  const isFiali = event.slug === FIALI_FALLBACK.slug;
  const factItems = isFiali
    ? [
        ["10-15", "Female Founders Cohort"],
        ["02 Stages", "Growth Lab + Summit"],
        ["AI & Digital", "Practical Founder Tools"],
        ["Frankfurt", "Ecosystem & Capital Access"],
      ]
    : (event.highlights || []).slice(0, 4).map((item, index) => [String(index + 1).padStart(2, "0"), item]);

  return (
    <section className={styles.wrap} id="featured-event" aria-label="Featured event">
      <div className={styles.topline}>
        <span className={styles.kicker}>Priority event · ABCN presents</span>
        <span className={styles.date}>{event.date_label || "Frankfurt · 2026"}</span>
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
              <Link className={styles.primary} href={"/events/" + event.slug + "#apply"}>{event.application_cta || "Apply now"} →</Link>
            ) : (
              <Link className={styles.primary} href={"/events/" + event.slug}>{isFiali ? "Explore FIALI" : "Explore event"} →</Link>
            )}
            <Link className={styles.secondary} href={"/events/" + event.slug}>Programme details</Link>
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
            label="FIALI Partner Ecosystem"
            tagline="Frankfurt 2026"
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
