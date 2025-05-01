"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface ParentHandsProps {
  position: [number, number, number]
}

export function ParentHands({ position }: ParentHandsProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [textureLoaded, setTextureLoaded] = useState(false)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [textureError, setTextureError] = useState(false)

  // Load the hands texture
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = "anonymous"

    try {
      textureLoader.load(
        "/textures/hands.png",
        (loadedTexture) => {
          setTexture(loadedTexture)
          setTextureLoaded(true)
          setTextureError(false)
        },
        undefined,
        (error) => {
          console.error("Error loading hands texture:", error)
          setTextureError(true)
        },
      )
    } catch (error) {
      console.error("Exception loading hands texture:", error)
      setTextureError(true)
    }

    // Cleanup function
    return () => {
      if (texture) {
        texture.dispose()
      }
    }
  }, [])

  // Animation
  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Simple bobbing animation
    groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.005) * 0.1
  })

  // Fallback color if texture fails to load
  const handColor = new THREE.Color("#ffdab9") // Peach color for hands

  return (
    <group ref={groupRef} position={position}>
      {textureLoaded && texture && !textureError ? (
        // Use the hands texture
        <mesh>
          <planeGeometry args={[3, 2]} /> {/* Adjust size as needed */}
          <meshStandardMaterial map={texture} transparent={true} alphaTest={0.1} side={THREE.DoubleSide} />
        </mesh>
      ) : (
        // Fallback to simple box hands if texture fails to load
        <>
          {/* Left hand */}
          <mesh position={[-0.5, 0, 0]}>
            <boxGeometry args={[0.8, 0.2, 1.5]} />
            <meshStandardMaterial color={handColor} />
          </mesh>

          {/* Right hand */}
          <mesh position={[0.5, 0, 0]}>
            <boxGeometry args={[0.8, 0.2, 1.5]} />
            <meshStandardMaterial color={handColor} />
          </mesh>
        </>
      )}
    </group>
  )
}
