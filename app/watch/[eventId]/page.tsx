import type { Metadata, ResolvingMetadata } from "next"
import EventPageClient from "./EventPageClient"
import { LiveEventJsonLd } from "./LiveEventJsonLd"

type Props = {
  params: { eventId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  // Extract event details from the URL
  const eventId = params.eventId
  const eventName = decodeURIComponent((searchParams.name as string) || "Sports Event")
  const sportType = (searchParams.sport as string) || "unknown"
  const league = (searchParams.league as string) || "Unknown League"

  return {
    title: `${eventName} Live Stream | Watch Online Free | Sportsurge`,
    description: `Watch ${eventName} live stream online for free. High-quality HD streaming of ${league} ${sportType} events.`,
    keywords: `${eventName}, live stream, watch online, free streaming, ${sportType}, ${league}, sports streaming`,
    openGraph: {
      title: `${eventName} Live Stream | Watch Online Free | Sportsurge`,
      description: `Watch ${eventName} live stream online for free. High-quality HD streaming of ${league} ${sportType} events.`,
      type: "video.other",
      url: `https://www.sportsurge.uno/watch/${eventId}?name=${encodeURIComponent(eventName)}&sport=${sportType}&league=${encodeURIComponent(league)}`,
      siteName: "Sportsurge",
      images: [
        {
          url: `https://iili.io/2Z4aqL7.webp`,
          width: 1200,
          height: 630,
          alt: `${eventName} Live Stream`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${eventName} Live Stream | Watch Online Free`,
      description: `Watch ${eventName} live stream online for free. High-quality HD streaming of ${league} ${sportType} events.`,
      images: [`https://iili.io/2Z4aqL7.webp`],
    },
    alternates: {
      canonical: `https://www.sportsurge.uno/watch/${eventId}?name=${encodeURIComponent(eventName)}&sport=${sportType}&league=${encodeURIComponent(league)}`,
    },
  }
}

// This function generates static paths for common events
// This helps with SEO as these pages will be pre-rendered
export async function generateStaticParams() {
  // In a real app, you would fetch popular events from your API
  // For now, we'll return an empty array
  return []
}

export default function EventPage(props: Props) {
  const { params, searchParams } = props
  const eventId = params.eventId
  const eventName = decodeURIComponent((searchParams.name as string) || "Sports Event")
  const sportType = (searchParams.sport as string) || "unknown"
  const league = (searchParams.league as string) || "Unknown League"

  // Get the current date and time for the event
  const eventDate = new Date()
  const endDate = new Date(eventDate)
  endDate.setHours(endDate.getHours() + 3) // Assume events last 3 hours

  return (
    <>
      <LiveEventJsonLd
        name={`${eventName} Live Stream`}
        startDate={eventDate.toISOString()}
        endDate={endDate.toISOString()}
        location={{
          name: "Sportsurge Online",
          address: {
            streetAddress: "",
            addressLocality: "",
            addressRegion: "",
            postalCode: "",
            addressCountry: "",
          },
        }}
        url={`https://www.sportsurge.uno/watch/${eventId}?name=${encodeURIComponent(eventName)}&sport=${sportType}&league=${encodeURIComponent(league)}`}
        description={`Watch ${eventName} live stream online for free. High-quality HD streaming of ${league} ${sportType} events.`}
        performers={[
          {
            name: eventName.split(" vs ")[0] || eventName,
          },
          {
            name: eventName.split(" vs ")[1] || "",
          },
        ]}
        organizer={{
          name: league,
          url: `https://www.sportsurge.uno/sports/${sportType}`,
        }}
        eventStatus="EventScheduled"
        eventAttendanceMode="OnlineEventAttendanceMode"
        offers={{
          price: "0",
          priceCurrency: "USD",
          availability: "InStock",
          url: `https://www.sportsurge.uno/watch/${eventId}?name=${encodeURIComponent(eventName)}&sport=${sportType}&league=${encodeURIComponent(league)}`,
          validFrom: new Date(eventDate.getTime() - 86400000).toISOString(), // 1 day before
        }}
      />
      <EventPageClient {...props} />
    </>
  )
}
