"use client"

interface GameUIProps {
  gameState: "playing" | "won" | "lost"
  obstacleHit: string | null
  onReset: () => void
}

export function GameUI({ gameState, obstacleHit, onReset }: GameUIProps) {
  if (gameState === "playing") return null

  const getMessage = () => {
    if (gameState === "won") {
      return "Baby reached the playmat safely!"
    } else if (gameState === "lost") {
      return `Oh no! Baby touched the ${obstacleHit}!`
    }
    return ""
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className={`text-2xl font-bold mb-4 ${gameState === "won" ? "text-green-600" : "text-red-600"}`}>
          {gameState === "won" ? "You Win!" : "Game Over"}
        </h2>
        <p className="text-gray-700 mb-6">{getMessage()}</p>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
