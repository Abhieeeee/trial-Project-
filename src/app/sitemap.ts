import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://trial-project-bice.vercel.app";
  const routes = [
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

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/shop" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/shop" ? 0.9 : 0.7,
  }));
}
