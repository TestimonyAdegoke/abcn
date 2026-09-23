"use client";

import Link from "next/link";
import NavExtras from "@/components/NavExtras";
import "./about.css";

const instagram = "https://www.instagram.com/afropeanbusinessnetwork/";

/**
 * Verified content from the supplied ABCN presentation PDF (page 4 FAQ and the
 * About Us statement). Nothing here is invented.
 *
 * Removed in the light rebuild:
 *  - A brand colour-palette swatch grid. That is an internal design artifact,
 *    not something a visitor to an About page needs.
 *  - A FIALI callout, a partner logo marquee and a closing CTA that all
 *    duplicated blocks already on the homepage.
 *  - An ecosystem gallery of stock imagery.
 * The page went from 11 sections and ~11 screens, all of them near-black, to
 * six light sections with a single deep-green slab for the founder.
 */
const mandates = [
  {
    tag: "Culture",
    title: "Celebrating culture",
    copy:
      "Honouring African and Afropean cultures, creative arts and lived experience, without translation or compromise.",
    image: "/assets/abcn/innovators-summit.jpg",
  },
  {
    tag: "Business",
    title: "Connecting businesses",
    copy:
      "Bridging founders, startups, operators and commercial ecosystems between European hubs and African markets.",
    image: "/assets/abcn/collaborators.png",
  },
  {
    tag: "Opportunity",
    title: "Opening doors",
    copy:
      "Creating access to capital, boardrooms and international stages for diaspora innovators.",
    image: "/assets/abcn/community-connection.jpg",
  },
];

const faqItems = [
  {
    question: "What is the Afropean Business and Culture Network?",
    answer:
      "ABCN is a platform focused on bridging the gap between African and European communities through business, culture, networking and collaboration.",
  },
  {
    question: "Who is ABCN for?",
    answer:
      "Entrepreneurs, professionals, creatives, organisations and diaspora communities looking to connect, collaborate and grow across African and European spaces.",
  },
  {
    question: "What is ABCN's mission?",
    answer:
      "To elevate Afropean communities by celebrating culture, increasing business visibility, and fostering meaningful cross-cultural connections.",
  },
];

function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 28 28" aria-hidden="true">
      <path d="M5 14h17" />
      <path d="m16 8 6 6-6 6" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <main className="about-page">
      <a className="skip-link" href="#top">Skip to main content</a>

      <header className="nav nav-scrolled">
        <Link href="/" className="brand" aria-label="ABCN home">
          <img src="/assets/abcn/abcn-logo.png" alt="ABCN Logo" className="brand-logo-img" />
          <span className="brand-long">
            Afropean Business
            <br />&amp; Culture Network
          </span>
        </Link>

        <nav className="nav-links">
          <Link href="/about">Our Story</Link>
          <Link href="/#network">What We Do</Link>
          <Link href="/events">Events</Link>
          <a href="#founder">Our Founder</a>
          <Link href="/#join">Join Us</Link>
        </nav>

        <div className="nav-right">
          <NavExtras />
          <a className="nav-cta" href={instagram} target="_blank" rel="noreferrer">
            <span>Enter the network</span>
            <Arrow />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="hero-light about-hero-light">
        <div className="hero-light-inner">
          <span className="pill">Our story</span>
          <h1>
            Bridging two places<br />
            <mark>we both call home.</mark>
          </h1>
          <p className="hero-light-lead">
            ABCN began with a simple observation: the people building between
            Africa and Europe rarely had a room of their own. So we made one.
          </p>
        </div>
      </section>

      {/* Mission statement, verbatim from the ABCN presentation */}
      <section className="section about-statement">
        <blockquote>
          Afropean Business and Culture Networks is an inclusive platform
          dedicated to elevating Afropean diaspora communities by celebrating
          their cultures and connecting their businesses &mdash; fostering
          visibility, opportunity, and cross-cultural collaboration.
        </blockquote>
        <div className="about-statement-mark">
          <img src="/assets/abcn/abcn-emblem.png" alt="" aria-hidden="true" />
          <span>
            <strong>Founding mandate</strong>
            <small>Frankfurt am Main &middot; Europe &amp; Africa</small>
          </span>
        </div>
      </section>

      {/* What we stand for */}
      <section className="section what-we-do">
        <div className="sec-head">
          <span className="pill">What we stand for</span>
          <h2>Three things we do, every time</h2>
          <p>The mandate behind every circle, salon and programme we run.</p>
        </div>

        <div className="wwd-grid wwd-grid-3">
          {mandates.map((item) => (
            <article className="wwd-card" key={item.title}>
              <img src={item.image} alt="" aria-hidden="true" className="wwd-img" />
              <div className="wwd-body">
                <span className="wwd-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section about-faq">
        <div className="sec-head">
          <span className="pill">Common questions</span>
          <h2>The basics, answered</h2>
        </div>
        <div className="about-faq-list">
          {faqItems.map((item) => (
            <div className="about-faq-item" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder - the single deep slab on this page */}
      <section id="founder" className="section founder">
        <div className="founder-visual">
          <div className="founder-portrait-frame">
            <img
              src="/assets/abcn/harmonie-essome-official.jpg"
              alt="Harmonie Essome, founder of ABCN"
              className="founder-photo"
            />
          </div>
        </div>

        <div className="founder-copy">
          <span className="section-label light">Our founder</span>
          <h2>Harmonie<br /><em>Essome.</em></h2>
          <p className="founder-lead">
            &ldquo;Meet the visionary behind ABCN, Harmonie Essome, a Tech CEO,
            speaker, and Afro-European business networker passionate about
            building sustainable bridges between African and European communities
            through business, talent, culture, and innovation.&rdquo;
          </p>
          <p>
            As Founder &amp; CEO of SoftXcloud GmbH and creator of multiple
            Afro-European initiatives, her work centres on turning diaspora
            potential into long-term economic impact, workforce opportunity and
            meaningful cross-cultural collaboration.
          </p>
        </div>
      </section>

      {/* Close */}
      <section className="section about-close">
        <div className="about-close-inner">
          <h2>Come and meet us</h2>
          <p>
            Come as you are. Bring what you know. Whether you are building a
            venture, sharing a craft, or partnering institutionally, there is a
            room here for you.
          </p>
          <div className="hero-light-actions">
            <a href={instagram} target="_blank" rel="noreferrer" className="btn btn-primary">
              Join the network <i className="btn-dot"><Arrow /></i>
            </a>
            <Link href="/events" className="btn btn-ghost">
              See what&rsquo;s on <i className="btn-dot"><Arrow /></i>
            </Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-deck">
          <div className="footer-identity">
            <div className="footer-brand">ABCN</div>
            <p className="footer-tagline">Afropean Business &amp; Culture Network</p>
            <p className="footer-place">Frankfurt am Main &middot; Europe &amp; Africa</p>
            <a className="footer-social" href={instagram} target="_blank" rel="noreferrer">
              Instagram &mdash; @afropeanbusinessnetwork
              <Arrow />
            </a>
          </div>

          <nav className="footer-nav" aria-label="Footer">
            <div className="footer-col">
              <h4>Network</h4>
              <Link href="/about">Our story</Link>
              <Link href="/#network">What we do</Link>
              <a href="#founder">Our founder</a>
            </div>
            <div className="footer-col">
              <h4>Programmes</h4>
              <Link href="/events">All events</Link>
              <Link href="/events/fiali-frankfurt-2026">FIALI 2026</Link>
              <Link href="/events/fiali-frankfurt-2026#apply">Apply</Link>
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
