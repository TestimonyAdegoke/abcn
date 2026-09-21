"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import dynamic from "next/dynamic";
import FeaturedEventSpotlight from "@/components/FeaturedEventSpotlight";
import NavExtras from "@/components/NavExtras";
import Voices from "@/components/Voices";

// Three.js is ~150kB and purely decorative, so it must never block the hero copy.
const HeroScene = dynamic(() => import("@/components/HeroScene"), { ssr: false });

const instagram = "https://www.instagram.com/afropeanbusinessnetwork/";
const founderInstagram = "https://www.instagram.com/harmonieessome/";

const lenses = [
  {
    id: "business",
    index: "01",
    title: "Access moves through relationships.",
    copy:
      "A meeting place for founders, professionals, operators and collaborators who want to exchange practical knowledge, widen their networks and build across borders.",
    note: "Network · Opportunity · Knowledge",
  },
  {
    id: "culture",
    index: "02",
    title: "Culture is infrastructure too.",
    copy:
      "Afropean identity is more than professional biography. ABCN makes room for heritage, creativity, language, food, style and lived experience - the things that turn a contact list into community.",
    note: "Heritage · Expression · Belonging",
  },
  {
    id: "community",
    index: "03",
    title: "Belonging creates momentum.",
    copy:
      "The network exists to make meaningful connection easier: people seeing one another clearly, sharing access and building relationships across generations, industries and geographies.",
    note: "People · Exchange · Collective growth",
  },
];

const images = {
  hero: "/assets/abcn/innovators-summit.jpg",
  business: "/assets/abcn/collaborators.png",
  culture: "/assets/abcn/ecosystem-network.png",
  community: "/assets/abcn/community-connection.jpg",
};

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg className={down ? "arrow down" : "arrow"} viewBox="0 0 28 28" aria-hidden="true">
      <path d="M5 14h17" />
      <path d="m16 8 6 6-6 6" />
    </svg>
  );
}

function Bridge() {
  return (
    <svg className="bridge" viewBox="0 0 72 42" aria-hidden="true">
      <path d="M4 34h64" />
      <path d="M10 34C15 14 25 8 36 8s21 6 26 26" />
      <path d="M18 34V24M27 34V15M36 34V9M45 34V15M54 34V24" />
    </svg>
  );
}

function Weave() {
  return (
    <svg className="weave" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M8 20C19 20 19 8 30 8s11 12 22 12" />
      <path d="M12 32c11 0 11-12 22-12s11 12 22 12" />
      <path d="M8 44c11 0 11-12 22-12s11 12 22 12" />
      <path d="M12 56c11 0 11-12 22-12s11 12 22 12" />
    </svg>
  );
}

