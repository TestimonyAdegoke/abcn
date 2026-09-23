"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export default function CookieBanner() {
  const locale = useLocale();
  const de = locale === "de";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("abcn_cookie_notice_seen");
    if (!seen) {
      const timer = setTimeout(() => setIsVisible(true), 900);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleReopen = () => setIsVisible(true);
    window.addEventListener("open-cookies", handleReopen);
    return () => window.removeEventListener("open-cookies", handleReopen);
  }, []);

  if (!isVisible) return null;

  const dismiss = () => {
    localStorage.setItem("abcn_cookie_notice_seen", "v1");
    setIsVisible(false);
  };

  const details = () => {
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent("open-gdpr"));
  };

  return (
    <div className="cookie-float-bar" role="region" aria-label={de ? "Cookie- und Datenschutzhinweis" : "Cookie and privacy notice"}>
      <div className="cookie-text">
        <span aria-hidden="true">◉</span>
        <p>
          {de
            ? "Diese Website verwendet derzeit nur technisch notwendige Browser-/Sitzungsfunktionen. Nicht erforderliche Analyse- oder Marketing-Technologien sind nicht aktiviert."
            : "This site currently uses only technically necessary browser/session functionality. Optional analytics or marketing technologies are not enabled."}
        </p>
      </div>
      <div className="cookie-btns">
        <button type="button" onClick={details} className="cookie-btn-info">
          {de ? "Details" : "Details"}
        </button>
        <button type="button" onClick={dismiss} className="cookie-btn-ok">
          {de ? "Verstanden" : "Got it"}
        </button>
      </div>
    </div>
  );
}
