"use client";

import React, { useState, useEffect } from "react";

export default function GdprModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"collect" | "process" | "rights">("collect");
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
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
      className="gdpr-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gdpr-modal-title"
    >
      <div className="gdpr-dialog">
        <div className="gdpr-accent-bar" />

        <button
          onClick={() => setIsOpen(false)}
          className="gdpr-close-btn"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="gdpr-body">
          <div className="gdpr-header">
            <div className="gdpr-icon">🛡️</div>
            <div className="gdpr-title">
              <h2 id="gdpr-modal-title">Data Protection Notice</h2>
              <p>GDPR / DSGVO Compliant · AES-256-GCM Encryption</p>
            </div>
          </div>

          <div className="gdpr-tabs-nav">
            <button
              type="button"
              onClick={() => setActiveTab("collect")}
              className={`gdpr-tab-btn ${activeTab === "collect" ? "active" : ""}`}
            >
              01. Collection
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("process")}
              className={`gdpr-tab-btn ${activeTab === "process" ? "active" : ""}`}
            >
              02. Processing
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rights")}
              className={`gdpr-tab-btn ${activeTab === "rights" ? "active" : ""}`}
            >
              03. Your Rights
            </button>
          </div>

          <div className="gdpr-tab-pane">
            {activeTab === "collect" && (
              <div>
                <p>
                  We collect your personal details exclusively to coordinate the{" "}
                  <strong>Afropean Business &amp; Culture Network (ABCN)</strong> programming and the{" "}
                  <strong>FIALI 2026 Innovation Initiative</strong> in Frankfurt am Main.
                </p>
                <p className="gdpr-note">
                  Data collected: Full name, executive title, business email, venture URL, innovation stage, and tech focus areas.
                </p>
              </div>
            )}
            {activeTab === "process" && (
              <div>
                <p>
                  Your information is processed to review cohort applications, confirm attendance,
                  facilitate curated 1:1 meetings with investors, and allocate startup innovation grants.
                </p>
                <p className="gdpr-note">
                  Legal basis: Explicit consent according to Art. 6(1)(a) GDPR/DSGVO. We never sell, rent, or monetize your information.
                </p>
              </div>
            )}
            {activeTab === "rights" && (
              <div>
                <p>
                  Under the European General Data Protection Regulation (GDPR), you possess full rights to access, rectify, export, or permanently delete your stored data at any time.
                </p>
                <p className="gdpr-note">
                  Direct privacy officer contact:{" "}
                  <a
                    href="mailto:harmonie.essome@softxcloud.net"
                    style={{ color: "#E09000", textDecoration: "underline", fontWeight: 600 }}
                  >
                    harmonie.essome@softxcloud.net
                  </a>
                </p>
              </div>
            )}
          </div>

          <div className="gdpr-footer">
            <label className="gdpr-consent-label">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
              />
              <span>
                I have read and agree to the data protection terms and consent to processing my information for ABCN &amp; FIALI initiatives.
              </span>
            </label>

            <div className="gdpr-actions">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="gdpr-btn-dismiss"
              >
                Dismiss
              </button>
              <button
                type="button"
                disabled={!consentChecked}
                onClick={handleAccept}
                className="gdpr-btn-accept"
              >
                Accept &amp; Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
