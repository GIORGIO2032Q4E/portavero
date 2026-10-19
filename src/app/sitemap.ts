import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\\/$/, "");
  const routes = [
    "", "/calculator", "/vehicle-import", "/shipping",
    "/how-it-works", "/about", "/privacy-policy", "/terms"
  ];
  return routes.map((route) => ({
    url: baseUrl + route,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
