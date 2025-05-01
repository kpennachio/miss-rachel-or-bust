"use client"

import { useState, useEffect } from "react"
import * as THREE from "three"

export function Background() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = "anonymous"

    textureLoader.load(
      "/textures/living_room.png",
      (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping
        loadedTexture.wrapT = THREE.RepeatWrapping
        loadedTexture.colorSpace = 'srgb'
        setTexture(loadedTexture)
      },
      undefined,
      (error) => {
        console.error("Error loading background texture:", error)
      }
    )

    return () => {
      if (texture) {
        texture.dispose()
      }
    }
  }, [])

  if (!texture) return null

  return (
    <mesh position={[0, 2, -5]} scale={[1, 1, 1]}>
      <planeGeometry args={[25, 12]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true}
        side={THREE.DoubleSide}
        depthTest={false}  
        depthWrite={false} 
      />
    </mesh>
  )
}
