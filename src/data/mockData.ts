export type TerraceStatus = 'completed' | 'in-progress' | 'pending'

export interface Terrace {
  id: string
  level: number
  innerRadius: number
  outerRadius: number
  y: number
  status: TerraceStatus
  segments: number
}

export interface EquipmentStats {
  runtime: string
  load: string
  fuel: string
  speed: string
}

export interface Equipment {
  id: string
  name: string
  type: 'truck' | 'excavator'
  online: boolean
  stats: EquipmentStats
  pathIndex: number
  pathProgress: number
  speed: number
  terraceLevel: number
}

export interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  category: string
  message: string
  value: string
  time: string
  location: string
  equipmentId: string | null
  resolved: boolean
}

export interface DaySnapshot {
  date: string
  terraces: Terrace[]
  extraction: number
  trips: number
  devicesOnline: number
  safetyWarnings: number
}

function generateTerraces(dayIndex: number): Terrace[] {
  const terraces: Terrace[] = []
  const totalLevels = 7 + dayIndex
  const baseOuter = 28

  for (let i = 0; i < totalLevels; i++) {
    const level = i
    const outerR = baseOuter - i * 3.2
    const innerR = outerR - 2.8
    const depth = -i * 2.2

    let status: TerraceStatus
    if (i < 3 + dayIndex) {
      status = 'completed'
    } else if (i < 4 + dayIndex) {
      status = 'in-progress'
    } else {
      status = 'pending'
    }

    if (innerR < 2) continue

    terraces.push({
      id: `terrace-${dayIndex}-${level}`,
      level,
      innerRadius: innerR,
      outerRadius: outerR,
      y: depth,
      status,
      segments: 48,
    })
  }
  return terraces
}

export const weekData: DaySnapshot[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(2026, 5, 10 + i)
  const dateStr = `${d.getMonth() + 1}月${d.getDate()}日`
  return {
    date: dateStr,
    terraces: generateTerraces(i),
    extraction: 12000 + i * 1800 + Math.floor(Math.random() * 800),
    trips: 42 + i * 6 + Math.floor(Math.random() * 8),
    devicesOnline: 14 + Math.floor(i * 0.8),
    safetyWarnings: Math.max(0, 3 - Math.floor(i * 0.4) + Math.floor(Math.random() * 2)),
  }
})

export const equipmentList: Equipment[] = [
  {
    id: 'truck-1', name: '矿卡-01', type: 'truck', online: true,
    stats: { runtime: '6h 23m', load: '85t', fuel: '72%', speed: '18km/h' },
    pathIndex: 0, pathProgress: 0.3, speed: 0.0008, terraceLevel: 2,
  },
  {
    id: 'truck-2', name: '矿卡-02', type: 'truck', online: true,
    stats: { runtime: '4h 10m', load: '92t', fuel: '58%', speed: '22km/h' },
    pathIndex: 1, pathProgress: 0.6, speed: 0.001, terraceLevel: 1,
  },
  {
    id: 'truck-3', name: '矿卡-03', type: 'truck', online: true,
    stats: { runtime: '7h 45m', load: '78t', fuel: '41%', speed: '15km/h' },
    pathIndex: 2, pathProgress: 0.1, speed: 0.0007, terraceLevel: 3,
  },
  {
    id: 'truck-4', name: '矿卡-04', type: 'truck', online: false,
    stats: { runtime: '0h 0m', load: '0t', fuel: '95%', speed: '0km/h' },
    pathIndex: 0, pathProgress: 0.7, speed: 0, terraceLevel: 0,
  },
  {
    id: 'exc-1', name: '挖掘机-01', type: 'excavator', online: true,
    stats: { runtime: '8h 05m', load: '12t', fuel: '63%', speed: '3km/h' },
    pathIndex: 0, pathProgress: 0, speed: 0, terraceLevel: 3,
  },
  {
    id: 'exc-2', name: '挖掘机-02', type: 'excavator', online: true,
    stats: { runtime: '5h 30m', load: '8t', fuel: '77%', speed: '2km/h' },
    pathIndex: 0, pathProgress: 0, speed: 0, terraceLevel: 5,
  },
  {
    id: 'exc-3', name: '挖掘机-03', type: 'excavator', online: true,
    stats: { runtime: '3h 50m', load: '15t', fuel: '88%', speed: '4km/h' },
    pathIndex: 0, pathProgress: 0, speed: 0, terraceLevel: 4,
  },
  {
    id: 'exc-4', name: '挖掘机-04', type: 'excavator', online: false,
    stats: { runtime: '0h 0m', load: '0t', fuel: '100%', speed: '0km/h' },
    pathIndex: 0, pathProgress: 0, speed: 0, terraceLevel: 2,
  },
]

