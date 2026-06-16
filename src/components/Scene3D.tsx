import React, { useRef, useEffect, useCallback } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import MineTerrain from './MineTerrain'
import EquipmentModels from './EquipmentModels'
import { Terrace, Equipment } from '../data/mockData'

interface CameraControllerProps {
  target: { x: number; y: number; z: number } | null
  onArrive: () => void
}

function CameraController({ target, onArrive }: CameraControllerProps) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(35, 25, 35))
  const isMoving = useRef(false)

  useEffect(() => {
    if (target) {
      targetPos.current.set(target.x + 8, target.y + 8, target.z + 8)
      isMoving.current = true
    }
  }, [target])

  useFrame(() => {
    if (isMoving.current) {
      camera.position.lerp(targetPos.current, 0.03)
      if (camera.position.distanceTo(targetPos.current) < 0.5) {
        isMoving.current = false
        onArrive()
      }
    }
  })

  return null
}

interface Scene3DProps {
  terraces: Terrace[]
  equipment: Equipment[]
  selectedEquipmentId: string | null
  onSelectEquipment: (id: string) => void
  cameraTarget: { x: number; y: number; z: number } | null
  onCameraArrive: () => void
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} color="#8899cc" />
      <directionalLight
        position={[30, 40, 20]}
        intensity={1.2}
        color="#ffe8cc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <directionalLight position={[-20, 20, -10]} intensity={0.3} color="#6688cc" />
      <pointLight position={[0, -15, 0]} intensity={0.8} color="#ff6600" distance={50} />
    </>
  )
}

function GridFloor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -20, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#0d1520" roughness={0.95} />
      </mesh>
      <gridHelper args={[120, 60, '#1a2a40', '#111a28']} position={[0, -19.9, 0]} />
    </group>
  )
}

export default function Scene3D({
  terraces,
  equipment,
  selectedEquipmentId,
  onSelectEquipment,
  cameraTarget,
  onCameraArrive,
}: Scene3DProps) {
  return (
    <div className="canvas-wrapper">
      <Canvas
        shadows
        camera={{ position: [35, 25, 35], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
      >
        <color attach="background" args={['#070b14']} />
        <fog attach="fog" args={['#070b14', 60, 120]} />
        <Lights />
        <GridFloor />
        <MineTerrain terraces={terraces} />
        <EquipmentModels
          equipment={equipment}
          terraces={terraces}
          selectedId={selectedEquipmentId}
          onSelect={onSelectEquipment}
        />
        <CameraController target={cameraTarget} onArrive={onCameraArrive} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI * 0.48}
          minDistance={10}
          maxDistance={80}
          target={[0, -5, 0]}
        />
      </Canvas>
    </div>
  )
}
