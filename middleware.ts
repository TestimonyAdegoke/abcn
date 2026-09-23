import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match the root, any explicitly-prefixed locale path, and every other path
  // that is not a Next internal, an API route or a static file.
  //
  // NOTE: the dot must be escaped as \\. in this string literal so the regex
  // receives \. — writing \. here collapses to a bare "." and the lookahead
  // then excludes every path except "/", 404ing all unprefixed English routes.
  matcher: [
    "/",
    "/(de|en)/:path*",
    "/((?!api|_next|_vercel|assets|.*\\..*).*)",
  ],
};
