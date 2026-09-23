"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { neon } from "@/lib/neon";

type Props = {
  eventId?: string;
  eventSlug: string;
  eventTitle: string;
};

interface FormData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  country: string;
  email: string;
  phone: string;
  companyName: string;
  companyUrl: string;
  sector: string;
  stage: string;
  motivation: string;
  aiFocus: string;
  grantInterest: string;
  consent: boolean;
}

const initialData: FormData = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  country: "DE",
  email: "",
  phone: "",
  companyName: "",
  companyUrl: "",
  sector: "AI & Digital Tech",
  stage: "Early Revenue / Seed",
  motivation: "",
  aiFocus: "",
  grantInterest: "Yes, interested in the €500 × 2 Grant",
  consent: false,
};

export default function MultiStepApplication({ eventId, eventSlug, eventTitle }: Props) {
  const locale = useLocale();
  const privacyHref = locale === "de" ? "/de/datenschutz" : "/privacy";
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const err: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.firstName.trim()) err.firstName = "First name is required.";
      if (!formData.lastName.trim()) err.lastName = "Last name is required.";
      if (!formData.jobTitle.trim()) err.jobTitle = "Role or title is required.";
      if (!formData.email.trim() || !formData.email.includes("@")) {
        err.email = "A valid business email is required.";
      }
    } else if (currentStep === 2) {
      if (!formData.companyName.trim()) err.companyName = "Company or venture name is required.";
      if (!formData.sector.trim()) err.sector = "Please select your sector.";
    } else if (currentStep === 3) {
      if (!formData.motivation.trim() || formData.motivation.trim().length < 15) {
        err.motivation = "Please share a brief motivation (minimum 15 characters).";
      }
    } else if (currentStep === 4) {
      if (!formData.consent) {
        err.consent = "Please confirm that you have read the privacy notice before submitting.";
      }
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 4));
    }
  };

  const handlePrev = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setSubmitError("");
    setIsSubmitting(true);

    try {
      let id = eventId;
      if (!id) {
        const { data, error: eventError } = await neon
          .from("events")
          .select("id")
          .eq("slug", eventSlug)
          .eq("status", "published")
          .limit(1);
        if (eventError || !data?.[0]?.id) {
          throw new Error("This programme is not currently accepting applications.");
        }
        id = String(data[0].id);
      }

      const { error: insertError } = await neon.from("event_applications").insert({
        event_id: id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role_title: formData.jobTitle,
        email: formData.email,
        phone: formData.phone,
        city: "",
        country: formData.country,
        company_name: formData.companyName,
        company_website: formData.companyUrl,
        business_model: formData.sector,
        venture_stage: formData.stage,
        ai_interest: formData.aiFocus,
        motivation: formData.motivation,
        goals: formData.grantInterest,
        referral_source: "",
        consent: formData.consent,
        status: "submitted",
      });
      if (insertError) throw insertError;

      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(
        err?.message || "We could not submit your application. Please try again, or email us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="wizard-box" style={{ padding: "40px 32px", textAlign: "center" }}>
        <div style={{
          width: "68px",
          height: "68px",
          borderRadius: "50%",
          background: "rgba(79, 140, 201, 0.15)",
          color: "#4F8CC9",
          fontSize: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          border: "1px solid rgba(79, 140, 201, 0.3)"
        }}>
          ✓
        </div>
        <div style={{
          display: "inline-block",
          padding: "4px 14px",
          borderRadius: "999px",
          background: "rgba(79, 140, 201, 0.1)",
          border: "1px solid rgba(79, 140, 201, 0.3)",
          color: "#4F8CC9",
          fontSize: "0.68rem",
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "12px"
        }}>
          Application Received
        </div>
        <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff", margin: "0 0 10px", fontFamily: "var(--font-serif, Georgia, serif)" }}>
          Welcome to the FIALI 2026 Evaluation Pool
        </h3>
        <p style={{ color: "#b9c7d4", fontSize: "0.85rem", maxWidth: "540px", margin: "0 auto 20px", lineHeight: "1.6" }}>
          Thank you, <strong style={{ color: "#fff" }}>{formData.firstName}</strong>. Your dossier for{" "}
          <strong style={{ color: "#E09000" }}>{formData.companyName || "your venture"}</strong> has been registered with the ABCN Executive Committee.
          Due to the high touch 10-15 founder cohort limit, applications are reviewed rolling within 14 business days.
        </p>
        <div style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "16px 20px",
          maxWidth: "420px",
          margin: "0 auto 28px",
          fontSize: "0.76rem",
          color: "#8da4b8",
          textAlign: "left",
          lineHeight: "1.6"
        }}>
          <div>• We will reply to: <strong style={{ color: "#fff" }}>{formData.email}</strong></div>
          <div>• Programme: <strong style={{ color: "#E09000" }}>{eventTitle}</strong></div>
          <div>• Questions? <span style={{ color: "#fff" }}>harmonie.essome@softxcloud.net</span></div>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormData(initialData);
            setStep(1);
            setIsSubmitted(false);
          }}
          className="wizard-btn-prev"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="wizard-box">
      <div className="wizard-stripe" />

      <div className="wizard-content">
        {/* Step Indicator Header */}
        <div className="wizard-steps-header">
          {[
            { num: "01", label: "Profile" },
            { num: "02", label: "Venture" },
            { num: "03", label: "Focus" },
            { num: "04", label: "Review" },
          ].map((s, idx) => {
            const stepIndex = idx + 1;
            const isActive = step === stepIndex;
            const isPast = step > stepIndex;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (isPast) setStep(stepIndex);
                }}
                disabled={!isPast && !isActive}
                className={`wizard-step-indicator ${isActive ? "active" : isPast ? "done" : ""}`}
              >
                <span className="wizard-step-num">{isPast ? "✓" : s.num}</span>
                <span className="wizard-step-lbl">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          {/* STEP 1: Personal Profile */}
          {step === 1 && (
            <div>
              <div className="wizard-heading-group">
                <h3>Founder &amp; Leadership Profile</h3>
                <p>Step 1 of 4 · Tell us about yourself and how to reach you.</p>
              </div>

              <div className="wizard-form-grid">
                <div className="wizard-field">
                  <label>
                    First Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="e.g. Amara"
                  />
                  {errors.firstName && <div className="wizard-err">{errors.firstName}</div>}
                </div>

                <div className="wizard-field">
                  <label>
                    Last Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="e.g. Diallo"
                  />
                  {errors.lastName && <div className="wizard-err">{errors.lastName}</div>}
                </div>

                <div className="wizard-field">
                  <label>
                    Executive / Role Title <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => updateField("jobTitle", e.target.value)}
                    placeholder="e.g. Founder & CEO / Managing Director"
                  />
                  {errors.jobTitle && <div className="wizard-err">{errors.jobTitle}</div>}
                </div>

                <div className="wizard-field">
                  <label>
                    Location / Country Base <span className="req">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                  >
                    <option value="DE">🇩🇪 Germany (Frankfurt / Rhine-Main / Berlin)</option>
                    <option value="FR">🇫🇷 France (Paris / Lyon)</option>
                    <option value="UK">🇬🇧 United Kingdom (London / Manchester)</option>
                    <option value="BE">🇧🇪 Belgium / Brussels</option>
                    <option value="CH">🇨🇭 Switzerland (Zürich / Geneva)</option>
                    <option value="CM">🇨🇲 Cameroon (Douala / Yaoundé)</option>
                    <option value="NG">🇳🇬 Nigeria (Lagos / Abuja)</option>
                    <option value="RW">🇷🇼 Rwanda (Kigali)</option>
                    <option value="OTHER">🌍 Other International Corridor</option>
                  </select>
                </div>

                <div className="wizard-field">
                  <label>
                    Business Email Address <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="founder@company.com"
                  />
                  {errors.email && <div className="wizard-err">{errors.email}</div>}
                </div>

                <div className="wizard-field">
                  <label>
                    Phone / WhatsApp <span className="opt">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+49 176 …"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Venture & Innovation */}
          {step === 2 && (
            <div>
              <div className="wizard-heading-group">
                <h3>Venture &amp; Innovation Profile</h3>
                <p>Step 2 of 4 · Tell us about what you are building and your market traction.</p>
              </div>

              <div className="wizard-form-grid">
                <div className="wizard-field">
                  <label>
                    Venture / Project Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="e.g. AfroPulse Analytics"
                  />
                  {errors.companyName && <div className="wizard-err">{errors.companyName}</div>}
                </div>

                <div className="wizard-field">
                  <label>
                    Website or LinkedIn URL <span className="opt">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.companyUrl}
                    onChange={(e) => updateField("companyUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="wizard-field">
                  <label>
                    Core Sector <span className="req">*</span>
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => updateField("sector", e.target.value)}
                  >
                    <option value="AI & Digital Tech">AI, Automation &amp; SaaS</option>
                    <option value="Creative & Cultural Economy">Creative Industries &amp; Media</option>
                    <option value="FinTech & Cross-Border Trade">FinTech &amp; Pan-African Commerce</option>
                    <option value="HealthTech & BioTech">HealthTech &amp; Wellbeing</option>
                    <option value="EdTech & Future of Work">EdTech &amp; Talent Infrastructure</option>
                    <option value="AgriTech & Sustainability">AgriTech &amp; Climate Solutions</option>
                  </select>
                </div>

                <div className="wizard-field">
                  <label>
                    Venture Stage <span className="req">*</span>
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => updateField("stage", e.target.value)}
                  >
                    <option value="Pre-seed / MVP">Pre-Seed / Working MVP</option>
                    <option value="Early Revenue / Seed">Early Revenue / Seed Stage</option>
                    <option value="Growth / Series A Ready">Scaling / Seeking Growth Capital</option>
                    <option value="Bootstrapped & Profitable">Bootstrapped &amp; Profitable</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Motivation & AI Focus */}
          {step === 3 && (
            <div>
              <div className="wizard-heading-group">
                <h3>Cohort Goals &amp; Innovation Readiness</h3>
                <p>Step 3 of 4 · FIALI provides practical AI toolkits and €500 × 2 Startup Innovation Grants.</p>
              </div>

              <div className="wizard-form-grid">
                <div className="wizard-field full-span">
                  <label>
                    Why do you want to join the FIALI Frankfurt Cohort? <span className="req">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.motivation}
                    onChange={(e) => updateField("motivation", e.target.value)}
                    placeholder="Share what milestone you aim to achieve, whether expanding into European/African corridors or seeking strategic investor relationships..."
                  />
                  {errors.motivation && <div className="wizard-err">{errors.motivation}</div>}
                </div>

                <div className="wizard-field full-span">
                  <label>
                    What AI or digital workflows do you aim to integrate into your business?
                  </label>
                  <input
                    type="text"
                    value={formData.aiFocus}
                    onChange={(e) => updateField("aiFocus", e.target.value)}
                    placeholder="e.g. AI-assisted customer ops, predictive forecasting, automated workflow pipelines..."
                  />
                </div>

                <div className="wizard-field full-span">
                  <label>
                    Are you interested in pitching for the €500 × 2 Startup Innovation Grant?
                  </label>
                  <select
                    value={formData.grantInterest}
                    onChange={(e) => updateField("grantInterest", e.target.value)}
                  >
                    <option value="Yes, interested in the €500 × 2 Grant">Yes, pitch readiness for the €500 × 2 Grant</option>
                    <option value="Focusing on ecosystem networking & mentorship">Focusing primarily on mentorship and investor networking</option>
                    <option value="Interested in both">Both grant competition and corridor partnership</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Confirm */}
          {step === 4 && (
            <div>
              <div className="wizard-heading-group">
                <h3>Review &amp; Confirm Application</h3>
                <p>Step 4 of 4 · Please review your dossier summary before final submission.</p>
              </div>

              <div className="wizard-review-card">
                <div className="wizard-review-row">
                  <div className="wizard-review-item">
                    <span>Applicant</span>
                    <strong>{formData.firstName} {formData.lastName}</strong>
                    <em>{formData.jobTitle}</em>
                  </div>
                  <div className="wizard-review-item">
                    <span>Contact</span>
                    <strong>{formData.email}</strong>
                    <em>{formData.phone || "No phone provided"}</em>
                  </div>
                </div>

                <div className="wizard-review-row" style={{ borderBottom: "none", paddingBottom: 0 }}>
                  <div className="wizard-review-item">
                    <span>Venture</span>
                    <strong>{formData.companyName}</strong>
                    <em>{formData.sector}</em>
                  </div>
                  <div className="wizard-review-item">
                    <span>Stage &amp; Country</span>
                    <strong>{formData.stage}</strong>
                    <em>Country: {formData.country}</em>
                  </div>
                </div>

                <div style={{ background: "rgba(0,0,0,0.25)", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: "0.68rem", color: "#7b94a8", display: "block", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                    Motivation Excerpt
                  </span>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "#d1dde6", fontStyle: "italic" }}>
                    &ldquo;{formData.motivation}&rdquo;
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "14px" }}>
                <label className="gdpr-consent-label">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => updateField("consent", e.target.checked)}
                  />
                  <span>
                    I confirm that the details provided are accurate and that I have read the{" "}
                    <a
                      href={privacyHref}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#E09000", textDecoration: "underline", background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}
                    >
                      privacy notice / Datenschutzerklärung
                    </a>
                    . My information will be used to review and administer this application. This acknowledgement is not consent to unrelated marketing.
                  </span>
                </label>
                {errors.consent && <div className="wizard-err">{errors.consent}</div>}
              </div>
            </div>
          )}

          {submitError && (
            <div
              role="alert"
              style={{
                marginTop: "18px",
                padding: "12px 16px",
                borderRadius: "12px",
                background: "rgba(214, 69, 69, 0.12)",
                border: "1px solid rgba(214, 69, 69, 0.35)",
                color: "#ffb4b4",
                fontSize: "0.8rem",
                lineHeight: 1.55,
              }}
            >
              {submitError}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="wizard-nav-controls">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="wizard-btn-prev"
              >
                ← Previous
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="wizard-btn-next"
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="wizard-btn-submit"
              >
                {isSubmitting ? "Transmitting Dossier..." : "Submit Official Application ✓"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
