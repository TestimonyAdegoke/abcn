"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { neon } from "@/lib/neon";
import { EventRecord, FIALI_FALLBACK, normaliseEvent } from "@/lib/events";

export default function EventDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || FIALI_FALLBACK.slug;
  const [event, setEvent] = useState<EventRecord>(
    slug === FIALI_FALLBACK.slug ? FIALI_FALLBACK : { ...FIALI_FALLBACK, slug, title: "ABCN Event" }
  );

  useEffect(() => {
    let live = true;
    neon.from("events").select("*").eq("slug", slug).eq("status", "published").limit(1)
      .then(({ data }) => {
        if (live && data?.[0]) setEvent(normaliseEvent(data[0] as Partial<EventRecord>));
      }).catch(() => {});
    return () => { live = false; };
  }, [slug]);

  const isFiali = event.slug === FIALI_FALLBACK.slug;

  return (
    <main className="event-detail">
      <header className="events-nav">
        <Link className="events-brand" href="/">ABCN <small>Afropean Business & Culture Network</small></Link>
        <nav className="events-navlinks">
          <Link href="/">Home</Link><Link href="/events">Events</Link><Link href="/#join">Join network</Link>
        </nav>
      </header>

      <section className="detail-hero">
        <div className="detail-hero-copy">
          <span className="mini">{event.eyebrow || "ABCN event"}</span>
          <h1>{event.title}</h1>
          <p>{event.short_description}</p>
          <div className="detail-actions">
            {event.registration_url ? (
              <a className="detail-button" href={event.registration_url} target="_blank" rel="noreferrer">Register now</a>
            ) : (
              <span className="detail-button">Registration details coming soon</span>
            )}
            <Link className="detail-button ghost" href="/events">All events</Link>
          </div>
        </div>
        <div className="detail-hero-image" style={{ backgroundImage: `url("${event.hero_image_url || FIALI_FALLBACK.hero_image_url}")` }} />
      </section>

      <div className="detail-strip">
        <div><strong>{event.date_label || "Dates TBA"}</strong><span>When</span></div>
        <div><strong>{event.city || "Location TBA"}</strong><span>Where</span></div>
        <div><strong>{isFiali ? "10–15 founders" : event.event_type || "Community"}</strong><span>Format</span></div>
        <div><strong>{event.organizer || "ABCN"}</strong><span>Presented by</span></div>
      </div>

      <section className="detail-section detail-intro">
        <div>
          <span className="detail-kicker">Programme overview</span>
          <h2>{isFiali ? <>Build. Scale.<br/>Connect.</> : "About this event."}</h2>
        </div>
        <div className="detail-intro-copy">
          <p>{event.description}</p>
          {event.long_description && <p>{event.long_description}</p>}
        </div>
      </section>

      {event.stages.length > 0 && (
        <section className="detail-section stage-wrap">
          <span className="detail-kicker" style={{color:"#a7dec8"}}>The programme</span>
          <h2>Two stages.<br/>One growth journey.</h2>
          <div className="stage-grid">
            {event.stages.map((stage) => (
              <article className="stage-card" key={stage.title}>
                <span className="stage-no">{stage.stage}</span>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
                <div className="stage-items">{stage.items.map((item) => <span key={item}>{item}</span>)}</div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="detail-section audience-grid">
        <div>
          <span className="detail-kicker">Who it is for</span>
          <h2>International female founders with room to scale.</h2>
          <p className="detail-note">
            FIALI focuses on founders in Frankfurt and the Rhine-Main region, particularly within the diverse Afropean, immigrant and international community, with scalable models and an interest in AI and digitalization.
          </p>
        </div>
        <div>
          <span className="detail-kicker">Participation requirements</span>
          <div className="requirements">
            {event.eligibility.map((item, index) => (
              <div className="requirement" key={item}><span>{String(index + 1).padStart(2, "0")}</span><span>{item}</span></div>
            ))}
          </div>
        </div>
      </section>

      {event.grants?.title && (
        <section className="detail-section">
          <div className="grant-card">
            <span className="detail-kicker" style={{color:"#a7dec8"}}>Founder support</span>
            <div className="amount">{event.grants.count || 2} × {event.grants.amount_each || "€500"}</div>
            <h2 style={{fontSize:"clamp(2.8rem,5vw,5.7rem)"}}>{event.grants.title}</h2>
            <p>{event.grants.description}</p>
          </div>
        </section>
      )}

      {event.partners.length > 0 && (
        <section className="detail-section partners">
          <span className="detail-kicker">Partner ecosystem</span>
          <h2>Built with community.</h2>
          <div className="partner-list">
            {event.partners.map((partner) => (
              <div className="partner" key={partner.name}>
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.name + " logo"} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : null}
                <span>{partner.name}</span>
              </div>
            ))}
          </div>
          <p className="detail-note" style={{marginTop:24}}>
            Partner marks are drawn from the supplied FIALI programme deck. Dates and venue remain intentionally unfilled where the source material does not provide a confirmed value.
          </p>
        </section>
      )}

      <footer className="events-footer">
        <strong>ABCN</strong><span>Afropean Business & Culture Network · Frankfurt 2026</span>
      </footer>
    </main>
  );
}
