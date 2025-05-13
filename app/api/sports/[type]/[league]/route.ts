import { type NextRequest, NextResponse } from "next/server"

// Helper function to format date as YYYYMMDD
function getFormattedDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}${month}${day}`
}

// Replace the fetchESPNData function with this improved version that handles rate limiting
async function fetchESPNData(sportType: string, leagueName: string) {
  const formattedDate = getFormattedDate()
  const url = `https://site.api.espn.com/apis/site/v2/sports/${sportType}/${leagueName}/scoreboard?dates=${formattedDate}`

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

// Map of sport types and leagues to their ESPN API endpoints
const leagueEndpoints: Record<string, Record<string, string>> = {
  soccer: {
    "premier-league": "ENG.1",
    "la-liga": "ESP.1",
    "serie-a": "ITA.1",
    bundesliga: "GER.1",
    "ligue-1": "FRA.1",
    "champions-league": "UEFA.CHAMPIONS",
    "europa-league": "UEFA.EUROPA",
    mls: "USA.1",
  },
  basketball: {
    nba: "nba",
    wnba: "wnba",
  },
  baseball: {
    mlb: "mlb",
  },
  hockey: {
    nhl: "nhl",
  },
  football: {
    nfl: "nfl",
    college: "college-football",
  },
  mma: {
    ufc: "ufc",
    pfl: "pfl",
  },
  racing: {
    f1: "f1",
    indycar: "irl",
  },
  golf: {
    pga: "pga",
    lpga: "lpga",
    champions: "champions-tour",
    liv: "liv",
  },
}

export async function GET(request: NextRequest, { params }: { params: { type: string; league: string } }) {
  try {
    const { type: sportType, league: leagueSlug } = params

    // Check if the requested sport type is supported
    if (!leagueEndpoints[sportType]) {
      return NextResponse.json({ success: false, error: `Sport type '${sportType}' not supported` }, { status: 400 })
    }

    // Check if the requested league is supported for this sport type
    if (!leagueEndpoints[sportType][leagueSlug]) {
      return NextResponse.json(
        { success: false, error: `League '${leagueSlug}' not supported for sport type '${sportType}'` },
        { status: 400 },
      )
    }

    const leagueName = leagueEndpoints[sportType][leagueSlug]

    // Fetch data for the requested league
    const data = await fetchESPNData(sportType, leagueName)
    const processedData = processESPNData(data, sportType)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      sportType,
      league: {
        slug: leagueSlug,
        name: leagueName,
        fullName: data?.leagues?.[0]?.name || leagueName,
      },
      events: processedData,
    })
  } catch (error) {
    console.error(`Error in ${params.type}/${params.league} sports API:`, error)
    return NextResponse.json({ success: false, error: "Failed to fetch sports data" }, { status: 500 })
  }
}
