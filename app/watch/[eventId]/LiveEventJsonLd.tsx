import Script from "next/script"

interface Performer {
  name: string
  url?: string
}

interface Organizer {
  name: string
  url?: string
}

interface Location {
  name: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  url?: string
}

interface Offers {
  price: string
  priceCurrency: string
  availability: string
  url: string
  validFrom: string
}

interface LiveEventJsonLdProps {
  name: string
  startDate: string
  endDate: string
  location: Location
  url: string
  description: string
  performers: Performer[]
  organizer: Organizer
  eventStatus: string
  eventAttendanceMode: string
  offers: Offers
}

export function LiveEventJsonLd({
  name,
  startDate,
  endDate,
  location,
  url,
  description,
  performers,
  organizer,
  eventStatus,
  eventAttendanceMode,
  offers,
}: LiveEventJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    startDate,
    endDate,
    eventStatus: `https://schema.org/${eventStatus}`,
    eventAttendanceMode: `https://schema.org/${eventAttendanceMode}`,
    location: {
      "@type": "VirtualLocation",
      name: location.name,
      url,
    },
    image: ["https://iili.io/2Z4aqL7.webp"],
    description,
    performer: performers.map((performer) => ({
      "@type": "SportsTeam",
      name: performer.name,
      ...(performer.url && { url: performer.url }),
    })),
    organizer: {
      "@type": "Organization",
      name: organizer.name,
      ...(organizer.url && { url: organizer.url }),
    },
    offers: {
      "@type": "Offer",
      price: offers.price,
      priceCurrency: offers.priceCurrency,
      availability: `https://schema.org/${offers.availability}`,
      url: offers.url,
      validFrom: offers.validFrom,
    },
    isAccessibleForFree: true,
    video: {
      "@type": "VideoObject",
      name,
      description,
      uploadDate: startDate,
      thumbnailUrl: "https://iili.io/2Z4aqL7.webp",
      contentUrl: url,
      embedUrl: url,
    },
  }

  return (
    <Script
      id="live-event-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
