"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { neon } from "@/lib/neon";
import { EventRecord, FIALI_FALLBACK, normaliseEvent } from "@/lib/events";

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([FIALI_FALLBACK]);

  useEffect(() => {
    let live = true;
    neon.from("events").select("*").eq("status", "published").order("priority", { ascending: false })
      .then(({ data }) => {
        if (live && data?.length) setEvents(data.map((row) => normaliseEvent(row as Partial<EventRecord>)));
      }).catch(() => {});
    return () => { live = false; };
  }, []);

  return (
    <main className="events-shell">
      <header className="events-nav">
        <Link className="events-brand" href="/">ABCN <small>Afropean Business & Culture Network</small></Link>
        <nav className="events-navlinks">
          <Link href="/">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/#join">Join network</Link>
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
              <div className="event-image" style={{ backgroundImage: `url("${event.card_image_url || event.hero_image_url || FIALI_FALLBACK.card_image_url}")` }}>
                {event.featured && <span className="event-badge">Featured</span>}
              </div>
              <div className="event-body">
                <span className="event-meta">{event.eyebrow || event.date_label || "ABCN event"}</span>
                <h3>{event.title}</h3>
                <p>{event.short_description}</p>
                <Link className="event-link" href={"/events/" + event.slug}>Event details →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="events-footer">
        <strong>ABCN</strong>
        <span>African roots · European horizons</span>
      </footer>
    </main>
  );
}
