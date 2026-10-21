import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl.replace(/\/$/, "");
  const routes = [
    "", "/calculator", "/vehicle-import", "/vehicles", "/shipping",
    "/how-it-works", "/about", "/privacy-policy", "/terms"
  ];
  return routes.map((route) => ({
    url: baseUrl + route,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
