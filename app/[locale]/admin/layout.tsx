import type { Metadata } from "next";
import "./admin.css";

/**
 * robots.txt already disallows /admin, but a Disallow only asks a crawler not
 * to fetch the page - it does not stop the URL being indexed if it is linked
 * from somewhere. noindex is the directive that actually keeps the event CMS
 * out of search results.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
