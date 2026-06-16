import React from 'react'
import { Alert } from '../data/mockData'

interface SafetyPanelProps {
  alerts: Alert[]
}

export default function SafetyPanel({ alerts }: SafetyPanelProps) {
  return (
    <div className="right-panel">
      <div className="panel-title">安全告警面板</div>
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert-item ${alert.type}`}>
          <div className={`alert-type ${alert.type}`}>
            {alert.type === 'critical' ? '严重' : alert.type === 'warning' ? '警告' : '信息'}
            {' · '}
            {alert.category}
            {alert.value && <span style={{ marginLeft: 6, opacity: 0.8 }}>{alert.value}</span>}
          </div>
          <div className="alert-msg">{alert.message}</div>
          <div className="alert-meta">
            <span>{alert.location}</span>
            <span>{alert.time}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
