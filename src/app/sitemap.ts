import type { MetadataRoute } from "next";
import { products } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://trial-project-bice.vercel.app";
  const staticRoutes = [
    "",
    "/shop",
    "/collections",
    "/lookbook",
    "/editorial",
    "/archive",
    "/about",
    "/contact",
    "/sizing",
    "/checkout",
    "/faq",
    "/shipping",
    "/returns",
    "/terms",
    "/privacy",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/shop" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/shop" ? 0.9 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
