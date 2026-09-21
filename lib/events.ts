export type EventStage = {
  stage: string;
  title: string;
  description: string;
  items: string[];
};

export type EventPartner = {
  name: string;
  logo?: string;
  website?: string;
};

export type EventGrant = {
  count?: number;
  amount_each?: string;
  title?: string;
  description?: string;
};

export type EventContentCard = {
  title: string;
  description: string;
};

export type EventRecord = {
  id?: string;
  slug: string;
  title: string;
  eyebrow?: string | null;
  short_description: string;
  description: string;
  long_description?: string | null;
  city?: string | null;
  country?: string | null;
  venue?: string | null;
  date_label?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  status: "draft" | "published" | "archived";
  event_type?: string | null;
  organizer?: string | null;
  hero_image_url?: string | null;
  card_image_url?: string | null;
  registration_url?: string | null;
  featured: boolean;
  priority: number;
  show_on_home: boolean;
  theme?: string | null;
  accent_color?: string | null;
  deep_color?: string | null;
  light_color?: string | null;
  highlights: string[];
  stages: EventStage[];
  eligibility: string[];
  partners: EventPartner[];
  grants: EventGrant;
  gallery: string[];
  application_open?: boolean;
  application_deadline?: string | null;
  application_cta?: string | null;
  focus_areas: EventContentCard[];
  benefits: EventContentCard[];
};

