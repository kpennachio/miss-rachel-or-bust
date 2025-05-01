"use client"

import { useState } from "react"
import { RigidBody } from "@react-three/rapier"
import * as THREE from "three"

export function Floor() {
  const [textureLoaded, setTextureLoaded] = useState(false)

  // Try to load texture but provide fallback
  try {
    // Use a simple color instead of texture
    const floorColor = new THREE.Color("#f5f5f5")

    return (
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[25, 10]} />
          <meshStandardMaterial color={floorColor} />
        </mesh>
      </RigidBody>
    )
  } catch (error) {
    console.error("Error loading floor texture:", error)

    // Fallback to a simple colored material
    return (
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[25, 10]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
      </RigidBody>
    )
  }
}
