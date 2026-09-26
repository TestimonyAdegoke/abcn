import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const CANONICAL_HOST = "www.afropeanbusiness.com";

export default function middleware(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase().replace(/:\d+$/, "");
  const { pathname, search } = request.nextUrl;

  // Skip API routes, Next internal assets, and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 1. Any request coming from a .de domain (e.g. afropeanbusiness.de, afropeanbusinessnetwork.de)
  if (host.endsWith(".de")) {
    if (pathname === "/" || pathname === "") {
      return NextResponse.redirect(
        new URL(`/de${search}`, `https://${CANONICAL_HOST}`),
        308
      );
    }
    if (!pathname.startsWith("/de")) {
      return NextResponse.redirect(
        new URL(`/de${pathname}${search}`, `https://${CANONICAL_HOST}`),
        308
      );
    }
    // Already has /de prefix but came via the .de domain host
    return NextResponse.redirect(
      new URL(`${pathname}${search}`, `https://${CANONICAL_HOST}`),
      308
    );
  }

  // 2. Any other alternate domain (e.g. afropeanbusinessnetwork.com, .store, .global)
  // that points directly to this Vercel deployment instead of the canonical domain
  const isExcludedHost =
    !host ||
    host === CANONICAL_HOST ||
    host === "afropeanbusiness.com" ||
    host === "localhost" ||
    host.endsWith(".vercel.app");

  if (!isExcludedHost) {
    return NextResponse.redirect(
      new URL(`${pathname}${search}`, `https://${CANONICAL_HOST}`),
      308
    );
  }

  return intlMiddleware(request);
}

export const config = {
  // Match the root, any explicitly-prefixed locale path, and every other path
  // that is not a Next internal, an API route or a static file.
  matcher: [
    "/",
    "/(de|en)/:path*",
    "/((?!api|_next|_vercel|assets|.*\\..*).*)",
  ],
};
