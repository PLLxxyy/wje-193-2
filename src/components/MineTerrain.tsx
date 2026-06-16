import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Terrace } from '../data/mockData'

const STATUS_COLORS: Record<string, string> = {
  'completed': '#2a7fff',
  'in-progress': '#ff8c2a',
  'pending': '#5a6577',
}

const STATUS_EMISSIVE: Record<string, string> = {
  'completed': '#0a2a66',
  'in-progress': '#663300',
  'pending': '#1a1e28',
}

function TerraceRing({ terrace }: { terrace: Terrace }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const color = STATUS_COLORS[terrace.status]
  const emissive = STATUS_EMISSIVE[terrace.status]

  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(terrace.innerRadius, terrace.outerRadius, terrace.segments, 1)
    const pos = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getY(i)
      const dist = Math.sqrt(x * x + z * z)
      const noise = Math.sin(dist * 1.3) * 0.15 + Math.cos(x * 0.8) * 0.1
      pos.setZ(i, noise)
    }
    geo.computeVertexNormals()
    return geo
  }, [terrace])

  const wallGeo = useMemo(() => {
    const height = 2.0
    const innerGeo = new THREE.CylinderGeometry(terrace.innerRadius, terrace.innerRadius, height, terrace.segments, 1, true)
    const outerGeo = new THREE.CylinderGeometry(terrace.outerRadius, terrace.outerRadius, height, terrace.segments, 1, true)
    outerGeo.scale(1, 1, 1)

    const merge = (geo: THREE.BufferGeometry) => {
      const pos = geo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const z = pos.getZ(i)
        const dist = Math.sqrt(x * x + z * z)
        const noise = Math.sin(dist * 2.1 + pos.getY(i) * 0.5) * 0.12
        pos.setX(i, x + noise * (x / dist))
        pos.setZ(i, z + noise * (z / dist))
      }
      geo.computeVertexNormals()
    }
    merge(innerGeo)
    merge(outerGeo)

    const merged = new THREE.BufferGeometry()
    const innerPos = (innerGeo.attributes.position as THREE.BufferAttribute).array as Float32Array
    const innerIdx = (innerGeo.index as THREE.BufferAttribute).array as Uint16Array
    const outerPos = (outerGeo.attributes.position as THREE.BufferAttribute).array as Float32Array
    const outerIdx = (outerGeo.index as THREE.BufferAttribute).array as Uint16Array

    const vertCount = innerPos.length / 3 + outerPos.length / 3
    const positions = new Float32Array(vertCount * 3)
    const normals = new Float32Array(vertCount * 3)
    positions.set(innerPos)
    const innerVertCount = innerPos.length / 3
    for (let i = 0; i < outerPos.length; i += 3) {
      positions[innerPos.length + i] = outerPos[i]
      positions[innerPos.length + i + 1] = outerPos[i + 1]
      positions[innerPos.length + i + 2] = outerPos[i + 2]
    }

    merged.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    merged.computeVertexNormals()

    const indices = new Uint32Array(innerIdx.length + outerIdx.length)
    indices.set(innerIdx)
    for (let i = 0; i < outerIdx.length; i++) {
      indices[innerIdx.length + i] = outerIdx[i] + innerVertCount
    }
    merged.setIndex(new THREE.BufferAttribute(indices, 1))

    return merged
  }, [terrace])

  useFrame((_, delta) => {
    if (meshRef.current && terrace.status === 'in-progress') {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      const pulse = Math.sin(Date.now() * 0.002) * 0.15 + 0.85
      mat.emissiveIntensity = pulse
    }
  })

  return (
    <group position={[0, terrace.y, 0]}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.6}
          roughness={0.75}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh receiveShadow castShadow>
        <primitive object={wallGeo} attach="geometry" />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.3}
          roughness={0.85}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default function MineTerrain({ terraces }: { terraces: Terrace[] }) {
  return (
    <group>
      <mesh position={[0, -terraces.length * 2.2 - 1, 0]} receiveShadow>
        <cylinderGeometry args={[32, 35, 2, 64]} />
        <meshStandardMaterial color="#1a2030" roughness={0.9} />
      </mesh>
      {terraces.map((t) => (
        <TerraceRing key={t.id} terrace={t} />
      ))}
    </group>
  )
}
