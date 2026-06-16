import React from 'react'
import { Equipment } from '../data/mockData'

interface EquipmentDetailProps {
  equipment: Equipment
  onClose: () => void
}

export default function EquipmentDetail({ equipment, onClose }: EquipmentDetailProps) {
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
    </div>
  )
}