export default function Home() {
  const [lens, setLens] = useState("business");
  const [menu, setMenu] = useState(false);
  const [scroll, setScroll] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => setScroll(window.scrollY);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // GSAP entrance animation.
  // The hero copy is visible in CSS by default and this only plays it in, so a
  // failed/slow bundle or a reverted context can never leave the headline, the
  // value proposition and both CTAs stuck at opacity 0.
  useEffect(() => {
    if (!heroRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-anim-item",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.14,
          ease: "power3.out",
          delay: 0.2,
          clearProps: "opacity,transform",
        }
      );
    }, heroRef);

    // Failsafe: if the tween is created but never ticks (a reverted StrictMode
    // context, a throttled tab, a GSAP failure), reveal the copy anyway.
    const failsafe = window.setTimeout(() => {
      heroRef.current
        ?.querySelectorAll<HTMLElement>(".hero-anim-item")
        .forEach((el) => {
          if (Number(getComputedStyle(el).opacity) < 1) {
            el.style.opacity = "1";
            el.style.transform = "none";
          }
        });
    }, 2600);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, []);

  const active = useMemo(
    () => lenses.find((item) => item.id === lens) || lenses[0],
    [lens]
  );

  const progress =
    typeof window === "undefined"
      ? 0
      : Math.min(
          100,
          (scroll /
            Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) *
            100
        );

  return (
    <main>
      <a className="skip-link" href="#top">Skip to main content</a>
      <div className="progress" style={{ width: progress + "%" }} />

      {/* Modern Sticky Navigation */}
      <header className={"nav " + (scroll > 24 ? "nav-scrolled" : "")}>
        <a href="#top" className="brand" aria-label="ABCN home">
          <img src="/assets/abcn/abcn-logo.png" alt="ABCN Logo" className="brand-logo-img" />
          <span className="brand-long">
            Afropean Business
            <br />&amp; Culture Network
          </span>
        </a>

        <nav className={"nav-links " + (menu ? "open" : "")}>
          <a href="/about" onClick={() => setMenu(false)}>About</a>
          <a href="#network" onClick={() => setMenu(false)}>Network</a>
          <a href="/events" onClick={() => setMenu(false)}>Events</a>
          <a href="#founder" onClick={() => setMenu(false)}>Founder</a>
          <a href="#join" onClick={() => setMenu(false)}>Join</a>
          <a
            className="nav-cta-mobile"
            href={instagram}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenu(false)}
          >
            Enter the network
          </a>
        </nav>

        {/* Right Nav Cluster: Social Share, Language Switcher & CTA */}
        <div className="nav-right">
          <NavExtras />

          <a className="nav-cta" href={instagram} target="_blank" rel="noreferrer">
            <span>Enter the network</span>
            <Arrow />
          </a>

          <button
            className={"menu " + (menu ? "active" : "")}
            aria-label="Toggle navigation"
            onClick={() => setMenu((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------
          CINEMATIC HERO
          One frame, one statement. The previous version stacked an announcement
          pill, a four-dot eyebrow, a KPI strip, a partner strip, a photo card,
          a glass city tag, an emblem badge and a corner index - so nothing led.
          This is a single full-bleed shot, a title, a line, and one way in.
         ------------------------------------------------------------------ */}
      <section id="top" className="hero-cine" ref={heroRef}>
        <div className="hero-cine-media">
          <img
            src={images.hero}
            alt=""
            aria-hidden="true"
            className="hero-cine-img"
          />
          <div className="hero-cine-veil" />
        </div>

        {/* Particle field sits above the image, well below the type. */}
        <HeroScene />
        <div className="grain" />

        <div className="hero-cine-rule hero-cine-rule-top" />

        <div className="hero-cine-inner">
          <p className="hero-cine-meta hero-anim-item">
            <span>Frankfurt am Main</span>
            <i />
            <span>Europe &harr; Africa</span>
          </p>

          <h1 className="hero-anim-item">
            <span className="hero-title-prefix">African roots.</span>
            <em className="hero-horizon-shimmer">European horizons.</em>
          </h1>

          <p className="hero-cine-lead hero-anim-item">
            Frankfurt&rsquo;s network for Afropean founders, professionals and
            creatives building between Europe and Africa.
          </p>

          <div className="hero-cine-actions hero-anim-item">
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="hero-btn-primary"
            >
              <span>Join the network</span>
              <Arrow />
            </a>
            <a href="/about" className="hero-cine-text-link">
              What ABCN is <Arrow />
            </a>
          </div>
        </div>

        <div className="hero-cine-foot">
          <a className="hero-cine-featured" href="#featured-event">
            <span className="hero-cine-featured-tag">Now featured</span>
            <span className="hero-cine-featured-name">FIALI &middot; Frankfurt 2026</span>
            <Arrow />
          </a>
          <a className="hero-cine-scroll" href="#featured-event" aria-label="Scroll to featured programme">
            <span />
          </a>
        </div>
      </section>

      {/* Priority Event Spotlight with Transparent Scrolling Logo Marquee */}
      <FeaturedEventSpotlight />



      {/* Redesigned & Restructured About Showcase */}
      <section id="about" className="about-restructured">
        <div className="about-kicker-row">
          <div className="about-kicker-badge">
            <span>01 · THE AFROPEAN CATALYST</span>
          </div>
          <span className="section-no">ABCN / PURPOSE</span>
        </div>

        <div className="about-split-head">
          <h2>
            A living bridge where culture meets <em>commercial velocity.</em>
          </h2>
          <p>
            Afropean identity lives in the overlap: African heritage, European experience, and global ambition. ABCN turns that complexity into an enduring advantage - socially, culturally, and economically.
          </p>
        </div>

        <div className="about-showcase-grid">
          {/* Left: Mission Statement & Emblem Showcase */}
          <div className="about-quote-card">
            <div className="about-quote-top">
              <img
                src="/assets/abcn/abcn-emblem.png"
                alt="ABCN Official Emblem"
                className="about-emblem-micro"
              />
              <span className="about-origin-tag">FRANKFURT · EUROPE · AFRICA</span>
            </div>

            <p className="about-statement-text">
              &ldquo;Afropean Business and Culture Networks (ABCN) is an inclusive platform dedicated to elevating Afropean diaspora communities by celebrating their cultures and connecting their businesses, fostering visibility, opportunity, and cross-cultural collaboration.&rdquo;
            </p>

            <div className="about-quote-foot">
              <span>FOUNDING MANDATE</span>
              <strong style={{ color: "var(--brand-forest, #004f1e)" }}>Inclusive Diaspora Platform 🌍</strong>
            </div>
          </div>

          {/* "Who is ABCN for?" - the question the homepage never answered.
              The three impact pillars that used to sit here are already on /about
              as the mandates section, in near-identical wording. */}
          <div className="about-pillars-stack">
            <span className="about-audience-label">Who ABCN is for</span>

            <div className="about-pillar-card">
              <span className="about-pillar-index">01</span>
              <div className="about-pillar-content">
                <h3>Founders &amp; entrepreneurs</h3>
                <p>
                  Building a venture across African and European markets, and tired of
                  explaining the context every time.
                </p>
              </div>
            </div>

            <div className="about-pillar-card">
              <span className="about-pillar-index">02</span>
              <div className="about-pillar-content">
                <h3>Professionals &amp; creatives</h3>
                <p>
                  Working in European tech, business or culture, and looking for peers who
                  share the reference points.
                </p>
              </div>
            </div>

            <div className="about-pillar-card">
              <span className="about-pillar-index">03</span>
              <div className="about-pillar-content">
                <h3>Organisations &amp; institutions</h3>
                <p>
                  Seeking genuine diaspora engagement rather than a logo on a panel, and
                  partners who can actually open the corridor.
                </p>
              </div>
            </div>

            <p className="about-audience-note">
              Come as you are. Bring what you know.
            </p>
          </div>
        </div>

        <div className="about-bottom-bar">
          <a
            href="/about"
            className="button primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
          >
            Explore the full About story &amp; FAQs <Arrow />
          </a>
          <div style={{ display: "flex", gap: "24px", fontSize: "0.75rem", color: "#6a7670", fontWeight: 700 }}>
            <span>7.6K+ on Instagram</span>
            <span>·</span>
            <span>Frankfurt Ecosystem</span>
            <span>·</span>
            <span>Cross-Border Impact</span>
          </div>
        </div>
      </section>

      {/* Three Lenses Interactive Ecosystem */}
      <section id="network" className="section ink lenses">
        <div className="section-no">02</div>
        <div className="section-label">THE NETWORK</div>
        <div className="lenses-head">
          <h2>Three lenses.<br /><em>One ecosystem.</em></h2>
          <p>
            Move through the network by what you need today. The value is in how
            each layer strengthens the others.
          </p>
        </div>

        <div className="lens-layout">
          <div className="lens-tabs" role="tablist" aria-label="ABCN network lenses">
            {lenses.map((item) => (
              <button
                key={item.id}
                className={lens === item.id ? "active" : ""}
                onClick={() => setLens(item.id)}
                role="tab"
                aria-selected={lens === item.id}
              >
                <span>{item.index}</span> {item.id}
              </button>
            ))}
          </div>

          <div className="lens-stage" key={active.id}>
            <span className="lens-kicker">{active.index} / {active.id.toUpperCase()}</span>
            <h3>{active.title}</h3>
            <p>{active.copy}</p>
            <span className="lens-note">{active.note}</span>
            <div className="signal"><i /><i /><i /></div>
          </div>
        </div>
      </section>

      {/* Authentic Visual Stories Section with Real Company Photography */}
      <section className="stories" aria-label="Business culture and community">
        <article className="story">
          <img src={images.business} alt="Founders participating in Frankfurt innovation lab" />
          <div className="story-shade" />
          <span className="credit">ABCN · Founder Growth Lab</span>
          <div className="story-copy">
            <span>BUSINESS</span>
            <h3>Ambition with context.</h3>
            <p>Relationships, insight and access for founders building across markets.</p>
          </div>
        </article>
        <article className="story">
          {/* ecosystem-network.png is a flat gradient, not a photograph, so it is
              marked decorative and given a deliberate graphic treatment rather than
              looking like a failed image load. Replace with real ABCN event
              photography when available (see CONTENT-SOURCES.md). */}
          <img src={images.culture} alt="" aria-hidden="true" />
          <img
            src="/assets/abcn/abcn-emblem.png"
            alt=""
            aria-hidden="true"
            className="story-emblem"
          />
          <div className="story-shade" />
          <span className="credit">ABCN · Culture & Ecosystem Room</span>
          <div className="story-copy">
            <span>CULTURE</span>
            <h3>Identity without translation.</h3>
            <p>A space where African heritage and European experience coexist fully.</p>
          </div>
        </article>
        <article className="story">
          <img src={images.community} alt="Authentic community connection and sisterhood" />
          <div className="story-shade" />
          <span className="credit">ABCN · Sisterhood &amp; Community</span>
          <div className="story-copy">
            <span>COMMUNITY</span>
            <h3>Connection that feels human.</h3>
            <p>Less collecting contacts. More building relationships worth keeping.</p>
          </div>
        </article>
      </section>

      {/* Programmatic Formats Section */}
      <section className="section sand formats">
        <div className="section-no">03</div>
        <div className="section-label">WHAT ABCN UNLOCKS</div>
        <div className="formats-head">
          <h2>Connection becomes useful when it <em>moves.</em></h2>
          <p>
            Structured formats designed to turn community into practical momentum across Frankfurt, Europe and Africa.
          </p>
        </div>

        <div className="format-list">
          {[
            ["01", "Business circles", "Founder-to-founder and professional conversations around markets, careers, capital and growth."],
            ["02", "Cultural salons", "Rooms for creativity, identity, food, design, storytelling and the lived Afropean experience."],
            ["03", "Cross-border rooms", "Introductions and conversations that connect African and European ecosystems around practical opportunity."],
            ["04", "Member stories", "A visible platform for the leaders and innovators shaping Afropean business and culture."],
          ].map(([no, title, copy]) => (
            // No arrow: these formats are not links, and an arrow plus a hover
            // shift promised a destination that does not exist.
            <div className="format-row" key={no}>
              <span className="format-no">{no}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Authentic Founder Spotlight Section with Real Portrait of Harmonie Essome */}
      <section id="founder" className="section founder">
        <div className="founder-visual">
          <div className="founder-portrait-frame">
            <img
              src="/assets/abcn/harmonie-essome-official.jpg"
              alt="Harmonie Essome - Tech CEO & Visionary behind ABCN"
              className="founder-photo"
            />
            <div className="founder-orbit-badge">
              <span>FRANKFURT · EUROPE · AFRICA · DUBAI</span>
            </div>
          </div>
        </div>

        <div className="founder-copy">
          <span className="section-label light">MEET THE VISIONARY · ABCN LEADERSHIP</span>
          <h2>Harmonie<br /><em>Essome.</em></h2>
          <p className="founder-lead">
            &ldquo;Meet the visionary behind ABCN, Harmonie Essome, a Tech CEO, speaker, and Afro-European business networker passionate about building sustainable bridges between African and European communities through business, talent, culture, and innovation.&rdquo;
          </p>
          <p>
            As the Founder &amp; CEO of SoftXcloud GmbH and creator of multiple Afro-European initiatives, her vision is centered on transforming diaspora potential into long-term economic impact, workforce opportunities, and meaningful cross-cultural collaboration.
          </p>
          <div className="founder-tags">
            <span>TECH CEO</span><span>SOFTXCLOUD GMBH</span><span>AFRO-EUROPEAN BRIDGES</span><span>CITS26 BOARD</span>
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "12px" }}>
            <a className="founder-link" href="/about#visionary">
              Full visionary profile <Arrow />
            </a>
            <a className="founder-link" href={founderInstagram} target="_blank" rel="noreferrer">
              Public profile <Arrow />
            </a>
          </div>
        </div>
      </section>



      {/* Renders only once real, attributable member quotes exist. */}
      <Voices />

      {/* Redesigned Manifesto Section */}
      <section id="manifesto" className="manifesto">
        <div className="manifesto-top-row">
          <div className="manifesto-badge">
            <span>AFROPEAN /ˌAF.RƏˈPIː.ƏN/</span>
          </div>
          <span className="manifesto-tag">A CULTURAL &amp; ECONOMIC CREED</span>
        </div>

        <blockquote>
          Not caught between worlds.<br />
          <em>Fluent in more than one.</em>
        </blockquote>

        {/* The three pillars that sat here restated the network lenses and the
            About section almost verbatim - the fifth 3-up card grid on one page.
            The manifesto now does one job: state the creed and move on. */}

        <div className="manifesto-foot">
          <blockquote className="manifesto-coda">
            ABCN is for the overlap &ndash; where inherited culture, present
            experience and future ambition converge into tangible leadership.
          </blockquote>
          <div className="manifesto-mark">
            <img
              src="/assets/abcn/abcn-emblem.png"
              alt=""
              aria-hidden="true"
              className="manifesto-emblem-img"
            />
            <span className="manifesto-mark-text">
              <strong>Afropean Business &amp; Culture Network</strong>
              <small>Frankfurt am Main &middot; Europe &harr; Africa</small>
            </span>
          </div>
        </div>
      </section>

      {/* Redesigned Join / Conversion Section */}
      <section id="join" className="join">
        <div className="join-glow" />

        <div className="join-copy">
          <span className="join-kicker">06 · ENTER THE LIVING BRIDGE · FRANKFURT 2026</span>
          <h2>
            The next introduction could<br />
            <em>change the room.</em>
          </h2>
          <p className="join-lead">
            Come as you are. Bring what you know. Follow ABCN&rsquo;s public community and connect with founders, creators, executives, and organizations shaping the Afropean business and cultural ecosystem.
          </p>

          <div className="join-actions-cluster">
            {/* Inclusive action leads: most visitors are not eligible for FIALI,
                so sending them to a women-only application is a dead end. */}
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="join-btn-primary"
            >
              Join the community ↗
            </a>
            <a
              href="/events/fiali-frankfurt-2026#apply"
              className="join-btn-glass"
            >
              Apply to FIALI 2026 →
            </a>
            <a href="/about" className="text-link" style={{ color: "rgba(255,255,255,0.7)" }}>
              Official About dossier <Arrow />
            </a>
          </div>

          <div className="join-metrics-row">
            <div className="join-metric-item">
              <strong>7.6K+</strong>
              <span>Followers on Instagram</span>
            </div>
            <div className="join-metric-item">
              <strong>10-15</strong>
              <span>FIALI Founder Cohort</span>
            </div>
            <div className="join-metric-item">
              <strong>2 Continents</strong>
              <span>Europe ↔ Africa Unified</span>
            </div>
          </div>
        </div>

        {/* Brand surface: uses an ABCN asset, not a FIALI programme asset.
            See CONTENT-SOURCES.md - this still needs mixed-gender ABCN-owned
            photography to stop the inclusive homepage reading as women-only. */}
        <div className="join-visual-frame">
          <img
            src={images.community}
            alt="ABCN members in conversation at a community gathering"
            className="join-visual-img"
          />
          <div className="join-visual-overlay">
            <span className="join-floating-badge">Frankfurt · Europe · Africa</span>
            <span className="join-overlay-tag">COMMUNITY IN MOTION</span>
            <h3 className="join-overlay-title">Where Vision Meets Tangible Opportunity.</h3>
            <p className="join-overlay-desc">
              From intimate Growth Labs to high-stakes investor summits, ABCN brings diverse innovators into the room where decisions are made.
            </p>
          </div>
        </div>
      </section>

      {/* Two-tier footer: an identity + navigation deck, then a legal bar.
          Previously a single four-column row that stranded the compliance line
          on the far right of wide screens. */}
      <footer>
        <div className="footer-deck">
          <div className="footer-identity">
            <div className="footer-brand">ABCN</div>
            <p className="footer-tagline">
              Afropean Business &amp; Culture Network
            </p>
            <p className="footer-place">Frankfurt am Main &middot; Europe &harr; Africa</p>
            <a
              className="footer-social"
              href={instagram}
              target="_blank"
              rel="noreferrer"
            >
              Instagram &mdash; @afropeanbusinessnetwork
              <Arrow />
            </a>
          </div>

          <nav className="footer-nav" aria-label="Footer">
            <div className="footer-col">
              <h4>Network</h4>
              <a href="/about">About</a>
              <a href="#network">The network</a>
              <a href="#founder">Founder</a>
              <a href="#manifesto">Manifesto</a>
            </div>
            <div className="footer-col">
              <h4>Programmes</h4>
              <a href="/events">All events</a>
              <a href="/events/fiali-frankfurt-2026">FIALI 2026</a>
              <a href="/events/fiali-frankfurt-2026#apply">Apply</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <button
                type="button"
                className="footer-linkbtn"
                onClick={() => window.dispatchEvent(new CustomEvent("open-gdpr"))}
              >
                Privacy &amp; GDPR
              </button>
              <button
                type="button"
                className="footer-linkbtn"
                onClick={() => window.dispatchEvent(new CustomEvent("open-cookies"))}
              >
                Cookie settings
              </button>
            </div>
          </nav>
        </div>

        <div className="footer-bar">
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} Afropean Business &amp; Culture Network
          </span>
          <span className="footer-creed">African roots &middot; European horizons</span>
          <span className="footer-meta">GDPR / DSGVO compliant</span>
        </div>
      </footer>
    </main>
  );
}
