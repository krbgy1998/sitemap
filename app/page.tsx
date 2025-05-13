import Link from "next/link"
import {
  Tv,
  Menu,
  Dribbble,
  CircleDot,
  RabbitIcon as Rugby,
  Dumbbell,
  Swords,
  Car,
  Snowflake,
  CircleDashed,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SportsurgeLanding() {
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
          <div className="flex items-center gap-4">
            <Menu className="md:hidden h-6 w-6" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Sportsurge <span className="text-red-500">v3</span>
          </h2>
          <h3 className="mt-4 text-2xl font-semibold sm:text-3xl">What do you want to watch today?</h3>
          <p className="mt-4 text-gray-400">
            Sportsurge helps fans from around the world watch their favorite games, events and more.
          </p>

          <div className="mt-8">
            <Button asChild size="lg" className="bg-red-500 hover:bg-red-600">
              <Link href="/sports">Explore Sports</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sports Categories */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="mb-8 text-center text-2xl font-bold">Popular Sports</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[
            { name: "Soccer", icon: <Dribbble className="h-10 w-10" /> },
            { name: "Basketball", icon: <CircleDot className="h-10 w-10" /> },
            { name: "Football", icon: <Rugby className="h-10 w-10" /> },
            { name: "Boxing", icon: <Dumbbell className="h-10 w-10" /> },
            { name: "MMA", icon: <Swords className="h-10 w-10" /> },
            { name: "Motor Sports", icon: <Car className="h-10 w-10" /> },
            { name: "Hockey", icon: <Snowflake className="h-10 w-10" /> },
            { name: "Baseball", icon: <CircleDashed className="h-10 w-10" /> },
          ].map((sport, index) => (
            <Link
              href={`/sports/${sport.name.toLowerCase()}`}
              key={index}
              className="flex flex-col items-center justify-center rounded-lg bg-gray-900 p-6 transition-all hover:bg-gray-800 hover:scale-105"
            >
              <div className="mb-4 rounded-lg bg-black p-4 text-red-500">{sport.icon}</div>
              <span className="text-center font-medium">{sport.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-900 to-red-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold">Never Miss a Game Again</h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg">
            Join thousands of sports fans who use Sportsurge to watch their favorite games live.
          </p>
          <Button asChild size="lg" className="mt-8 bg-white text-red-600 hover:bg-gray-100">
            <Link href="/sports">Browse All Sports</Link>
          </Button>
        </div>
      </section>

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
