/**
 * Consent state for §25 TTDSG / GDPR Art. 6(1)(a).
 *
 * Rules this module exists to enforce:
 *  - Nothing beyond strictly necessary storage runs before an explicit opt-in.
 *    Consumers must gate on hasConsent(category); never read the raw cookie.
 *  - Silence is not consent. An absent or unreadable record means "denied" for
 *    every optional category, so a visitor who ignores the banner is treated as
 *    having refused.
 *  - The decision is recorded with a timestamp and a policy version, which is
 *    the accountability evidence Art. 7(1) requires.
 *  - Withdrawal must be as easy as consent, so the record is rewritable at any
 *    time from the footer and every subscriber re-evaluates immediately.
 */

export const CONSENT_COOKIE = "abcn_consent";

/**
 * Bump when the categories or the purposes behind them change. An older
 * version re-opens the banner rather than silently reusing a decision the
 * visitor made about a different set of purposes.
 */
export const CONSENT_VERSION = 1;

/**
 * German supervisory authorities expect consent to be re-obtained at sensible
 * intervals rather than stored indefinitely; six months is the common practice.
 */
const MAX_AGE_DAYS = 180;

export type ConsentCategory = "necessary" | "analytics" | "marketing";

/** Categories the visitor can decide about. "necessary" is not one of them. */
export const OPTIONAL_CATEGORIES: Exclude<ConsentCategory, "necessary">[] = [
  "analytics",
  "marketing",
];

export type ConsentState = {
  version: number;
  /** ISO timestamp of the decision - accountability evidence under Art. 7(1). */
  decidedAt: string;
  analytics: boolean;
  marketing: boolean;
};

export const DENY_ALL: Omit<ConsentState, "version" | "decidedAt"> = {
  analytics: false,
  marketing: false,
};

export const ALLOW_ALL: Omit<ConsentState, "version" | "decidedAt"> = {
  analytics: true,
  marketing: true,
};

const CHANGE_EVENT = "abcn:consent-change";

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function readCookie(name: string): string | null {
  if (!isBrowser()) return null;
  for (const part of document.cookie.split("; ")) {
    const separator = part.indexOf("=");
    if (separator > 0 && part.slice(0, separator) === name) {
      return decodeURIComponent(part.slice(separator + 1));
    }
  }
  return null;
}

/**
 * Reads the stored decision. Returns null when there is none, when it is
 * malformed, when it has expired, or when it predates the current version -
 * every one of those cases must re-ask rather than assume.
 */
export function readConsent(): ConsentState | null {
  const raw = readCookie(CONSENT_COOKIE);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (typeof parsed.decidedAt !== "string") return null;

    const age = Date.now() - new Date(parsed.decidedAt).getTime();
    if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_DAYS * 86_400_000) return null;

    return {
      version: CONSENT_VERSION,
      decidedAt: parsed.decidedAt,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    };
  } catch {
    return null;
  }
}

/** Records a decision and notifies every gate on the page. */
export function writeConsent(choice: Omit<ConsentState, "version" | "decidedAt">): ConsentState {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    analytics: choice.analytics === true,
    marketing: choice.marketing === true,
  };

  if (isBrowser()) {
    const value = encodeURIComponent(JSON.stringify(state));
    // First-party, SameSite=Lax, no third party can read it. Secure everywhere
    // except local http development, where the browser would drop it.
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${MAX_AGE_DAYS * 86_400}; SameSite=Lax${secure}`;

    window.dispatchEvent(new CustomEvent<ConsentState>(CHANGE_EVENT, { detail: state }));
  }

  return state;
}

/** Erases the decision, returning the visitor to the pre-consent state. */
export function clearConsent() {
  if (!isBrowser()) return;
  document.cookie = `${CONSENT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent<ConsentState | null>(CHANGE_EVENT, { detail: null }));
}

/** True only when the visitor actively opted in to that category. */
export function hasConsent(category: ConsentCategory): boolean {
  if (category === "necessary") return true;
  const state = readConsent();
  return state ? state[category] === true : false;
}

/** Subscribe to decisions made anywhere on the page. Returns an unsubscribe. */
export function onConsentChange(listener: (state: ConsentState | null) => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = (event: Event) => listener((event as CustomEvent<ConsentState | null>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

/** Event name the footer and banner use to re-open the preferences dialog. */
export const OPEN_PREFERENCES_EVENT = "open-cookies";

export function openConsentPreferences() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
}
