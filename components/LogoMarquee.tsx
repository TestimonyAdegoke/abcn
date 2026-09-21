"use client";

import { useMemo } from "react";
import Image from "next/image";
import { EventPartner } from "@/lib/events";
import styles from "./LogoMarquee.module.css";

export const DEFAULT_FIALI_PARTNERS: EventPartner[] = [
  { name: "ABCN", logo: "/assets/fiali/logos/abcn.png" },
  { name: "DIVOC Rising", logo: "/assets/fiali/logos/divoc-rising.png" },
  { name: "Kompass Frankfurt", logo: "/assets/fiali/logos/kompass-frankfurt.png" },
  { name: "Black Women in Tech DACH", logo: "/assets/fiali/logos/black-women-in-tech-dach.png" },
  { name: "EquiNet", logo: "/assets/fiali/logos/equinet.png" },
  { name: "Flourish & Prosper", logo: "/assets/fiali/logos/flourish-prosper.png" },
];

interface LogoMarqueeProps {
  logos?: EventPartner[];
  label?: string;
  tagline?: string;
  theme?: "light" | "dark";
  speed?: "normal" | "slow" | "fast";
  className?: string;
}

export default function LogoMarquee({
  logos = DEFAULT_FIALI_PARTNERS,
  label = "Partner Ecosystem & Collaborators",
  tagline = "FIALI · Frankfurt 2026",
  theme = "light",
  speed = "normal",
  className = "",
}: LogoMarqueeProps) {
  const activeLogos = logos && logos.length > 0 ? logos : DEFAULT_FIALI_PARTNERS;

  // Duplicate items to ensure seamless continuous CSS infinite scroll
  const duplicatedLogos = useMemo(() => {
    // Return 4 sets of logos so the track is always longer than ultra-wide viewports
    return [...activeLogos, ...activeLogos, ...activeLogos, ...activeLogos];
  }, [activeLogos]);

  const wrapClasses = [
    styles.marqueeWrap,
    theme === "dark" ? styles.dark : styles.light,
    styles[speed],
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={wrapClasses} aria-label="Partner organizations logo ticker">
      {(label || tagline) && (
        <div className={styles.header}>
          {label && <span className={styles.headerLabel}>{label}</span>}
          {tagline && <span className={styles.headerTag}>{tagline}</span>}
        </div>
      )}

      <div className={styles.marqueeTrackWrap}>
        <div className={styles.marqueeTrack}>
          {duplicatedLogos.map((partner, index) => {
            const key = `${partner.name}-${index}`;
            const cardContent = partner.logo ? (
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className={styles.logoImage}
                loading="lazy"
              />
            ) : (
              <span className={styles.logoNameFallback}>{partner.name}</span>
            );

            if (partner.website) {
              return (
                <a
                  key={key}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.logoCard}
                  title={`Visit ${partner.name}`}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <div key={key} className={styles.logoCard} title={partner.name}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
