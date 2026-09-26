"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { neon } from "@/lib/neon";
import {
  EventRecord,
  EventStage,
  EventPartner,
  FIALI_FALLBACK,
  normaliseEvent,
} from "@/lib/events";
import "@/app/[locale]/admin/admin.css";

type Mode = "checking" | "signed-out" | "needs-admin" | "admin";
type MainTab = "events" | "pipeline";
type EditorTab = "core" | "location" | "content" | "media" | "stages" | "german" | "applicants";
type Editable = EventRecord & { id?: string };

type ApplicationRow = {
  id: string;
  event_id?: string | null;
  event_title?: string | null;
  first_name: string;
  last_name: string;
  role_title?: string | null;
  email: string;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  company_name?: string | null;
  company_website?: string | null;
  business_model?: string | null;
  venture_stage?: string | null;
  ai_interest?: string | null;
  motivation?: string | null;
  goals?: string | null;
  referral_source?: string | null;
  status: string;
  admin_notes?: string | null;
  submitted_at: string;
};

const blankEvent = (): Editable => ({
  slug: "",
  title: "",
  eyebrow: "",
  short_description: "",
  description: "",
  long_description: "",
  city: "Frankfurt am Main",
  country: "Germany",
  venue: "",
  date_label: "",
  start_at: null,
  end_at: null,
  status: "draft",
  event_type: "Summit",
  organizer: "ABCN · Afropean Business & Culture Network",
  hero_image_url: "",
  card_image_url: "",
  registration_url: "",
  featured: false,
  priority: 50,
  show_on_home: false,
  theme: "",
  accent_color: "#58AC8C",
  deep_color: "#0F4C38",
  light_color: "#F1F5FA",
  title_de: "",
  eyebrow_de: "",
  short_description_de: "",
  description_de: "",
  long_description_de: "",
  date_label_de: "",
  venue_de: "",
  application_cta_de: "",
  application_deadline_de: "",
  highlights_de: [],
  stages_de: [],
  eligibility_de: [],
  grants_de: {},
  focus_areas_de: [],
  benefits_de: [],
  highlights: [],
  stages: [],
  eligibility: [],
  partners: [],
  grants: {},
  gallery: [],
  application_open: false,
  application_deadline: "",
  application_cta: "Apply now",
  focus_areas: [],
  benefits: [],
});

const lines = (value: string) =>
  value
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);

const partnersFromText = (value: string): EventPartner[] =>
  lines(value).map((row) => {
    const [name, logo, website] = row.split("|").map((v) => v.trim());
    return { name, ...(logo ? { logo } : {}), ...(website ? { website } : {}) };
  });

const cardsFromText = (value: string) =>
  lines(value).map((row) => {
    const [title, ...rest] = row.split("|");
    return { title: title.trim(), description: rest.join("|").trim() };
  });

async function compressImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not decode image."));
    el.src = source;
  });
  const max = 1600;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  const out = canvas.toDataURL("image/jpeg", 0.82);
  if (out.length > 1_700_000)
    throw new Error("Image is still too large. Please use an image under about 1.2 MB.");
  return out;
}

