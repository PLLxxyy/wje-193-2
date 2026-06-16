import React, { useState, useCallback, useMemo } from 'react'
import Scene3D from './components/Scene3D'
import TopStatsBar from './components/TopStatsBar'
import EquipmentPanel from './components/EquipmentPanel'
import SafetyPanel from './components/SafetyPanel'
import TimelineSlider from './components/TimelineSlider'
import EquipmentDetail from './components/EquipmentDetail'
import { weekData, equipmentList, alertList, getTruckPath, getExcavatorPosition } from './data/mockData'

export default function App() {
  const [dayIndex, setDayIndex] = useState(6)
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null)
  const [cameraTarget, setCameraTarget] = useState<{ x: number; y: number; z: number } | null>(null)

  const snapshot = weekData[dayIndex]
  const dates = useMemo(() => weekData.map((d) => d.date), [])

  const selectedEquipment = useMemo(
    () => equipmentList.find((e) => e.id === selectedEquipmentId) || null,
    [selectedEquipmentId],
  )

  const handleSelectEquipment = useCallback(
    (id: string) => {
      if (selectedEquipmentId === id) {
        setSelectedEquipmentId(null)
        setCameraTarget(null)
        return
      }
      setSelectedEquipmentId(id)
      const eq = equipmentList.find((e) => e.id === id)
      if (!eq) return
      const terraces = snapshot.terraces
      const t = terraces[Math.min(eq.terraceLevel, terraces.length - 1)]
      if (!t) return

      if (eq.type === 'truck') {
        const path = getTruckPath(eq.pathIndex, t)
        const p = path[Math.floor(eq.pathProgress * (path.length - 1))]
        setCameraTarget({ x: p.x, y: t.y, z: p.z })
      } else {
        const excOfType = equipmentList
          .filter((e) => e.type === 'excavator')
          .indexOf(eq)
        const p = getExcavatorPosition(t, excOfType)
        setCameraTarget({ x: p.x, y: t.y, z: p.z })
      }
    },
    [selectedEquipmentId, snapshot],
  )

  const handleCameraArrive = useCallback(() => {
    setCameraTarget(null)
  }, [])

  return (
    <div className="app-container">
      <Scene3D
        terraces={snapshot.terraces}
        equipment={equipmentList}
        selectedEquipmentId={selectedEquipmentId}
        onSelectEquipment={handleSelectEquipment}
        cameraTarget={cameraTarget}
        onCameraArrive={handleCameraArrive}
      />
      <TopStatsBar snapshot={snapshot} />
      <EquipmentPanel
        equipment={equipmentList}
        selectedId={selectedEquipmentId}
        onSelect={handleSelectEquipment}
      />
      <TimelineSlider dates={dates} currentIndex={dayIndex} onChange={setDayIndex} />
      <SafetyPanel alerts={alertList} />
      {selectedEquipment && (
        <EquipmentDetail
          equipment={selectedEquipment}
          onClose={() => {
            setSelectedEquipmentId(null)
            setCameraTarget(null)
          }}
        />
      )}
    </div>
  )
}
