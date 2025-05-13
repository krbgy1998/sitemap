"use client"

import { useEffect, useState, useRef } from "react"
import { Play, Maximize2, Minimize2 } from "lucide-react"

interface VideoPlayerProps {
  eventId: string
  eventName: string
}

export default function VideoPlayer({ eventId, eventName }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTheaterMode, setIsTheaterMode] = useState(false)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const currentStreamId = useRef("33943")

  // Function to handle play button click
  const handlePlay = () => {
    setIsPlaying(true)
    setIsLoading(true)

    // Create and append iframe when play is clicked
    if (iframeRef.current) return // Already created

    const iframe = document.createElement("iframe")
    iframe.id = "wp_player"
    iframe.className = "embed-responsive-item"
    iframe.frameBorder = "0"
    iframe.width = "100%"
    iframe.height = "100%"
    iframe.src = `https://googlapisapi.com/new-stream-embed/${currentStreamId.current}?newa=111`
    iframe.allowFullscreen = true
    iframe.style.backgroundColor = "#000"
    iframe.title = `${eventName} Live Stream`
    iframe.onload = () => {
      setIsLoading(false)
    }

    // Append iframe to container
    const container = document.getElementById("iframe-container")
    if (container) {
      container.appendChild(iframe)
      iframeRef.current = iframe
    }
  }

  // Function to toggle theater mode
  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode)
  }

  useEffect(() => {
    // Define the changeStream function in the window object
    // @ts-ignore
    window.changeStream = (streamId: string) => {
      // Update current stream ID
      currentStreamId.current = streamId

      // Remove 'Aktif' class from all stream buttons
      const activeButtons = document.getElementsByClassName("Aktif")
      if (activeButtons.length) {
        activeButtons[0].className = "btns x-btn btn--default"
      }

      // Update iframe src if it exists
      if (iframeRef.current) {
        iframeRef.current.src = `https://googlapisapi.com/new-stream-embed/${streamId}?newa=22`
      }

      // Add 'Aktif' class to the clicked button
      const button = document.getElementById(`stream-btn-${streamId}`)
      if (button) {
        button.className = "btns x-btn btn--default Aktif"
      }
    }

    // Define theater mode function
    // @ts-ignore
    window.theaterMode = () => {
      toggleTheaterMode()
    }

    // Function to handle clicks on the video container
    const handleContainerClick = (e: MouseEvent) => {
      // Only handle clicks on the container itself or the play button, not on the iframe
      const target = e.target as HTMLElement
      if (
        target.closest("#wp_player") ||
        (isPlaying && !target.closest(".videoPlayerBtn") && !target.closest(".theater-btn"))
      ) {
        return
      }

      handlePlay()
    }

    // Add click event listener to the video container
    const container = videoContainerRef.current
    if (container) {
      container.addEventListener("click", handleContainerClick)
    }

    return () => {
      // Clean up the global functions when component unmounts
      // @ts-ignore
      window.changeStream = undefined
      // @ts-ignore
      window.theaterMode = undefined

      // Remove event listener
      if (container) {
        container.removeEventListener("click", handleContainerClick)
      }
    }
  }, [isPlaying])

  return (
    <div id="player-container" className={`relative ${isTheaterMode ? "theater-mode" : ""}`} ref={videoContainerRef}>
      <section
        className={`video-container relative ${isPlaying ? "playing" : ""}`}
        aria-label="Video Player Area"
        title="View Broadcast"
      >
        {!isPlaying && (
          <>
            <img
              className="img-fluid w-full h-auto object-cover"
              id="leagueImage"
              src="https://iili.io/2Z4aqL7.webp"
              alt={`${eventName} Background`}
              style={{ maxHeight: "500px" }}
            />
            <div
              className="videoPlayerBtn absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              aria-hidden="true"
            >
              <span
                id="play"
                className="play-btn-border flex items-center justify-center w-16 h-16 rounded-full bg-red-600 bg-opacity-80 hover:bg-opacity-100 transition-all cursor-pointer"
              >
                <Play className="w-8 h-8 text-white" />
              </span>
            </div>
          </>
        )}

        {isLoading && (
          <div
            className="videoLoading absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-white rounded-full">
              <span className="visually-hidden sr-only">Loading...</span>
            </div>
          </div>
        )}

        {isPlaying && (
          <div
            id="iframe-container"
            className="w-full h-full"
            style={{ height: isTheaterMode ? "calc(100vh - 50px)" : "500px" }}
          ></div>
        )}
      </section>

      <div className="p-2 flex justify-end bg-gray-900">
        <button
          className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded transition-colors flex items-center theater-btn"
          onClick={toggleTheaterMode}
          id="theater-mode-btn"
          type="button"
        >
          {isTheaterMode ? (
            <>
              <Minimize2 className="mr-2 h-4 w-4" />
              Exit Theater Mode
            </>
          ) : (
            <>
              <Maximize2 className="mr-2 h-4 w-4" />
              Theater Mode
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .theater-mode {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 9999;
          background: #000;
          padding: 0;
        }
        
        .theater-mode .video-container {
          height: calc(100vh - 50px);
        }
        
        .theater-mode button {
          position: absolute;
          bottom: 10px;
          right: 10px;
        }
        
        .video-container.playing {
          background-color: #000;
          width: 100%;
          height: 500px;
        }
      `}</style>
    </div>
  )
}
