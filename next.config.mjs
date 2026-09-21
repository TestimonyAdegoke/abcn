/** @type {import('next').NextConfig} */
const onGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
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
