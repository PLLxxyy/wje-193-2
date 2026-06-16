import React from 'react'

interface TimelineSliderProps {
  dates: string[]
  currentIndex: number
  onChange: (index: number) => void
}

export default function TimelineSlider({ dates, currentIndex, onChange }: TimelineSliderProps) {
  return (
    <div className="bottom-bar">
      <div className="timeline-header">
        <span className="title">矿区一周地形变化回放</span>
        <span className="date">{dates[currentIndex]}</span>
      </div>
      <input
        type="range"
        className="timeline-slider"
        min={0}
        max={dates.length - 1}
        step={1}
        value={currentIndex}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
      <div className="timeline-labels">
        {dates.map((d, i) => (
          <span key={i} style={{ opacity: i === currentIndex ? 1 : 0.5, fontWeight: i === currentIndex ? 700 : 400 }}>
            {d}
          </span>
        ))}
      </div>
    </div>
  )
}
