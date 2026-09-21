"use client";

import React, { useState } from "react";

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

export default function MultiStepApplication() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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
        err.consent = "You must confirm your consent to submit.";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  if (isSubmitted) {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-[#0A1410] p-8 md:p-12 text-center text-white shadow-2xl animate-fade-in">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-4xl border border-emerald-500/40">
          ✓
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
          Application Received
        </div>
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
          Welcome to the FIALI 2026 Evaluation Pool
        </h3>
        <p className="max-w-xl mx-auto text-sm text-gray-300 leading-relaxed mb-6">
          Thank you, <strong className="text-white">{formData.firstName}</strong>. Your dossier for{" "}
          <strong className="text-[#E09000]">{formData.companyName || "your venture"}</strong> has been registered with the ABCN Executive Committee.
          Due to the high touch 10-15 founder cohort limit, applications are reviewed rolling within 14 business days.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 max-w-md mx-auto text-xs text-gray-400 mb-8 space-y-1 text-left">
          <p>• Confirmation email sent to: <span className="text-white font-medium">{formData.email}</span></p>
          <p>• Reference ID: <span className="text-[#E09000] font-mono font-semibold">FIALI-2026-{Math.floor(1000 + Math.random() * 9000)}</span></p>
          <p>• Secretariat Contact: <span className="text-gray-300">harmonie.essome@softxcloud.net</span></p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormData(initialData);
            setStep(1);
            setIsSubmitted(false);
          }}
          className="px-6 py-2.5 rounded-full border border-white/20 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl border border-white/10 bg-[#080d15] text-white shadow-2xl overflow-hidden">
      {/* Top Brand Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#004F1E] via-[#02318B] via-[#E09000] to-[#B01010]" />

      <div className="p-6 md:p-10">
        {/* Step Indicator Header (Benchmark Inspired) */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
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
                  className={`flex flex-col items-center sm:items-start text-left pb-3 border-b-2 transition-all ${
                    isActive
                      ? "border-[#E09000] text-[#E09000]"
                      : isPast
                      ? "border-emerald-500/80 text-emerald-400 cursor-pointer"
                      : "border-white/10 text-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold font-mono">
                    <span>{isPast ? "✓" : s.num}</span>
                    <span className="hidden sm:inline uppercase tracking-wider text-[11px] font-sans">
                      {s.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          {/* STEP 1: Personal Profile */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-white mb-1">
                  Founder & Leadership Profile
                </h3>
                <p className="text-xs text-gray-400">
                  Step 1 of 4 · Tell us about yourself and how to reach you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    First Name <span className="text-[#E09000]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="e.g. Amara"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E09000] focus:outline-none focus:ring-1 focus:ring-[#E09000]"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-rose-400 mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Last Name <span className="text-[#E09000]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="e.g. Diallo"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E09000] focus:outline-none focus:ring-1 focus:ring-[#E09000]"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-rose-400 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Executive / Role Title <span className="text-[#E09000]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => updateField("jobTitle", e.target.value)}
                    placeholder="e.g. Founder & CEO / Managing Director"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E09000] focus:outline-none focus:ring-1 focus:ring-[#E09000]"
                  />
                  {errors.jobTitle && (
                    <p className="text-xs text-rose-400 mt-1">{errors.jobTitle}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Location / Country Base <span className="text-[#E09000]">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0e1624] px-4 py-2.5 text-sm text-white focus:border-[#E09000] focus:outline-none focus:ring-1 focus:ring-[#E09000]"
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Business Email Address <span className="text-[#E09000]">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="founder@company.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E09000] focus:outline-none focus:ring-1 focus:ring-[#E09000]"
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-400 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Phone / WhatsApp <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+49 176 …"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E09000] focus:outline-none focus:ring-1 focus:ring-[#E09000]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Venture & Innovation */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-white mb-1">
                  Venture & Innovation Profile
                </h3>
                <p className="text-xs text-gray-400">
                  Step 2 of 4 · Tell us about what you are building and your market traction.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Venture / Project Name <span className="text-[#E09000]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="e.g. AfroPulse Analytics"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E09000] focus:outline-none focus:ring-1 focus:ring-[#E09000]"
                  />
                  {errors.companyName && (
                    <p className="text-xs text-rose-400 mt-1">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Website or LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.companyUrl}
                    onChange={(e) => updateField("companyUrl", e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E09000] focus:outline-none focus:ring-1 focus:ring-[#E09000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Core Sector <span className="text-[#E09000]">*</span>
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => updateField("sector", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0e1624] px-4 py-2.5 text-sm text-white focus:border-[#E09000] focus:outline-none focus:ring-1 focus:ring-[#E09000]"
                  >
                    <option value="AI & Digital Tech">AI, Automation & SaaS</option>
                    <option value="Creative & Cultural Economy">Creative Industries & Media</option>
                    <option value="FinTech & Cross-Border Trade">FinTech & Pan-African Commerce</option>
                    <option value="HealthTech & BioTech">HealthTech & Wellbeing</option>
                    <option value="EdTech & Future of Work">EdTech & Talent Infrastructure</option>
                    <option value="AgriTech & Sustainability">AgriTech & Climate Solutions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Venture Stage <span className="text-[#E09000]">*</span>
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => updateField("stage", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0e1624] px-4 py-2.5 text-sm text-white focus:border-[#E09000] focus:outline-none focus:ring-1 focus:ring-[#E09000]"
                  >
                    <option value="Pre-seed / MVP">Pre-Seed / Working MVP</option>
                    <option value="Early Revenue / Seed">Early Revenue / Seed Stage</option>
                    <option value="Growth / Series A Ready">Scaling / Seeking Growth Capital</option>
                    <option value="Bootstrapped & Profitable">Bootstrapped & Profitable</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Motivation & AI Focus */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-white mb-1">
                  Cohort Goals & Innovation Readiness
                </h3>
                <p className="text-xs text-gray-400">
                  Step 3 of 4 · FIALI provides practical AI toolkits and €500 × 2 Startup Innovation Grants.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Why do you want to join the FIALI Frankfurt Cohort? <span className="text-[#E09000]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.motivation}
                  onChange={(e) => updateField("motivation", e.target.value)}
                  placeholder="Share what milestone you aim to achieve, whether expanding into European/African corridors or seeking strategic investor relationships..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E09000] focus:outline-none focus:ring-1 focus:ring-[#E09000]"
                />
                {errors.motivation && (
                  <p className="text-xs text-rose-400 mt-1">{errors.motivation}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  What AI or digital workflows do you aim to integrate into your business?
                </label>
                <input
                  type="text"
                  value={formData.aiFocus}
                  onChange={(e) => updateField("aiFocus", e.target.value)}
                  placeholder="e.g. AI-assisted customer ops, predictive forecasting, automated workflow pipelines..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#E09000] focus:outline-none focus:ring-1 focus:ring-[#E09000]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Are you interested in pitching for the €500 × 2 Startup Innovation Grant?
                </label>
                <select
                  value={formData.grantInterest}
                  onChange={(e) => updateField("grantInterest", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0e1624] px-4 py-2.5 text-sm text-white focus:border-[#E09000] focus:outline-none focus:ring-1 focus:ring-[#E09000]"
                >
                  <option value="Yes, interested in the €500 × 2 Grant">Yes, pitch readiness for the €500 × 2 Grant</option>
                  <option value="Focusing on ecosystem networking & mentorship">Focusing primarily on mentorship and investor networking</option>
                  <option value="Interested in both">Both grant competition and corridor partnership</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Confirm */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-white mb-1">
                  Review & Confirm Application
                </h3>
                <p className="text-xs text-gray-400">
                  Step 4 of 4 · Please review your dossier summary before final submission.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-gray-400 block">Applicant</span>
                    <strong className="text-white text-sm">
                      {formData.firstName} {formData.lastName}
                    </strong>
                    <span className="text-gray-300 block">{formData.jobTitle}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Contact</span>
                    <span className="text-white block">{formData.email}</span>
                    <span className="text-gray-400 block">{formData.phone || "No phone provided"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-gray-400 block">Venture</span>
                    <strong className="text-white text-sm">{formData.companyName}</strong>
                    <span className="text-[#E09000] block">{formData.sector}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Stage & Location</span>
                    <span className="text-white block">{formData.stage}</span>
                    <span className="text-gray-300 block">Country: {formData.country}</span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 block mb-1">Motivation Excerpt</span>
                  <p className="text-gray-200 italic bg-black/20 p-2.5 rounded-lg border border-white/5">
                    "{formData.motivation}"
                  </p>
                </div>
              </div>

              {/* GDPR Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => updateField("consent", e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-700 bg-white/5 text-[#E09000] focus:ring-[#E09000]"
                  />
                  <span>
                    I confirm that the details provided are accurate and agree to the{" "}
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent("open-gdpr"))}
                      className="text-[#E09000] underline hover:text-amber-300"
                    >
                      GDPR Data Protection Policy
                    </button>
                    . Applications are reviewed on a rolling basis for the 10-15 cohort.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-xs text-rose-400 mt-1">{errors.consent}</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-full border border-white/20 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E09000] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#ffad1a] transition-all duration-200 shadow-lg shadow-amber-900/30"
              >
                <span>Continue</span>
                <span>→</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#E09000] to-[#ffb833] text-black text-xs font-extrabold uppercase tracking-wider hover:brightness-110 transition-all duration-200 shadow-xl shadow-amber-900/40 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Transmitting Dossier...</span>
                ) : (
                  <>
                    <span>Submit Official Application</span>
                    <span>✓</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
