"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { neon } from "@/lib/neon";
import { EventRecord, FIALI_FALLBACK, normaliseEvent } from "@/lib/events";
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

  return (
    <section className={styles.wrap} id="featured-event" aria-label="Featured event">
      <div className={styles.topline}>
        <span className={styles.kicker}>Priority event · ABCN presents</span>
        <span className={styles.date}>{event.date_label || "Frankfurt · 2026"}</span>
      </div>
      <div className={styles.grid}>
        <h2 className={styles.title}>
          Female Innovation<br />
          <em>Afropean Leadership</em><br />
          Initiative
        </h2>
        <div className={styles.copy}>
          <p>{event.short_description}</p>
          <div className={styles.actions}>
            <Link className={styles.primary} href={"/events/" + event.slug}>Explore FIALI →</Link>
            <Link className={styles.secondary} href="/events">All events</Link>
          </div>
        </div>
      </div>
      <div className={styles.partnerBand}>
        <div className={styles.eventMark}>
          <span>FIALI</span>
          <small>Female Innovation · Afropean Leadership</small>
        </div>
        <img src="/assets/fiali/partners-strip.jpg" alt="FIALI programme partner logos" />
      </div>
      <div className={styles.facts}>
        <div className={styles.fact}><strong>10–15</strong><span>female founders</span></div>
        <div className={styles.fact}><strong>02 stages</strong><span>growth lab + summit</span></div>
        <div className={styles.fact}><strong>AI + growth</strong><span>practical founder tools</span></div>
        <div className={styles.fact}><strong>Frankfurt</strong><span>ecosystem access</span></div>
      </div>
    </section>
  );
}
