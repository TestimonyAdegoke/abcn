"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import LogoMarquee from "@/components/LogoMarquee";
import { neon } from "@/lib/neon";
import { EventRecord, FIALI_FALLBACK, fallbackEvent, normaliseEvent } from "@/lib/events";
import Img from "@/components/Img";

export default function EventsPage() {
  const locale = useLocale();
  const [events, setEvents] = useState<EventRecord[]>([fallbackEvent(locale)]);

  useEffect(() => {
    let live = true;
    setEvents([fallbackEvent(locale)]);
    neon.from("events").select("*").eq("status", "published").order("priority", { ascending: false })
      .then(({ data }) => {
        if (live && data?.length) setEvents(data.map((row) => normaliseEvent(row as Partial<EventRecord>, locale)));
      }, () => {});
    return () => { live = false; };
  }, [locale]);

  return (
    <main className="events-shell">
      <header className="events-nav">
        <Link className="events-brand" href="/">ABCN <small>Afropean Business & Culture Network</small></Link>
        <nav className="events-navlinks">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/events">Events</Link>
          <Link href={{ pathname: "/", hash: "join" }}>Join network</Link>
        </nav>
      </header>

      <section className="events-hero">
        <span className="eyeline">ABCN · Events & programmes</span>
        <h1>Where connection<br/><em>becomes momentum.</em></h1>
        <p>Founder programmes, cultural rooms and cross-border gatherings designed to turn community into practical opportunity.</p>
      </section>

      <section className="events-container">
        <div className="events-head">
          <h2>Current & featured.</h2>
          <p>Priority events appear first. Published events are managed from ABCN’s event CMS and can be featured on the homepage independently.</p>
        </div>

        <div className="event-grid">
          {events.map((event, index) => (
            <article key={event.id || event.slug} className={"event-card " + ((event.featured || index === 0) ? "featured" : "")}>
              <div className="event-image">
                <Img
                  src={event.card_image_url || event.hero_image_url || FIALI_FALLBACK.card_image_url || ""}
                  alt={event.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
                {event.featured && <span className="event-badge">Featured</span>}
              </div>
              <div className="event-body">
                <span className="event-meta">{event.eyebrow || event.date_label || "ABCN event"}</span>
                <h3>{event.title}</h3>
                <p>{event.short_description}</p>
                <Link className="event-link" href={{ pathname: "/events/[slug]", params: { slug: event.slug } }}>Event details →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <LogoMarquee
        theme="light"
        speed="slow"
        label="Ecosystem & Institutional Partners"
        tagline="Cross-Border Innovation"
      />

      <footer className="events-footer">
        <strong>ABCN</strong>
        <span>African roots · European horizons</span>
      </footer>
    </main>
  );
}
