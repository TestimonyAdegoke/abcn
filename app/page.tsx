"use client";

import { useEffect, useMemo, useState } from "react";

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
      "Afropean identity is more than professional biography. ABCN makes room for heritage, creativity, language, food, style and lived experience — the things that turn a contact list into community.",
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
  hero:
    "https://images.unsplash.com/photo-1776039324982-449086984ceb?auto=format&fit=crop&fm=jpg&q=84&w=2200",
  business:
    "https://images.unsplash.com/photo-1758519291037-db9ec86cda69?auto=format&fit=crop&fm=jpg&q=84&w=1800",
  culture:
    "https://images.unsplash.com/photo-1773864930264-bb73c9714418?auto=format&fit=crop&fm=jpg&q=84&w=1800",
  community:
    "https://images.unsplash.com/photo-1777115213572-2097c1c9ebcc?auto=format&fit=crop&fm=jpg&q=84&w=1800",
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

function CompassMark() {
  return (
    <svg className="compass" viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="31" />
      <circle cx="40" cy="40" r="5" />
      <path d="m47 25-4.5 12.5L30 44l4.5-12.5L47 25Z" />
      <path d="M40 4v8M40 68v8M4 40h8M68 40h8" />
    </svg>
  );
}

export default function Home() {
  const [lens, setLens] = useState("business");
  const [menu, setMenu] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [pointer, setPointer] = useState({ x: 62, y: 26 });

  useEffect(() => {
    const update = () => setScroll(window.scrollY);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
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

      <header className={"nav " + (scroll > 24 ? "nav-scrolled" : "")}>
        <a href="#top" className="brand" aria-label="ABCN home">
          <span className="brand-abcn">ABCN</span>
          <span className="brand-long">
            Afropean Business
            <br />&amp; Culture Network
          </span>
        </a>

        <nav className={"nav-links " + (menu ? "open" : "")}>
          <a href="#about" onClick={() => setMenu(false)}>About</a>
          <a href="#network" onClick={() => setMenu(false)}>Network</a>
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

      <section
        id="top"
        className="hero"
        onMouseMove={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          setPointer({
            x: ((event.clientX - box.left) / box.width) * 100,
            y: ((event.clientY - box.top) / box.height) * 100,
          });
        }}
        style={{
          backgroundImage:
            "radial-gradient(circle at " +
            pointer.x +
            "% " +
            pointer.y +
            "%, rgba(214,101,58,.17), transparent 27%)",
        }}
      >
        <div className="grain" />
        <div className="orbit orbit-a" />
        <div className="orbit orbit-b" />

        <div className="hero-copy reveal">
          <p className="eyebrow"><span /> BUSINESS · CULTURE · COMMUNITY</p>
          <h1>
            African roots.
            <br />
            <em>European horizons.</em>
          </h1>
          <p className="hero-intro">
            ABCN is an inclusive platform dedicated to elevating Afropean diaspora
            communities — connecting people, ideas and opportunity across business,
            culture and belonging.
          </p>
          <div className="hero-actions">
            <a href={instagram} target="_blank" rel="noreferrer" className="button primary">
              Join the conversation <Arrow />
            </a>
            <a href="#about" className="text-link">
              Discover ABCN <Arrow down />
            </a>
          </div>
        </div>

        <div className="hero-visual reveal delay">
          <div className="hero-photo">
            <img src={images.hero} alt="Two women speaking during a professional panel discussion" />
            <div className="photo-label">
              <span>THE NETWORK IN MOTION</span>
              <span>BUSINESS × CULTURE</span>
            </div>
          </div>
          <div className="float-card community-card">
            <strong>7.6K+</strong>
            <span>public Instagram community</span>
          </div>
          <div className="float-card bridge-card">
            <Bridge />
            <span>Africa ↔ Europe</span>
          </div>
        </div>

        <div className="hero-index">ABCN / 2026</div>
      </section>

      <section className="ticker" aria-label="ABCN themes">
        <div className="ticker-track">
          {["CONNECT", "BUILD", "BELONG", "EXCHANGE", "CREATE", "COLLABORATE", "CONNECT", "BUILD", "BELONG", "EXCHANGE"].map(
            (item, index) => (
              <span key={item + index}>{item}<i>✦</i></span>
            )
          )}
        </div>
      </section>

      <section id="about" className="section paper about">
        <div className="section-no">01</div>
        <div className="section-label">WHY ABCN</div>

        <div className="split-heading">
          <p>Not another networking club.</p>
          <h2>
            A living bridge for people who are <em>both / and.</em>
          </h2>
        </div>

        <div className="about-grid">
          <div className="about-lead">
            <Weave />
            <p>
              Afropean identity lives in the overlap: African heritage, European
              experience and global ambition. ABCN creates room for that complexity
              to become an advantage — socially, culturally and economically.
            </p>
          </div>
          <div className="about-copy">
            <p>
              The public ABCN community describes itself as an inclusive platform
              dedicated to elevating Afropean diaspora communities. Its strongest
              idea is simple: the people, culture and commercial opportunity do not
              need to live in separate rooms.
            </p>
            <p>
              ABCN can be the connective tissue — a place where ambitious
              professionals meet creative voices, entrepreneurs meet collaborators,
              and diaspora identity becomes a source of confidence, insight and
              cross-border possibility.
            </p>
          </div>
        </div>
      </section>

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

      <section className="stories" aria-label="Business culture and community">
        <article className="story">
          <img src={images.business} alt="Professional working with a laptop" />
          <div className="story-shade" />
          <span className="credit">Photo: Vitaly Gariev / Unsplash</span>
          <div className="story-copy">
            <span>BUSINESS</span>
            <h3>Ambition with context.</h3>
            <p>Relationships, insight and access for people building across markets.</p>
          </div>
        </article>
        <article className="story">
          <img src={images.culture} alt="Community gathering in Nairobi" />
          <div className="story-shade" />
          <span className="credit">Photo: Dwayne Joe / Unsplash</span>
          <div className="story-copy">
            <span>CULTURE</span>
            <h3>Identity without translation.</h3>
            <p>A space where African heritage and European experience can coexist fully.</p>
          </div>
        </article>
        <article className="story">
          <img src={images.community} alt="Two women embracing at an outdoor community event" />
          <div className="story-shade" />
          <span className="credit">Photo: Ben Iwara / Unsplash</span>
          <div className="story-copy">
            <span>COMMUNITY</span>
            <h3>Connection that feels human.</h3>
            <p>Less collecting contacts. More building relationships worth keeping.</p>
          </div>
        </article>
      </section>

      <section className="section sand formats">
        <div className="section-no">03</div>
        <div className="section-label">WHAT ABCN CAN UNLOCK</div>
        <div className="formats-head">
          <h2>Connection becomes useful when it <em>moves.</em></h2>
          <p>
            The website is designed to grow naturally into the network’s real
            programming — without pretending unverified programmes already exist.
          </p>
        </div>

        <div className="format-list">
          {[
            ["01", "Business circles", "Founder-to-founder and professional conversations around markets, careers, capital and growth."],
            ["02", "Cultural salons", "Rooms for creativity, identity, food, design, storytelling and the lived Afropean experience."],
            ["03", "Cross-border rooms", "Introductions and conversations that connect African and European ecosystems around practical opportunity."],
            ["04", "Member stories", "A visible platform for the people already shaping Afropean business and culture."],
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

      <section id="founder" className="section founder">
        <div className="founder-visual">
          <div className="founder-orbit">
            <span>FRANKFURT</span>
            <span>EUROPE</span>
            <span>AFRICA</span>
            <span>DUBAI</span>
          </div>
          <div className="founder-monogram">HE</div>
          <CompassMark />
        </div>

        <div className="founder-copy">
          <span className="section-label light">FOUNDER / ECOSYSTEM BUILDER</span>
          <h2>Harmonie<br /><em>Essome.</em></h2>
          <p className="founder-lead">
            Her public work sits at the intersection of technology, entrepreneurship
            and Afro-European networks.
          </p>
          <p>
            Public profiles describe a career spanning software sales and strategic
            partnerships, entrepreneurship, community events and international
            ecosystem building. Her recent work repeatedly returns to the same theme:
            connecting people and opportunities between Africa and Europe, with
            Frankfurt and international markets as important nodes.
          </p>
          <p>
            ABCN reads as a natural extension of that work — business and culture
            treated not as separate interests, but as parts of the same ecosystem.
          </p>
          <div className="founder-tags">
            <span>TECH</span><span>ENTREPRENEURSHIP</span><span>AFRO-EUROPEAN NETWORKS</span>
          </div>
          <a className="founder-link" href={founderInstagram} target="_blank" rel="noreferrer">
            Public founder profile <Arrow />
          </a>
        </div>
      </section>

      <section className="section manifesto">
        <div className="manifesto-top">AFROPEAN /ˌAF.RƏˈPIː.ƏN/</div>
        <blockquote>
          Not caught between worlds.<br />
          <em>Fluent in more than one.</em>
        </blockquote>
        <div className="manifesto-foot">
          <p>
            ABCN is for the overlap — where inherited culture, present experience
            and future ambition meet.
          </p>
          <Weave />
        </div>
      </section>

      <section id="join" className="join">
        <div className="join-bg" />
        <div className="join-copy">
          <span>THE NEXT INTRODUCTION COULD CHANGE THE ROOM.</span>
          <h2>Come as you are.<br />Bring what you know.</h2>
          <p>
            Follow ABCN’s public community and stay close to the people, ideas and
            conversations shaping the Afropean business and cultural ecosystem.
          </p>
          <a className="button light-button" href={instagram} target="_blank" rel="noreferrer">
            Connect on Instagram <Arrow />
          </a>
        </div>
        <div className="join-word">ABCN</div>
      </section>

      <footer>
        <div className="footer-brand">ABCN</div>
        <p>Afropean Business &amp; Culture Network</p>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#network">Network</a>
          <a href="#founder">Founder</a>
          <a href={instagram} target="_blank" rel="noreferrer">Instagram</a>
        </div>
        <span className="footer-meta">AFRICAN ROOTS · EUROPEAN HORIZONS</span>
      </footer>
    </main>
  );
}
