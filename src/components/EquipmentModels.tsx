import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Equipment, Terrace, getTruckPath, getExcavatorPosition } from '../data/mockData'

interface TruckModelProps {
  equipment: Equipment
  terrace: Terrace
  onSelect: (id: string) => void
  isSelected: boolean
}

function TruckModel({ equipment, terrace, onSelect, isSelected }: TruckModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const path = useMemo(() => getTruckPath(equipment.pathIndex, terrace), [equipment.pathIndex, terrace])
  const progressRef = useRef(equipment.pathProgress)

  useFrame((_, delta) => {
    if (!groupRef.current || !equipment.online || equipment.speed === 0) return
    progressRef.current = (progressRef.current + delta * equipment.speed) % 1
    const idx = Math.floor(progressRef.current * (path.length - 1))
    const nextIdx = Math.min(idx + 1, path.length - 1)
    const t = (progressRef.current * (path.length - 1)) - idx
    const x = path[idx].x + (path[nextIdx].x - path[idx].x) * t
    const z = path[idx].z + (path[nextIdx].z - path[idx].z) * t
    groupRef.current.position.x = x
    groupRef.current.position.z = z

    const dx = path[nextIdx].x - path[idx].x
    const dz = path[nextIdx].z - path[idx].z
    if (dx !== 0 || dz !== 0) {
      groupRef.current.rotation.y = Math.atan2(dx, dz)
    }
  })

  return (
    <group
      ref={groupRef}
      position={[path[0].x, terrace.y + 1.2, path[0].z]}
      onClick={(e) => { e.stopPropagation(); onSelect(equipment.id) }}
    >
      {/* truck body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.8, 1.0, 3.2]} />
        <meshStandardMaterial
          color={isSelected ? '#ffcc00' : '#cc6600'}
          emissive={isSelected ? '#664400' : '#331100'}
          emissiveIntensity={isSelected ? 0.8 : 0.3}
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>
      {/* truck cabin */}
      <mesh position={[0, 1.2, -0.8]} castShadow>
        <boxGeometry args={[1.5, 0.8, 1.2]} />
        <meshStandardMaterial color="#88aacc" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* truck bed (raised) */}
      <mesh position={[0, 1.0, 0.6]} castShadow>
        <boxGeometry args={[1.7, 0.6, 2.0]} />
        <meshStandardMaterial color="#aa5500" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* wheels */}
      {[[-0.8, 0, -1.0], [0.8, 0, -1.0], [-0.8, 0, 1.0], [0.8, 0, 1.0]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 12]} />
          <meshStandardMaterial color="#222222" roughness={0.9} />
        </mesh>
      ))}
      {/* direction indicator */}
      <mesh position={[0, 2.0, 0]}>
        <coneGeometry args={[0.3, 0.6, 8]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ffaa00"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* label */}
      {isSelected && (
        <mesh position={[0, 3.0, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={1} />
        </mesh>
      )}
    </group>
  )
}

interface ExcavatorModelProps {
  equipment: Equipment
  terrace: Terrace
  index: number
  onSelect: (id: string) => void
  isSelected: boolean
}

function ExcavatorModel({ equipment, terrace, index, onSelect, isSelected }: ExcavatorModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const armRef = useRef<THREE.Group>(null)
  const pos = useMemo(() => getExcavatorPosition(terrace, index), [terrace, index])

  useFrame(() => {
    if (armRef.current && equipment.online) {
      armRef.current.rotation.z = Math.sin(Date.now() * 0.0008 + index) * 0.15 - 0.3
    }
  })

  return (
    <group
      ref={groupRef}
      position={[pos.x, terrace.y + 1.0, pos.z]}
      rotation={[0, pos.rotY, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect(equipment.id) }}
    >
      {/* base/track */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.2, 0.6, 3.0]} />
        <meshStandardMaterial
          color={isSelected ? '#ffcc00' : '#336633'}
          emissive={isSelected ? '#664400' : '#112211'}
          emissiveIntensity={isSelected ? 0.8 : 0.2}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      {/* cabin */}
      <mesh position={[0, 1.2, -0.3]} castShadow>
        <boxGeometry args={[1.6, 1.4, 1.6]} />
        <meshStandardMaterial color="#448844" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* cabin window */}
      <mesh position={[0, 1.5, 0.42]}>
        <boxGeometry args={[1.2, 0.7, 0.05]} />
        <meshStandardMaterial color="#88bbdd" roughness={0.2} metalness={0.5} transparent opacity={0.7} />
      </mesh>
      {/* arm group */}
      <group ref={armRef} position={[0, 1.8, 0.8]}>
        {/* boom */}
        <mesh position={[0, 0.8, 0.5]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 2.5, 0.4]} />
          <meshStandardMaterial color="#556644" roughness={0.7} metalness={0.4} />
        </mesh>
        {/* stick */}
        <mesh position={[0, 2.0, 1.5]} rotation={[0.8, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 2.0, 0.3]} />
          <meshStandardMaterial color="#556644" roughness={0.7} metalness={0.4} />
        </mesh>
        {/* bucket */}
        <mesh position={[0, 2.5, 2.8]} rotation={[1.2, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.6]} />
          <meshStandardMaterial color="#888888" roughness={0.8} metalness={0.5} />
        </mesh>
      </group>
      {/* direction indicator */}
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[0.25, 0.5, 8]} />
        <meshStandardMaterial
          color="#44ff88"
          emissive="#44ff88"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      {isSelected && (
        <mesh position={[0, 4.2, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={1} />
        </mesh>
      )}
    </group>
  )
}

interface EquipmentModelsProps {
  equipment: Equipment[]
  terraces: Terrace[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function EquipmentModels({ equipment, terraces, selectedId, onSelect }: EquipmentModelsProps) {
  const truckCounter = useRef(0)
  const excCounter = useRef(0)
  truckCounter.current = 0
  excCounter.current = 0

  return (
    <group>
      {equipment.map((eq) => {
        const t = terraces[Math.min(eq.terraceLevel, terraces.length - 1)]
        if (!t) return null
        if (eq.type === 'truck') {
          const idx = truckCounter.current++
          return (
            <TruckModel
              key={eq.id}
              equipment={eq}
              terrace={t}
              onSelect={onSelect}
              isSelected={selectedId === eq.id}
            />
          )
        } else {
          const idx = excCounter.current++
          return (
            <ExcavatorModel
              key={eq.id}
              equipment={eq}
              terrace={t}
              index={idx}
              onSelect={onSelect}
              isSelected={selectedId === eq.id}
            />
          )
        }
      })}
    </group>
  )
}
