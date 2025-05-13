"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tv, Calendar, Trophy } from "lucide-react"

type SportEvent = {
  id: string
  name: string
  shortName: string
  league: string
  date: string
  status: string
  statusText: string
  timeDisplay: string
  competitors?: Array<{
    id: string
    name: string
    shortName: string
    score?: number | null
  }>
  scores?: Array<number | null>
  link: string
  sportType: string
}

type SportsFeedProps = {
  sportType?: string
  league?: string
  limit?: number
  liveOnly?: boolean
  upcomingOnly?: boolean
}

export default function SportsFeed({
  sportType,
  league,
  limit = 5,
  liveOnly = false,
  upcomingOnly = false,
}: SportsFeedProps) {
  const [events, setEvents] = useState<SportEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSportsData() {
      try {
        setLoading(true)

        let url = "/api/sports"
        if (sportType) {
          url += `/${sportType}`
          if (league) {
            url += `/${league}`
          }
        }

        // Check if we have cached data that's less than 5 minutes old
        const cachedData = localStorage.getItem(`sports_data_${url}`)
        const cachedTimestamp = localStorage.getItem(`sports_data_timestamp_${url}`)

        if (cachedData && cachedTimestamp) {
          const parsedData = JSON.parse(cachedData)
          const timestamp = Number.parseInt(cachedTimestamp)
          const now = Date.now()

          // If cache is less than 5 minutes old, use it
          if (now - timestamp < 5 * 60 * 1000) {
            processAndSetEvents(parsedData)
            setLoading(false)
            return
          }
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch sports data: ${response.status}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Unknown error occurred")
        }

        // Cache the data
        localStorage.setItem(`sports_data_${url}`, JSON.stringify(data))
        localStorage.setItem(`sports_data_timestamp_${url}`, Date.now().toString())

        processAndSetEvents(data)
      } catch (err) {
        console.error("Error fetching sports data:", err)
        setError("Failed to load sports data. Please try again later.")
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    function processAndSetEvents(data: any) {
      let eventsData: SportEvent[] = []

      if (sportType && league) {
        eventsData = data.events || []
      } else if (sportType) {
        eventsData = data.events || []
      } else {
        // Flatten all sports data
        if (data.data) {
          Object.values(data.data).forEach((sportEvents: any) => {
            eventsData = [...eventsData, ...sportEvents]
          })
        }
      }

      // Filter events based on liveOnly and upcomingOnly parameters
      if (liveOnly) {
        // Show only live events
        eventsData = eventsData.filter((event) => event.status === "live")
      } else if (upcomingOnly) {
        // Show only upcoming scheduled events (not live or finished)
        eventsData = eventsData.filter((event) => event.status === "scheduled")
      }

      // Sort events: by date for scheduled events, or by name for non-scheduled
      eventsData.sort((a, b) => {
        if (a.status === "scheduled" && b.status === "scheduled") {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        }
        return a.name.localeCompare(b.name)
      })

      setEvents(eventsData.slice(0, limit))
      setError(null)
    }

    fetchSportsData()

    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchSportsData, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [sportType, league, limit, liveOnly, upcomingOnly])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>{error}</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>
          {liveOnly
            ? "No live events at the moment"
            : upcomingOnly
              ? "No upcoming events scheduled"
              : "No events found"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        // Create a URL for the watch page with event details
        const watchUrl = `/watch/${event.id}?name=${encodeURIComponent(event.name)}&sport=${event.sportType}&league=${encodeURIComponent(event.league)}`

        return (
          <Link key={event.id} href={watchUrl} className="block">
            <div className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">{event.league}</span>
                  {event.status === "live" && (
                    <span className="text-xs px-2 py-1 bg-red-900 rounded text-white animate-pulse">LIVE</span>
                  )}
                </div>
                <div className="text-sm text-gray-400">{event.timeDisplay}</div>
              </div>

              <div className="mt-2">
                {event.competitors ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                        {event.sportType === "soccer" ? (
                          <Tv className="w-4 h-4 text-gray-400" />
                        ) : event.sportType === "basketball" ? (
                          <Calendar className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Trophy className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <span>{event.competitors[0].name}</span>
                    </div>

                    {event.status !== "scheduled" && event.scores && (
                      <div className="text-xl font-bold">{event.scores[0] ?? 0}</div>
                    )}
                  </div>
                ) : (
                  <div className="font-medium">{event.name}</div>
                )}

                {event.competitors && event.competitors.length > 1 && (
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                        {event.sportType === "soccer" ? (
                          <Tv className="w-4 h-4 text-gray-400" />
                        ) : event.sportType === "basketball" ? (
                          <Calendar className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Trophy className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <span>{event.competitors[1].name}</span>
                    </div>

                    {event.status !== "scheduled" && event.scores && (
                      <div className="text-xl font-bold">{event.scores[1] ?? 0}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
