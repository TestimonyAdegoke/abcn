"use client";

/**
 * Member voices / social proof.
 *
 * DELIBERATELY EMPTY. Testimonials are the highest-converting element this site
 * is missing, but inventing them is not an option - fabricated quotes attributed
 * to real or implied people are dishonest and legally risky.
 *
 * To switch this section on, add real entries to VOICES below. Each one needs:
 *   - a quote the person actually said, and agreed to publish
 *   - their real name and role
 *   - a photo in /public/assets/abcn/voices/ (optional but far stronger with one)
 *
 * The section renders nothing at all while the list is empty, so shipping this
 * file cannot put a placeholder in front of a visitor.
 */

export type Voice = {
  quote: string;
  name: string;
  role: string;
  photo?: string;
};

export const VOICES: Voice[] = [
  // Example of the required shape - delete this comment, do not uncomment it
  // with invented content:
  //
  // {
  //   quote: "...",
  //   name: "...",
  //   role: "...",
  //   photo: "/assets/abcn/voices/name.jpg",
  // },
];

export default function Voices() {
  if (VOICES.length === 0) return null;

  return (
    <section className="voices" aria-label="Member voices">
      <div className="voices-head">
        <span className="section-label">IN THEIR WORDS</span>
        <h2>
          People who have<br />
          <em>been in the room.</em>
        </h2>
      </div>

      <div className="voices-grid">
        {VOICES.map((voice) => (
          <figure className="voice-card" key={voice.name}>
            <blockquote>{voice.quote}</blockquote>
            <figcaption>
              {voice.photo && (
                <img src={voice.photo} alt="" aria-hidden="true" className="voice-photo" />
              )}
              <span>
                <strong>{voice.name}</strong>
                <small>{voice.role}</small>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
