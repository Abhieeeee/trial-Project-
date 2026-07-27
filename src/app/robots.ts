import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/super-admin/", "/api/"],
    },
    sitemap: "https://trial-project-bice.vercel.app/sitemap.xml",
  };
}
