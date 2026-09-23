import path from "path";
import { fileURLToPath } from "url";
import createNextIntlPlugin from "next-intl/plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
// NOTE: the GitHub Pages static-export branch is incompatible with the
// locale middleware (middleware does not run in a static export). The Pages
// workflow is already disabled in favour of Vercel, so this branch is dead
// today; if it is ever revived, locale routing will need prerendered
// /en and /de paths instead of middleware negotiation.
const onGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  outputFileTracingRoot: __dirname,
  ...(onGitHubPages
    ? {
        output: "export",
        basePath: "/abcn",
        assetPrefix: "/abcn/",
        trailingSlash: true,
      }
    : {}),
};

export default withNextIntl(nextConfig);
