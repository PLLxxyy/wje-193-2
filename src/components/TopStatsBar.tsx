import React from 'react'
import { DaySnapshot } from '../data/mockData'

interface TopStatsBarProps {
  snapshot: DaySnapshot
}

export default function TopStatsBar({ snapshot }: TopStatsBarProps) {
  return (
    <div className="top-bar">
      <div className="stat-card">
        <div className="label">今日开采量</div>
        <div className="value">
          {(snapshot.extraction / 1000).toFixed(1)}
          <span className="unit">千吨</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="label">运输车次</div>
        <div className="value">
          {snapshot.trips}
          <span className="unit">车次</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="label">设备在线数</div>
        <div className="value">
          {snapshot.devicesOnline}
          <span className="unit">台</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="label">安全预警</div>
        <div className={`value ${snapshot.safetyWarnings > 2 ? 'warn' : ''}`}>
          {snapshot.safetyWarnings}
          <span className="unit">条</span>
        </div>
      </div>
    </div>
  )
}
