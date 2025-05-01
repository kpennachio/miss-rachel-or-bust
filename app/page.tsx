"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import Loading from "./loading"

// Dynamically import the game component to avoid SSR issues with Three.js
const Game = dynamic(() => import("@/components/game"), { ssr: false })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-sky-100">
      <div className="w-full max-w-5xl aspect-video relative overflow-hidden rounded-lg shadow-xl border-4 border-pink-200">
        <Suspense fallback={<Loading />}>
          <Game />
        </Suspense>
      </div>

      <div className="mt-6 text-center max-w-md">
        <h1 className="text-2xl font-bold text-pink-600 mb-2">Baby Crawler</h1>
        <p className="text-gray-700">Help the baby reach the playmat! Use arrow keys to move and jump.</p>
        <div className="mt-4 p-3 bg-white rounded-lg shadow-md">
          <p className="font-medium text-gray-800">Controls:</p>
          <ul className="text-sm text-gray-600 mt-1">
            <li>← → Arrow keys: Move left/right</li>
            <li>↑ Arrow key: Parent lift (avoid obstacles)</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
