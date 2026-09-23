"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import MultiStepApplication from "@/components/MultiStepApplication";
import NavExtras from "@/components/NavExtras";
import LogoMarquee from "@/components/LogoMarquee";
import { neon } from "@/lib/neon";
import { EventRecord, FIALI_FALLBACK, normaliseEvent } from "@/lib/events";

const FRANKFURT_VALUES = [
  {
    num: "01",
    title: "Female Entrepreneurship",
    description:
      "Empowers diverse female leadership and drives sustainable business growth across Frankfurt and the wider Rhine-Main metropolitan region.",
  },
  {
    num: "02",
    title: "Global Ecosystem Advantage",
    description:
      "Leverages founders' international networks and intercultural skills to position Frankfurt as an open, globally connected startup destination.",
  },
  {
    num: "03",
    title: "Innovation & AI Competency",
    description:
      "Delivers hands-on digital skills and practical AI expertise so founders can innovate, automate and scale their operating models.",
  },
  {
    num: "04",
    title: "Visibility & Matchmaking",
    description:
      "Showcases founders directly to corporates, institutional partners, investors and business angels through curated networking rooms.",
  },
];

const GRANT_EXPENSES = [
  "Prototyping & MVP build",
  "Product development",
  "Brand & identity design",
  "Go-to-market testing",
  "Initial marketing & sales",
  "Essential incorporation expenses",
];

const ELIGIBILITY_CRITERIA = [
  "Already incorporated or on the verge of doing so",
  "Pursuing an innovative or scalable business model",
  "Showing strong interest in digitalization and AI integration",
  "Exhibiting high growth potential and international perspective",
  "Aiming to build, launch or scale the business within Frankfurt / Rhine-Main",
];

