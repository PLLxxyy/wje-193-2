# 露天矿山3D监控系统

基于 Vite + React 18 + TypeScript + Three.js 的露天矿山三维可视化监控系统。

## 技术栈

- **构建工具**: Vite 5
- **前端框架**: React 18 + TypeScript
- **3D引擎**: Three.js + @react-three/fiber + @react-three/drei
- **样式**: 内联 CSS（index.html 中的 `<style>` 标签）

## 功能特性

- **3D矿坑地形**: 同心环形台阶模型，带顶点位移的自然地形效果
- **开采状态着色**: 蓝色(已完成)、橙色(进行中)、灰色(待开采)
- **设备模型**: 卡车(BoxGeometry)在环形路径上移动，挖掘机(Bucket+Boom)带动画臂
- **顶部数据栏**: 今日开采量、运输车次、设备在线数、安全预警数量
- **左侧设备列表**: 按类型分组(运输卡车/挖掘机)，点击飞到设备旁并弹出详情
- **底部时间轴**: 拖动滑块回放一周地形变化，矿坑逐渐扩大
- **右侧安全告警**: 边坡位移、粉尘浓度等监测数据

## 运行方式

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 项目结构

```
├── index.html                 # 入口 HTML（含所有样式）
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx               # React 入口
    ├── App.tsx                # 主应用组件
    ├── data/
    │   └── mockData.ts        # 模拟数据（地形、设备、告警）
    └── components/
        ├── Scene3D.tsx         # Three.js 场景（相机、灯光、轨道控制）
        ├── MineTerrain.tsx     # 矿坑地形（环形台阶 + 顶点位移）
        ├── EquipmentModels.tsx # 设备模型（卡车 + 挖掘机）
        ├── TopStatsBar.tsx     # 顶部数据统计栏
        ├── EquipmentPanel.tsx  # 左侧设备列表面板
        ├── SafetyPanel.tsx     # 右侧安全告警面板
        ├── TimelineSlider.tsx  # 底部时间轴滑块
        └── EquipmentDetail.tsx # 设备详情弹窗
```
