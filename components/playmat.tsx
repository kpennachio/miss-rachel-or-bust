"use client"

import { RigidBody } from "@react-three/rapier"
import * as THREE from "three"

interface PlaymatProps {
  position: [number, number, number]
}

export function Playmat({ position }: PlaymatProps) {
  // Use a color instead of texture
  const playmatColor = new THREE.Color("#90ee90") // Light green for playmat

  return (
    <RigidBody position={position} type="fixed" colliders="cuboid" sensor>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color={playmatColor} />
      </mesh>
    </RigidBody>
  )
}
