import React, { useMemo } from 'react'
import { Alert, Equipment } from '../data/mockData'

interface SafetyPanelProps {
  alerts: Alert[]
  equipment: Equipment[]
  filterEquipmentId: string | null
  onFilterChange: (id: string | null) => void
}

export default function SafetyPanel({ alerts, equipment, filterEquipmentId, onFilterChange }: SafetyPanelProps) {
  const filteredAlerts = useMemo(() => {
    if (!filterEquipmentId) return alerts
    return alerts.filter((a) => a.equipmentId === filterEquipmentId)
  }, [alerts, filterEquipmentId])

  return (
    <div className="right-panel">
      <div className="panel-title">安全告警面板</div>
      <div className="alert-filter">
        <select
          className="alert-filter-select"
          value={filterEquipmentId || ''}
          onChange={(e) => onFilterChange(e.target.value || null)}
        >
          <option value="">全部设备</option>
          {equipment.map((eq) => (
            <option key={eq.id} value={eq.id}>{eq.name}</option>
          ))}
        </select>
      </div>
      {filteredAlerts.length === 0 ? (
        <div className="alert-empty">暂无匹配告警</div>
      ) : (
        filteredAlerts.map((alert) => (
          <div key={alert.id} className={`alert-item ${alert.type} ${alert.resolved ? 'resolved' : ''}`}>
            <div className={`alert-type ${alert.type}`}>
              {alert.type === 'critical' ? '严重' : alert.type === 'warning' ? '警告' : '信息'}
              {' · '}
              {alert.category}
              {alert.value && <span style={{ marginLeft: 6, opacity: 0.8 }}>{alert.value}</span>}
              {alert.resolved && <span className="alert-resolved-tag">已处理</span>}
            </div>
            <div className="alert-msg">{alert.message}</div>
            <div className="alert-meta">
              <span>{alert.location}</span>
              <span>{alert.time}</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
