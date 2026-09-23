"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { neon } from "@/lib/neon";

type Props = {
  eventId?: string;
  eventSlug: string;
  eventTitle: string;
  grants?: { count?: number; amount_each?: string; title?: string } | null;
  applicationDeadline?: string | null;
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
  grantInterest: "Yes, interested in the grant",
  consent: false,
};

export default function MultiStepApplication({
  eventId,
  eventSlug,
  eventTitle,
  grants,
}: Props) {
  const locale = useLocale();
  const t = useTranslations("application");
  const privacyHref = locale === "de" ? "/de/datenschutz" : "/privacy";
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  const hasGrants = Boolean(grants?.title || grants?.amount_each);

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
      if (!formData.firstName.trim()) err.firstName = t("errFirstName");
      if (!formData.lastName.trim()) err.lastName = t("errLastName");
      if (!formData.jobTitle.trim()) err.jobTitle = t("errJobTitle");
      if (!formData.email.trim() || !formData.email.includes("@")) {
        err.email = t("errEmail");
      }
    } else if (currentStep === 2) {
      if (!formData.companyName.trim()) err.companyName = t("errCompanyName");
      if (!formData.sector.trim()) err.sector = t("errSector");
    } else if (currentStep === 3) {
      if (!formData.motivation.trim() || formData.motivation.trim().length < 15) {
        err.motivation = t("errMotivation");
      }
    } else if (currentStep === 4) {
      if (!formData.consent) {
        err.consent = t("errConsent");
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
          throw new Error(t("errSubmit"));
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
      setSubmitError(err?.message || t("errSubmit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: "01", label: t("step1Label") },
    { num: "02", label: t("step2Label") },
    { num: "03", label: t("step3Label") },
    { num: "04", label: t("step4Label") },
  ];

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
          {t("receivedBadge")}
        </div>
        <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff", margin: "0 0 10px", fontFamily: "var(--font-serif, Georgia, serif)" }}>
          {t("successTitle", { eventTitle })}
        </h3>
        <p style={{ color: "#b9c7d4", fontSize: "0.85rem", maxWidth: "540px", margin: "0 auto 20px", lineHeight: "1.6" }}>
          {t("successBody", {
            name: formData.firstName,
            company: formData.companyName || (locale === "de" ? "Ihr Unternehmen" : "your venture")
          })}
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
          <div>• {t("replyTo")} <strong style={{ color: "#fff" }}>{formData.email}</strong></div>
          <div>• {t("programme")} <strong style={{ color: "#E09000" }}>{eventTitle}</strong></div>
          <div>• {t("questions")} <span style={{ color: "#fff" }}>harmonie.essome@softxcloud.net</span></div>
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
          {t("submitAnother")}
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
          {steps.map((s, idx) => {
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
                <h3>{t("step1Title")}</h3>
                <p>{t("step1Subtitle")}</p>
              </div>

              <div className="wizard-form-grid">
                <div className="wizard-field">
                  <label>
                    {t("firstName")} <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder={t("firstNamePlaceholder")}
                  />
                  {errors.firstName && <div className="wizard-err">{errors.firstName}</div>}
                </div>

                <div className="wizard-field">
                  <label>
                    {t("lastName")} <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder={t("lastNamePlaceholder")}
                  />
                  {errors.lastName && <div className="wizard-err">{errors.lastName}</div>}
                </div>

                <div className="wizard-field">
                  <label>
                    {t("jobTitle")} <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => updateField("jobTitle", e.target.value)}
                    placeholder={t("jobTitlePlaceholder")}
                  />
                  {errors.jobTitle && <div className="wizard-err">{errors.jobTitle}</div>}
                </div>

                <div className="wizard-field">
                  <label>
                    {t("country")} <span className="req">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                  >
                    <option value="DE">{t("countryDe")}</option>
                    <option value="FR">{t("countryFr")}</option>
                    <option value="UK">{t("countryUk")}</option>
                    <option value="BE">{t("countryBe")}</option>
                    <option value="CH">{t("countryCh")}</option>
                    <option value="CM">{t("countryCm")}</option>
                    <option value="NG">{t("countryNg")}</option>
                    <option value="RW">{t("countryRw")}</option>
                    <option value="OTHER">{t("countryOther")}</option>
                  </select>
                </div>

                <div className="wizard-field">
                  <label>
                    {t("email")} <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder={t("emailPlaceholder")}
                  />
                  {errors.email && <div className="wizard-err">{errors.email}</div>}
                </div>

                <div className="wizard-field">
                  <label>
                    {t("phone")} <span className="opt">{t("optional")}</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder={t("phonePlaceholder")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Venture & Innovation */}
          {step === 2 && (
            <div>
              <div className="wizard-heading-group">
                <h3>{t("step2Title")}</h3>
                <p>{t("step2Subtitle")}</p>
              </div>

              <div className="wizard-form-grid">
                <div className="wizard-field">
                  <label>
                    {t("companyName")} <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder={t("companyNamePlaceholder")}
                  />
                  {errors.companyName && <div className="wizard-err">{errors.companyName}</div>}
                </div>

                <div className="wizard-field">
                  <label>
                    {t("companyUrl")} <span className="opt">{t("optional")}</span>
                  </label>
                  <input
                    type="url"
                    value={formData.companyUrl}
                    onChange={(e) => updateField("companyUrl", e.target.value)}
                    placeholder={t("companyUrlPlaceholder")}
                  />
                </div>

                <div className="wizard-field">
                  <label>
                    {t("sector")} <span className="req">*</span>
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => updateField("sector", e.target.value)}
                  >
                    <option value="AI & Digital Tech">{t("sectorAi")}</option>
                    <option value="Creative & Cultural Economy">{t("sectorCreative")}</option>
                    <option value="FinTech & Cross-Border Trade">{t("sectorFintech")}</option>
                    <option value="HealthTech & BioTech">{t("sectorHealth")}</option>
                    <option value="EdTech & Future of Work">{t("sectorEdtech")}</option>
                    <option value="AgriTech & Sustainability">{t("sectorAgri")}</option>
                  </select>
                </div>

                <div className="wizard-field">
                  <label>
                    {t("stage")} <span className="req">*</span>
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => updateField("stage", e.target.value)}
                  >
                    <option value="Pre-seed / MVP">{t("stagePreSeed")}</option>
                    <option value="Early Revenue / Seed">{t("stageEarlyRev")}</option>
                    <option value="Growth / Series A Ready">{t("stageGrowth")}</option>
                    <option value="Bootstrapped & Profitable">{t("stageProfitable")}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Motivation & Focus */}
          {step === 3 && (
            <div>
              <div className="wizard-heading-group">
                <h3>{t("step3Title")}</h3>
                <p>{t("step3Subtitle")}</p>
              </div>

              <div className="wizard-form-grid">
                <div className="wizard-field full-span">
                  <label>
                    {t("motivationLabel", { eventTitle })} <span className="req">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.motivation}
                    onChange={(e) => updateField("motivation", e.target.value)}
                    placeholder={t("motivationPlaceholder")}
                  />
                  {errors.motivation && <div className="wizard-err">{errors.motivation}</div>}
                </div>

                <div className="wizard-field full-span">
                  <label>
                    {t("aiFocusLabel")}
                  </label>
                  <input
                    type="text"
                    value={formData.aiFocus}
                    onChange={(e) => updateField("aiFocus", e.target.value)}
                    placeholder={t("aiFocusPlaceholder")}
                  />
                </div>

                <div className="wizard-field full-span">
                  <label>
                    {hasGrants ? t("grantInterestLabel") : t("grantInterestGeneralLabel")}
                  </label>
                  <select
                    value={formData.grantInterest}
                    onChange={(e) => updateField("grantInterest", e.target.value)}
                  >
                    <option value="Yes, interested in the grant">{t("grantOption1")}</option>
                    <option value="Focusing on ecosystem networking & mentorship">{t("grantOption2")}</option>
                    <option value="Interested in both">{t("grantOption3")}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Confirm */}
          {step === 4 && (
            <div>
              <div className="wizard-heading-group">
                <h3>{t("step4Title")}</h3>
                <p>{t("step4Subtitle")}</p>
              </div>

              <div className="wizard-review-card">
                <div className="wizard-review-row">
                  <div className="wizard-review-item">
                    <span>{t("applicant")}</span>
                    <strong>{formData.firstName} {formData.lastName}</strong>
                    <em>{formData.jobTitle}</em>
                  </div>
                  <div className="wizard-review-item">
                    <span>{t("contact")}</span>
                    <strong>{formData.email}</strong>
                    <em>{formData.phone || t("noPhone")}</em>
                  </div>
                </div>

                <div className="wizard-review-row" style={{ borderBottom: "none", paddingBottom: 0 }}>
                  <div className="wizard-review-item">
                    <span>{t("venture")}</span>
                    <strong>{formData.companyName}</strong>
                    <em>{formData.sector}</em>
                  </div>
                  <div className="wizard-review-item">
                    <span>{t("stageCountry")}</span>
                    <strong>{formData.stage}</strong>
                    <em>{t("countryLabel")}: {formData.country}</em>
                  </div>
                </div>

                <div style={{ background: "rgba(0,0,0,0.25)", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: "0.68rem", color: "#7b94a8", display: "block", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                    {t("motivationExcerpt")}
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
                    {t("consentText")}{" "}
                    <a
                      href={privacyHref}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#E09000", textDecoration: "underline", background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}
                    >
                      {t("privacyLink")}
                    </a>
                    {t("consentTail")}
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
                {t("prevBtn")}
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
                {t("nextBtn", { step: steps[step]?.label || "" })}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="wizard-btn-submit"
              >
                {isSubmitting ? t("submittingBtn") : t("submitBtn")}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
