/**
 * Factual inventory of what the application actually does with personal data.
 *
 * Everything here is verifiable from the codebase rather than being a legal
 * judgement: the cookies the site really sets, the fields the application form
 * really submits, and the services a visitor's browser really contacts. The
 * privacy notice renders both language versions from this one source, so the
 * German and English texts cannot describe different systems.
 *
 * KEEP IN SYNC. If you add a cookie, a form field or a third-party request,
 * add it here in the same change - the notice is only accurate because these
 * lists are.
 *
 * Legal conclusions (lawful basis, retention periods, the controller's
 * identity, the competent authority) deliberately stay in legalPlaceholders:
 * those are decisions for ABCN and its lawyer, not facts about the code.
 */

export type Bilingual = { en: string; de: string };

/** A cookie or storage item the site sets, and why. */
export type StorageItem = {
  name: string;
  category: "necessary" | "analytics" | "marketing";
  purpose: Bilingual;
  duration: Bilingual;
  /** Who sets it and where it is readable. */
  party: Bilingual;
};

/**
 * The complete list. The site sets no localStorage or sessionStorage at all,
 * and no third-party cookies, because it loads no third-party scripts.
 */
export const STORAGE_INVENTORY: StorageItem[] = [
  {
    name: "abcn_consent",
    category: "necessary",
    purpose: {
      en: "Stores your privacy choices (whether statistics and marketing technologies may load) together with the time and version of the decision, so you are not asked again on every page.",
      de: "Speichert Ihre Datenschutz-Auswahl (ob Statistik- und Marketing-Technologien geladen werden dürfen) samt Zeitpunkt und Version der Entscheidung, damit Sie nicht auf jeder Seite erneut gefragt werden.",
    },
    duration: { en: "180 days", de: "180 Tage" },
    party: { en: "First-party, set by this website", de: "Erstanbieter, von dieser Website gesetzt" },
  },
  {
    name: "NEXT_LOCALE",
    category: "necessary",
    purpose: {
      en: "Remembers whether you chose the German or English version of the site.",
      de: "Merkt sich, ob Sie die deutsche oder englische Version der Website gewählt haben.",
    },
    duration: { en: "1 year", de: "1 Jahr" },
    party: { en: "First-party, set by this website", de: "Erstanbieter, von dieser Website gesetzt" },
  },
  {
    name: "Session cookies (CMS login)",
    category: "necessary",
    purpose: {
      en: "Keeps an authorised ABCN administrator signed in to the event CMS. Set only after an administrator signs in at /admin; ordinary visitors never receive these.",
      de: "Hält autorisierte ABCN-Administratorinnen und -Administratoren im Veranstaltungs-CMS angemeldet. Wird nur nach einer Anmeldung unter /admin gesetzt; normale Besucherinnen und Besucher erhalten diese nicht.",
    },
    duration: { en: "Session / until sign-out", de: "Sitzung / bis zur Abmeldung" },
    party: { en: "Set by the authentication service (Neon)", de: "Vom Authentifizierungsdienst (Neon) gesetzt" },
  },
];

/** A field the FIALI / event application form submits. */
export type ApplicationField = {
  label: Bilingual;
  required: boolean;
};

/**
 * Exactly what components/MultiStepApplication.tsx writes to the
 * event_applications table. Nothing is collected that is not listed here.
 */
export const APPLICATION_FIELDS: ApplicationField[] = [
  { required: true, label: { en: "First name", de: "Vorname" } },
  { required: true, label: { en: "Last name", de: "Nachname" } },
  { required: true, label: { en: "Role / job title", de: "Rolle / Position" } },
  { required: true, label: { en: "Email address", de: "E-Mail-Adresse" } },
  { required: true, label: { en: "Company or venture name", de: "Unternehmens- oder Projektname" } },
  { required: true, label: { en: "Sector / business model", de: "Branche / Geschäftsmodell" } },
  { required: true, label: { en: "Motivation for applying (free text)", de: "Motivation für die Bewerbung (Freitext)" } },
  { required: true, label: { en: "Confirmation that this privacy notice has been read", de: "Bestätigung, dass diese Datenschutzhinweise gelesen wurden" } },
  { required: false, label: { en: "Country", de: "Land" } },
  { required: false, label: { en: "Phone number", de: "Telefonnummer" } },
  { required: false, label: { en: "Company website", de: "Unternehmenswebsite" } },
  { required: false, label: { en: "Venture stage", de: "Entwicklungsphase des Unternehmens" } },
  { required: false, label: { en: "Interest in AI and digitalisation (free text)", de: "Interesse an KI und Digitalisierung (Freitext)" } },
  { required: false, label: { en: "Interest in the startup innovation grant", de: "Interesse am Startup-Innovationszuschuss" } },
];

/**
 * Administrators additionally record a processing status and internal notes
 * against an application while reviewing it.
 */
export const APPLICATION_ADMIN_FIELDS: Bilingual = {
  en: "Application status (e.g. submitted, under review) and internal administrator notes, plus the time of submission.",
  de: "Bearbeitungsstatus der Bewerbung (z. B. eingereicht, in Prüfung) und interne Notizen der Administration sowie der Zeitpunkt der Einreichung.",
};

/** A service that processes data on ABCN's behalf. */
export type Processor = {
  name: string;
  role: Bilingual;
  /** Where the service is configured to run, as set in this repository. */
  region: Bilingual;
  privacyUrl: string;
};

