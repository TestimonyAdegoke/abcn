"use client";

import { FormEvent, useMemo, useState } from "react";
import { neon } from "@/lib/neon";

type Props = {
  eventId?: string;
  eventSlug: string;
  eventTitle: string;
  applicationDeadline?: string | null;
};

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  company_name: string;
  company_website: string;
  role_title: string;
  venture_stage: string;
  business_model: string;
  ai_interest: string;
  motivation: string;
  goals: string;
  referral_source: string;
  consent: boolean;
};

const initial: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  company_name: "",
  company_website: "",
  role_title: "",
  venture_stage: "",
  business_model: "",
  ai_interest: "",
  motivation: "",
  goals: "",
  referral_source: "",
  consent: false,
};

export default function EventApplicationForm({ eventId, eventSlug, eventTitle, applicationDeadline }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const steps = ["Profile", "Venture", "Motivation", "Confirm"];
  const progress = useMemo(() => (step / steps.length) * 100, [step]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateCurrent() {
    setError("");
    if (step === 1) {
      if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim() || !form.country.trim()) {
        setError("Please complete the required profile fields.");
        return false;
      }
    }
    if (step === 2) {
      if (!form.company_name.trim() || !form.venture_stage.trim() || !form.business_model.trim()) {
        setError("Please tell us about your venture.");
        return false;
      }
    }
    if (step === 3) {
      if (!form.motivation.trim() || !form.consent) {
        setError("Please share your motivation and confirm consent before continuing.");
        return false;
      }
    }
    return true;
  }

  function next() {
    if (!validateCurrent()) return;
    setStep((s) => Math.min(4, s + 1));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      let id = eventId;
      if (!id) {
        const { data, error: eventError } = await neon
          .from("events")
          .select("id")
          .eq("slug", eventSlug)
          .eq("status", "published")
          .limit(1);
        if (eventError || !data?.[0]?.id) throw new Error("This event is not currently accepting applications.");
        id = String(data[0].id);
      }

      const { error: insertError } = await neon.from("event_applications").insert({
        event_id: id,
        ...form,
        status: "submitted",
      });
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "We could not submit your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="application-success">
        <div className="success-mark">✓</div>
        <span>Application received</span>
        <h3>Thank you, {form.first_name}.</h3>
        <p>
          Your application for {eventTitle} has been submitted. The ABCN team can now review it from the event CMS.
        </p>
        <button type="button" onClick={() => { setSubmitted(false); setStep(1); setForm(initial); }}>
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form className="application-form" onSubmit={submit}>
      <div className="application-progress"><i style={{ width: progress + "%" }} /></div>
      <div className="application-steps">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            className={step === index + 1 ? "active" : step > index + 1 ? "done" : ""}
            onClick={() => { if (index + 1 < step) setStep(index + 1); }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>{label}
          </button>
        ))}
      </div>

      {applicationDeadline && <div className="application-deadline">{applicationDeadline}</div>}
      {error && <div className="application-error">{error}</div>}

      {step === 1 && (
        <div className="application-panel">
          <span className="application-kicker">01 · Your profile</span>
          <h3>Start with you.</h3>
          <div className="application-grid">
            <label>First name *<input value={form.first_name} onChange={(e)=>update("first_name",e.target.value)} /></label>
            <label>Last name *<input value={form.last_name} onChange={(e)=>update("last_name",e.target.value)} /></label>
            <label>Email *<input type="email" value={form.email} onChange={(e)=>update("email",e.target.value)} /></label>
            <label>Phone<input value={form.phone} onChange={(e)=>update("phone",e.target.value)} placeholder="+49 …" /></label>
            <label>City<input value={form.city} onChange={(e)=>update("city",e.target.value)} /></label>
            <label>Country *<input value={form.country} onChange={(e)=>update("country",e.target.value)} /></label>
            <label className="wide">Role / title<input value={form.role_title} onChange={(e)=>update("role_title",e.target.value)} /></label>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="application-panel">
          <span className="application-kicker">02 · Your venture</span>
          <h3>Tell us what you are building.</h3>
          <div className="application-grid">
            <label>Company / venture name *<input value={form.company_name} onChange={(e)=>update("company_name",e.target.value)} /></label>
            <label>Website<input value={form.company_website} onChange={(e)=>update("company_website",e.target.value)} placeholder="https://" /></label>
            <label>Venture stage *
              <select value={form.venture_stage} onChange={(e)=>update("venture_stage",e.target.value)}>
                <option value="">Select stage</option>
                <option>Idea / pre-incorporation</option>
                <option>Early-stage / incorporated</option>
                <option>Revenue generating</option>
                <option>Growth / scaling</option>
              </select>
            </label>
            <label>AI & digitalization interest
              <select value={form.ai_interest} onChange={(e)=>update("ai_interest",e.target.value)}>
                <option value="">Select</option>
                <option>Exploring</option>
                <option>Already using AI</option>
                <option>AI is core to the product</option>
                <option>Need support identifying use cases</option>
              </select>
            </label>
            <label className="wide">Business model *<textarea value={form.business_model} onChange={(e)=>update("business_model",e.target.value)} placeholder="What problem do you solve, for whom, and how does the venture create value?" /></label>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="application-panel">
          <span className="application-kicker">03 · Motivation</span>
          <h3>Why FIALI, and why now?</h3>
          <div className="application-grid">
            <label className="wide">Motivation *<textarea maxLength={2000} value={form.motivation} onChange={(e)=>update("motivation",e.target.value)} placeholder="What would make this programme valuable for you and your venture?" /><small>{form.motivation.length}/2000</small></label>
            <label className="wide">What do you want to achieve?<textarea maxLength={1200} value={form.goals} onChange={(e)=>update("goals",e.target.value)} /><small>{form.goals.length}/1200</small></label>
            <label className="wide">How did you hear about FIALI?<input value={form.referral_source} onChange={(e)=>update("referral_source",e.target.value)} /></label>
            <label className="consent wide">
              <input type="checkbox" checked={form.consent} onChange={(e)=>update("consent",e.target.checked)} />
              <span>I consent to ABCN processing the information I submit for the purpose of reviewing and communicating about my FIALI application. *</span>
            </label>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="application-panel review-panel">
          <span className="application-kicker">04 · Review</span>
          <h3>Ready to submit?</h3>
          <div className="review-grid">
            <div><span>Name</span><strong>{form.first_name} {form.last_name}</strong></div>
            <div><span>Email</span><strong>{form.email}</strong></div>
            <div><span>Venture</span><strong>{form.company_name}</strong></div>
            <div><span>Stage</span><strong>{form.venture_stage}</strong></div>
            <div className="wide"><span>Motivation</span><p>{form.motivation}</p></div>
          </div>
        </div>
      )}

      <div className="application-actions">
        {step > 1 && <button type="button" className="back" onClick={()=>setStep((s)=>s-1)}>Back</button>}
        {step < 4 ? (
          <button type="button" className="next" onClick={next}>Continue →</button>
        ) : (
          <button type="submit" className="next" disabled={submitting}>{submitting ? "Submitting…" : "Submit application →"}</button>
        )}
      </div>
    </form>
  );
}
