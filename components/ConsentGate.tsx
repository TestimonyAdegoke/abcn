"use client";

import { useEffect, useState } from "react";
import {
  hasConsent,
  onConsentChange,
  type ConsentCategory,
} from "@/lib/consent";

/**
 * Reactive read of the current decision for one category.
 * Always false on the server and on the first client render, so nothing can be
 * loaded during hydration before the stored decision has been read.
 */
export function useConsent(category: ConsentCategory): boolean {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    setGranted(hasConsent(category));
    return onConsentChange(() => setGranted(hasConsent(category)));
  }, [category]);

  return granted;
}

/**
 * Wrapper for anything that may only run after an opt-in: analytics snippets,
 * Google Maps, YouTube/Vimeo embeds, marketing pixels.
 *
 * Children are not rendered - so their scripts are never requested and no
 * third-party cookie or IP transfer occurs - until consent is granted, and they
 * unmount again the moment it is withdrawn.
 *
 *   <ConsentGate category="analytics">
 *     <Script src="https://..." />
 *   </ConsentGate>
 */
export default function ConsentGate({
  category,
  children,
  fallback = null,
}: {
  category: Exclude<ConsentCategory, "necessary">;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return useConsent(category) ? <>{children}</> : <>{fallback}</>;
}
