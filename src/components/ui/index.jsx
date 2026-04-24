import React from 'react'
import { getPriorityMeta, getScoreColor } from '../../utils/priority'

// ── PriorityBadge ────────────────────────────────────────────────────────────
export const PriorityBadge = ({ label, size = 'sm' }) => {
  const meta = getPriorityMeta(label)
  const fontSize = size === 'lg' ? 13 : 11
  const padding = size === 'lg' ? '3px 10px' : '2px 7px'
  return (
    <span
      className="priority-badge"
      style={{
        color: meta.color,
        background: meta.bg,
        border: `1px solid ${meta.border}`,
        fontSize,
        padding,
      }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: meta.color,
        boxShadow: `0 0 6px ${meta.glow}`, display: 'inline-block', flexShrink: 0,
      }} />
      {label}
    </span>
  )
}

// ── ScoreBar ─────────────────────────────────────────────────────────────────
export const ScoreBar = ({ score, width = 40 }) => {
  const color = getScoreColor(score)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: '#e8e4f5', minWidth: 24 }}>{score}</span>
      <div className="score-bar-track" style={{ width }}>
        <div style={{
          height: '100%', width: `${score}%`, background: color,
          borderRadius: 2, transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  )
}

// ── SliderInput ───────────────────────────────────────────────────────────────
export const SliderInput = ({ label, value, onChange, weight }) => {
  const color = getScoreColor(value)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: '#9b96b4', flex: 1 }}>{label}</span>
        {weight && <span style={{ fontSize: 10, color: 'rgba(162,89,255,0.6)' }}>{weight}</span>}
        <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 28, textAlign: 'right' }}>{value}</span>
      </div>
      <input
        type="range" min={0} max={100} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', background: `linear-gradient(to right, ${color} ${value}%, rgba(255,255,255,0.1) ${value}%)` }}
      />
    </div>
  )
}

// ── StarRating ────────────────────────────────────────────────────────────────
export const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = React.useState(0)
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const on = (hovered || value) >= star
        return (
          <button
            key={star}
            onClick={() => onChange(star === value ? 0 : star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            style={{
              color: on ? '#ffd147' : '#5c587a',
              fontSize: 16,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0 1px',
              transform: on ? 'scale(1.15)' : 'scale(1)',
              transition: 'all 0.15s',
              filter: on ? 'drop-shadow(0 0 4px rgba(255,209,71,0.6))' : 'none',
              lineHeight: 1,
            }}
          >★</button>
        )
      })}
    </div>
  )
}

// ── ReviewedDot ───────────────────────────────────────────────────────────────
export const ReviewedDot = () => (
  <span style={{
    width: 6, height: 6, borderRadius: '50%', background: '#00d4ff',
    boxShadow: '0 0 6px rgba(0,212,255,0.8)', display: 'inline-block',
    marginLeft: 5, verticalAlign: 'middle', flexShrink: 0,
  }} />
)

// ── SectionHeading ────────────────────────────────────────────────────────────
export const SectionHeading = ({ children }) => (
  <div className="section-heading">{children}</div>
)

// ── EmptyState ────────────────────────────────────────────────────────────────
export const EmptyState = ({ title = 'No results', description = 'Try adjusting your filters' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 32px' }}>
    <div style={{
      width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 16,
    }}>
      <span style={{ fontSize: 28, opacity: 0.3 }}>⊘</span>
    </div>
    <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, color: '#e8e4f5', marginBottom: 6 }}>{title}</p>
    <p style={{ color: '#5c587a', fontSize: 12, textAlign: 'center' }}>{description}</p>
  </div>
)
