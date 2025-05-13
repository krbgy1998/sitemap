"use client"

import Link from "next/link"
import { Tv, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import VideoPlayer from "@/components/video-player"

type Props = {
  params: { eventId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function EventPageClient({ params, searchParams }: Props) {
  const eventId = params.eventId
  const eventName = decodeURIComponent((searchParams.name as string) || "Sports Event")
  const sportType = (searchParams.sport as string) || "unknown"
  const league = (searchParams.league as string) || "Unknown League"

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Tv className="h-8 w-8 text-red-500" />
            </Link>
            <h1 className="text-2xl font-bold">
              <Link href="/">Sportsurge</Link>
            </h1>
            <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs">BETA</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/sports" className="text-sm hover:text-red-500 transition-colors">
              Sports
            </Link>
            <Link href={`/sports/${sportType}`} className="text-sm hover:text-red-500 transition-colors">
              {sportType.charAt(0).toUpperCase() + sportType.slice(1)}
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
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" asChild className="mr-4">
            <Link href={`/sports/${sportType}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {sportType.charAt(0).toUpperCase() + sportType.slice(1)}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content - Video player */}
          <div className="lg:col-span-9">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="border-b border-gray-800 px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-bold">{eventName} Live Stream</h1>
                <div className="text-xs px-2 py-1 bg-red-900 rounded text-white">LIVE</div>
              </div>

              <VideoPlayer eventId={eventId} eventName={eventName} />

              <div className="p-4 border-t border-gray-800">
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((streamId) => (
                    <button
                      key={streamId}
                      id={`stream-btn-${streamId}`}
                      className={`btns x-btn btn--default ${streamId === 1 ? "Aktif" : ""}`}
                      onClick={() => {
                        // @ts-ignore
                        window.changeStream?.(streamId)
                      }}
                    >
                      <span className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded transition-colors">
                        Stream {streamId}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-900 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">League</p>
                  <p>{league}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Sport</p>
                  <p>{sportType.charAt(0).toUpperCase() + sportType.slice(1)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Stream Info</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  This stream is provided as a free service. Please note that stream quality may vary depending on your
                  internet connection.
                </p>
                <p className="text-gray-400">
                  If you experience any issues with the current stream, try switching to an alternative stream using the
                  buttons below the player.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <h3 className="font-medium mb-2">Stream Quality</h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <span className="ml-2 text-sm">HD</span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-gray-900 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Disclaimer</h2>
              <p className="text-sm text-gray-400">
                Sportsurge does not host any of the streaming videos or links displayed on this site. All streams are
                found freely available on the internet. We are not affiliated with nor responsible for any content
                streamed.
              </p>
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