export const FIALI_FALLBACK: EventRecord = {
  slug: "fiali-frankfurt-2026",
  title: "Female Innovation Afropean Leadership Initiative",
  eyebrow: "FIALI · FRANKFURT 2026",
  short_description:
    "Empowering international female founders in Frankfurt through intensive business development, AI and digitalization, mentorship, matchmaking and ecosystem access.",
  description:
    "A two-event pilot programme bringing together 10-15 international female founders from Frankfurt am Main to strengthen business models and connect directly with the city's business and innovation ecosystem.",
  long_description:
    "FIALI is designed to highlight entrepreneurial potential, build stronger ventures through hands-on workshops and expert support, and create concrete connections to corporates, investors, business angels and strategic partners. The programme is led by Harmonie Essome and centres Afropean leadership, inclusive innovation and international female entrepreneurship.",
  city: "Frankfurt am Main",
  country: "Germany",
  venue: null,
  date_label: "Frankfurt · 2026 · Dates to be announced",
  start_at: null,
  end_at: null,
  status: "published",
  event_type: "Founder programme",
  organizer: "ABCN · led by Harmonie Essome",
  hero_image_url: "/assets/fiali/female-founders-summit.jpg",
  card_image_url: "/assets/fiali/female-founder-workshop.jpg",
  registration_url: null,
  featured: true,
  priority: 100,
  show_on_home: true,
  theme: "fiali",
  accent_color: "#58AC8C",
  deep_color: "#0F4C38",
  light_color: "#F0F5F3",
  highlights: [
    "10-15 international female founders",
    "Two-stage pilot programme",
    "AI & digitalization",
    "90-day growth planning",
    "Founder pitches & matchmaking",
    "Corporate, investor & business angel access",
  ],
  stages: [
    {
      stage: "Stage 1",
      title: "Female Innovation Growth Lab",
      description:
        "A full-day intensive workshop supported by an external AI expert and startup specialist. Each participant builds an individual 90-day growth plan.",
      items: [
        "Business Model Development",
        "Leadership & Positioning",
        "AI & Digitalization",
        "Go-to-Market Strategy",
        "Individual 90-Day Growth Plan",
      ],
    },
    {
      stage: "Stage 2",
      title: "Female Founder Business Networking Summit",
      description:
        "An exclusive evening ecosystem summit connecting cohort founders directly with Frankfurt corporates, investors, business angels, and institutional innovators.",
      items: [
        "Founder Pitches",
        "Business Matchmaking",
        "Expert Keynotes",
        "AI & Innovation Showcases",
      ],
    },
  ],
  eligibility: [
    "International female founders in Frankfurt and Rhine-Main",
    "African / Afropean diaspora background strongly welcome",
    "Innovative or scalable business model",
    "High interest in AI and digitalization",
    "Growth potential within Frankfurt",
  ],
  partners: [
    { name: "ABCN (Afropean Business & Culture Network)", logo: "/assets/fiali/logos/abcn.png" },
    { name: "DIVOC Rising", logo: "/assets/fiali/logos/divoc-rising.png" },
    { name: "Kompass Frankfurt", logo: "/assets/fiali/logos/kompass-frankfurt.png" },
    { name: "Black Women in Tech DACH", logo: "/assets/fiali/logos/black-women-in-tech-dach.png" },
    { name: "EquiNet", logo: "/assets/fiali/logos/equinet.png" },
    { name: "Flourish & Prosper", logo: "/assets/fiali/logos/flourish-prosper.png" },
  ],
  grants: {
    count: 2,
    amount_each: "€500",
    title: "Startup Innovation Grants",
    description:
      "Two grants of €500 each support early-stage founders developing digital or technical solutions, including prototyping, product development, branding, market entry, initial marketing and sales, and eligible incorporation expenses.",
  },
  gallery: [
    "/assets/fiali/female-founders-summit.jpg",
    "/assets/fiali/growth-lab-session.jpg",
    "/assets/fiali/female-founder-workshop.jpg",
    "/assets/fiali/female-founder-vision.jpg",
    "/assets/abcn/collaborators.png",
    "/assets/abcn/harmonie-essome.png",
  ],
  application_open: true,
  application_deadline: "Applications reviewed on a rolling basis · limited cohort of 10-15 founders",
  application_cta: "Apply for FIALI",
  focus_areas: [
    { title: "Business Model Development", description: "Sharpen the model, value proposition and commercial logic behind the venture." },
    { title: "Leadership & Positioning", description: "Strengthen founder positioning, leadership presence and strategic narrative." },
    { title: "AI & Digitalization", description: "Turn AI and digital tools into practical leverage for execution and growth." },
    { title: "Go-to-Market Strategy", description: "Build a clearer route to customers, partnerships and market traction." },
  ],
  benefits: [
    { title: "A 90-day growth plan", description: "Leave the Growth Lab with a practical individual roadmap for the next stage of your business." },
    { title: "Expert founder support", description: "Work through business, positioning, digitalization and growth questions with specialist input." },
    { title: "Frankfurt ecosystem access", description: "Build direct connections with corporates, investors, business angels and strategic partners." },
    { title: "Founder visibility", description: "Pitch, present and position your venture in front of people who can open relevant doors." },
    { title: "AI that is useful now", description: "Explore concrete ways to apply AI and digital tools to your operating model and growth." },
    { title: "Innovation grant opportunity", description: "Eligible early-stage founders can be considered for one of two €500 Startup Innovation Grants." },
  ],
};

export function normaliseEvent(row: Partial<EventRecord>): EventRecord {
  return {
    ...FIALI_FALLBACK,
    ...row,
    slug: row.slug || FIALI_FALLBACK.slug,
    title: row.title || FIALI_FALLBACK.title,
    short_description: row.short_description || "",
    description: row.description || "",
    status: row.status || "draft",
    featured: Boolean(row.featured),
    priority: Number(row.priority || 0),
    show_on_home: Boolean(row.show_on_home),
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    stages: Array.isArray(row.stages) ? row.stages : [],
    eligibility: Array.isArray(row.eligibility) ? row.eligibility : [],
    partners: Array.isArray(row.partners) ? row.partners : [],
    grants: row.grants && typeof row.grants === "object" ? row.grants : {},
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    application_open: Boolean(row.application_open),
    application_deadline: row.application_deadline || null,
    application_cta: row.application_cta || "Apply now",
    focus_areas: Array.isArray(row.focus_areas) ? row.focus_areas : [],
    benefits: Array.isArray(row.benefits) ? row.benefits : [],
  };
}
