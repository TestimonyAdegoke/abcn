"use client";

import React, { useState, useEffect } from "react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("abcn_cookie_accepted");
    if (!accepted) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleReopen = () => setIsVisible(true);
    window.addEventListener("open-cookies", handleReopen);
    return () => window.removeEventListener("open-cookies", handleReopen);
  }, []);

  if (!isVisible) return null;

  const handleDismiss = () => {
    localStorage.setItem("abcn_cookie_accepted", "true");
    setIsVisible(false);
  };

  const handleDetails = () => {
    window.dispatchEvent(new CustomEvent("open-gdpr"));
  };

  return (
    <div className="cookie-float-bar">
      <div className="cookie-text">
        <span>🍪</span>
        <p>
          We use only strictly necessary session cookies for security and language preference.
          <strong> Zero third-party ad tracking.</strong>
        </p>
      </div>
      <div className="cookie-btns">
        <button
          type="button"
          onClick={handleDetails}
          className="cookie-btn-info"
        >
          Details
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="cookie-btn-ok"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