export default function EventDetailPage() {
  const locale = useLocale();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || FIALI_FALLBACK.slug;
  const [event, setEvent] = useState<EventRecord>(
    slug === FIALI_FALLBACK.slug ? FIALI_FALLBACK : { ...FIALI_FALLBACK, slug, title: "ABCN Event" }
  );
  const [activeStage, setActiveStage] = useState<number | "all">("all");
  const [checkedCriteria, setCheckedCriteria] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let live = true;
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
  }, [slug]);

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
          <a href="#about">About</a>
          <a href="#journey">Programme</a>
          <a href="#why-join">Why join</a>
          {isFiali && <a href="#ecosystem">Partners</a>}
          {isFiali && <a href="#gallery">Gallery</a>}
          {event.grants?.title && <a href="#grants">Grants</a>}
          <a href="#eligibility">Who it’s for</a>
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
            {isFiali && (
              <img
                src="/assets/fiali/logos/abcn.png"
                alt="ABCN Logo"
                style={{ height: "42px", width: "auto" }}
              />
            )}
            <span>{event.eyebrow || "ABCN Event"}</span>
          </div>
          <h1>
            {isFiali ? (
              <>
                Female Innovation<br />
                <em>Afropean Leadership</em><br />
                Initiative
              </>
            ) : (
              event.title
            )}
          </h1>
          <p className="benchmark-lead">{event.short_description}</p>
          <div className="benchmark-actions">
            {hasApplications ? (
              <a className="benchmark-primary" href="#apply">
                {event.application_cta || "Apply now"} →
              </a>
            ) : event.registration_url ? (
              <a className="benchmark-primary" href={event.registration_url} target="_blank" rel="noreferrer">
                Register now →
              </a>
            ) : (
              <span className="benchmark-primary disabled">Registration details coming soon</span>
            )}
            <a className="benchmark-secondary" href="#about">
              Discover the programme ↓
            </a>
          </div>

          <div className="benchmark-stats">
            <div>
              <strong>10-15</strong>
              <span>founders cohort</span>
            </div>
            <div>
              <strong>02</strong>
              <span>programme stages</span>
            </div>
            <div>
              <strong>90 days</strong>
              <span>growth roadmap</span>
            </div>
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

      {/* Infinite Scrolling Logo Marquee for Verified Partner Ecosystem */}
      {isFiali && (
        <LogoMarquee
          logos={event.partners}
          theme="light"
          speed="normal"
          label="FIALI Partner Ecosystem & Collaborators"
          tagline="Frankfurt 2026"
        />
      )}

      {/* About Section */}
      <section id="about" className="benchmark-section benchmark-about">
        <div className="benchmark-section-intro">
          <span className="benchmark-kicker">About FIALI</span>
          <h2>
            Build stronger.<br />
            <em>Scale with context.</em>
          </h2>
        </div>
        <div className="benchmark-about-copy">
          <p className="large">{event.description}</p>
          {event.long_description && <p>{event.long_description}</p>}
          {isFiali && (
            <div className="about-leadership-frame">
              <div className="leadership-photo-card">
                <img
                  src="/assets/abcn/harmonie-essome.png"
                  alt="Harmonie Essome - Programme Lead & Tech CEO"
                />
                <div className="leadership-caption">
                  <span>Programme Lead</span>
                  <strong>Harmonie Essome</strong>
                </div>
              </div>
              <div className="leadership-photo-card">
                <img
                  src="/assets/fiali/female-founder-vision.jpg"
                  alt="Female Founder Vision & Strategy Session"
                />
                <div className="leadership-caption">
                  <span>Cohort Mission</span>
                  <strong>Afropean Female Leadership</strong>
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
            <span className="benchmark-kicker">Core curriculum</span>
            <h2>
              Four pillars.<br />
              <em>One stronger venture.</em>
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
            <span className="benchmark-kicker light">The journey</span>
            <h2>
              Your FIALI<br />
              <em>growth journey.</em>
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
              Full Journey (Stages 1 & 2)
            </button>
            <button
              className={`stage-tab ${activeStage === 0 ? "active" : ""}`}
              onClick={() => setActiveStage(0)}
              type="button"
            >
              Stage 1: Growth Lab
            </button>
            <button
              className={`stage-tab ${activeStage === 1 ? "active" : ""}`}
              onClick={() => setActiveStage(1)}
              type="button"
            >
              Stage 2: Networking Summit
            </button>
          </div>

          <div className="journey-grid">
            {displayedStages.map((stage, index) => (
              <article className="journey-card" key={stage.title}>
                <div>
                  {isFiali && (
                    <div className="stage-image-preview">
                      <img
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

      {/* Value Addition for Frankfurt Section */}
      {isFiali && (
        <section id="ecosystem" className="values-section">
          <div className="values-heading">
            <div>
              <span className="benchmark-kicker">Ecosystem impact</span>
              <h2>
                Value addition for<br />
                <em>the Frankfurt ecosystem.</em>
              </h2>
            </div>
            <p style={{ maxWidth: "460px", color: "rgba(16,37,31,.7)", lineHeight: "1.65", margin: 0 }}>
              FIALI strengthens Frankfurt as a premier international hub for diverse, high-growth entrepreneurship, connecting the diaspora with Germany’s financial capital.
            </p>
          </div>
          <div className="values-grid">
            {FRANKFURT_VALUES.map((item) => (
              <article key={item.title} className="value-card">
                <span className="num">{item.num} · PILLAR</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
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
              <span className="benchmark-kicker">COHORT IN MOTION · AUTHENTIC MOMENTS</span>
              <h2>
                Empowering international<br />
                <em>female founders in Frankfurt.</em>
              </h2>
            </div>
            <p>
              Moments from the FIALI initiative, ABCN founder growth labs, and international summits bridging diaspora enterprise with Frankfurt’s innovation economy.
            </p>
          </div>

          <div className="fiali-gallery-grid">
            <div className="fiali-gallery-card featured">
              <img
                src="/assets/fiali/female-founders-summit.jpg"
                alt="Female Founders Networking Summit in Frankfurt"
              />
              <div className="fiali-gallery-info">
                <span>STAGE 2 SUMMIT &amp; MATCHMAKING</span>
                <strong>Founder Pitches &amp; Corporate Alliances</strong>
              </div>
            </div>

            <div className="fiali-gallery-card">
              <img
                src="/assets/fiali/growth-lab-session.jpg"
                alt="Female Innovation Growth Lab Session"
              />
              <div className="fiali-gallery-info">
                <span>STAGE 1 GROWTH LAB</span>
                <strong>Hands-on AI &amp; Business Models</strong>
              </div>
            </div>

            <div className="fiali-gallery-card">
              <img
                src="/assets/fiali/female-founder-workshop.jpg"
                alt="Digitalization & Prototype Scaling"
              />
              <div className="fiali-gallery-info">
                <span>DIGITALIZATION &amp; TOOLS</span>
                <strong>Prototyping &amp; Market Scaling</strong>
              </div>
            </div>

            <div className="fiali-gallery-card">
              <img
                src="/assets/fiali/female-founder-vision.jpg"
                alt="Vision & Market Positioning Session"
              />
              <div className="fiali-gallery-info">
                <span>STRATEGIC POSITIONING</span>
                <strong>Founder Narrative &amp; Leadership</strong>
              </div>
            </div>

            <div className="fiali-gallery-card">
              <img
                src="/assets/abcn/collaborators.png"
                alt="Frankfurt Founder Peer Collaboration"
              />
              <div className="fiali-gallery-info">
                <span>COMMUNITY &amp; PEERS</span>
                <strong>Frankfurt Founder Collaboration</strong>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Join Benefits Section */}
      {event.benefits.length > 0 && (
        <section id="why-join" className="benefits-section">
          <div className="benefits-heading">
            <span className="benchmark-kicker">Tangible outcomes</span>
            <h2>
              What you gain from<br />
              <em>the programme.</em>
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
              <span className="benchmark-kicker light">Founder support fund</span>
              <strong className="grant-number">
                {event.grants.count || 2} × {event.grants.amount_each || "€500"}
              </strong>
            </div>
            <div>
              <h2>{event.grants.title}</h2>
              <p>{event.grants.description}</p>
              <div className="grant-expenses">
                {GRANT_EXPENSES.map((exp) => (
                  <span key={exp}>{exp}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Eligibility Requirements & Interactive Self-Assessment */}
      {event.eligibility.length > 0 && (
        <section id="eligibility" className="eligibility-section">
          <div>
            <span className="benchmark-kicker">Cohort criteria</span>
            <h2>
              Built for founders<br />
              <em>with room to scale.</em>
            </h2>
            <p>
              {isFiali
                ? "FIALI is designed for ambitious international female founders in Frankfurt and the Rhine-Main region, particularly with an Afropean or immigrant diaspora background, scalable commercial models, and active interest in digitalization and AI."
                : event.short_description}
            </p>

            {/* Interactive Self-Assessment Checklist */}
            <div className="eligibility-assessment">
              <div className="assessment-meter">
                <strong>Cohort Fit Self-Assessment</strong>
                <span>
                  {checkedCount} of {ELIGIBILITY_CRITERIA.length} criteria met
                </span>
              </div>
              <div className="assessment-items">
                {ELIGIBILITY_CRITERIA.map((criterion, idx) => {
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
                <a href="#apply">Go to application ↓</a>
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
            <span>Limited cohort</span>
            <h2>
              10-15 founders.<br />
              <em>One focused room.</em>
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
            <span className="benchmark-kicker">Before you apply</span>
            <h2>
              The questions<br />
              <em>founders actually ask.</em>
            </h2>
          </div>
          <div className="fiali-faq-grid">
            {[
              [
                "Do I need to be incorporated already?",
                "No. FIALI is open to founders who have already incorporated and to those on the verge of doing so. The grants can even cover essential incorporation costs.",
              ],
              [
                "How many places are there?",
                "Between 10 and 15. It is deliberately small - the point is a room where you are known, not an audience you sit in.",
              ],
              [
                "What do I actually leave with?",
                "An individual 90-day growth plan built during the Growth Lab, practical AI and digitalisation training, and a pitch in front of Frankfurt corporates, investors and business angels at the Summit.",
              ],
              [
                "Is there funding attached?",
                "Two Startup Innovation Grants of €500 each. They cover prototyping and product development, branding and market entry, first marketing and sales activity, and incorporation costs. Two founders are selected on the growth potential and innovation of their model.",
              ],
              [
                "Do I need to be an AI company?",
                "No, but you should have genuine interest in digitalisation and AI, and a business model that can scale. The programme is built around applying those tools to whatever you are building.",
              ],
              [
                "Where do I need to be based?",
                "Frankfurt and the Rhine-Main region. There is a particular focus on founders from the city's Afropean, immigrant and international diaspora communities.",
              ],
            ].map(([q, a]) => (
              <div className="fiali-faq-item" key={q}>
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Application Form Section */}
      {hasApplications && (
        <section id="apply" className="application-section">
          <div className="application-intro">
            <span className="benchmark-kicker">Express your interest</span>
            <h2>
              Join the FIALI<br />
              <em>founder cohort.</em>
            </h2>
            <p>
              Tell us about yourself, what you are building and where you want to go next. Places are intentionally limited to 10-15 founders so every participant receives high-touch guidance and direct ecosystem access.
            </p>
            <div className="application-facts">
              <div>
                <strong>Frankfurt</strong>
                <span>Rhine-Main location</span>
              </div>
              <div>
                <strong>10-15</strong>
                <span>Founders cohort</span>
              </div>
              <div>
                <strong>2 stages</strong>
                <span>Growth lab + summit</span>
              </div>
            </div>
            {isFiali && (
              <div style={{ marginTop: "28px", display: "flex", alignItems: "center", gap: "16px", background: "rgba(15, 76, 56, 0.08)", padding: "16px 20px", borderRadius: "14px", border: "1px solid rgba(15, 76, 56, 0.15)" }}>
                <img
                  src="/assets/abcn/harmonie-essome.png"
                  alt="Harmonie Essome"
                  style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", objectPosition: "top", border: "2px solid #58ac8c" }}
                />
                <div>
                  <strong style={{ display: "block", fontSize: "0.88rem", color: "#10251f" }}>Harmonie Essome</strong>
                  <span style={{ fontSize: "0.72rem", color: "rgba(16, 37, 31, 0.72)" }}>Lead, FIALI Frankfurt 2026 · Founder &amp; CEO, SoftXcloud GmbH</span>
                </div>
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: "320px" }}>
            <MultiStepApplication
              eventId={event.id}
              eventSlug={event.slug}
              eventTitle={event.title}
            />
          </div>
        </section>
      )}

      {/* Sister Summit & Tech Delegation Spotlight (gcbfd-forum2026.com) */}
      <section className="sister-delegation-banner" style={{ maxWidth: "1280px", margin: "40px auto", padding: "0 24px" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(75, 29, 142, 0.25) 0%, rgba(7, 11, 17, 0.95) 100%)",
          border: "1px solid rgba(123, 78, 200, 0.35)",
          borderRadius: "24px",
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "4px 12px", borderRadius: "9999px", background: "rgba(255,255,255,0.08)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e2b978", marginBottom: "8px" }}>
              🇨🇲 SISTER INITIATIVE · CITS 2026
            </div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", margin: "4px 0" }}>
              German Tech Innovation Delegation to Cameroon
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#a4b9cb", maxWidth: "650px", lineHeight: "1.5" }}>
              Connecting German-speaking IT professionals with Cameroon&rsquo;s tech ecosystem across Douala, Bafoussam, Bangangté, and the Yaoundé Summit · 11-18 October 2026.
            </p>
          </div>
          <a
            href="https://gcbfd-forum2026.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "12px 24px",
              borderRadius: "9999px",
              background: "#4B1D8E",
              color: "#ffffff",
              fontSize: "0.78rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              textDecoration: "none",
              boxShadow: "0 8px 20px rgba(75, 29, 142, 0.4)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            Explore Delegation ↗
          </a>
        </div>
      </section>

      {/* Footer with Logo Marquee Reprise & Network Links */}
      <footer className="events-footer benchmark-footer">
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <strong>ABCN</strong>
          <span>Afropean Business &amp; Culture Network · Frankfurt 2026</span>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/about">About ABCN</Link>
          <Link href="/events">All ABCN events →</Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-gdpr"))}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, font: "inherit", fontSize: "0.78rem" }}
          >
            Privacy Policy &amp; GDPR
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-cookies"))}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, font: "inherit", fontSize: "0.78rem" }}
          >
            Cookie Settings
          </button>
        </div>
      </footer>
    </main>
  );
}
