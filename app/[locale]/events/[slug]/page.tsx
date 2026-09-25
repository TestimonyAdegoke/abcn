"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { openConsentPreferences } from "@/lib/consent";
import { useParams } from "next/navigation";
import MultiStepApplication from "@/components/MultiStepApplication";
import NavExtras from "@/components/NavExtras";
import LogoMarquee from "@/components/LogoMarquee";
import { neon } from "@/lib/neon";
import { EventRecord, FIALI_FALLBACK, fallbackEvent, normaliseEvent } from "@/lib/events";
import Img from "@/components/Img";

const VALUE_KEYS = [1, 2, 3, 4];

const GRANT_EXPENSE_KEYS = [1, 2, 3, 4, 5, 6];

const ELIGIBILITY_KEYS = [1, 2, 3, 4, 5];

function renderEventTitle(title: string) {
  if (!title) return null;
  if (title.includes("\n")) {
    return title.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  }
  if (/Female Innovation/i.test(title) && /Afropean Leadership/i.test(title)) {
    return (
      <>
        Female Innovation<br />
        <em>Afropean Leadership</em><br />
        Initiative
      </>
    );
  }
  if (/Führungsinitiative/i.test(title)) {
    return (
      <>
        Innovations- &<br />
        <em>Führungsinitiative</em><br />
        für afropäische Frauen
      </>
    );
  }
  return title;
}

