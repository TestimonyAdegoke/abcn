"use client";

import React, { useState, useEffect } from "react";

export default function GdprModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"collect" | "process" | "rights">("collect");
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    // Listen for custom open event
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-gdpr", handleOpen);
    return () => window.removeEventListener("open-gdpr", handleOpen);
  }, []);

  if (!isOpen) return null;

  const handleAccept = () => {
    localStorage.setItem("abcn_gdpr_consent", "true");
    setIsOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gdpr-modal-title"
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0c121c] text-white shadow-2xl"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Top accent bar matching ABCN brand colors */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#004F1E] via-[#02318B] via-[#E09000] to-[#B01010]" />

        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/15 hover:text-white transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
              <span className="text-xl">🛡️</span>
            </div>
            <div>
              <h2 id="gdpr-modal-title" className="text-xl font-bold tracking-tight text-white">
                Data Protection & Privacy Notice
              </h2>
              <p className="text-xs text-gray-400">
                GDPR / DSGVO Compliant · AES-256-GCM Encryption
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 mb-5 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("collect")}
              className={`pb-2.5 px-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === "collect"
                  ? "border-[#E09000] text-[#E09000]"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              01. Collection
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("process")}
              className={`pb-2.5 px-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === "process"
                  ? "border-[#E09000] text-[#E09000]"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              02. Processing
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rights")}
              className={`pb-2.5 px-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === "rights"
                  ? "border-[#E09000] text-[#E09000]"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              03. Your Rights
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[140px] text-sm leading-relaxed text-gray-300">
            {activeTab === "collect" && (
              <div className="space-y-2">
                <p>
                  We collect your profile, company details, and motivation exclusively to coordinate
                  the <strong>Afropean Business & Culture Network (ABCN)</strong> programming and the{" "}
                  <strong>FIALI 2026 Innovation Initiative</strong> in Frankfurt am Main.
                </p>
                <p className="text-xs text-gray-400">
                  Data collected: Full name, executive title, business email, venture URL, innovation stage, and tech focus areas.
                </p>
              </div>
            )}
            {activeTab === "process" && (
              <div className="space-y-2">
                <p>
                  Your information is processed to review cohort applications, confirm attendance,
                  facilitate curated 1:1 meetings with investors, and allocate startup innovation grants.
                </p>
                <p className="text-xs text-gray-400">
                  Legal basis: Explicit consent according to Art. 6(1)(a) GDPR/DSGVO. We do not sell, rent, or monetize your information under any circumstances.
                </p>
              </div>
            )}
            {activeTab === "rights" && (
              <div className="space-y-2">
                <p>
                  Under the European General Data Protection Regulation (GDPR), you possess full rights to access, rectify, export, or permanently delete your stored data at any time.
                </p>
                <p className="text-xs text-gray-400">
                  Direct privacy officer contact:{" "}
                  <a
                    href="mailto:harmonie.essome@softxcloud.net"
                    className="text-[#E09000] underline hover:text-amber-300 font-medium"
                  >
                    harmonie.essome@softxcloud.net
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-gray-300">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-700 bg-white/5 text-[#E09000] focus:ring-[#E09000]"
              />
              <span>
                I have read and agree to the data protection terms and consent to processing my information for ABCN & FIALI initiatives.
              </span>
            </label>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Dismiss
              </button>
              <button
                type="button"
                disabled={!consentChecked}
                onClick={handleAccept}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  consentChecked
                    ? "bg-[#E09000] text-black hover:bg-[#ffad1a] shadow-lg shadow-amber-900/30 cursor-pointer"
                    : "bg-white/10 text-gray-500 cursor-not-allowed"
                }`}
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
