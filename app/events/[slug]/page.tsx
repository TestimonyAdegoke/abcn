"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import EventApplicationForm from "@/components/EventApplicationForm";
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
      }, () => {});
    return () => { live = false; };
  }, [slug]);

  const isFiali = event.slug === FIALI_FALLBACK.slug;
  const hasApplications = Boolean(event.application_open);

  return (
    <main className="event-detail">
      <header className="events-nav event-nav-benchmark">
        <Link className="events-brand" href="/">
          ABCN <small>Afropean Business & Culture Network</small>
        </Link>
        <nav className="events-navlinks event-anchor-nav">
          <a href="#about">About</a>
          <a href="#journey">Journey</a>
          <a href="#why-join">Why join</a>
          {hasApplications && <a className="nav-apply" href="#apply">{event.application_cta || "Apply"}</a>}
        </nav>
      </header>

      <section className="benchmark-hero">
        <div className="benchmark-hero-copy">
          <div className="benchmark-brand-row">
            {isFiali && <img src="/assets/fiali/logos/abcn.png" alt="ABCN" />}
            <span>{event.eyebrow || "ABCN event"}</span>
          </div>
          <p className="hero-date-line">{event.date_label || "Frankfurt · 2026"}</p>
          <h1>{event.title}</h1>
          <p className="benchmark-lead">{event.short_description}</p>
          <div className="benchmark-actions">
            {hasApplications ? (
              <a className="benchmark-primary" href="#apply">{event.application_cta || "Apply now"} →</a>
            ) : event.registration_url ? (
              <a className="benchmark-primary" href={event.registration_url} target="_blank" rel="noreferrer">Register now →</a>
            ) : (
              <span className="benchmark-primary disabled">Registration details coming soon</span>
            )}
            <a className="benchmark-secondary" href="#about">Discover the programme ↓</a>
          </div>

          <div className="benchmark-stats">
            <div><strong>10–15</strong><span>founders</span></div>
            <div><strong>02</strong><span>programme stages</span></div>
            <div><strong>90 days</strong><span>growth planning</span></div>
          </div>
        </div>
        <div
          className="benchmark-hero-image"
          style={{ backgroundImage: `url("${event.hero_image_url || FIALI_FALLBACK.hero_image_url}")` }}
        >
          <div className="hero-image-caption">
            <span>Frankfurt · Afropean leadership</span>
            <strong>Build the venture. Expand the network.</strong>
          </div>
        </div>
      </section>

      {isFiali && (
        <section className="cooperation-band">
          <div>
            <span>Built with community</span>
            <strong>Partner ecosystem</strong>
          </div>
          <img src="/assets/fiali/partners-strip.jpg" alt="FIALI programme partner logos" />
        </section>
      )}

      <section id="about" className="benchmark-section benchmark-about">
        <div className="benchmark-section-intro">
          <span className="benchmark-kicker">About FIALI</span>
          <h2>Build stronger.<br/><em>Scale with context.</em></h2>
        </div>
        <div className="benchmark-about-copy">
          <p className="large">{event.description}</p>
          {event.long_description && <p>{event.long_description}</p>}
        </div>
      </section>

      {event.focus_areas.length > 0 && (
        <section className="focus-section">
          <div className="focus-heading">
            <span className="benchmark-kicker">Focus areas</span>
            <h2>Four areas.<br/>One stronger venture.</h2>
          </div>
          <div className="focus-grid">
            {event.focus_areas.map((area, index) => (
              <article key={area.title} className="focus-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {event.stages.length > 0 && (
        <section id="journey" className="journey-section">
          <div className="journey-header">
            <span className="benchmark-kicker light">The journey</span>
            <h2>Your FIALI<br/><em>growth journey.</em></h2>
            <p>
              A carefully designed two-stage programme: first strengthen the venture,
              then put it in the room with the people and institutions that can help it move.
            </p>
          </div>
          <div className="journey-grid">
            {event.stages.map((stage, index) => (
              <article className="journey-card" key={stage.title}>
                <div className="journey-topline">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{stage.stage}</strong>
                </div>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
                <div className="journey-tags">
                  {stage.items.map((item) => <span key={item}>{item}</span>)}
                </div>
                <div className="journey-arrow">→</div>
              </article>
            ))}
          </div>
        </section>
      )}

      {event.benefits.length > 0 && (
        <section id="why-join" className="benefits-section">
          <div className="benefits-heading">
            <span className="benchmark-kicker">Why join?</span>
            <h2>What you gain from<br/><em>the programme.</em></h2>
          </div>
          <div className="benefits-grid">
            {event.benefits.map((benefit, index) => (
              <article key={benefit.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {event.grants?.title && (
        <section className="grant-section">
          <div className="grant-benchmark-card">
            <div>
              <span className="benchmark-kicker light">Founder support</span>
              <strong className="grant-number">{event.grants.count || 2} × {event.grants.amount_each || "€500"}</strong>
            </div>
            <div>
              <h2>{event.grants.title}</h2>
              <p>{event.grants.description}</p>
            </div>
          </div>
        </section>
      )}

      {event.eligibility.length > 0 && (
        <section className="eligibility-section">
          <div>
            <span className="benchmark-kicker">Who should apply</span>
            <h2>Built for founders<br/>with room to scale.</h2>
            <p>
              {isFiali
                ? "FIALI focuses on international female founders in Frankfurt and the Rhine-Main region, particularly within the diverse Afropean and immigrant community."
                : event.short_description}
            </p>
          </div>
          <div className="eligibility-list">
            {event.eligibility.map((item, index) => (
              <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>
            ))}
          </div>
        </section>
      )}

      {hasApplications && (
        <section className="scarcity-band">
          <div>
            <span>Limited cohort</span>
            <h2>10–15 founders.<br/>One focused room.</h2>
          </div>
          <div>
            <p>{event.application_deadline || "Applications are reviewed before places are confirmed."}</p>
            <a href="#apply">{event.application_cta || "Apply now"} →</a>
          </div>
        </section>
      )}

      {hasApplications && (
        <section id="apply" className="application-section">
          <div className="application-intro">
            <span className="benchmark-kicker">Express your interest</span>
            <h2>Join the FIALI<br/><em>founder cohort.</em></h2>
            <p>
              Tell us about you, what you are building and where you want to go next.
              Places are intentionally limited so the programme can remain practical and high-touch.
            </p>
            <div className="application-facts">
              <div><strong>Frankfurt</strong><span>Programme location</span></div>
              <div><strong>10–15</strong><span>Founder cohort</span></div>
              <div><strong>2 stages</strong><span>Lab + summit</span></div>
            </div>
          </div>
          <EventApplicationForm
            eventId={event.id}
            eventSlug={event.slug}
            eventTitle={event.title}
            applicationDeadline={event.application_deadline}
          />
        </section>
      )}

      <footer className="events-footer benchmark-footer">
        <strong>ABCN</strong>
        <span>Afropean Business & Culture Network · Frankfurt 2026</span>
        <Link href="/events">All events →</Link>
      </footer>
    </main>
  );
}
