import type { MetadataRoute } from "next"

// This function generates a robots.txt file for the site
// It helps search engines understand which pages to crawl and index
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/"],
    },
    sitemap: "https://www.sportsurge.uno/sitemap.xml",
  }
}