export default function EventsAdminPage() {
  const [mode, setMode] = useState<Mode>("checking");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mainTab, setMainTab] = useState<MainTab>("events");
  const [editorTab, setEditorTab] = useState<EditorTab>("core");

  const [events, setEvents] = useState<Editable[]>([]);
  const [form, setForm] = useState<Editable>(blankEvent());
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [eventsSearch, setEventsSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [claimToken, setClaimToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [allApplications, setAllApplications] = useState<ApplicationRow[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [pipelineEventFilter, setPipelineEventFilter] = useState<string>("all");
  const [pipelineStatusFilter, setPipelineStatusFilter] = useState<string>("all");
  const [pipelineSearch, setPipelineSearch] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicationRow | null>(null);

  const [rawJsonMode, setRawJsonMode] = useState(false);

  const stagesText = useMemo(() => JSON.stringify(form.stages || [], null, 2), [form.stages]);
  const grantsText = useMemo(() => JSON.stringify(form.grants || {}, null, 2), [form.grants]);
  const partnersText = useMemo(
    () =>
      (form.partners || [])
        .map((p) => [p.name, p.logo || "", p.website || ""].join(" | "))
        .join("\n"),
    [form.partners]
  );
  const focusText = useMemo(
    () => (form.focus_areas || []).map((p) => [p.title, p.description].join(" | ")).join("\n"),
    [form.focus_areas]
  );
  const benefitsText = useMemo(
    () => (form.benefits || []).map((p) => [p.title, p.description].join(" | ")).join("\n"),
    [form.benefits]
  );

  function showToast(text: string, type: "success" | "error" = "success") {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4500);
  }

  // Resilient session loader
  async function refreshSession() {
    try {
      const { data } = await neon.auth.getSession();
      const user = (data as any)?.user || (data as any)?.session?.user;
      if (!user) {
        setMode("signed-out");
        return;
      }
      setCurrentUser(user);
      const role = String(user.role || "");
      if (role.includes("admin")) {
        setMode("admin");
        await Promise.all([loadEvents(), loadAllApplications()]);
      } else {
        setMode("needs-admin");
      }
    } catch (err) {
      setMode("signed-out");
    }
  }

  // Resilient events loader: tries internal API route first, then PostgREST fallback
  async function loadEvents() {
    try {
      const res = await fetch("/api/admin/events");
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const rows = json.data.map((r: any) => normaliseEvent(r));
          setEvents(rows);
          if (rows.length && !selectedId) {
            setSelectedId(rows[0].id);
            setForm({ ...rows[0] });
            loadEventApplications(rows[0].id);
          }
          return;
        }
      }
    } catch {
      // Fall through to neon client fallback
    }

    try {
      const { data } = await neon.from("events").select("*").order("priority", { ascending: false });
      if (data) {
        const rows = (data as any[]).map((row) => normaliseEvent(row));
        setEvents(rows);
        if (rows.length && !selectedId) {
          setSelectedId(rows[0].id);
          setForm({ ...rows[0] });
          loadEventApplications(rows[0].id);
        }
      }
    } catch (err: any) {
      showToast(err.message || "Could not fetch events list", "error");
    }
  }

  // Resilient applications loader
  async function loadAllApplications() {
    setApplicationsLoading(true);
    try {
      const res = await fetch("/api/admin/applications");
      if (res.ok) {
        const json = await res.json();
        setAllApplications((json.data || []) as ApplicationRow[]);
      }
    } catch {
      // Silent failover
    } finally {
      setApplicationsLoading(false);
    }
  }

  async function loadEventApplications(eventId?: string) {
    if (!eventId) {
      setApplications([]);
      return;
    }
    setApplicationsLoading(true);
    try {
      const res = await fetch(`/api/admin/applications?eventId=${encodeURIComponent(eventId)}`);
      if (res.ok) {
        const json = await res.json();
        setApplications((json.data || []) as ApplicationRow[]);
      } else {
        const { data } = await neon
          .from("event_applications")
          .select("*")
          .eq("event_id", eventId)
          .order("submitted_at", { ascending: false });
        setApplications((data || []) as ApplicationRow[]);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to load event applications", "error");
    } finally {
      setApplicationsLoading(false);
    }
  }

  useEffect(() => {
    refreshSession().catch(() => setMode("signed-out"));
  }, []);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    const { error: authError } = await neon.auth.signIn.email({
      email: authForm.email,
      password: authForm.password,
    });
    if (authError) {
      showToast(authError.message || "Could not sign in.", "error");
      return;
    }
    showToast("Signed in successfully.");
    await refreshSession();
  }

  async function signUp() {
    const { error: authError } = await neon.auth.signUp.email({
      name: authForm.name || "ABCN Admin",
      email: authForm.email,
      password: authForm.password,
    });
    if (authError) {
      showToast(authError.message || "Could not create account.", "error");
      return;
    }
    showToast("Account created. Welcome to ABCN CMS.");
    await refreshSession();
  }

  async function claimAdmin() {
    const { data, error: rpcError } = await neon.rpc("claim_cms_admin", { p_token: claimToken });
    if (rpcError || !data) {
      showToast(rpcError?.message || "Invalid setup token.", "error");
      return;
    }
    showToast("Administrator role assigned! Refreshing session...");
    await refreshSession();
  }

  async function signOut() {
    await neon.auth.signOut();
    setMode("signed-out");
    setEvents([]);
    setForm(blankEvent());
    showToast("Signed out.");
  }

  function selectEvent(event: Editable) {
    setSelectedId(event.id);
    setForm({ ...event });
    loadEventApplications(event.id);
  }

  function newEvent() {
    setSelectedId(undefined);
    setForm(blankEvent());
    setApplications([]);
    setEditorTab("core");
    showToast("Ready to draft a new event.");
  }

  function update<K extends keyof Editable>(key: K, value: Editable[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function generateSlug() {
    if (!form.title) return;
    const generated = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    update("slug", generated);
    showToast(`Slug updated to "${generated}"`);
  }

  async function saveEvent() {
    setSaving(true);
    try {
      if (!form.title.trim() || !form.slug.trim()) {
        throw new Error("Title and slug are required.");
      }

      const payload = { ...form };
      delete payload.id;

      let savedItem: any = null;

      if (selectedId) {
        // Try direct API route PUT
        const res = await fetch("/api/admin/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedId, ...payload }),
        });

        if (res.ok) {
          const json = await res.json();
          savedItem = json.data;
        } else {
          // Fallback to neon client
          const { data, error: q } = await neon
            .from("events")
            .update(payload)
            .eq("id", selectedId)
            .select();
          if (q) throw q;
          savedItem = (data as any)?.[0];
        }
        showToast("Event changes saved successfully.");
      } else {
        // Direct API route POST
        const res = await fetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          savedItem = json.data;
        } else {
          // Fallback to neon client
          const { data, error: q } = await neon.from("events").insert(payload).select();
          if (q) throw q;
          savedItem = (data as any)?.[0];
        }

        if (savedItem?.id) {
          setSelectedId(savedItem.id);
        }
        showToast("New event published/created.");
      }

      await loadEvents();
    } catch (err: any) {
      showToast(err.message || "Could not save event.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function removeEvent() {
    if (!selectedId || !confirm("Are you sure you want to delete this event permanently?")) return;
    try {
      const res = await fetch(`/api/admin/events?id=${encodeURIComponent(selectedId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const { error: q } = await neon.from("events").delete().eq("id", selectedId);
        if (q) throw q;
      }
      newEvent();
      showToast("Event deleted permanently.");
      await loadEvents();
    } catch (err: any) {
      showToast(err.message || "Could not delete event", "error");
    }
  }

  async function updateApplicationStatus(id: string, status: string, notes?: string) {
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, ...(notes !== undefined ? { admin_notes: notes } : {}) }),
      });

      if (!res.ok) {
        await neon.from("event_applications").update({ status }).eq("id", id);
      }

      setApplications((rows) =>
        rows.map((row) => (row.id === id ? { ...row, status, ...(notes ? { admin_notes: notes } : {}) } : row))
      );
      setAllApplications((rows) =>
        rows.map((row) => (row.id === id ? { ...row, status, ...(notes ? { admin_notes: notes } : {}) } : row))
      );
      if (selectedApplicant?.id === id) {
        setSelectedApplicant((prev) => (prev ? { ...prev, status, ...(notes ? { admin_notes: notes } : {}) } : null));
      }
      showToast(`Applicant status changed to ${status}.`);
    } catch (err: any) {
      showToast(err.message || "Could not update status", "error");
    }
  }

  async function deleteApplication(id: string) {
    if (!confirm("Permanently delete this founder application?")) return;
    try {
      const res = await fetch(`/api/admin/applications?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        await neon.from("event_applications").delete().eq("id", id);
      }
      setApplications((rows) => rows.filter((r) => r.id !== id));
      setAllApplications((rows) => rows.filter((r) => r.id !== id));
      if (selectedApplicant?.id === id) setSelectedApplicant(null);
      showToast("Application deleted.");
    } catch (err: any) {
      showToast(err.message || "Could not delete application", "error");
    }
  }

  async function handleImage(file?: File) {
    if (!file) return;
    try {
      showToast("Compressing and preparing image...");
      const compressed = await compressImage(file);
      update("hero_image_url", compressed);
      showToast("Hero image uploaded & ready to save.");
    } catch (err: any) {
      showToast(err.message || "Failed to process image", "error");
    }
  }

  // Interactive array helpers
  function addListItem(key: "highlights" | "eligibility" | "highlights_de" | "eligibility_de") {
    const current = (form[key] as string[]) || [];
    update(key, [...current, ""]);
  }

  function updateListItem(
    key: "highlights" | "eligibility" | "highlights_de" | "eligibility_de",
    index: number,
    value: string
  ) {
    const current = [...((form[key] as string[]) || [])];
    current[index] = value;
    update(key, current);
  }

  function removeListItem(
    key: "highlights" | "eligibility" | "highlights_de" | "eligibility_de",
    index: number
  ) {
    const current = [...((form[key] as string[]) || [])];
    current.splice(index, 1);
    update(key, current);
  }

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchSearch =
        !eventsSearch ||
        ev.title.toLowerCase().includes(eventsSearch.toLowerCase()) ||
        (ev.city && ev.city.toLowerCase().includes(eventsSearch.toLowerCase()));
      const matchStatus = statusFilter === "all" || ev.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [events, eventsSearch, statusFilter]);

  // Filtered Pipeline Applications
  const filteredPipeline = useMemo(() => {
    return allApplications.filter((app) => {
      const matchEvent = pipelineEventFilter === "all" || app.event_id === pipelineEventFilter;
      const matchStatus = pipelineStatusFilter === "all" || app.status === pipelineStatusFilter;
      const matchSearch =
        !pipelineSearch ||
        `${app.first_name} ${app.last_name}`.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
        app.email.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
        (app.company_name && app.company_name.toLowerCase().includes(pipelineSearch.toLowerCase()));
      return matchEvent && matchStatus && matchSearch;
    });
  }, [allApplications, pipelineEventFilter, pipelineStatusFilter, pipelineSearch]);

  // Metric KPIs
  const totalEventsCount = events.length;
  const publishedEventsCount = events.filter((e) => e.status === "published").length;
  const totalApplicantsCount = allApplications.length;
  const shortlistedApplicantsCount = allApplications.filter(
    (a) => a.status === "shortlisted" || a.status === "accepted" || a.status === "reviewing"
  ).length;

  if (mode === "checking") {
    return (
      <main className="cms">
        <div className="cms-auth-container">
          <div className="cms-auth-box" style={{ textAlign: "center" }}>
            <div className="cms-logo-badge" style={{ margin: "0 auto 1rem" }}>
              A
            </div>
            <h2>Connecting to ABCN Control Center…</h2>
            <p className="cms-hint">Verifying authenticated session and database connection</p>
          </div>
        </div>
      </main>
    );
  }

  if (mode === "signed-out") {
    return (
      <main className="cms">
        <header className="cms-top">
          <div className="cms-brand">
            <span className="cms-logo-badge">A</span>
            <div className="cms-brand-text">
              <h1>ABCN Executive Portal</h1>
              <span>Control Center</span>
            </div>
          </div>
          <Link href="/events" className="cms-btn cms-btn-secondary" style={{ fontSize: "0.78rem" }}>
            View Public Events ↗
          </Link>
        </header>

        <div className="cms-auth-container">
          <div className="cms-auth-box">
            <div className="cms-auth-logo-center">
              <span className="cms-logo-badge" style={{ width: 48, height: 48, fontSize: "1.2rem" }}>
                A
              </span>
              <h2>Admin Authentication</h2>
              <p>Sign in with your administrator credentials to manage events & applications.</p>
            </div>

            <form onSubmit={signIn} className="cms-field" style={{ gap: "1rem" }}>
              <div className="cms-field">
                <label>Name (New accounts only)</label>
                <input
                  type="text"
                  placeholder="e.g. Harmonie Essome"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                />
              </div>

              <div className="cms-field">
                <label>Administrator Email *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@afropeanbusiness.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                />
              </div>

              <div className="cms-field">
                <label>Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="submit" className="cms-btn cms-btn-primary" style={{ flex: 1 }}>
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={signUp}
                  className="cms-btn cms-btn-secondary"
                  style={{ flex: 1 }}
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
        {toast && <div className={`cms-toast ${toast.type}`}>{toast.text}</div>}
      </main>
    );
  }

  if (mode === "needs-admin") {
    return (
      <main className="cms">
        <header className="cms-top">
          <div className="cms-brand">
            <span className="cms-logo-badge">A</span>
            <div className="cms-brand-text">
              <h1>ABCN Executive Portal</h1>
              <span>One-Time Admin Claim</span>
            </div>
          </div>
          <button onClick={signOut} className="cms-btn cms-btn-secondary">
            Sign out
          </button>
        </header>

        <div className="cms-auth-container">
          <div className="cms-auth-box">
            <div className="cms-auth-logo-center">
              <span className="cms-logo-badge">A</span>
              <h2>Elevate to Administrator</h2>
              <p>Your account is authenticated. Enter the setup key to unlock the event control room.</p>
            </div>

            <div className="cms-field" style={{ gap: "1rem" }}>
              <div className="cms-field">
                <label>Setup Key / Token</label>
                <input
                  type="text"
                  placeholder="ABCN2026Admin!"
                  value={claimToken}
                  onChange={(e) => setClaimToken(e.target.value)}
                />
                <span className="cms-hint">Default setup key: ABCN2026Admin!</span>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={claimAdmin} className="cms-btn cms-btn-primary" style={{ flex: 1 }}>
                  Claim Admin Access
                </button>
                <button onClick={signOut} className="cms-btn cms-btn-secondary">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
        {toast && <div className={`cms-toast ${toast.type}`}>{toast.text}</div>}
      </main>
    );
  }

  return (
    <main className="cms">
      {/* ---------------- Top Sticky Header ---------------- */}
      <header className="cms-top">
        <div className="cms-brand">
          <span className="cms-logo-badge">A</span>
          <div className="cms-brand-text">
            <h1>ABCN Executive Control Room</h1>
            <span>Events & Pipeline Intelligence</span>
          </div>
        </div>

        {/* View Tabs Switcher */}
        <div className="cms-nav-tabs">
          <button
            className={`cms-nav-btn ${mainTab === "events" ? "active" : ""}`}
            onClick={() => setMainTab("events")}
          >
            Events Manager
            <span className="cms-counter-pill">{totalEventsCount}</span>
          </button>
          <button
            className={`cms-nav-btn ${mainTab === "pipeline" ? "active" : ""}`}
            onClick={() => setMainTab("pipeline")}
          >
            Founder Pipeline
            <span className="cms-counter-pill">{totalApplicantsCount}</span>
          </button>
        </div>

        {/* Actions & User Badge */}
        <div className="cms-top-actions">
          <div className="cms-user-badge">
            <div className="cms-user-avatar">
              {(currentUser?.name || currentUser?.email || "A").charAt(0).toUpperCase()}
            </div>
            <span>{currentUser?.email || "Admin"}</span>
            <span className="cms-user-role">Admin</span>
          </div>

          <Link href="/events" target="_blank" className="cms-btn cms-btn-secondary">
            Public Site ↗
          </Link>
          <button onClick={signOut} className="cms-btn cms-btn-secondary">
            Sign out
          </button>
        </div>
      </header>

      <div className="cms-wrap">
        {/* ---------------- KPI Stat Cards ---------------- */}
        <div className="cms-kpis">
          <div className="cms-kpi-card">
            <div className="cms-kpi-head">
              <span>Total Events</span>
              <span>All Statuses</span>
            </div>
            <div className="cms-kpi-value">{totalEventsCount}</div>
            <span className="cms-kpi-sub">{publishedEventsCount} currently published & visible</span>
          </div>

          <div className="cms-kpi-card">
            <div className="cms-kpi-head">
              <span>Published Live</span>
              <span className="cms-pill published">Live</span>
            </div>
            <div className="cms-kpi-value" style={{ color: "var(--cms-accent)" }}>
              {publishedEventsCount}
            </div>
            <span className="cms-kpi-sub">Serving public traffic across EN & DE routes</span>
          </div>

          <div className="cms-kpi-card">
            <div className="cms-kpi-head">
              <span>Total Applicants</span>
              <span>Founder Pipeline</span>
            </div>
            <div className="cms-kpi-value">{totalApplicantsCount}</div>
            <span className="cms-kpi-sub">Submissions received across all programmes</span>
          </div>

          <div className="cms-kpi-card">
            <div className="cms-kpi-head">
              <span>Active Candidates</span>
              <span className="cms-pill featured">Pipeline</span>
            </div>
            <div className="cms-kpi-value" style={{ color: "var(--cms-gold)" }}>
              {shortlistedApplicantsCount}
            </div>
            <span className="cms-kpi-sub">In Review, Shortlisted, or Accepted</span>
          </div>
        </div>

        {/* =========================================================================
            VIEW 1: EVENTS MANAGER
            ========================================================================= */}
        {mainTab === "events" && (
          <div className="cms-main-grid">
            {/* Sidebar: Event List */}
            <aside className="cms-sidebar">
              <div className="cms-sidebar-header">
                <h2>Events Index</h2>
                <button onClick={newEvent} className="cms-btn cms-btn-primary" style={{ padding: "6px 12px" }}>
                  + New Event
                </button>
              </div>

              <div className="cms-search-box">
                <input
                  type="text"
                  placeholder="Filter events by title or city…"
                  value={eventsSearch}
                  onChange={(e) => setEventsSearch(e.target.value)}
                />
              </div>

              <div className="cms-filter-pills">
                {["all", "published", "draft", "archived"].map((st) => (
                  <button
                    key={st}
                    className={`cms-filter-btn ${statusFilter === st ? "active" : ""}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>

              <div className="cms-event-cards">
                {filteredEvents.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "var(--cms-text-muted)" }}>
                    No matching events found.
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <article
                      key={event.id || event.slug}
                      onClick={() => selectEvent(event)}
                      className={`cms-event-item ${selectedId === event.id ? "active" : ""}`}
                    >
                      <div className="cms-event-item-head">
                        <h3 className="cms-event-item-title">{event.title}</h3>
                        <span className={`cms-pill ${event.status}`}>{event.status}</span>
                      </div>

                      <div className="cms-event-loc-date">
                        {event.date_label || "Date TBA"} · {event.city || "Venue TBA"}
                      </div>

                      <div className="cms-event-meta-tags">
                        {event.featured && <span className="cms-pill featured">★ Featured</span>}
                        {event.show_on_home && <span className="cms-pill home">Homepage</span>}
                        {event.application_open && (
                          <span className="cms-pill" style={{ background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>
                            Applications Open
                          </span>
                        )}
                        <span style={{ fontSize: "0.7rem", color: "var(--cms-text-muted)" }}>
                          Priority {event.priority}
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </aside>

            {/* Right Pane: Tabbed Event Editor */}
            <section className="cms-editor-canvas">
              {/* Editor Top Bar */}
              <div className="cms-editor-top">
                <div className="cms-editor-title-wrap">
                  <h2>{selectedId ? form.title || "Untitled Event" : "Create New Event"}</h2>
                  <span>/{form.slug || "new-slug"}</span>
                </div>

                <div className="cms-editor-actions">
                  {selectedId && (
                    <a
                      href={`/events/${form.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cms-btn cms-btn-secondary"
                    >
                      View Live ↗
                    </a>
                  )}
                  <button
                    onClick={() => setForm({ ...FIALI_FALLBACK })}
                    className="cms-btn cms-btn-secondary"
                    title="Load verified FIALI template"
                  >
                    Load FIALI Template
                  </button>
                  {selectedId && (
                    <button onClick={removeEvent} className="cms-btn cms-btn-danger">
                      Delete Event
                    </button>
                  )}
                  <button
                    onClick={saveEvent}
                    disabled={saving}
                    className="cms-btn cms-btn-primary"
                  >
                    {saving ? "Saving…" : selectedId ? "Save Changes" : "Publish Event"}
                  </button>
                </div>
              </div>

              {/* Sub-Tabs Navigation */}
              <div className="cms-sub-tabs">
                <button
                  className={`cms-sub-tab ${editorTab === "core" ? "active" : ""}`}
                  onClick={() => setEditorTab("core")}
                >
                  01 Core & Publishing
                </button>
                <button
                  className={`cms-sub-tab ${editorTab === "location" ? "active" : ""}`}
                  onClick={() => setEditorTab("location")}
                >
                  02 Date & Location
                </button>
                <button
                  className={`cms-sub-tab ${editorTab === "content" ? "active" : ""}`}
                  onClick={() => setEditorTab("content")}
                >
                  03 Narrative & Editorial
                </button>
                <button
                  className={`cms-sub-tab ${editorTab === "media" ? "active" : ""}`}
                  onClick={() => setEditorTab("media")}
                >
                  04 Media & Aesthetics
                </button>
                <button
                  className={`cms-sub-tab ${editorTab === "stages" ? "active" : ""}`}
                  onClick={() => setEditorTab("stages")}
                >
                  05 Programme & Grants
                </button>
                <button
                  className={`cms-sub-tab ${editorTab === "german" ? "active" : ""}`}
                  onClick={() => setEditorTab("german")}
                >
                  06 German (DE) Translation
                </button>
                {selectedId && (
                  <button
                    className={`cms-sub-tab ${editorTab === "applicants" ? "active" : ""}`}
                    onClick={() => setEditorTab("applicants")}
                  >
                    07 Applicants ({applications.length})
                  </button>
                )}
              </div>

              {/* Form Body */}
              <div className="cms-form-body">
                {/* TAB 1: CORE & STATUS */}
                {editorTab === "core" && (
                  <div className="cms-form-grid">
                    <div className="cms-field cms-col-full">
                      <label>Event Title *</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => update("title", e.target.value)}
                        placeholder="e.g. Female Innovation Afropean Leadership Initiative"
                      />
                    </div>

                    <div className="cms-field">
                      <label>
                        <span>Slug (URL key) *</span>
                        <button
                          type="button"
                          onClick={generateSlug}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--cms-accent)",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                          }}
                        >
                          Auto-generate from title
                        </button>
                      </label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) =>
                          update(
                            "slug",
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/(^-|-$)/g, "")
                          )
                        }
                        placeholder="fiali-frankfurt-2026"
                      />
                    </div>

                    <div className="cms-field">
                      <label>Eyebrow / Category Tag</label>
                      <input
                        type="text"
                        value={form.eyebrow || ""}
                        onChange={(e) => update("eyebrow", e.target.value)}
                        placeholder="FIALI · FRANKFURT 2026"
                      />
                    </div>

                    <div className="cms-field">
                      <label>Event Type</label>
                      <input
                        type="text"
                        value={form.event_type || ""}
                        onChange={(e) => update("event_type", e.target.value)}
                        placeholder="Flagship Programme / Summit"
                      />
                    </div>

                    <div className="cms-field">
                      <label>Organizer</label>
                      <input
                        type="text"
                        value={form.organizer || ""}
                        onChange={(e) => update("organizer", e.target.value)}
                        placeholder="ABCN · Afropean Business & Culture Network"
                      />
                    </div>

                    <div className="cms-field">
                      <label>Publishing Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => update("status", e.target.value as Editable["status"])}
                      >
                        <option value="draft">Draft (Admin review only)</option>
                        <option value="published">Published (Live to public)</option>
                        <option value="archived">Archived (Hidden from index)</option>
                      </select>
                    </div>

                    <div className="cms-field">
                      <label>Priority Rank</label>
                      <input
                        type="number"
                        value={form.priority}
                        onChange={(e) => update("priority", Number(e.target.value))}
                      />
                      <span className="cms-hint">Higher values appear first on listing pages.</span>
                    </div>

                    <div className="cms-field cms-col-full">
                      <label>External Registration URL (Optional)</label>
                      <input
                        type="text"
                        value={form.registration_url || ""}
                        onChange={(e) => update("registration_url", e.target.value)}
                        placeholder="https://eventbrite.com/... (Leave blank if using internal applications)"
                      />
                    </div>

                    {/* Promotion & Application Toggles */}
                    <div className="cms-col-full" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "1rem" }}>
                      <div className="cms-switch-row">
                        <div className="cms-switch-info">
                          <strong>Featured Event</strong>
                          <span>Prominent badge & highlights</span>
                        </div>
                        <label className="cms-switch-control">
                          <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={(e) => update("featured", e.target.checked)}
                          />
                          <span className="cms-slider" />
                        </label>
                      </div>

                      <div className="cms-switch-row">
                        <div className="cms-switch-info">
                          <strong>Show on Homepage</strong>
                          <span>Highlight in main feed</span>
                        </div>
                        <label className="cms-switch-control">
                          <input
                            type="checkbox"
                            checked={form.show_on_home}
                            onChange={(e) => update("show_on_home", e.target.checked)}
                          />
                          <span className="cms-slider" />
                        </label>
                      </div>

                      <div className="cms-switch-row">
                        <div className="cms-switch-info">
                          <strong>Accept Applications</strong>
                          <span>Enable website wizard form</span>
                        </div>
                        <label className="cms-switch-control">
                          <input
                            type="checkbox"
                            checked={Boolean(form.application_open)}
                            onChange={(e) => update("application_open", e.target.checked)}
                          />
                          <span className="cms-slider" />
                        </label>
                      </div>
                    </div>

                    <div className="cms-field">
                      <label>Application CTA Button Text</label>
                      <input
                        type="text"
                        value={form.application_cta || ""}
                        onChange={(e) => update("application_cta", e.target.value)}
                        placeholder="Apply for FIALI 2026"
                      />
                    </div>

                    <div className="cms-field">
                      <label>Application Deadline / Scarcity Label</label>
                      <input
                        type="text"
                        value={form.application_deadline || ""}
                        onChange={(e) => update("application_deadline", e.target.value)}
                        placeholder="Applications reviewed on a rolling basis · limited places"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: LOCATION & DATES */}
                {editorTab === "location" && (
                  <div className="cms-form-grid">
                    <div className="cms-field cms-col-full">
                      <label>Human Date Display Label</label>
                      <input
                        type="text"
                        value={form.date_label || ""}
                        onChange={(e) => update("date_label", e.target.value)}
                        placeholder="e.g. 14 October 2026 · 18:00 CEST or April – May 2026"
                      />
                      <span className="cms-hint">Formatted text shown in event cards and hero banner.</span>
                    </div>

                    <div className="cms-field">
                      <label>Start Date & Time (ISO/Local)</label>
                      <input
                        type="datetime-local"
                        value={form.start_at ? form.start_at.slice(0, 16) : ""}
                        onChange={(e) =>
                          update(
                            "start_at",
                            e.target.value ? new Date(e.target.value).toISOString() : null
                          )
                        }
                      />
                    </div>

                    <div className="cms-field">
                      <label>End Date & Time (ISO/Local)</label>
                      <input
                        type="datetime-local"
                        value={form.end_at ? form.end_at.slice(0, 16) : ""}
                        onChange={(e) =>
                          update(
                            "end_at",
                            e.target.value ? new Date(e.target.value).toISOString() : null
                          )
                        }
                      />
                    </div>

                    <div className="cms-field">
                      <label>City</label>
                      <input
                        type="text"
                        value={form.city || ""}
                        onChange={(e) => update("city", e.target.value)}
                        placeholder="Frankfurt am Main"
                      />
                    </div>

                    <div className="cms-field">
                      <label>Country</label>
                      <input
                        type="text"
                        value={form.country || ""}
                        onChange={(e) => update("country", e.target.value)}
                        placeholder="Germany"
                      />
                    </div>

                    <div className="cms-field cms-col-full">
                      <label>Venue / Address Details</label>
                      <input
                        type="text"
                        value={form.venue || ""}
                        onChange={(e) => update("venue", e.target.value)}
                        placeholder="e.g. TechQuartier, Platz der Einheit 2, 60327 Frankfurt"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: CONTENT & EDITORIAL */}
                {editorTab === "content" && (
                  <div className="cms-form-grid">
                    <div className="cms-field cms-col-full">
                      <label>Short Description (Card Teaser)</label>
                      <textarea
                        rows={2}
                        value={form.short_description}
                        onChange={(e) => update("short_description", e.target.value)}
                        placeholder="One to two sentences summarizing the event for index cards and meta descriptions."
                      />
                    </div>

                    <div className="cms-field cms-col-full">
                      <label>Main Description</label>
                      <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        placeholder="Overview of the programme, target audience, and goals."
                      />
                    </div>

                    <div className="cms-field cms-col-full">
                      <label>Long Description / Manifesto</label>
                      <textarea
                        rows={6}
                        value={form.long_description || ""}
                        onChange={(e) => update("long_description", e.target.value)}
                        placeholder="Comprehensive details, keynote topics, and founder vision."
                      />
                    </div>

                    {/* Interactive Highlights Builder */}
                    <div className="cms-field cms-col-full">
                      <label>Key Highlights</label>
                      <div className="cms-list-builder">
                        {(form.highlights || []).map((item, idx) => (
                          <div className="cms-list-row" key={idx}>
                            <input
                              type="text"
                              value={item}
                              placeholder="e.g. 10-15 international female founders selected for intensive cohort"
                              onChange={(e) => updateListItem("highlights", idx, e.target.value)}
                            />
                            <button
                              type="button"
                              className="cms-icon-btn"
                              onClick={() => removeListItem("highlights", idx)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="cms-add-row-btn"
                          onClick={() => addListItem("highlights")}
                        >
                          + Add Highlight
                        </button>
                      </div>
                    </div>

                    {/* Interactive Eligibility Builder */}
                    <div className="cms-field cms-col-full">
                      <label>Eligibility & Who Should Apply</label>
                      <div className="cms-list-builder">
                        {(form.eligibility || []).map((item, idx) => (
                          <div className="cms-list-row" key={idx}>
                            <input
                              type="text"
                              value={item}
                              placeholder="e.g. Female founders based in Frankfurt am Main with early-stage venture"
                              onChange={(e) => updateListItem("eligibility", idx, e.target.value)}
                            />
                            <button
                              type="button"
                              className="cms-icon-btn"
                              onClick={() => removeListItem("eligibility", idx)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="cms-add-row-btn"
                          onClick={() => addListItem("eligibility")}
                        >
                          + Add Eligibility Criterion
                        </button>
                      </div>
                    </div>

                    {/* Focus Areas & Benefits */}
                    <div className="cms-field">
                      <label>Focus Areas (Title | Description per line)</label>
                      <textarea
                        rows={4}
                        value={focusText}
                        onChange={(e) => update("focus_areas", cardsFromText(e.target.value))}
                        placeholder="AI & Digitalization | Hands-on workflow optimization&#10;Capital Access | Pitching to German business angels"
                      />
                    </div>

                    <div className="cms-field">
                      <label>Founder Benefits (Title | Description per line)</label>
                      <textarea
                        rows={4}
                        value={benefitsText}
                        onChange={(e) => update("benefits", cardsFromText(e.target.value))}
                        placeholder="€1,000 Micro-Grants | Financial support for cohort ventures&#10;Ecosystem Access | VIP introduction to Frankfurt innovation leaders"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 4: MEDIA & BRANDING */}
                {editorTab === "media" && (
                  <div className="cms-form-grid">
                    <div className="cms-field cms-col-full">
                      <label>Hero Image (Upload or URL)</label>
                      <div className="cms-image-upload-zone" onClick={() => document.getElementById("hero-file")?.click()}>
                        <input
                          id="hero-file"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImage(e.target.files?.[0])}
                        />
                        <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>🖼️</div>
                        <strong>Click or drag to upload a high-resolution hero image</strong>
                        <p className="cms-hint" style={{ marginTop: "4px" }}>
                          Images are automatically compressed client-side before storage.
                        </p>
                      </div>

                      {form.hero_image_url && (
                        <div className="cms-image-preview-box">
                          <img src={form.hero_image_url} alt="Hero banner preview" />
                        </div>
                      )}

                      <div style={{ marginTop: "0.75rem" }}>
                        <label>Or Direct Hero Image URL</label>
                        <input
                          type="text"
                          value={form.hero_image_url || ""}
                          onChange={(e) => update("hero_image_url", e.target.value)}
                          placeholder="/assets/fiali/growth-lab-session.jpg"
                        />
                      </div>
                    </div>

                    <div className="cms-field cms-col-full">
                      <label>Card Thumbnail Image URL</label>
                      <input
                        type="text"
                        value={form.card_image_url || ""}
                        onChange={(e) => update("card_image_url", e.target.value)}
                        placeholder="/assets/fiali/female-founders-summit.jpg"
                      />
                    </div>

                    {/* Brand Palette Customizer */}
                    <div className="cms-field">
                      <label>Brand Accent Color</label>
                      <div className="cms-color-row">
                        <input
                          type="color"
                          className="cms-color-picker-input"
                          value={form.accent_color || "#58AC8C"}
                          onChange={(e) => update("accent_color", e.target.value)}
                        />
                        <input
                          type="text"
                          value={form.accent_color || "#58AC8C"}
                          onChange={(e) => update("accent_color", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="cms-field">
                      <label>Deep Theme Color</label>
                      <div className="cms-color-row">
                        <input
                          type="color"
                          className="cms-color-picker-input"
                          value={form.deep_color || "#0F4C38"}
                          onChange={(e) => update("deep_color", e.target.value)}
                        />
                        <input
                          type="text"
                          value={form.deep_color || "#0F4C38"}
                          onChange={(e) => update("deep_color", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="cms-field cms-col-full">
                      <label>Live Event Card Swatch Preview</label>
                      <div
                        className="cms-brand-swatch-preview"
                        style={{
                          background: `linear-gradient(135deg, ${form.deep_color || "#0F4C38"}, ${
                            form.accent_color || "#58AC8C"
                          })`,
                          color: "#fff",
                        }}
                      >
                        <span>{form.title || "Event Palette Preview"}</span>
                        <span style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                          {form.accent_color} / {form.deep_color}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: PROGRAMME STAGES & GRANTS */}
                {editorTab === "stages" && (
                  <div className="cms-form-grid">
                    <div className="cms-col-full" style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        className="cms-btn cms-btn-secondary"
                        onClick={() => setRawJsonMode(!rawJsonMode)}
                      >
                        {rawJsonMode ? "Switch to Visual Mode" : "Switch to Raw JSON Editor"}
                      </button>
                    </div>

                    <div className="cms-field cms-col-full">
                      <label>Programme Stages ({form.stages?.length || 0} Stages)</label>
                      <textarea
                        rows={8}
                        style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
                        value={stagesText}
                        onChange={(e) => {
                          try {
                            update("stages", JSON.parse(e.target.value) as EventStage[]);
                          } catch {
                            // Syntax error will resolve as user types
                          }
                        }}
                      />
                      <span className="cms-hint">JSON format matching the FIALI two-part programme structure.</span>
                    </div>

                    <div className="cms-field cms-col-full">
                      <label>Grants & Support Package</label>
                      <textarea
                        rows={6}
                        style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
                        value={grantsText}
                        onChange={(e) => {
                          try {
                            update("grants", JSON.parse(e.target.value));
                          } catch {
                            // Syntax error will resolve as user types
                          }
                        }}
                      />
                      <span className="cms-hint">JSON details for micro-grants, travel support, and stipends.</span>
                    </div>

                    <div className="cms-field cms-col-full">
                      <label>Partners (Name | Logo URL | Website)</label>
                      <textarea
                        rows={4}
                        value={partnersText}
                        onChange={(e) => update("partners", partnersFromText(e.target.value))}
                        placeholder="SoftXcloud GmbH | /assets/partners/softxcloud.png | https://softxcloud.net&#10;Mountain Hub | /assets/partners/mountain-hub.png | https://mountainhub.org"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 6: GERMAN LOCALIZATION */}
                {editorTab === "german" && (
                  <div className="cms-form-grid">
                    <div className="cms-col-full" style={{ padding: "12px", background: "rgba(229,184,105,0.08)", border: "1px solid rgba(229,184,105,0.2)", borderRadius: "var(--cms-radius-sm)" }}>
                      <strong style={{ color: "var(--cms-gold)", fontSize: "0.85rem", display: "block" }}>
                        Deutsche Übersetzung / German Localization
                      </strong>
                      <span className="cms-hint">
                        Fields left blank automatically fall back to the primary English values, ensuring robust rendering on /de.
                      </span>
                    </div>

                    <div className="cms-field cms-col-full">
                      <label>Titel (DE)</label>
                      <input
                        type="text"
                        value={form.title_de || ""}
                        onChange={(e) => update("title_de", e.target.value)}
                        placeholder="Female Innovation Afropean Leadership Initiative (FIALI)"
                      />
                    </div>

                    <div className="cms-field">
                      <label>Eyebrow / Rubrik (DE)</label>
                      <input
                        type="text"
                        value={form.eyebrow_de || ""}
                        onChange={(e) => update("eyebrow_de", e.target.value)}
                        placeholder="FIALI · FRANKFURT 2026"
                      />
                    </div>

                    <div className="cms-field">
                      <label>Bewerbungs-Button CTA (DE)</label>
                      <input
                        type="text"
                        value={form.application_cta_de || ""}
                        onChange={(e) => update("application_cta_de", e.target.value)}
                        placeholder="Jetzt für FIALI 2026 bewerben"
                      />
                    </div>

                    <div className="cms-field cms-col-full">
                      <label>Kurzbeschreibung (DE)</label>
                      <textarea
                        rows={2}
                        value={form.short_description_de || ""}
                        onChange={(e) => update("short_description_de", e.target.value)}
                        placeholder="Förderung internationaler Gründerinnen in Frankfurt durch intensive Geschäftsentwicklung..."
                      />
                    </div>

                    <div className="cms-field cms-col-full">
                      <label>Hauptbeschreibung (DE)</label>
                      <textarea
                        rows={4}
                        value={form.description_de || ""}
                        onChange={(e) => update("description_de", e.target.value)}
                        placeholder="Ein zweiteiliges Pilotprogramm, das 10–15 internationale Gründerinnen..."
                      />
                    </div>

                    <div className="cms-field cms-col-full">
                      <label>Ausführliche Beschreibung (DE)</label>
                      <textarea
                        rows={5}
                        value={form.long_description_de || ""}
                        onChange={(e) => update("long_description_de", e.target.value)}
                      />
                    </div>

                    <div className="cms-field">
                      <label>Datumsanzeige (DE)</label>
                      <input
                        type="text"
                        value={form.date_label_de || ""}
                        onChange={(e) => update("date_label_de", e.target.value)}
                        placeholder="April – Mai 2026"
                      />
                    </div>

                    <div className="cms-field">
                      <label>Veranstaltungsort (DE)</label>
                      <input
                        type="text"
                        value={form.venue_de || ""}
                        onChange={(e) => update("venue_de", e.target.value)}
                        placeholder="Frankfurt am Main, Deutschland"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 7: APPLICANTS FOR THIS EVENT */}
                {editorTab === "applicants" && selectedId && (
                  <div className="cms-pipeline-wrap">
                    <div className="cms-pipeline-head">
                      <div>
                        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                          Founder Submissions ({applications.length})
                        </h3>
                        <span className="cms-hint">Candidates registered specifically for this event.</span>
                      </div>
                    </div>

                    {applicationsLoading ? (
                      <div style={{ padding: "3rem", textAlign: "center", color: "var(--cms-text-secondary)" }}>
                        Loading applications…
                      </div>
                    ) : applications.length === 0 ? (
                      <div style={{ padding: "3rem", textAlign: "center", color: "var(--cms-text-muted)" }}>
                        No applications received for this event yet.
                      </div>
                    ) : (
                      <table className="cms-table">
                        <thead>
                          <tr>
                            <th>Founder</th>
                            <th>Venture</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((app) => (
                            <tr key={app.id}>
                              <td>
                                <span className="cms-applicant-name">
                                  {app.first_name} {app.last_name}
                                </span>
                                <span className="cms-applicant-sub">{app.role_title || "Founder"}</span>
                              </td>
                              <td>{app.company_name || "Venture TBA"}</td>
                              <td>{app.email}</td>
                              <td>{new Date(app.submitted_at).toLocaleDateString()}</td>
                              <td>
                                <select
                                  className="cms-status-select"
                                  value={app.status}
                                  onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                                >
                                  <option value="submitted">Submitted</option>
                                  <option value="reviewing">In Review</option>
                                  <option value="shortlisted">Shortlisted</option>
                                  <option value="accepted">Accepted</option>
                                  <option value="declined">Declined</option>
                                </select>
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <button
                                    onClick={() => setSelectedApplicant(app)}
                                    className="cms-btn cms-btn-secondary"
                                    style={{ padding: "4px 8px", fontSize: "0.72rem" }}
                                  >
                                    Review
                                  </button>
                                  <button
                                    onClick={() => deleteApplication(app.id)}
                                    className="cms-btn cms-btn-danger"
                                    style={{ padding: "4px 8px", fontSize: "0.72rem" }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: DEDICATED FOUNDER PIPELINE REVIEW
            ========================================================================= */}
        {mainTab === "pipeline" && (
          <div className="cms-pipeline-wrap">
            <div className="cms-pipeline-head">
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: "1.4rem", fontWeight: 800 }}>
                  Founder Pipeline & Candidate Review
                </h2>
                <span className="cms-hint">
                  Review applicant profiles, motivation letters, venture stages, and advance candidates through the evaluation funnel.
                </span>
              </div>

              <div className="cms-pipeline-controls">
                <input
                  type="text"
                  placeholder="Search founder, venture or email…"
                  value={pipelineSearch}
                  onChange={(e) => setPipelineSearch(e.target.value)}
                  style={{
                    padding: "8px 14px",
                    background: "var(--cms-bg)",
                    border: "1px solid var(--cms-border)",
                    borderRadius: "var(--cms-radius-sm)",
                    color: "#fff",
                    fontSize: "0.85rem",
                  }}
                />

                <select
                  value={pipelineEventFilter}
                  onChange={(e) => setPipelineEventFilter(e.target.value)}
                  className="cms-status-select"
                >
                  <option value="all">All Programmes</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
                    </option>
                  ))}
                </select>

                <select
                  value={pipelineStatusFilter}
                  onChange={(e) => setPipelineStatusFilter(e.target.value)}
                  className="cms-status-select"
                >
                  <option value="all">All Statuses</option>
                  <option value="submitted">Submitted</option>
                  <option value="reviewing">In Review</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
            </div>

            {applicationsLoading ? (
              <div style={{ padding: "4rem", textAlign: "center", color: "var(--cms-text-secondary)" }}>
                Loading founder pipeline…
              </div>
            ) : filteredPipeline.length === 0 ? (
              <div style={{ padding: "4rem", textAlign: "center", color: "var(--cms-text-muted)" }}>
                No candidate applications match the selected filters.
              </div>
            ) : (
              <table className="cms-table">
                <thead>
                  <tr>
                    <th>Founder Candidate</th>
                    <th>Venture & Stage</th>
                    <th>Programme</th>
                    <th>Location</th>
                    <th>Submission Date</th>
                    <th>Review Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPipeline.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <span className="cms-applicant-name">
                          {app.first_name} {app.last_name}
                        </span>
                        <span className="cms-applicant-sub">{app.email}</span>
                      </td>
                      <td>
                        <strong>{app.company_name || "Venture Not Named"}</strong>
                        <span className="cms-applicant-sub" style={{ display: "block" }}>
                          {app.venture_stage || "Stage TBA"}
                        </span>
                      </td>
                      <td>{app.event_title || "General Application"}</td>
                      <td>
                        {app.city || "City TBA"}, {app.country || "Country TBA"}
                      </td>
                      <td>{new Date(app.submitted_at).toLocaleDateString()}</td>
                      <td>
                        <select
                          className="cms-status-select"
                          value={app.status}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        >
                          <option value="submitted">Submitted</option>
                          <option value="reviewing">In Review</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="accepted">Accepted</option>
                          <option value="declined">Declined</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => setSelectedApplicant(app)}
                            className="cms-btn cms-btn-primary"
                            style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                          >
                            Inspect Profile
                          </button>
                          <button
                            onClick={() => deleteApplication(app.id)}
                            className="cms-btn cms-btn-danger"
                            style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ---------------- Candidate Details Drawer / Modal ---------------- */}
        {selectedApplicant && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(6px)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "680px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "var(--cms-surface)",
                border: "1px solid var(--cms-border)",
                borderRadius: "var(--cms-radius-lg)",
                padding: "2rem",
                boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  borderBottom: "1px solid var(--cms-border)",
                  paddingBottom: "1rem",
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>
                    {selectedApplicant.first_name} {selectedApplicant.last_name}
                  </h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--cms-text-secondary)" }}>
                    {selectedApplicant.role_title || "Founder"} · {selectedApplicant.company_name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="cms-icon-btn"
                  style={{ width: "36px", height: "36px" }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <span className="cms-hint">Email</span>
                  <div style={{ fontWeight: 600 }}>{selectedApplicant.email}</div>
                </div>
                <div>
                  <span className="cms-hint">Phone</span>
                  <div style={{ fontWeight: 600 }}>{selectedApplicant.phone || "Not provided"}</div>
                </div>
                <div>
                  <span className="cms-hint">Location</span>
                  <div style={{ fontWeight: 600 }}>
                    {selectedApplicant.city || "City TBA"}, {selectedApplicant.country || "Country TBA"}
                  </div>
                </div>
                <div>
                  <span className="cms-hint">Venture Stage</span>
                  <div style={{ fontWeight: 600 }}>{selectedApplicant.venture_stage || "Not specified"}</div>
                </div>
              </div>

              {selectedApplicant.motivation && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <span className="cms-hint" style={{ display: "block", marginBottom: "4px" }}>
                    Founder Motivation
                  </span>
                  <div
                    style={{
                      background: "rgba(0,0,0,0.25)",
                      padding: "1rem",
                      borderRadius: "var(--cms-radius-sm)",
                      lineHeight: 1.6,
                      fontSize: "0.9rem",
                    }}
                  >
                    {selectedApplicant.motivation}
                  </div>
                </div>
              )}

              {selectedApplicant.ai_interest && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <span className="cms-hint" style={{ display: "block", marginBottom: "4px" }}>
                    AI & Digitalization Interest
                  </span>
                  <div
                    style={{
                      background: "rgba(0,0,0,0.25)",
                      padding: "1rem",
                      borderRadius: "var(--cms-radius-sm)",
                      lineHeight: 1.6,
                      fontSize: "0.9rem",
                    }}
                  >
                    {selectedApplicant.ai_interest}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <span className="cms-hint" style={{ display: "block", marginBottom: "4px" }}>
                  Internal Reviewer Notes
                </span>
                <textarea
                  rows={3}
                  defaultValue={selectedApplicant.admin_notes || ""}
                  placeholder="Private evaluation notes, scoring, or interview feedback…"
                  onBlur={(e) =>
                    updateApplicationStatus(
                      selectedApplicant.id,
                      selectedApplicant.status,
                      e.target.value
                    )
                  }
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="cms-hint">Change Status:</span>
                  <select
                    className="cms-status-select"
                    value={selectedApplicant.status}
                    onChange={(e) => updateApplicationStatus(selectedApplicant.id, e.target.value)}
                  >
                    <option value="submitted">Submitted</option>
                    <option value="reviewing">In Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <button onClick={() => setSelectedApplicant(null)} className="cms-btn cms-btn-primary">
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Status Toast */}
      {toast && <div className={`cms-toast ${toast.type}`}>{toast.text}</div>}
    </main>
  );
}
