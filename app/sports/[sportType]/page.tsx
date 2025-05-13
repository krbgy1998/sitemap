import Link from "next/link"
import { Tv, ArrowLeft } from "lucide-react"
import SportsFeed from "@/components/sports-feed"
import { Button } from "@/components/ui/button"

// Define the supported sport types and their display names
const sportTypes = {
  soccer: "Soccer",
  basketball: "Basketball",
  baseball: "Baseball",
  hockey: "Hockey",
  football: "American Football",
  mma: "MMA",
  racing: "Racing",
  golf: "Golf",
}

type SportPageProps = {
  params: {
    sportType: string
  }
}

export function generateStaticParams() {
  return Object.keys(sportTypes).map((sportType) => ({
    sportType,
  }))
}

export default function SportPage({ params }: SportPageProps) {
  const { sportType } = params

  // Check if the sport type is valid
  if (!Object.keys(sportTypes).includes(sportType)) {
    return (
      <div className="flex min-h-screen flex-col bg-black text-white">
        <header className="border-b border-gray-800 bg-black">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Tv className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold">Sportsurge</h1>
              <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs">BETA</span>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Sport Not Found</h1>
          <p className="text-gray-400 mb-8">The sport type you're looking for doesn't exist or isn't supported.</p>
          <Button asChild>
            <Link href="/sports">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Sports
            </Link>
          </Button>
        </main>
      </div>
    )
  }

  const sportDisplayName = sportTypes[sportType as keyof typeof sportTypes]

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
              All Sports
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
        <div className="flex items-center mb-8">
          <Button variant="outline" size="sm" asChild className="mr-4">
            <Link href="/sports">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{sportDisplayName} Events</h1>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-2 h-6 bg-red-500 mr-2 rounded"></span>
              Live {sportDisplayName} Events
            </h2>
            <SportsFeed sportType={sportType} liveOnly={true} limit={10} />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-2 h-6 bg-red-500 mr-2 rounded"></span>
              Upcoming {sportDisplayName} Events
            </h2>
            <SportsFeed sportType={sportType} upcomingOnly={true} limit={10} />
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
