"use client"

import { useRef, useEffect, useState } from "react"
import { RigidBody, type RapierRigidBody } from "@react-three/rapier"
import * as THREE from "three"

interface ObstacleProps {
  id: string
  position: [number, number, number]
  type: "scissors" | "bottle" | "cord"
  onCollision: () => void
}

export function Obstacle({ id, position, type, onCollision }: ObstacleProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const [textureLoaded, setTextureLoaded] = useState(false)
  const [textureError, setTextureError] = useState(false)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  // Load texture based on obstacle type
  useEffect(() => {
    // Only try to load textures for scissors and bottle for now
    // since we don't have a cord texture yet
    if (type === "cord") {
      setTextureError(true)
      return
    }

    const textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = "anonymous"

    const texturePath = `/textures/${type}.png`

    try {
      textureLoader.load(
        texturePath,
        (loadedTexture) => {
          setTexture(loadedTexture)
          setTextureLoaded(true)
          setTextureError(false)
        },
        undefined,
        (error) => {
          console.error(`Error loading ${type} texture:`, error)
          setTextureError(true)
        },
      )
    } catch (error) {
      console.error(`Exception loading ${type} texture:`, error)
      setTextureError(true)
    }

    // Cleanup function
    return () => {
      if (texture) {
        texture.dispose()
      }
    }
  }, [type])

  // Size based on obstacle type
  const getSize = () => {
    switch (type) {
      case "scissors":
        return [1.5, 1.5, 0.2]
      case "bottle":
        return [1, 2, 0.2] // Adjusted for the new bottle image
      case "cord":
        return [1.2, 0.3, 0.2]
      default:
        return [1, 1, 0.2]
    }
  }

  // Fallback color if texture fails to load
  const getFallbackColor = () => {
    switch (type) {
      case "scissors":
        return new THREE.Color("#c0c0c0") // Silver for scissors
      case "bottle":
        return new THREE.Color("#87ceeb") // Sky blue for bottle
      case "cord":
        return new THREE.Color("#000000") // Black for cord
      default:
        return new THREE.Color("#ff0000") // Red for unknown
    }
  }

  // Rotation for certain obstacles
  const getRotation = () => {
    // No special rotations needed for now
    return [0, 0, 0]
  }

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      type="fixed"
      colliders="cuboid"
      sensor
      name={id}
      onIntersectionEnter={({ other }) => {
        // Check if intersection is with the baby
        if (other.rigidBodyObject?.name === "baby") {
          onCollision()
        }
      }}
    >
      {textureLoaded && texture && !textureError ? (
        // Use a plane with the texture if loaded successfully
        <mesh rotation={getRotation()}>
          <planeGeometry args={getSize().slice(0, 2) as [number, number]} />
          <meshStandardMaterial map={texture} transparent={true} alphaTest={0.1} side={THREE.DoubleSide} />
        </mesh>
      ) : (
        // Fallback to a colored box if texture failed to load
        <mesh rotation={getRotation()}>
          <boxGeometry args={[getSize()[0], getSize()[1], 0.1]} />
          <meshStandardMaterial color={getFallbackColor()} />
        </mesh>
      )}
    </RigidBody>
  )
}
