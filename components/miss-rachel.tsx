"use client"

import { useState, useEffect } from "react"
import * as THREE from "three"

interface MissRachelProps {
  position: [number, number, number]
}

export function MissRachel({ position }: MissRachelProps) {
  const [textureLoaded, setTextureLoaded] = useState(false)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  // Load the Miss Rachel texture
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = "anonymous"

    textureLoader.load(
      "/textures/miss_rachel.png",
      (loadedTexture) => {
        setTexture(loadedTexture)
        setTextureLoaded(true)
      },
      undefined,
      (error) => {
        console.error("Error loading Miss Rachel texture:", error)
      }
    )

    return () => {
      if (texture) {
        texture.dispose()
      }
    }
  }, [])

  return (
    <group position={position}>
      {textureLoaded && texture ? (
        <mesh>
          <planeGeometry args={[3, 4]} /> {/* Adjust size as needed */}
          <meshStandardMaterial 
            map={texture} 
            transparent={true} 
            alphaTest={0.1} 
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : (
        // Placeholder while texture loads
        <mesh>
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial color="#FFB6C1" />
        </mesh>
      )}
    </group>
  )
}
