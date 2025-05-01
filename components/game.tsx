"use client"

import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier"
import { OrthographicCamera } from "@react-three/drei"
import { Baby } from "./baby"
import { Floor } from "./floor"
import { Obstacle } from "./obstacle"
import { ParentHands } from "./parent-hands"
import { Playmat } from "./playmat"
import { GameUI } from "./game-ui"

export default function Game() {
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing")
  const [babyPosition, setBabyPosition] = useState({ x: -8, y: 0.5 })
  const [isLifted, setIsLifted] = useState(false)
  const [obstacleHit, setObstacleHit] = useState<string | null>(null)

  // Game reset function
  const resetGame = () => {
    setBabyPosition({ x: -8, y: 0.5 })
    setGameState("playing")
    setIsLifted(false)
    setObstacleHit(null)
  }

  // Generate obstacles
  const obstacles = [
    { id: "scissors", position: [-4, 0.3, 0], type: "scissors" },
    { id: "bottle", position: [0, 0.3, 0], type: "bottle" },
    { id: "cord", position: [4, 0.3, 0], type: "cord" },
  ]

  // Handle keyboard input
  useEffect(() => {
    if (gameState !== "playing") return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && !isLifted) {
        setIsLifted(true)
        // Reset after animation time
        setTimeout(() => setIsLifted(false), 1000)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState, isLifted])

  // Check for win condition
  useEffect(() => {
    if (babyPosition.x > 8 && gameState === "playing") {
      setGameState("won")
    }
  }, [babyPosition, gameState])

  return (
    <>
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />

        <OrthographicCamera makeDefault position={[0, 5, 10]} zoom={40} />

        <Physics debug={false}>
          {/* Floor */}
          <Floor />

          {/* Baby */}
          <Baby
            position={[babyPosition.x, babyPosition.y, 0]}
            isLifted={isLifted}
            gameState={gameState}
            onPositionChange={setBabyPosition}
          />

          {/* Obstacles */}
          {obstacles.map((obstacle) => (
            <Obstacle
              key={obstacle.id}
              id={obstacle.id}
              position={obstacle.position}
              type={obstacle.type as "scissors" | "bottle" | "cord"}
              onCollision={() => {
                if (gameState === "playing" && !isLifted) {
                  setGameState("lost")
                  setObstacleHit(obstacle.id)
                }
              }}
            />
          ))}

          {/* Goal - Playmat */}
          <Playmat position={[9, 0.1, 0]} />

          {/* Parent Hands */}
          {isLifted && <ParentHands position={[babyPosition.x, 3, 0]} />}

          {/* World boundaries */}
          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[0.5, 5, 5]} position={[-10, 0, 0]} />
            <CuboidCollider args={[0.5, 5, 5]} position={[12, 0, 0]} />
          </RigidBody>
        </Physics>
      </Canvas>

      <GameUI gameState={gameState} obstacleHit={obstacleHit} onReset={resetGame} />

      {/* Removed audio element since the file might not exist */}
    </>
  )
}
