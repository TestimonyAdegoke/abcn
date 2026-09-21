import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
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

export default nextConfig;
