import type { MetadataRoute } from "next"

// This function generates a sitemap for the site
// It helps search engines discover and index your pages
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL for the site
  const baseUrl = "https://www.sportsurge.uno"

  // Current date for lastModified
  const now = new Date()

  // Static routes
  const routes = [
    "",
    "/sports",
    "/sports/soccer",
    "/sports/basketball",
    "/sports/baseball",
    "/sports/hockey",
    "/sports/football",
    "/sports/mma",
    "/sports/racing",
    "/sports/golf",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // In a real application, you would fetch dynamic event data here
  // and generate URLs for each event
  // For example:
  /*
  const events = await fetchEvents()
  const eventUrls = events.map(event => ({
    url: `${baseUrl}/watch/${event.id}?name=${encodeURIComponent(event.name)}&sport=${event.sportType}&league=${encodeURIComponent(event.league)}`,
    lastModified: new Date(event.date),
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  }))
  
  return [...routes, ...eventUrls]
  */

  return routes
}