export default function EventDetailPage() {
  const locale = useLocale();
  const te = useTranslations("event");
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || FIALI_FALLBACK.slug;
  // Locale-aware initial state: this is what server-rendered HTML contains,
  // so a hard-coded English fallback made /de render English before hydration.
  const [event, setEvent] = useState<EventRecord>(() =>
    slug === FIALI_FALLBACK.slug
      ? fallbackEvent(locale)
      : { ...fallbackEvent(locale), slug, title: "ABCN Event" }
  );
  const [activeStage, setActiveStage] = useState<number | "all">("all");
  const [checkedCriteria, setCheckedCriteria] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let live = true;
    setEvent(
      slug === FIALI_FALLBACK.slug
        ? fallbackEvent(locale)
        : { ...fallbackEvent(locale), slug, title: "ABCN Event" }
    );
    neon
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .limit(1)
      .then(
        ({ data }) => {
          if (live && data?.[0]) setEvent(normaliseEvent(data[0] as Partial<EventRecord>, locale));
        },
        () => {}
      );
    return () => {
      live = false;
    };
  }, [slug, locale]);

  const isFiali = event.slug === FIALI_FALLBACK.slug;
  const hasApplications = Boolean(event.application_open);

  const toggleCriteria = (index: number) => {
    setCheckedCriteria((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const checkedCount = Object.values(checkedCriteria).filter(Boolean).length;

  const displayedStages =
    activeStage === "all"
      ? event.stages
      : event.stages.filter((_, idx) => idx === activeStage);

  return (
    <main className="event-detail">
      {/* Sticky Top Navigation */}
      <header className="events-nav event-nav-benchmark">
        <Link className="events-brand" href="/">
          ABCN <small>Afropean Business & Culture Network</small>
        </Link>
        <nav className="events-navlinks event-anchor-nav">
          <a href="#about">{te("navAbout")}</a>
          <a href="#journey">{te("navProgramme")}</a>
          <a href="#why-join">{te("navWhyJoin")}</a>
          {event.grants?.title && <a href="#grants">{te("navGrants")}</a>}
          {event.partners && event.partners.length > 0 && (
            <a href="#partners">{te("navPartners")}</a>
          )}
          {isFiali && <a href="#gallery">{te("navGallery")}</a>}
          <a href="#eligibility">{te("navWhoFor")}</a>
          {hasApplications && (
            <a className="nav-apply" href="#apply">
              {event.application_cta || "Apply"}
            </a>
          )}
        </nav>
        <NavExtras />
      </header>

      {/* Hero Section with Crisp Typography & Stylish Accents */}
      <section className="benchmark-hero">
        <div className="benchmark-hero-copy">
          <div className="benchmark-brand-row">
            {event.partners?.[0]?.logo ? (
              <Img
                src={event.partners[0].logo}
                alt={event.partners[0].name || "Logo"}
                style={{ height: "42px", width: "auto" }}
              />
            ) : isFiali ? (
              <Img
                src="/assets/fiali/logos/abcn.png"
                alt="ABCN Logo"
                style={{ height: "42px", width: "auto" }}
              />
            ) : null}
            <span>{event.eyebrow || "ABCN Event"}</span>
          </div>
          <h1>
            {renderEventTitle(event.title)}
          </h1>
          <p className="benchmark-lead">{event.short_description}</p>
          <div className="benchmark-actions">
            {hasApplications ? (
              <a className="benchmark-primary" href="#apply">
                {event.application_cta || "Apply now"} →
              </a>
            ) : event.registration_url ? (
              <a className="benchmark-primary" href={event.registration_url} target="_blank" rel="noreferrer">
                {te("registerNow")}
              </a>
            ) : (
              <span className="benchmark-primary disabled">{te("registrationSoon")}</span>
            )}
            <a className="benchmark-secondary" href="#about">
              {te("discoverProgramme")}
            </a>
          </div>

          <div className="benchmark-stats">
            <div>
              <strong>
                {event.highlights?.find(h => /\d+[-–]\d+/.test(h))?.match(/\d+[-–]\d+/)?.[0] || "10-15"}
              </strong>
              <span>{te("statCohort")}</span>
            </div>
            <div>
              <strong>{String(event.stages?.length || 2).padStart(2, "0")}</strong>
              <span>{te("statStages")}</span>
            </div>
            <div>
              <strong>
                {event.grants?.amount_each ? `${event.grants.count || 2}x ${event.grants.amount_each}` : "90 days"}
              </strong>
              <span>{event.grants?.amount_each ? (locale === "de" ? "Zuschüsse" : "Grants") : te("statRoadmap")}</span>
            </div>
          </div>
        </div>
        <div className="benchmark-hero-image">
          {/* Was a CSS background, which no browser can preload, resize or
              serve as AVIF. As a real image it is the page's LCP candidate. */}
          <Img
            src={event.hero_image_url || FIALI_FALLBACK.hero_image_url || ""}
            alt={event.title}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <div className="hero-image-caption">
            <span>{te("heroCaption")}</span>
            <strong>{te("heroCaptionStrong")}</strong>
          </div>
        </div>
      </section>

      {/* Infinite Scrolling Logo Marquee for Verified Partner Ecosystem */}
      {event.partners && event.partners.length > 0 && (
        <LogoMarquee
          logos={event.partners}
          theme="light"
          speed="normal"
          label={event.eyebrow || "Partner Ecosystem & Collaborators"}
          tagline={event.venue || event.city || "Frankfurt 2026"}
        />
      )}

      {/* About Section */}
      <section id="about" className="benchmark-section benchmark-about">
        <div className="benchmark-section-intro">
          <span className="benchmark-kicker">{te("aboutKicker")}</span>
          <h2>
            {te("aboutTitle1")}<br />
            <em>{te("aboutTitle2")}</em>
          </h2>
        </div>
        <div className="benchmark-about-copy">
          <p className="large">{event.description}</p>
          {event.long_description && <p>{event.long_description}</p>}
          {isFiali && (
            <div className="about-leadership-frame">
              <div className="leadership-photo-card">
                <Img
                  src="/assets/abcn/harmonie-essome.png"
                  alt="Harmonie Essome - Programme Lead & Tech CEO"
                />
                <div className="leadership-caption">
                  <span>{te("programmeLead")}</span>
                  <strong>Harmonie Essome</strong>
                </div>
              </div>
              <div className="leadership-photo-card">
                <Img
                  src="/assets/fiali/female-founder-vision.jpg"
                  alt="Female Founder Vision & Strategy Session"
                />
                <div className="leadership-caption">
                  <span>{te("cohortMission")}</span>
                  <strong>{te("afropeanFemaleLeadership")}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Four Focus Pillars Bento Grid */}
      {event.focus_areas.length > 0 && (
        <section className="focus-section">
          <div className="focus-heading">
            <span className="benchmark-kicker">{te("curriculumKicker")}</span>
            <h2>
              {te("curriculumTitle1")}<br />
              <em>{te("curriculumTitle2")}</em>
            </h2>
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

      {/* Interactive Two-Stage Growth Journey Section */}
      {event.stages.length > 0 && (
        <section id="journey" className="journey-section">
          <div className="journey-header">
            <span className="benchmark-kicker light">{te("journeyKicker")}</span>
            <h2>
              {te("journeyTitle1")}<br />
              <em>{te("journeyTitle2")}</em>
            </h2>
            <p>
              A carefully sequenced two-stage programme: first sharpen the business fundamentals and AI execution in an intensive lab, then put your venture in the room with Frankfurt’s investors, corporates and ecosystem leaders.
            </p>
          </div>

          {/* Interactive Stage Filter Tabs */}
          <div className="stage-tabs" role="tablist" aria-label="Programme stages switcher">
            <button
              className={`stage-tab ${activeStage === "all" ? "active" : ""}`}
              onClick={() => setActiveStage("all")}
              type="button"
            >
              {te("journeyAll2")}
            </button>
            <button
              className={`stage-tab ${activeStage === 0 ? "active" : ""}`}
              onClick={() => setActiveStage(0)}
              type="button"
            >
              {te("journeyStage1")}
            </button>
            <button
              className={`stage-tab ${activeStage === 1 ? "active" : ""}`}
              onClick={() => setActiveStage(1)}
              type="button"
            >
              {te("journeyStage2")}
            </button>
          </div>

          <div className="journey-grid">
            {displayedStages.map((stage, index) => (
              <article className="journey-card" key={stage.title}>
                <div>
                  {isFiali && (
                    <div className="stage-image-preview">
                      <Img
                        src={stage.stage.includes("1") ? "/assets/fiali/growth-lab-session.jpg" : "/assets/fiali/female-founders-summit.jpg"}
                        alt={stage.title}
                      />
                      <span className="stage-image-overlay">
                        {stage.stage.includes("1") ? "Growth Lab AI Workshop" : "Networking Summit & Pitches"}
                      </span>
                    </div>
                  )}
                  <div className="journey-topline">
                    <span>{String(activeStage === "all" ? index + 1 : Number(activeStage) + 1).padStart(2, "0")}</span>
                    <strong>{stage.stage}</strong>
                  </div>
                  <h3>{stage.title}</h3>
                  <div className="journey-tagline">
                    {stage.stage.includes("1")
                      ? "Intensive 1-Day Workshop · External AI Specialist · 90-Day Growth Plan"
                      : "Corporate & Investor Access · Pitch Sessions · Matchmaking"}
                  </div>
                  <p style={{ marginTop: "18px" }}>{stage.description}</p>
                </div>
                <div>
                  <div className="journey-tags">
                    {stage.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <div className="journey-arrow">→</div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Why Join Benefits Section */}
      {event.benefits.length > 0 && (
        <section id="why-join" className="benefits-section">
          <div className="benefits-heading">
            <span className="benchmark-kicker">{te("benefitsKicker")}</span>
            <h2>
              {te("benefitsTitle1")}<br />
              <em>{te("benefitsTitle2")}</em>
            </h2>
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

      {/* Startup Innovation Grant Feature Card */}
      {event.grants?.title && (
        <section id="grants" className="grant-section">
          <div className="grant-benchmark-card">
            <div>
              <span className="benchmark-kicker light">{te("grantsKicker")}</span>
              <strong className="grant-number">
                {event.grants.count || 2} × {event.grants.amount_each || "€500"}
              </strong>
            </div>
            <div>
              <h2>{event.grants.title}</h2>
              <p>{event.grants.description}</p>
              <div className="grant-expenses">
                {GRANT_EXPENSE_KEYS.map((n) => (
                  <span key={n}>{te(`grantExp${n}`)}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Partner Ecosystem & Supporters Section */}
      {event.partners && event.partners.length > 0 && (
        <section id="partners" className="partners-section">
          <div className="partners-heading">
            <span className="benchmark-kicker">{te("partnersKicker")}</span>
            <h2>
              {te("partnersTitle1")}<br />
              <em>{te("partnersTitle2")}</em>
            </h2>
            <p className="partners-lead">
              {te("partnersDesc")}
            </p>
          </div>

          <div className="partner-cards-grid">
            {event.partners.map((partner) => (
              <div key={partner.name} className="partner-card-item">
                <div className="partner-card-logo-wrap">
                  {partner.logo ? (
                    <Img
                      src={partner.logo}
                      alt={partner.name}
                      className="partner-card-logo"
                    />
                  ) : (
                    <strong>{partner.name}</strong>
                  )}
                </div>
                <h4 className="partner-card-name">{partner.name}</h4>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noreferrer"
                    className="partner-card-link"
                  >
                    Website ↗
                  </a>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "48px" }}>
            <LogoMarquee
              logos={event.partners}
              theme="light"
              speed="normal"
              label={event.eyebrow || "Partner Ecosystem & Collaborators"}
              tagline={event.venue || event.city || "Frankfurt 2026"}
            />
          </div>
        </section>
      )}

      {/* Value Addition for Frankfurt Section */}
      {isFiali && (
        <section id="ecosystem" className="values-section">
          <div className="values-heading">
            <div>
              <span className="benchmark-kicker">{te("valuesKicker")}</span>
              <h2>
                {te("valuesTitle1")}<br />
                <em>{te("valuesTitle2")}</em>
              </h2>
            </div>
            <p style={{ maxWidth: "460px", color: "rgba(19,37,58,.7)", lineHeight: "1.65", margin: 0 }}>
              FIALI strengthens Frankfurt as a premier international hub for diverse, high-growth entrepreneurship, connecting the diaspora with Germany’s financial capital.
            </p>
          </div>
          <div className="values-grid">
            {VALUE_KEYS.map((n) => (
              <article key={n} className="value-card">
                <span className="num">{String(n).padStart(2, "0")} · {te("pillar")}</span>
                <div>
                  <h3>{te(`value${n}Title`)}</h3>
                  <p>{te(`value${n}Desc`)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Dedicated FIALI Cohort in Motion Photo Gallery */}
      {isFiali && (
        <section id="gallery" className="fiali-gallery-section">
          <div className="gallery-head">
            <div>
              <span className="benchmark-kicker">{te("galleryKicker")}</span>
              <h2>
                {te("galleryTitle1")}<br />
                <em>{te("galleryTitle2")}</em>
              </h2>
            </div>
            <p>
              Moments from the FIALI initiative, ABCN founder growth labs, and international summits bridging diaspora enterprise with Frankfurt’s innovation economy.
            </p>
          </div>

          <div className="fiali-gallery-grid">
            <div className="fiali-gallery-card featured">
              <Img
                src="/assets/fiali/female-founders-summit.jpg"
                alt="Female Founders Networking Summit in Frankfurt"
              />
              <div className="fiali-gallery-info">
                <span>{te("g1")}</span>
                <strong>{te("g1b")}</strong>
              </div>
            </div>

            <div className="fiali-gallery-card">
              <Img
                src="/assets/fiali/growth-lab-session.jpg"
                alt="Female Innovation Growth Lab Session"
              />
              <div className="fiali-gallery-info">
                <span>{te("g2")}</span>
                <strong>{te("g2b")}</strong>
              </div>
            </div>

            <div className="fiali-gallery-card">
              <Img
                src="/assets/fiali/female-founder-workshop.jpg"
                alt="Digitalization & Prototype Scaling"
              />
              <div className="fiali-gallery-info">
                <span>{te("g3")}</span>
                <strong>{te("g3b")}</strong>
              </div>
            </div>

            <div className="fiali-gallery-card">
              <Img
                src="/assets/fiali/female-founder-vision.jpg"
                alt="Vision & Market Positioning Session"
              />
              <div className="fiali-gallery-info">
                <span>{te("g4")}</span>
                <strong>{te("g4b")}</strong>
              </div>
            </div>

            <div className="fiali-gallery-card">
              <Img
                src="/assets/abcn/collaborators.png"
                alt="Frankfurt Founder Peer Collaboration"
              />
              <div className="fiali-gallery-info">
                <span>{te("g5")}</span>
                <strong>{te("g5b")}</strong>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Eligibility Requirements & Interactive Self-Assessment */}
      {event.eligibility.length > 0 && (
        <section id="eligibility" className="eligibility-section">
          <div>
            <span className="benchmark-kicker">{te("eligibilityKicker")}</span>
            <h2>
              {te("eligibilityTitle1")}<br />
              <em>{te("eligibilityTitle2")}</em>
            </h2>
            <p>
              {isFiali
                ? "FIALI is designed for ambitious international female founders in Frankfurt and the Rhine-Main region, particularly with an Afropean or immigrant diaspora background, scalable commercial models, and active interest in digitalization and AI."
                : event.short_description}
            </p>

            {/* Interactive Self-Assessment Checklist */}
            <div className="eligibility-assessment">
              <div className="assessment-meter">
                <strong>{te("selfAssessment")}</strong>
                <span>
                  {te("criteriaMet", { checked: checkedCount, total: ELIGIBILITY_KEYS.length })}
                </span>
              </div>
              <div className="assessment-items">
                {ELIGIBILITY_KEYS.map((n, idx) => {
                  const criterion = te(`elig${n}`);
                  const isChecked = Boolean(checkedCriteria[idx]);
                  return (
                    <div
                      key={criterion}
                      className={`assessment-item ${isChecked ? "checked" : ""}`}
                      onClick={() => toggleCriteria(idx)}
                      role="checkbox"
                      aria-checked={isChecked}
                      tabIndex={0}
                    >
                      <div className="assessment-checkbox">{isChecked ? "✓" : ""}</div>
                      <label>{criterion}</label>
                    </div>
                  );
                })}
              </div>
              <div className="assessment-cta">
                <p>
                  {checkedCount >= 4
                    ? "✨ You match the ideal founder profile for this cohort! We encourage you to apply."
                    : checkedCount > 0
                    ? "Review the points above. Applications are assessed holistically on growth potential."
                    : "Select the criteria above that describe your venture to test your cohort fit."}
                </p>
                <a href="#apply">{te("goToApplication")}</a>
              </div>
            </div>
          </div>

          <div className="eligibility-list">
            {event.eligibility.map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cohort Scarcity Band */}
      {hasApplications && (
        <section className="scarcity-band">
          <div>
            <span>{te("scarcityKicker")}</span>
            <h2>
              10-15 founders.<br />
              <em>{te("scarcityTitle")}</em>
            </h2>
          </div>
          <div>
            <p>{event.application_deadline || "Applications are reviewed on a rolling basis. Cohort size is strictly limited."}</p>
            <a href="#apply">{event.application_cta || "Apply now"} →</a>
          </div>
        </section>
      )}

      {/* Objection-handling FAQ.
          Every answer below is grounded in the supplied FIALI deck. Four questions
          applicants will certainly ask CANNOT be answered from any source we hold -
          exact dates, venue, whether there is a participation fee, and the working
          language. Add them here once confirmed; do not guess. */}
      {isFiali && (
        <section id="faq" className="fiali-faq">
          <div className="fiali-faq-head">
            <span className="benchmark-kicker">{te("faqKicker")}</span>
            <h2>
              {te("faqTitle1")}<br />
              <em>{te("faqTitle2")}</em>
            </h2>
          </div>
          <div className="fiali-faq-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div className="fiali-faq-item" key={n}>
                <h3>{te(`faq${n}Q`)}</h3>
                <p>{te(`faq${n}A`)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Application Form Section */}
      {hasApplications && (
        <section id="apply" className="application-section">
          <div className="application-intro">
            <span className="benchmark-kicker">{te("applyKicker")}</span>
            <h2>
              {te("applyTitle1")}<br />
              <em>{te("applyTitle2")}</em>
            </h2>
            <p>
              Tell us about yourself, what you are building and where you want to go next. Places are intentionally limited to 10-15 founders so every participant receives high-touch guidance and direct ecosystem access.
            </p>
            <div className="application-facts">
              <div>
                <strong>Frankfurt</strong>
                <span>{te("applyLocation")}</span>
              </div>
              <div>
                <strong>10-15</strong>
                <span>{te("applyCohort")}</span>
              </div>
              <div>
                <strong>2 stages</strong>
                <span>{te("applyStages")}</span>
              </div>
            </div>
            {isFiali && (
              <div style={{ marginTop: "28px", display: "flex", alignItems: "center", gap: "16px", background: "rgba(15, 76, 56, 0.08)", padding: "16px 20px", borderRadius: "14px", border: "1px solid rgba(15, 76, 56, 0.15)" }}>
                <Img
                  src="/assets/abcn/harmonie-essome.png"
                  alt="Harmonie Essome"
                  style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", objectPosition: "top", border: "2px solid #5f8fc0" }}
                />
                <div>
                  <strong style={{ display: "block", fontSize: "0.88rem", color: "#13253a" }}>Harmonie Essome</strong>
                  <span style={{ fontSize: "0.72rem", color: "rgba(16, 37, 31, 0.72)" }}>{te("leadRole")}</span>
                </div>
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: "320px" }}>
            <MultiStepApplication
              eventId={event.id}
              eventSlug={event.slug}
              eventTitle={event.title}
              grants={event.grants}
              applicationDeadline={event.application_deadline}
            />
          </div>
        </section>
      )}

      {/* Footer with Logo Marquee Reprise & Network Links */}
      <footer className="events-footer benchmark-footer">
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <strong>ABCN</strong>
          <span>Afropean Business & Culture Network · Frankfurt 2026</span>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/about">{te("footerAboutAbcn")}</Link>
          <Link href="/events">{te("footerAllEvents")}</Link>
          <Link href="/privacy">{te("footerPrivacy")}</Link>
          <Link href="/impressum">{locale === "de" ? "Impressum" : "Legal notice"}</Link>
          <button
            type="button"
            onClick={openConsentPreferences}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, font: "inherit", fontSize: "0.78rem" }}
          >
            {te("footerCookies")}
          </button>
        </div>
      </footer>
    </main>
  );
}
