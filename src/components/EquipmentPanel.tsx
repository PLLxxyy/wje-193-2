import React from 'react'
import { Equipment } from '../data/mockData'

interface EquipmentPanelProps {
  equipment: Equipment[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function EquipmentPanel({ equipment, selectedId, onSelect }: EquipmentPanelProps) {
  const trucks = equipment.filter((e) => e.type === 'truck')
  const excavators = equipment.filter((e) => e.type === 'excavator')

  const renderGroup = (title: string, items: Equipment[]) => (
    <div className="equip-group">
      <div className="equip-group-title">{title}</div>
      {items.map((eq) => (
        <div
          key={eq.id}
          className={`equip-item ${selectedId === eq.id ? 'active' : ''}`}
          onClick={() => onSelect(eq.id)}
        >
          <span className={`equip-dot ${eq.online ? 'online' : 'offline'}`} />
          <span>{eq.name}</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#4a6080' }}>
            {eq.online ? '在线' : '离线'}
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="left-panel">
      <div className="panel-title">设备列表</div>
      {renderGroup('运输卡车', trucks)}
      {renderGroup('挖掘机', excavators)}
    </div>
  )
}
