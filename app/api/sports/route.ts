import { NextResponse } from "next/server"

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

// Function to fetch data from 365scores API with improved error handling
async function fetch365ScoresData(competitionId: string) {
  const url = `https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=${competitionId}`

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (response.status === 429) {
      console.warn(`Rate limited when fetching competition ${competitionId} data. Will return empty data.`)
      return { games: [], competitions: [{ name: "Unknown" }] }
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch data for competition ${competitionId}: ${response.status}`)
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(`Non-JSON response for competition ${competitionId}. Will return empty data.`)
      return { games: [], competitions: [{ name: "Unknown" }] }
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching competition ${competitionId} data:`, error)
    return { games: [], competitions: [{ name: "Unknown" }] }
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

// Process 365Scores data into a standardized format
function process365ScoresData(data: any) {
  if (!data || !data.games) {
    return []
  }

  const leagueName = data.competitions?.[0]?.name || "Unknown League"

  return data.games.map((game: any) => {
    const eventDate = new Date(game.startTime)

    let status = "scheduled"
    const statusText = game.statusText || "Scheduled"
    let timeDisplay = eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    if (
      statusText !== "Scheduled" &&
      statusText !== "Ended" &&
      statusText !== "WalkOver" &&
      statusText !== "Postponed" &&
      statusText !== "Final" &&
      statusText !== "Final (OT)" &&
      statusText !== "After Penalties" &&
      statusText !== "Final (SO)" &&
      statusText !== "Final (Ex)" &&
      statusText !== "Abandoned"
    ) {
      status = "live"
      timeDisplay = "LIVE NOW!"
    } else if (
      statusText === "Ended" ||
      statusText === "Final" ||
      statusText === "Final (OT)" ||
      statusText === "After Penalties" ||
      statusText === "Final (SO)" ||
      statusText === "Final (Ex)"
    ) {
      status = "finished"
      timeDisplay = "Full Time"
    }

    const homeTeam = {
      id: game.homeCompetitor.id,
      name: game.homeCompetitor.name,
      shortName: game.homeCompetitor.name,
      score: game.homeCompetitor.score,
    }

    const awayTeam = {
      id: game.awayCompetitor.id,
      name: game.awayCompetitor.name,
      shortName: game.awayCompetitor.name,
      score: game.awayCompetitor.score,
    }

    return {
      id: game.id,
      name: `${homeTeam.name} vs ${awayTeam.name}`,
      shortName: `${homeTeam.name} vs ${awayTeam.name}`,
      league: leagueName,
      date: game.startTime,
      status,
      statusText,
      timeDisplay,
      competitors: [homeTeam, awayTeam],
      scores: [homeTeam.score, awayTeam.score],
      link: `https://www.sportsurge.uno/#${encodeURIComponent(homeTeam.name + " vs " + awayTeam.name)}`,
      sportType: "soccer", // Default to soccer for 365Scores
    }
  })
}

// Update the GET function to implement rate limiting
export async function GET() {
  try {
    // Define the leagues to fetch from ESPN - reduce the number to avoid rate limiting
    const espnLeagues = [
      { type: "soccer", name: "ESP.1", id: "laliga" },
      { type: "soccer", name: "ENG.1", id: "premier-league" },
      { type: "basketball", name: "nba", id: "nba" },
      { type: "baseball", name: "mlb", id: "mlb" },
      { type: "hockey", name: "nhl", id: "nhl" },
      { type: "football", name: "nfl", id: "nfl" },
    ]

    // Define the competitions to fetch from 365Scores - reduce the number to avoid rate limiting
    const scores365Competitions = [
      { id: "7", name: "premierleague" },
      { id: "103", name: "nba" },
    ]

    // Add delay between requests to avoid rate limiting
    const fetchESPNWithDelay = async (league: any, index: number) => {
      // Add a delay of 500ms between requests
      await new Promise((resolve) => setTimeout(resolve, index * 500))
      const data = await fetchESPNData(league.type, league.name)
      return {
        source: "espn",
        type: league.type,
        id: league.id,
        data: processESPNData(data, league.type),
      }
    }

    const fetch365WithDelay = async (comp: any, index: number) => {
      // Add a delay of 500ms between requests
      await new Promise((resolve) => setTimeout(resolve, index * 500))
      const data = await fetch365ScoresData(comp.id)
      return {
        source: "365scores",
        id: comp.name,
        data: process365ScoresData(data),
      }
    }

    // Fetch data from ESPN with delay
    const espnPromises = espnLeagues.map((league, index) => fetchESPNWithDelay(league, index))

    // Fetch data from 365Scores with delay
    const scores365Promises = scores365Competitions.map((comp, index) => fetch365WithDelay(comp, index))

    // Wait for all promises to resolve
    const results = await Promise.all([...espnPromises, ...scores365Promises])

    // Organize the data by sport type
    const organizedData: Record<string, any[]> = {}

    results.forEach((result) => {
      if (!result.data || result.data.length === 0) return

      const sportType = result.type || (result.source === "365scores" ? "soccer" : "other")

      if (!organizedData[sportType]) {
        organizedData[sportType] = []
      }

      organizedData[sportType] = [...organizedData[sportType], ...result.data]
    })

    // Return the organized data
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: organizedData,
    })
  } catch (error) {
    console.error("Error in sports API:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch sports data" }, { status: 500 })
  }
}
