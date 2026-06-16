import React from 'react'
import { Equipment, Alert } from '../data/mockData'

interface EquipmentDetailProps {
  equipment: Equipment
  alerts: Alert[]
  onClose: () => void
}

export default function EquipmentDetail({ equipment, alerts, onClose }: EquipmentDetailProps) {
  const relatedAlerts = alerts.filter((a) => a.equipmentId === equipment.id)
  const unresolvedCount = relatedAlerts.filter((a) => !a.resolved).length

  return (
    <div
      className="detail-popup"
      style={{ top: 100, left: '50%', transform: 'translateX(-50%)' }}
    >
      <button className="close-btn" onClick={onClose}>✕</button>
      <div className="title">{equipment.name} 详情</div>
      <div className="detail-row">
        <span className="label">设备类型</span>
        <span className="value">{equipment.type === 'truck' ? '运输卡车' : '挖掘机'}</span>
      </div>
      <div className="detail-row">
        <span className="label">运行状态</span>
        <span className="value" style={{ color: equipment.online ? '#4ade80' : '#6b7280' }}>
          {equipment.online ? '运行中' : '已离线'}
        </span>
      </div>
      <div className="detail-row">
        <span className="label">运行时长</span>
        <span className="value">{equipment.stats.runtime}</span>
      </div>
      <div className="detail-row">
        <span className="label">当前载重</span>
        <span className="value">{equipment.stats.load}</span>
      </div>
      <div className="detail-row">
        <span className="label">油耗/电量</span>
        <span className="value">{equipment.stats.fuel}</span>
      </div>
      <div className="detail-row">
        <span className="label">当前速度</span>
        <span className="value">{equipment.stats.speed}</span>
      </div>
      <div className="detail-row">
        <span className="label">作业台阶</span>
        <span className="value">第{equipment.terraceLevel + 1}层</span>
      </div>
      <div className="detail-section-title">
        关联告警
        {unresolvedCount > 0 && (
          <span className="detail-alert-badge">{unresolvedCount}</span>
        )}
      </div>
      {relatedAlerts.length === 0 ? (
        <div className="detail-no-alert">暂无关联告警</div>
      ) : (
        <div className="detail-alert-list">
          {relatedAlerts.map((alert) => (
            <div key={alert.id} className={`detail-alert-item ${alert.type} ${alert.resolved ? 'resolved' : ''}`}>
              <div className={`detail-alert-type ${alert.type}`}>
                {alert.type === 'critical' ? '严重' : alert.type === 'warning' ? '警告' : '信息'}
                {' · '}
                {alert.category}
                {alert.resolved && <span className="detail-alert-resolved-tag">已处理</span>}
              </div>
              <div className="detail-alert-msg">{alert.message}</div>
              <div className="detail-alert-meta">
                <span>{alert.value}</span>
                <span>{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
