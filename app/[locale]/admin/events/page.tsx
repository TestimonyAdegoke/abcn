"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { neon } from "@/lib/neon";
import { EventRecord, EventStage, EventPartner, FIALI_FALLBACK, normaliseEvent } from "@/lib/events";

type Mode = "checking" | "signed-out" | "needs-admin" | "admin";
type Editable = EventRecord & { id?: string };
type ApplicationRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name?: string | null;
  venture_stage?: string | null;
  motivation?: string | null;
  status: string;
  submitted_at: string;
  admin_notes?: string | null;
};

const blankEvent = (): Editable => ({
  slug: "",
  title: "",
  eyebrow: "",
  short_description: "",
  description: "",
  long_description: "",
  city: "",
  country: "",
  venue: "",
  date_label: "",
  start_at: null,
  end_at: null,
  status: "draft",
  event_type: "",
  organizer: "ABCN",
  hero_image_url: "",
  card_image_url: "",
  registration_url: "",
  featured: false,
  priority: 0,
  show_on_home: false,
  theme: "",
  accent_color: "#5F8FC0",
  deep_color: "#0B2A4A",
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
  eligibility_de: [],
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

const lines = (value: string) => value.split("\n").map((v) => v.trim()).filter(Boolean);
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
  const out = canvas.toDataURL("image/jpeg", .82);
  if (out.length > 1_700_000) throw new Error("Image is still too large. Please use an image under about 1.2 MB.");
  return out;
}

export default function EventsAdminPage() {
  const [mode, setMode] = useState<Mode>("checking");
  const [events, setEvents] = useState<Editable[]>([]);
  const [form, setForm] = useState<Editable>(blankEvent());
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [claimToken, setClaimToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  const stagesText = useMemo(() => JSON.stringify(form.stages || [], null, 2), [form.stages]);
  const grantsText = useMemo(() => JSON.stringify(form.grants || {}, null, 2), [form.grants]);
  const partnersText = useMemo(() => (form.partners || []).map((p) => [p.name, p.logo || "", p.website || ""].join(" | ")).join("\n"), [form.partners]);
  const focusText = useMemo(() => (form.focus_areas || []).map((p) => [p.title, p.description].join(" | ")).join("\n"), [form.focus_areas]);
  const benefitsText = useMemo(() => (form.benefits || []).map((p) => [p.title, p.description].join(" | ")).join("\n"), [form.benefits]);

  async function refreshSession() {
    const { data } = await neon.auth.getSession();
    const user = (data as any)?.user || (data as any)?.session?.user;
    if (!user) { setMode("signed-out"); return; }
    const role = String(user.role || "");
    if (role.includes("admin")) {
      setMode("admin");
      await loadEvents();
    } else setMode("needs-admin");
  }

  async function loadEvents() {
    const { data, error: queryError } = await neon.from("events").select("*").order("priority", { ascending: false });
    if (queryError) { setError(queryError.message); return; }
    const rows = (data || []).map((row) => normaliseEvent(row as Partial<EventRecord>));
    setEvents(rows);
  }

  useEffect(() => { refreshSession().catch(() => setMode("signed-out")); }, []);

  async function signIn(e: FormEvent) {
    e.preventDefault(); setError(""); setMessage("");
    const { error: authError } = await neon.auth.signIn.email({ email: authForm.email, password: authForm.password });
    if (authError) { setError(authError.message || "Could not sign in."); return; }
    await refreshSession();
  }

  async function signUp() {
    setError(""); setMessage("");
    const { error: authError } = await neon.auth.signUp.email({ name: authForm.name || "ABCN Admin", email: authForm.email, password: authForm.password });
    if (authError) { setError(authError.message || "Could not create account."); return; }
    setMessage("Account created. If you are not signed in automatically, use Sign in.");
    await refreshSession();
  }

  async function claimAdmin() {
    setError(""); setMessage("");
    const { data, error: rpcError } = await neon.rpc("claim_cms_admin", { p_token: claimToken });
    if (rpcError || !data) { setError(rpcError?.message || "That setup token is invalid or has already been used."); return; }
    setMessage("Administrator access granted. Sign out and sign back in once so your refreshed session carries the admin role.");
  }

  async function signOut() {
    await neon.auth.signOut();
    setMode("signed-out"); setEvents([]); setForm(blankEvent());
  }

  async function loadApplications(eventId?: string) {
    if (!eventId) { setApplications([]); return; }
    setApplicationsLoading(true);
    const { data, error: q } = await neon.from("event_applications").select("*").eq("event_id", eventId).order("submitted_at", { ascending: false });
    if (q) setError(q.message);
    else setApplications((data || []) as ApplicationRow[]);
    setApplicationsLoading(false);
  }

  function selectEvent(event: Editable) {
    setSelectedId(event.id); setForm({ ...event }); setError(""); setMessage("");
    loadApplications(event.id);
  }

  function newEvent() {
    setSelectedId(undefined); setForm(blankEvent()); setApplications([]); setError(""); setMessage("");
  }

  function update<K extends keyof Editable>(key: K, value: Editable[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveEvent() {
    setSaving(true); setError(""); setMessage("");
    try {
      if (!form.title.trim() || !form.slug.trim()) throw new Error("Title and slug are required.");
      const payload = { ...form };
      delete payload.id;
      if (selectedId) {
        const { error: q } = await neon.from("events").update(payload).eq("id", selectedId).select();
        if (q) throw q;
        setMessage("Event updated.");
      } else {
        const { data, error: q } = await neon.from("events").insert(payload).select();
        if (q) throw q;
        const created = (data as any)?.[0];
        if (created?.id) setSelectedId(created.id);
        setMessage("Event created.");
      }
      await loadEvents();
    } catch (err: any) { setError(err.message || "Could not save event."); }
    finally { setSaving(false); }
  }

  async function removeEvent() {
    if (!selectedId || !confirm("Delete this event permanently?")) return;
    const { error: q } = await neon.from("events").delete().eq("id", selectedId);
    if (q) { setError(q.message); return; }
    newEvent(); setMessage("Event deleted."); await loadEvents();
  }

  async function updateApplicationStatus(id: string, status: string) {
    const { error: q } = await neon.from("event_applications").update({ status }).eq("id", id);
    if (q) { setError(q.message); return; }
    setApplications((rows) => rows.map((row) => row.id === id ? { ...row, status } : row));
  }

  async function deleteApplication(id: string) {
    if (!confirm("Delete this application permanently?")) return;
    const { error: q } = await neon.from("event_applications").delete().eq("id", id);
    if (q) { setError(q.message); return; }
    setApplications((rows) => rows.filter((row) => row.id !== id));
  }

  async function handleImage(file?: File) {
    if (!file) return;
    try { update("hero_image_url", await compressImage(file)); }
    catch (err: any) { setError(err.message); }
  }

  if (mode === "checking") return <main className="cms"><div className="cms-auth">Checking CMS session…</div></main>;

  if (mode === "signed-out") return (
    <main className="cms">
      <header className="cms-top"><strong>ABCN / CMS</strong><span>Events administration</span></header>
      <section className="cms-auth">
        <h1>Events CMS</h1>
        <p className="cms-sub">Sign in to manage ABCN events. The one-time administrator setup flow is available after authentication.</p>
        {message && <div className="cms-status">{message}</div>}
        {error && <div className="cms-status cms-error">{error}</div>}
        <form onSubmit={signIn} className="cms-formgrid">
          <label className="cms-full">Name <input value={authForm.name} onChange={(e)=>setAuthForm({...authForm,name:e.target.value})} placeholder="Only needed when creating an account" /></label>
          <label className="cms-full">Email <input type="email" required value={authForm.email} onChange={(e)=>setAuthForm({...authForm,email:e.target.value})} /></label>
          <label className="cms-full">Password <input type="password" required minLength={8} value={authForm.password} onChange={(e)=>setAuthForm({...authForm,password:e.target.value})} /></label>
          <div className="cms-actions cms-full"><button type="submit">Sign in</button><button type="button" className="secondary" onClick={signUp}>Create account</button><Link href="/events">View events</Link></div>
        </form>
      </section>
    </main>
  );

  if (mode === "needs-admin") return (
    <main className="cms">
      <header className="cms-top"><strong>ABCN / CMS</strong><span>One-time administrator setup</span></header>
      <section className="cms-auth">
        <h1>Claim CMS access</h1>
        <p className="cms-sub">Your account is authenticated but does not yet have the administrator role. Enter the one-time setup token.</p>
        {message && <div className="cms-status">{message}</div>}
        {error && <div className="cms-status cms-error">{error}</div>}
        <label>Administrator setup token<input value={claimToken} onChange={(e)=>setClaimToken(e.target.value)} /></label>
        <div className="cms-actions"><button onClick={claimAdmin}>Claim administrator</button><button className="secondary" onClick={signOut}>Sign out</button></div>
      </section>
    </main>
  );

  return (
    <main className="cms">
      <header className="cms-top"><strong>ABCN / CMS</strong><span>Events · full CRUD</span></header>
      <div className="cms-wrap">
        <div className="cms-head">
          <div><h1>Event control room.</h1><p className="cms-sub">Create, edit, publish, feature, prioritize and remove events. Featured homepage content is controlled independently from publication status.</p></div>
          <div className="cms-actions"><Link href="/events">Public events ↗</Link><button className="secondary" onClick={signOut}>Sign out</button></div>
        </div>
        {message && <div className="cms-status">{message}</div>}
        {error && <div className="cms-status cms-error">{error}</div>}

        <div className="cms-grid">
          <aside className="cms-list">
            <div className="cms-listhead"><strong>Events</strong><button onClick={newEvent}>+ New</button></div>
            {events.map((event) => (
              <div key={event.id || event.slug} onClick={()=>selectEvent(event)} className={"cms-event " + (selectedId===event.id?"active":"")}>
                <strong>{event.title}</strong>
                <div className="cms-eventmeta">
                  <span className={"cms-pill " + event.status}>{event.status}</span>
                  {event.featured && <span className="cms-pill">featured</span>}
                  {event.show_on_home && <span className="cms-pill">homepage</span>}
                  <span>priority {event.priority}</span>
                </div>
              </div>
            ))}
          </aside>

          <section className="cms-editor">
            <h2>{selectedId ? "Edit event" : "Create event"}</h2>
            <div className="cms-formgrid">
              <label>Title<input value={form.title} onChange={(e)=>update("title",e.target.value)} /></label>
              <label>Slug<input value={form.slug} onChange={(e)=>update("slug",e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""))} /></label>
              <label>Eyebrow / label<input value={form.eyebrow || ""} onChange={(e)=>update("eyebrow",e.target.value)} /></label>
              <label>Event type<input value={form.event_type || ""} onChange={(e)=>update("event_type",e.target.value)} /></label>
              <label className="cms-full">Short description<textarea value={form.short_description} onChange={(e)=>update("short_description",e.target.value)} /></label>
              <label className="cms-full">Description<textarea value={form.description} onChange={(e)=>update("description",e.target.value)} /></label>
              <label className="cms-full">Long description<textarea value={form.long_description || ""} onChange={(e)=>update("long_description",e.target.value)} /></label>
              <label>City<input value={form.city || ""} onChange={(e)=>update("city",e.target.value)} /></label>
              <label>Country<input value={form.country || ""} onChange={(e)=>update("country",e.target.value)} /></label>
              <label>Venue<input value={form.venue || ""} onChange={(e)=>update("venue",e.target.value)} /></label>
              <label>Date display<input value={form.date_label || ""} onChange={(e)=>update("date_label",e.target.value)} placeholder="e.g. 14 October 2026 · 18:00" /></label>
              <label>Start date/time<input type="datetime-local" value={form.start_at ? form.start_at.slice(0,16) : ""} onChange={(e)=>update("start_at",e.target.value ? new Date(e.target.value).toISOString() : null)} /></label>
              <label>End date/time<input type="datetime-local" value={form.end_at ? form.end_at.slice(0,16) : ""} onChange={(e)=>update("end_at",e.target.value ? new Date(e.target.value).toISOString() : null)} /></label>
              <label>Organizer<input value={form.organizer || ""} onChange={(e)=>update("organizer",e.target.value)} /></label>
              <label>Registration URL<input value={form.registration_url || ""} onChange={(e)=>update("registration_url",e.target.value)} /></label>
              <label>Status<select value={form.status} onChange={(e)=>update("status",e.target.value as Editable["status"])}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
              <label>Priority<input type="number" value={form.priority} onChange={(e)=>update("priority",Number(e.target.value))} /><span className="cms-help">Higher values appear first.</span></label>
              <label className="cms-toggle"><input type="checkbox" checked={form.featured} onChange={(e)=>update("featured",e.target.checked)} /> Featured event</label>
              <label className="cms-toggle"><input type="checkbox" checked={form.show_on_home} onChange={(e)=>update("show_on_home",e.target.checked)} /> Promote on homepage</label>
              <label className="cms-toggle"><input type="checkbox" checked={Boolean(form.application_open)} onChange={(e)=>update("application_open",e.target.checked)} /> Accept applications on site</label>
              <label>Application CTA<input value={form.application_cta || ""} onChange={(e)=>update("application_cta",e.target.value)} placeholder="Apply now" /></label>
              <label className="cms-full">Application timing / scarcity message<input value={form.application_deadline || ""} onChange={(e)=>update("application_deadline",e.target.value)} placeholder="Applications reviewed on a rolling basis · limited places" /></label>


              <div className="cms-divider cms-full" />
              <div className="cms-full cms-section-head">
                <strong>Deutsche Übersetzung / German translation</strong>
                <span className="cms-help">
                  Optional, and per field. Anything left blank falls back to the
                  English value above, so a partly translated event still works
                  on /de. Requires db/001_event_german_columns.sql to have been run.
                </span>
              </div>
              <label>Titel (DE)<input value={form.title_de || ""} onChange={(e)=>update("title_de",e.target.value)} /></label>
              <label>Eyebrow / Label (DE)<input value={form.eyebrow_de || ""} onChange={(e)=>update("eyebrow_de",e.target.value)} /></label>
              <label className="cms-full">Kurzbeschreibung (DE)<textarea value={form.short_description_de || ""} onChange={(e)=>update("short_description_de",e.target.value)} /></label>
              <label className="cms-full">Beschreibung (DE)<textarea value={form.description_de || ""} onChange={(e)=>update("description_de",e.target.value)} /></label>
              <label className="cms-full">Ausführliche Beschreibung (DE)<textarea value={form.long_description_de || ""} onChange={(e)=>update("long_description_de",e.target.value)} /></label>
              <label>Datumsanzeige (DE)<input value={form.date_label_de || ""} onChange={(e)=>update("date_label_de",e.target.value)} /></label>
              <label>Veranstaltungsort (DE)<input value={form.venue_de || ""} onChange={(e)=>update("venue_de",e.target.value)} /></label>
              <label>Bewerbungs-Button (DE)<input value={form.application_cta_de || ""} onChange={(e)=>update("application_cta_de",e.target.value)} placeholder="Jetzt bewerben" /></label>
              <label className="cms-full">Bewerbungshinweis (DE)<input value={form.application_deadline_de || ""} onChange={(e)=>update("application_deadline_de",e.target.value)} /></label>
              <label className="cms-full">Highlights (DE) - eine pro Zeile<textarea value={(form.highlights_de || []).join("\n")} onChange={(e)=>update("highlights_de",lines(e.target.value))} /></label>
              <label className="cms-full">Teilnahmekriterien (DE) - eine pro Zeile<textarea value={(form.eligibility_de || []).join("\n")} onChange={(e)=>update("eligibility_de",lines(e.target.value))} /></label>
              <div className="cms-divider cms-full" />
              <label className="cms-full">Hero image URL<input value={form.hero_image_url || ""} onChange={(e)=>update("hero_image_url",e.target.value)} /><span className="cms-help">Use a URL, or upload an image below. Uploaded images are compressed and stored with the event.</span></label>
              <label className="cms-full">Upload hero image<input type="file" accept="image/*" onChange={(e)=>handleImage(e.target.files?.[0])} /></label>
              {form.hero_image_url && <div className="cms-preview cms-full"><img src={form.hero_image_url} alt="" /><span>Current hero image</span></div>}
              <label className="cms-full">Card image URL<input value={form.card_image_url || ""} onChange={(e)=>update("card_image_url",e.target.value)} /></label>

              <div className="cms-divider cms-full" />
              <label>Accent colour<input type="color" value={form.accent_color || "#5F8FC0"} onChange={(e)=>update("accent_color",e.target.value)} /></label>
              <label>Deep colour<input type="color" value={form.deep_color || "#0B2A4A"} onChange={(e)=>update("deep_color",e.target.value)} /></label>
              <label className="cms-full">Highlights - one per line<textarea value={(form.highlights || []).join("\n")} onChange={(e)=>update("highlights",lines(e.target.value))} /></label>
              <label className="cms-full">Focus areas - Title | Description<textarea value={focusText} onChange={(e)=>update("focus_areas",cardsFromText(e.target.value))} /></label>
              <label className="cms-full">Benefits / Why join - Title | Description<textarea value={benefitsText} onChange={(e)=>update("benefits",cardsFromText(e.target.value))} /></label>
              <label className="cms-full">Eligibility - one per line<textarea value={(form.eligibility || []).join("\n")} onChange={(e)=>update("eligibility",lines(e.target.value))} /></label>
              <label className="cms-full">Partners - Name | Logo URL | Website<textarea value={partnersText} onChange={(e)=>update("partners",partnersFromText(e.target.value))} /></label>
              <label className="cms-full">Programme stages - JSON<textarea style={{minHeight:220}} value={stagesText} onChange={(e)=>{try{update("stages",JSON.parse(e.target.value) as EventStage[]);setError("")}catch{setError("Stages JSON is not valid yet.")}}} /></label>
              <label className="cms-full">Grant / support - JSON<textarea value={grantsText} onChange={(e)=>{try{update("grants",JSON.parse(e.target.value));setError("")}catch{setError("Grant JSON is not valid yet.")}}} /></label>
            </div>
            <div className="cms-actions"><button onClick={saveEvent} disabled={saving}>{saving ? "Saving…" : selectedId ? "Save changes" : "Create event"}</button>{selectedId && <button className="danger" onClick={removeEvent}>Delete event</button>}<button className="secondary" onClick={()=>setForm({...FIALI_FALLBACK})}>Load FIALI template</button></div>

            {selectedId && (
              <div className="cms-applications">
                <div className="cms-applications-head">
                  <div><span>APPLICATIONS</span><h2>Founder pipeline</h2></div>
                  <strong>{applications.length}</strong>
                </div>
                {applicationsLoading ? <p className="cms-sub">Loading applications…</p> : applications.length === 0 ? (
                  <div className="cms-empty">No applications received yet.</div>
                ) : (
                  <div className="cms-application-list">
                    {applications.map((application) => (
                      <article className="cms-application" key={application.id}>
                        <div className="cms-application-main">
                          <div>
                            <strong>{application.first_name} {application.last_name}</strong>
                            <span>{application.company_name || "Venture not named"} · {application.email}</span>
                          </div>
                          <span className={"cms-pill app-" + application.status}>{application.status}</span>
                        </div>
                        {application.motivation && <p>{application.motivation}</p>}
                        <div className="cms-application-actions">
                          <select value={application.status} onChange={(e)=>updateApplicationStatus(application.id,e.target.value)}>
                            <option value="submitted">Submitted</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="accepted">Accepted</option>
                            <option value="declined">Declined</option>
                            <option value="withdrawn">Withdrawn</option>
                          </select>
                          <button className="danger" onClick={()=>deleteApplication(application.id)}>Delete</button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
