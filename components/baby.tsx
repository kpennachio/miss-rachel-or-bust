"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody, type RapierRigidBody } from "@react-three/rapier"
import * as THREE from "three"

interface BabyProps {
  position: [number, number, number]
  isLifted: boolean
  gameState: "playing" | "won" | "lost"
  onPositionChange: (position: { x: number; y: number }) => void
}

export function Baby({ position, isLifted, gameState, onPositionChange }: BabyProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const [direction, setDirection] = useState<"left" | "right" | "idle">("idle")
  const [crawlFrame, setCrawlFrame] = useState(0)
  const [facingLeft, setFacingLeft] = useState(false)
  const [textureLoaded, setTextureLoaded] = useState(false)
  const [textureError, setTextureError] = useState(false)
  const [liftHeight, setLiftHeight] = useState(1.5)  // Initial lift height
  const [isUpPressed, setIsUpPressed] = useState(false)

  // Load the baby texture with error handling
  const textureLoader = new THREE.TextureLoader()
  const [babyTexture, setBabyTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    // Set crossOrigin to anonymous to avoid CORS issues
    textureLoader.crossOrigin = "anonymous"

    textureLoader.load(
      "/textures/baby.png",
      (texture) => {
        setBabyTexture(texture)
        setTextureLoaded(true)
      },
      undefined,
      (error) => {
        console.error("Error loading baby texture:", error)
        setTextureError(true)
      },
    )
  }, [])

  // Animation timing
  const frameInterval = 0.2 // seconds per frame
  const frameTimer = useRef(0)

  // Handle keyboard input
  useEffect(() => {
    if (gameState !== "playing") {
      setDirection("idle")
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setDirection("left")
        setFacingLeft(true)
      } else if (e.key === "ArrowRight") {
        setDirection("right")
        setFacingLeft(false)
      } else if (e.key === "ArrowUp" && isLifted) {
        setIsUpPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if ((e.key === "ArrowLeft" && direction === "left") || (e.key === "ArrowRight" && direction === "right")) {
        setDirection("idle")
      } else if (e.key === "ArrowUp") {
        setIsUpPressed(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [direction, gameState, isLifted])

  // Handle movement and animation
  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return

    // Update position for parent component
    const position = rigidBodyRef.current.translation()
    onPositionChange({ x: position.x, y: position.y })

    // Handle lifting by parent
    if (isLifted) {
      // If up arrow is pressed, increase height (with a maximum limit)
      if (isUpPressed) {
        setLiftHeight(prev => Math.min(prev + delta * 2, 4)) // Max height of 4 units, adjust speed with the '2' multiplier
      } else {
        setLiftHeight(prev => Math.max(prev - delta * 2, 1.5)) // Return to base height when up is released
      }
      rigidBodyRef.current.setTranslation({ x: position.x, y: liftHeight, z: position.z }, true)
      return
    }

    // Movement
    const speed = 3
    if (gameState === "playing") {
      if (direction === "left") {
        rigidBodyRef.current.setLinvel({ x: -speed, y: 0, z: 0 }, true)
      } else if (direction === "right") {
        rigidBodyRef.current.setLinvel({ x: speed, y: 0, z: 0 }, true)
      } else {
        rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      }
    } else {
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }

    // Animation
    if (direction !== "idle" && gameState === "playing") {
      frameTimer.current += delta
      if (frameTimer.current >= frameInterval) {
        setCrawlFrame((prev) => (prev + 1) % 4) // 4 frames of animation
        frameTimer.current = 0
      }
    }
  })

  // Create a simple crawling animation by slightly moving up and down
  const bobHeight = Math.sin((crawlFrame * Math.PI) / 2) * 0.05

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      lockRotations
      type="dynamic"
      colliders="cuboid"
      mass={1}
      name="baby"
    >
      <group position={[0, 0.25 + (direction !== "idle" ? bobHeight : 0), 0]}>
        {textureLoaded && babyTexture ? (
          // Use a plane with the baby texture if loaded
          <mesh rotation={[0, facingLeft ? Math.PI : 0, 0]}>
            <planeGeometry args={[2, 2]} /> {/* Adjust size as needed */}
            <meshStandardMaterial map={babyTexture} transparent={true} alphaTest={0.1} side={THREE.DoubleSide} />
          </mesh>
        ) : (
          // Fallback to a colored box if texture failed to load
          <mesh rotation={[0, facingLeft ? Math.PI : 0, 0]}>
            <boxGeometry args={[1.5, 0.8, 0.5]} />
            <meshStandardMaterial color="#ffb6c1" /> {/* Light pink for baby */}
          </mesh>
        )}

        {/* Invisible collision box - slightly smaller than the visual */}
        <mesh visible={false}>
          <boxGeometry args={[1.2, 0.6, 0.5]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </RigidBody>
  )
}
