import Link from "next/link"
import { Tv, ArrowRight } from "lucide-react"
import SportsFeed from "@/components/sports-feed"

// Define the supported sport types and their display names
const sportTypes = [
  { id: "soccer", name: "Soccer", icon: "⚽" },
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "baseball", name: "Baseball", icon: "⚾" },
  { id: "hockey", name: "Hockey", icon: "🏒" },
  { id: "football", name: "American Football", icon: "🏈" },
  { id: "mma", name: "MMA", icon: "🥊" },
  { id: "racing", name: "Racing", icon: "🏎️" },
  { id: "golf", name: "Golf", icon: "⛳" },
]

export default function SportsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Tv className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold">Sportsurge</h1>
            <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs">BETA</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/sports" className="text-sm hover:text-red-500 transition-colors">
              Sports
            </Link>
            <Link href="/news" className="text-sm hover:text-red-500 transition-colors">
              News
            </Link>
            <Link href="/faq" className="text-sm hover:text-red-500 transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Sports Categories</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {sportTypes.map((sport) => (
            <Link
              key={sport.id}
              href={`/sports/${sport.id}`}
              className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all hover:scale-105 flex flex-col items-center text-center"
            >
              <span className="text-4xl mb-2">{sport.icon}</span>
              <span className="font-medium">{sport.name}</span>
              <span className="text-gray-400 text-sm mt-2 flex items-center">
                View Events <ArrowRight className="ml-1 h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Live Events</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-2 h-6 bg-red-500 mr-2 rounded"></span>
              Soccer
            </h3>
            <SportsFeed sportType="soccer" liveOnly={true} limit={3} />

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-2 h-6 bg-red-500 mr-2 rounded"></span>
                Basketball
              </h3>
              <SportsFeed sportType="basketball" liveOnly={true} limit={3} />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-2 h-6 bg-red-500 mr-2 rounded"></span>
              American Football
            </h3>
            <SportsFeed sportType="football" liveOnly={true} limit={3} />

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-2 h-6 bg-red-500 mr-2 rounded"></span>
                Other Sports
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <SportsFeed sportType="hockey" liveOnly={true} limit={1} />
                <SportsFeed sportType="baseball" liveOnly={true} limit={1} />
                <SportsFeed sportType="mma" liveOnly={true} limit={1} />
                <SportsFeed sportType="racing" liveOnly={true} limit={1} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-800 bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Tv className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold">Sportsurge</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link
                href="https://www.sportsurge.uno"
                className="text-red-500 hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Official Site
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Sportsurge. All rights reserved.</p>
            <p className="mt-2">
              This is a demo site. For the official Sportsurge website, visit{" "}
              <Link
                href="https://www.sportsurge.uno"
                className="text-red-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.sportsurge.uno
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
