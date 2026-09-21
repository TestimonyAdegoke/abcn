"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import HeroScene from "@/components/HeroScene";
import FeaturedEventSpotlight from "@/components/FeaturedEventSpotlight";

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

// Authentic company photography extracted directly from official ABCN source material
const images = {
  hero: "/assets/abcn/innovators-summit.jpg",
  business: "/assets/abcn/collaborators.png",
  culture: "/assets/abcn/ecosystem-network.png",
  community: "/assets/abcn/harmonie-essome.png",
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

  // GSAP Entrance Animations
  useEffect(() => {
    if (heroRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(".hero-anim-item", {
          opacity: 0,
          y: 32,
          duration: 1.1,
          stagger: 0.14,
          ease: "power3.out",
          delay: 0.2,
        });
      }, heroRef);
      return () => ctx.revert();
    }
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
      <div className="progress" style={{ width: progress + "%" }} />

      {/* Modern Sticky Navigation */}
      <header className={"nav " + (scroll > 24 ? "nav-scrolled" : "")}>
        <a href="#top" className="brand" aria-label="ABCN home">
          <img src="/assets/abcn/abcn-logo.png" alt="ABCN Logo" className="brand-logo-img" />
          <span className="brand-abcn">ABCN</span>
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
        </nav>

        <a className="nav-cta" href={instagram} target="_blank" rel="noreferrer">
          Enter the network <Arrow />
        </a>

        <button
          className={"menu " + (menu ? "active" : "")}
          aria-label="Toggle navigation"
          onClick={() => setMenu((value) => !value)}
        >
          <span />
          <span />
        </button>
      </header>

      {/* Atmospheric Luxury Hero with Three.js 3D Particle Constellation */}
      <section id="top" className="hero" ref={heroRef}>
        {/* Interactive Three.js WebGL Particle Network */}
        <HeroScene />

        <div className="grain" />
        <div className="orbit orbit-a" />
        <div className="orbit orbit-b" />

        <div className="hero-copy">
          <div className="hero-anim-item">
            <a className="event-announcement" href="/events/fiali-frankfurt-2026#apply">
              <span>NOW FEATURED</span>
              <strong>FIALI · Frankfurt 2026</strong>
              <i>Applications · limited founder cohort →</i>
            </a>
          </div>

          <p className="eyebrow hero-anim-item">
            <span /> BUSINESS · CULTURE · COMMUNITY
          </p>

          <h1 className="hero-anim-item">
            African roots.
            <br />
            <em>European horizons.</em>
          </h1>

          <p className="hero-intro hero-anim-item">
            ABCN is an inclusive platform dedicated to elevating Afropean diaspora
            communities - connecting people, ideas and opportunity across business,
            culture and belonging.
          </p>

          <div className="hero-actions hero-anim-item">
            <a href={instagram} target="_blank" rel="noreferrer" className="button primary">
              Join the conversation <Arrow />
            </a>
            <a href="/about" className="text-link">
              Discover ABCN dossier <Arrow />
            </a>
          </div>
        </div>

        <div className="hero-visual reveal delay">
          <div className="hero-photo">
            <img src={images.hero} alt="Afropean female founders during Frankfurt innovation summit" />
            <div className="photo-label">
              <span>AUTHENTIC COMMUNITY IN MOTION</span>
              <span>FRANKFURT · EUROPE · AFRICA</span>
            </div>
          </div>
          <div className="float-card community-card">
            <strong style={{ color: "var(--gold)" }}>7.6K+</strong>
            <span>public diaspora network</span>
          </div>
          <div className="float-card bridge-card">
            <Bridge />
            <span>Africa ↔ Europe</span>
          </div>
        </div>

        <div className="hero-index">ABCN / 2026</div>
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

          {/* Right: Three Core Impact Pillars */}
          <div className="about-pillars-stack">
            <div className="about-pillar-card">
              <span className="about-pillar-index">01</span>
              <div className="about-pillar-content">
                <h3>Celebrating Culture</h3>
                <p>
                  Honoring diverse African and Afropean cultures, creative arts, and lived experiences without translation or compromise.
                </p>
              </div>
            </div>

            <div className="about-pillar-card">
              <span className="about-pillar-index">02</span>
              <div className="about-pillar-content">
                <h3>Connecting Businesses</h3>
                <p>
                  Bridging founders, startups, tech operators, and commercial ecosystems between European hubs and African markets.
                </p>
              </div>
            </div>

            <div className="about-pillar-card">
              <span className="about-pillar-index">03</span>
              <div className="about-pillar-content">
                <h3>Fostering Visibility &amp; Opportunity</h3>
                <p>
                  Creating access to venture capital, executive boardrooms, and international stages for diaspora innovators.
                </p>
              </div>
            </div>
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
            <span>7.6K+ Community Reach</span>
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
          <img src={images.culture} alt="Ecosystem networking in Frankfurt and across borders" />
          <div className="story-shade" />
          <span className="credit">ABCN · Culture & Ecosystem Room</span>
          <div className="story-copy">
            <span>CULTURE</span>
            <h3>Identity without translation.</h3>
            <p>A space where African heritage and European experience coexist fully.</p>
          </div>
        </article>
        <article className="story">
          <img src={images.community} alt="Harmonie Essome - Founder of ABCN" />
          <div className="story-shade" />
          <span className="credit">Harmonie Essome · ABCN Leadership</span>
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
            <div className="format-row" key={no}>
              <span>{no}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <Arrow />
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

        <div className="manifesto-pillars-grid">
          <div className="manifesto-pillar-item">
            <span className="manifesto-pillar-num">01 / DUAL FLUENCY</span>
            <h4>Culture Without Translation</h4>
            <p>
              We reject the idea that diaspora identity requires compromise. Lived African heritage and European commercial experience enhance one another.
            </p>
          </div>

          <div className="manifesto-pillar-item">
            <span className="manifesto-pillar-num">02 / DURABLE ASSETS</span>
            <h4>From Contacts to Equity</h4>
            <p>
              Less collecting business cards. More building joint ventures, software scalability, investment rounds, and long-term economic independence.
            </p>
          </div>

          <div className="manifesto-pillar-item">
            <span className="manifesto-pillar-num">03 / CONTINENTAL SCALE</span>
            <h4>Frankfurt to the World</h4>
            <p>
              Rooted in Frankfurt am Main with active corridors into London, Paris, Douala, Lagos, and Kigali - opening doors across two continents.
            </p>
          </div>
        </div>

        <div className="manifesto-foot">
          <p>
            &ldquo;ABCN is for the overlap - where inherited culture, present experience, and future ambition converge into tangible leadership.&rdquo;
          </p>
          <div className="manifesto-emblem-badge">
            <img
              src="/assets/abcn/abcn-emblem.png"
              alt="ABCN Global Emblem"
              className="manifesto-emblem-img"
            />
            <Weave />
          </div>
        </div>
      </section>

      {/* Redesigned Join / Conversion Section */}
      <section id="join" className="join">
        <div className="join-glow" />

        <div className="join-copy">
          <span className="join-kicker">05 · ENTER THE LIVING BRIDGE · FRANKFURT 2026</span>
          <h2>
            The next introduction could<br />
            <em>change the room.</em>
          </h2>
          <p className="join-lead">
            Come as you are. Bring what you know. Follow ABCN&rsquo;s public community and connect with founders, creators, executives, and organizations shaping the Afropean business and cultural ecosystem.
          </p>

          <div className="join-actions-cluster">
            <a
              href="/events/fiali-frankfurt-2026#apply"
              className="join-btn-primary"
            >
              Apply to FIALI 2026 →
            </a>
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="join-btn-glass"
            >
              Instagram Network ↗
            </a>
            <a href="/about" className="text-link" style={{ color: "rgba(255,255,255,0.7)" }}>
              Official About dossier <Arrow />
            </a>
          </div>

          <div className="join-metrics-row">
            <div className="join-metric-item">
              <strong>7.6K+</strong>
              <span>Public Diaspora Network</span>
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

        {/* Feature Visual Card with Verified Female Founders Photography */}
        <div className="join-visual-frame">
          <img
            src="/assets/fiali/female-founders-summit.jpg"
            alt="Afropean Female Founders Summit in Frankfurt"
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

      {/* Footer */}
      <footer>
        <div className="footer-brand">ABCN</div>
        <p>Afropean Business &amp; Culture Network</p>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="#network">Network</a>
          <a href="/events">Events</a>
          <a href="#founder">Founder</a>
          <a href={instagram} target="_blank" rel="noreferrer">Instagram</a>
        </div>
        <span className="footer-meta">AFRICAN ROOTS · EUROPEAN HORIZONS</span>
      </footer>
    </main>
  );
}