export const PROCESSORS: Processor[] = [
  {
    name: "Vercel",
    role: {
      en: "Hosting, content delivery and server-side rendering of the website. Processes technical access data such as IP address, time of request, requested URL and browser information.",
      de: "Hosting, Auslieferung der Inhalte und serverseitiges Rendering der Website. Verarbeitet technische Zugriffsdaten wie IP-Adresse, Zeitpunkt der Anfrage, angeforderte URL und Browserinformationen.",
    },
    region: {
      en: "Server functions are pinned to Frankfurt (fra1); static content is delivered from the nearest European edge location.",
      de: "Serverfunktionen sind auf Frankfurt (fra1) festgelegt; statische Inhalte werden vom nächstgelegenen europäischen Edge-Standort ausgeliefert.",
    },
    privacyUrl: "https://vercel.com/legal/privacy-policy",
  },
  {
    name: "Neon",
    role: {
      en: "Managed database for event content and event applications, and authentication for the administration area.",
      de: "Verwaltete Datenbank für Veranstaltungsinhalte und Bewerbungen sowie Authentifizierung für den Administrationsbereich.",
    },
    region: {
      en: "The database project runs in AWS eu-central-1 (Frankfurt, Germany).",
      de: "Das Datenbankprojekt läuft in AWS eu-central-1 (Frankfurt am Main, Deutschland).",
    },
    privacyUrl: "https://neon.com/privacy-policy",
  },
];

/**
 * Third-party requests the browser makes. Stating this precisely matters:
 * event content and application submissions go from the visitor's browser
 * straight to the database API, so that service receives the visitor's IP
 * address even though it is not a tracking service.
 */
export const DIRECT_BROWSER_CONNECTIONS: Bilingual = {
  en: "Event listings and application submissions are sent from your browser directly to the database interface operated by Neon in Frankfurt. That service therefore receives your IP address and the technical details of the request. No other external service is contacted while you browse this site.",
  de: "Veranstaltungsübersichten und Bewerbungen werden von Ihrem Browser direkt an die von Neon in Frankfurt betriebene Datenbankschnittstelle übermittelt. Dieser Dienst erhält dadurch Ihre IP-Adresse und die technischen Angaben der Anfrage. Weitere externe Dienste werden beim Besuch dieser Website nicht kontaktiert.",
};

/**
 * Things the site deliberately does NOT do. Each line is verifiable: there are
 * no analytics or marketing scripts in the codebase, fonts are bundled and
 * served from this domain rather than fetched from Google Fonts, and social
 * links are plain outbound links rather than embeds.
 */
export const NO_TRACKING_FACTS: Bilingual[] = [
  {
    en: "No web analytics, tag manager or tracking pixel is installed - neither Google Analytics, nor Google Tag Manager, nor Meta Pixel, nor any comparable service.",
    de: "Es sind keine Webanalyse, kein Tag-Manager und kein Tracking-Pixel eingebunden - weder Google Analytics noch Google Tag Manager, Meta-Pixel oder vergleichbare Dienste.",
  },
  {
    en: "Fonts are delivered from this website's own domain. No connection is made to Google Fonts or any other font network, so no data is transferred to such a provider when a page loads.",
    de: "Schriftarten werden von der eigenen Domain dieser Website ausgeliefert. Es besteht keine Verbindung zu Google Fonts oder einem anderen Schriftnetzwerk, sodass beim Seitenaufruf keine Daten an einen solchen Anbieter übertragen werden.",
  },
  {
    en: "Images are optimised and served by this website itself, not by an external image service.",
    de: "Bilder werden von dieser Website selbst optimiert und ausgeliefert, nicht von einem externen Bilddienst.",
  },
  {
    en: "There are no embedded maps, videos or social media feeds. Links to Instagram are ordinary links; nothing is loaded from those platforms unless you click through, after which that platform's own privacy policy applies.",
    de: "Es sind keine Karten, Videos oder Social-Media-Feeds eingebettet. Links zu Instagram sind gewöhnliche Links; von diesen Plattformen wird nichts geladen, solange Sie sie nicht anklicken - danach gilt die Datenschutzerklärung der jeweiligen Plattform.",
  },
  {
    en: "The site stores nothing in your browser's local storage, and sets no third-party cookies.",
    de: "Die Website speichert nichts im Local Storage Ihres Browsers und setzt keine Cookies von Drittanbietern.",
  },
];

/** Technical and organisational measures that are actually configured. */
export const SECURITY_MEASURES: Bilingual[] = [
  {
    en: "All traffic is served over an encrypted HTTPS connection. HTTP Strict Transport Security instructs browsers to use encryption for every future visit as well.",
    de: "Der gesamte Datenverkehr wird über eine verschlüsselte HTTPS-Verbindung ausgeliefert. HTTP Strict Transport Security weist Browser an, auch bei jedem künftigen Besuch zu verschlüsseln.",
  },
  {
    en: "Protective response headers are set against content-type sniffing and embedding of the site in foreign frames, and access to camera, microphone and location is switched off.",
    de: "Schützende Response-Header sind gegen Content-Type-Sniffing und das Einbetten der Seite in fremde Frames gesetzt; Zugriffe auf Kamera, Mikrofon und Standort sind abgeschaltet.",
  },
  {
    en: "Referrer information sent to other websites is reduced to the bare domain.",
    de: "An andere Websites übermittelte Referrer-Informationen werden auf die reine Domain reduziert.",
  },
  {
    en: "The administration area requires an individual login and an explicitly granted administrator role, and is excluded from search engine indexing.",
    de: "Der Administrationsbereich erfordert eine individuelle Anmeldung und eine ausdrücklich vergebene Administratorrolle und ist von der Indexierung durch Suchmaschinen ausgenommen.",
  },
  {
    en: "Application data is not readable from the public website; it is only accessible to signed-in administrators.",
    de: "Bewerbungsdaten sind über die öffentliche Website nicht abrufbar; sie sind ausschließlich für angemeldete Administratorinnen und Administratoren zugänglich.",
  },
];
