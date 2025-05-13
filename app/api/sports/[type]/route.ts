import { type NextRequest, NextResponse } from "next/server"

// Helper function to format date as YYYYMMDD
function getFormattedDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}${month}${day}`
}

// Improved fetchESPNData function with better error handling
async function fetchESPNData(sportType: string, leagueName: string) {
  const formattedDate = getFormattedDate()
  // For MMA and racing, we don't need to specify a date as they have fewer events
  const url =
    sportType === "mma" || sportType === "racing"
      ? `https://site.api.espn.com/apis/site/v2/sports/${sportType}/${leagueName}/scoreboard`
      : `https://site.api.espn.com/apis/site/v2/sports/${sportType}/${leagueName}/scoreboard?dates=${formattedDate}`

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    // Check for rate limiting or other errors
    if (response.status === 429) {
      console.warn(`Rate limited when fetching ${leagueName} data. Will return empty data.`)
      return { events: [] }
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${leagueName}: ${response.status}`)
    }

    // Check if the response is valid JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(`Non-JSON response for ${leagueName}. Will return empty data.`)
      return { events: [] }
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${leagueName} data:`, error)
    // Return a valid empty data structure instead of null
    return { events: [] }
  }
}

// Process ESPN data into a standardized format
function processESPNData(data: any, sportType: string) {
  if (!data || !data.events) {
    return []
  }

  return data.events.map((event: any) => {
    const eventDate = new Date(event.date)
    const leagueAbbreviation = data.leagues?.[0]?.abbreviation || sportType

    let status = "scheduled"
    let statusText = "Scheduled"
    let timeDisplay = eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    if (event.status.type.state === "in") {
      status = "live"
      statusText = "Live"
      timeDisplay = "LIVE NOW!"
    } else if (event.status.type.state === "post") {
      status = "finished"
      statusText = "Finished"
      timeDisplay = "Full Time"
    }

    let competitors = []
    let scores = []

    if (sportType === "mma" || sportType === "racing" || sportType === "golf") {
      // For non-team sports
      return {
        id: event.id,
        name: event.name,
        shortName: event.shortName || event.name,
        league: leagueAbbreviation,
        date: event.date,
        status,
        statusText,
        timeDisplay,
        link: `https://www.sportsurge.uno/#${encodeURIComponent(event.name)}`,
        sportType,
      }
    } else {
      // For team sports
      if (event.competitions && event.competitions[0] && event.competitions[0].competitors) {
        competitors = event.competitions[0].competitors.map((competitor: any) => ({
          id: competitor.id,
          name: competitor.team.displayName,
          shortName: competitor.team.shortDisplayName,
          score: competitor.score,
        }))

        scores = event.competitions[0].competitors.map((competitor: any) =>
          competitor.score !== undefined ? Number.parseInt(competitor.score) : null,
        )
      }

      return {
        id: event.id,
        name: event.name,
        shortName: event.shortName || event.name,
        league: leagueAbbreviation,
        date: event.date,
        status,
        statusText,
        timeDisplay,
        competitors,
        scores,
        link: `https://www.sportsurge.uno/#${encodeURIComponent(competitors.map((c: any) => c.shortName).join(" vs "))}`,
        sportType,
      }
    }
  })
}

// Update the sportEndpoints to include more leagues for MMA and racing
const sportEndpoints: Record<string, { type: string; leagues: string[] }> = {
  soccer: {
    type: "soccer",
    leagues: ["ESP.1", "ENG.1", "ITA.1", "GER.1"],
  },
  basketball: {
    type: "basketball",
    leagues: ["nba"],
  },
  baseball: {
    type: "baseball",
    leagues: ["mlb"],
  },
  hockey: {
    type: "hockey",
    leagues: ["nhl"],
  },
  football: {
    type: "football",
    leagues: ["nfl"],
  },
  mma: {
    type: "mma",
    leagues: ["ufc", "pfl", "bellator"],
  },
  racing: {
    type: "racing",
    leagues: ["f1", "irl", "nascar"],
  },
  golf: {
    type: "golf",
    leagues: ["pga"],
  },
}

// Update the GET function to add delay between requests
export async function GET(request: NextRequest, { params }: { params: { type: string } }) {
  try {
    const sportType = params.type

    // Check if the requested sport type is supported
    if (!sportEndpoints[sportType]) {
      return NextResponse.json({ success: false, error: `Sport type '${sportType}' not supported` }, { status: 400 })
    }

    const { type, leagues } = sportEndpoints[sportType]

    // Add delay between requests to avoid rate limiting
    const fetchWithDelay = async (league: string, index: number) => {
      // Add a delay of 500ms between requests
      await new Promise((resolve) => setTimeout(resolve, index * 500))
      const data = await fetchESPNData(type, league)
      return { league, data: processESPNData(data, type) }
    }

    // Fetch data for all leagues of the requested sport type with delay
    const promises = leagues.map((league, index) => fetchWithDelay(league, index))
    const results = await Promise.all(promises)

    // Combine all events from different leagues
    const allEvents = results.flatMap((result) => result.data)

    // Group events by league
    const eventsByLeague: Record<string, any[]> = {}

    results.forEach((result) => {
      if (result.data.length > 0) {
        eventsByLeague[result.league] = result.data
      }
    })

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      sportType,
      events: allEvents,
      eventsByLeague,
    })
  } catch (error) {
    console.error(`Error in ${params.type} sports API:`, error)
    return NextResponse.json({ success: false, error: "Failed to fetch sports data" }, { status: 500 })
  }
}
