"use client";

import React, { useState, useEffect } from "react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already dismissed
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
    <div
      className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-2xl rounded-2xl border border-white/15 bg-[#090e17]/95 p-4 shadow-2xl backdrop-blur-lg animate-slide-up text-white"
      style={{
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-gray-300">
          <span className="text-base flex-shrink-0">🍪</span>
          <p>
            We use only strictly necessary session cookies for security and language preference.
            <strong className="text-white ml-1">No cross-site tracking or third-party ads.</strong>
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <button
            type="button"
            onClick={handleDetails}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-xs font-medium"
          >
            Details
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="px-3.5 py-1.5 rounded-lg bg-[#E09000] text-black font-semibold hover:bg-[#ffad1a] transition-colors text-xs shadow-md"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