export const alertList: Alert[] = [
  {
    id: 'a1', type: 'critical', category: '边坡位移',
    message: '北侧边坡3号监测点位移速率超标，24小时累计位移12.3mm',
    value: '12.3mm/24h', time: '14:32', location: '北侧边坡-3#',
    equipmentId: null, resolved: false,
  },
  {
    id: 'a2', type: 'critical', category: '粉尘浓度',
    message: '采场底部粉尘浓度达到45mg/m³，超过安全阈值',
    value: '45mg/m³', time: '13:18', location: '采场底部-C区',
    equipmentId: null, resolved: false,
  },
  {
    id: 'a3', type: 'warning', category: '边坡位移',
    message: '东侧边坡1号监测点位移趋势上升，建议加密监测',
    value: '5.8mm/24h', time: '11:45', location: '东侧边坡-1#',
    equipmentId: null, resolved: false,
  },
  {
    id: 'a4', type: 'warning', category: '设备告警',
    message: '矿卡-03发动机水温偏高，建议检查冷却系统',
    value: '98°C', time: '10:22', location: '3号运输路线',
    equipmentId: 'truck-3', resolved: false,
  },
  {
    id: 'a5', type: 'info', category: '粉尘浓度',
    message: '西侧作业区粉尘浓度恢复正常范围',
    value: '18mg/m³', time: '09:15', location: '西侧作业区',
    equipmentId: null, resolved: true,
  },
  {
    id: 'a6', type: 'info', category: '系统提示',
    message: '新增2号台阶爆破作业完成，已转入开采阶段',
    value: '', time: '08:30', location: '2号台阶',
    equipmentId: null, resolved: true,
  },
  {
    id: 'a7', type: 'warning', category: '边坡位移',
    message: '南侧边坡2号监测点累计位移接近预警阈值',
    value: '8.1mm/24h', time: '07:50', location: '南侧边坡-2#',
    equipmentId: null, resolved: false,
  },
  {
    id: 'a8', type: 'critical', category: '设备告警',
    message: '挖掘机-01液压系统压力异常，已自动停机',
    value: '32MPa', time: '15:10', location: '3号台阶',
    equipmentId: 'exc-1', resolved: false,
  },
  {
    id: 'a9', type: 'warning', category: '设备告警',
    message: '矿卡-02轮胎压力不足，建议尽快检查',
    value: '0.6bar', time: '12:40', location: '1号运输路线',
    equipmentId: 'truck-2', resolved: false,
  },
  {
    id: 'a10', type: 'warning', category: '设备告警',
    message: '挖掘机-03回转电机温度偏高',
    value: '85°C', time: '09:55', location: '4号台阶',
    equipmentId: 'exc-3', resolved: false,
  },
]

export function getTruckPath(pathIndex: number, terrace: Terrace): { x: number; z: number }[] {
  const r = (terrace.innerRadius + terrace.outerRadius) / 2
  const count = 16 + pathIndex * 4
  const pts: { x: number; z: number }[] = []
  const offset = pathIndex * 0.7
  for (let i = 0; i <= count; i++) {
    const a = (i / count) * Math.PI * 2 + offset
    pts.push({ x: Math.cos(a) * r, z: Math.sin(a) * r })
  }
  return pts
}

export function getExcavatorPosition(terrace: Terrace, index: number): { x: number; z: number; rotY: number } {
  const r = (terrace.innerRadius + terrace.outerRadius) / 2
  const a = (index / 6) * Math.PI * 2 + 0.5
  return { x: Math.cos(a) * r, z: Math.sin(a) * r, rotY: -a + Math.PI / 2 }
}
