"use client";

import { useEffect, useState } from "react";
import FeaturedEventSpotlight from "@/components/FeaturedEventSpotlight";
import NavExtras from "@/components/NavExtras";
import Voices from "@/components/Voices";

const instagram = "https://www.instagram.com/afropeanbusinessnetwork/";
const founderInstagram = "https://www.instagram.com/harmonieessome/";

// The concrete format names. These previously appeared as a second list
// ("How we bring people together") describing the same three categories the
// card grid already covered.
const formats = [
  {
    id: "business-circles",
    tag: "Business",
    title: "Business circles",
    copy:
      "Founder-to-founder and professional conversations about markets, careers, capital and growth.",
    image: "/assets/abcn/collaborators.png",
  },
  {
    id: "cultural-salons",
    tag: "Culture",
    title: "Cultural salons",
    copy:
      "Rooms for creativity, identity, food, design and storytelling - the lived Afropean experience.",
    image: "/assets/abcn/innovators-summit.jpg",
  },
  {
    id: "cross-border-rooms",
    tag: "Community",
    title: "Cross-border rooms",
    copy:
      "Introductions that connect African and European ecosystems around practical opportunity.",
    image: "/assets/abcn/community-connection.jpg",
  },
  {
    id: "member-stories",
    tag: "Platform",
    title: "Member stories",
    copy:
      "A visible platform for the people shaping Afropean business and culture.",
    image: null,
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

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const update = () => setScroll(window.scrollY);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

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

      <header className={"nav " + (scroll > 24 ? "nav-scrolled" : "")}>
        <a href="#top" className="brand" aria-label="ABCN home">
          <img src="/assets/abcn/abcn-logo.png" alt="ABCN Logo" className="brand-logo-img" />
          <span className="brand-long">
            Afropean Business
            <br />&amp; Culture Network
          </span>
        </a>

        <nav className={"nav-links " + (menu ? "open" : "")}>
          <a href="#about" onClick={() => setMenu(false)}>Our Story</a>
          <a href="#network" onClick={() => setMenu(false)}>What We Do</a>
          <a href="/events" onClick={() => setMenu(false)}>Events</a>
          <a href="#founder" onClick={() => setMenu(false)}>Our Founder</a>
          <a href="#join" onClick={() => setMenu(false)}>Join Us</a>
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

      {/* Light, centred hero. The previous dark cinematic version - WebGL
          particle field, gradient-shimmer headline, glow orbs, film grain -
          read as an AI product landing page. All three reference sites are
          light, centred, and lead with real photographs of people. */}
      <section id="top" className="hero-light">
        <div className="hero-light-inner">
          <span className="pill">Frankfurt &middot; Europe &amp; Africa</span>

          <h1>
            African roots.<br />
            <mark>European horizons.</mark>
          </h1>

          <p className="hero-light-lead">
            ABCN is a Frankfurt network for Afropean founders, professionals and
            creatives. We run business circles, cultural salons and programmes
            that connect people building between Europe and Africa.
          </p>

          <div className="hero-light-actions">
            <a href={instagram} target="_blank" rel="noreferrer" className="btn btn-primary">
              Join the network <i className="btn-dot"><Arrow /></i>
            </a>
            <a href="#featured-event" className="btn btn-ghost">
              See FIALI 2026 <i className="btn-dot"><Arrow /></i>
            </a>
          </div>
        </div>

        <div className="hero-strip">
          <figure><img src={images.hero} alt="ABCN members in conversation at a community gathering" /></figure>
          <figure><img src={images.community} alt="Members connecting at an ABCN event" /></figure>
          <figure><img src={images.business} alt="Founders working together in Frankfurt" /></figure>
        </div>
      </section>

      {/* Priority Event Spotlight with Transparent Scrolling Logo Marquee */}
      <FeaturedEventSpotlight />



      <section id="about" className="about-restructured">
        <div className="about-kicker-row">
          <div className="about-kicker-badge">
            <span>Our story</span>
          </div>
          
        </div>

        <div className="about-split-head">
          <h2>
            Who we are
          </h2>
          <p>
            ABCN is an inclusive platform for the Afropean diaspora. We celebrate our
            cultures, connect our businesses, and open doors between Africa and Europe.
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

        {/* One plain link out. The stat row here repeated "7.6K+" from the
            Join section and sat under a second CTA to the same page. */}
        <a className="about-more" href="/about">
          Read the full story <Arrow />
        </a>
      </section>

      {/* Three plain cards, the pattern every reference site uses. This replaces
          a dark tabbed "lenses" widget and a separate 3-panel photo strip that
          explained the same three things - business, culture, community. */}
      <section id="network" className="section what-we-do">
        <div className="sec-head">
          <span className="pill">What we do</span>
          <h2>Four ways we bring people together</h2>
          <p>Regular formats across Frankfurt, Europe and Africa.</p>
        </div>

        <div className="wwd-grid">
          {formats.map((item) => (
            <article
              className={"wwd-card" + (item.image ? "" : " wwd-card-accent")}
              key={item.id}
            >
              {item.image && (
                <img src={item.image} alt="" aria-hidden="true" className="wwd-img" />
              )}
              <div className="wwd-body">
                <span className="wwd-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="founder" className="section founder">
        <div className="founder-visual">
          <div className="founder-portrait-frame">
            <img
              src="/assets/abcn/harmonie-essome-official.jpg"
              alt="Harmonie Essome - Tech CEO & Visionary behind ABCN"
              className="founder-photo"
            />
          </div>
        </div>

        <div className="founder-copy">
          <span className="section-label light">Our founder</span>
          <h2>Harmonie<br /><em>Essome.</em></h2>
          <p className="founder-lead">
            &ldquo;Meet the visionary behind ABCN, Harmonie Essome, a Tech CEO, speaker, and Afro-European business networker passionate about building sustainable bridges between African and European communities through business, talent, culture, and innovation.&rdquo;
          </p>
          <p>
            As the Founder &amp; CEO of SoftXcloud GmbH and creator of multiple Afro-European initiatives, her vision is centered on transforming diaspora potential into long-term economic impact, workforce opportunities, and meaningful cross-cultural collaboration.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "12px" }}>
            <a className="founder-link" href="/about#visionary">
              Full visionary profile <Arrow />
            </a>
          </div>
        </div>
      </section>



      {/* Renders only once real, attributable member quotes exist. */}
      <Voices />

      {/* The "Manifesto" section was removed. A creed section is an agency
          template trope, its three pillars restated the network lenses, and it
          added a fourth dark slab to an already busy page. */}

      {/* Join / Conversion Section */}
      <section id="join" className="join">
        <div className="join-glow" />

        <div className="join-copy">
          <span className="join-kicker">Join us</span>
          <h2>
            Come and meet us
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
          </div>

          {/* Metrics row removed: it repeated 7.6K+ and 10-15 from elsewhere
              on the page. The FIALI facts strip is the one place numbers live. */}
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
              <a href="#network">What we do</a>
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
