import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://portavero.com";
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
