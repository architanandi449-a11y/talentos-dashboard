import React from 'react'
import { useCandidateStore } from '../../store/useCandidateStore'
import { calcPriorityScore, getPriorityLabel } from '../../utils/priority'

export const Topbar = () => {
  const compareIds = useCandidateStore((s) => s.compareIds)
  const openCompareModal = useCandidateStore((s) => s.openCompareModal)
  const clearCompare = useCandidateStore((s) => s.clearCompare)
  const resetFilters = useCandidateStore((s) => s.resetFilters)
  const candidates = useCandidateStore((s) => s.candidates)

  const reviewed = candidates.filter((c) => c.reviewed).length
  const shortlisted = candidates.filter((c) => {
    const lbl = getPriorityLabel(calcPriorityScore(c))
    return lbl === 'P0' || lbl === 'P1'
  }).length
  const stats = [
    { label: 'Total', value: candidates.length, color: '#a259ff' },
    { label: 'Reviewed', value: reviewed, color: '#00d4ff' },
    { label: 'Shortlisted', value: shortlisted, color: '#39ff6a' },
    { label: 'Pending', value: candidates.length - reviewed, color: '#ff8c2a' },
  ]

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(7,5,15,0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      flexShrink: 0,
      zIndex: 20,
      gap: 12,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, #a259ff, #00d4ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#fff',
        }}>T</div>
        <div>
          <span className="gradient-text" style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700 }}>
            TalentOS
          </span>
          <span style={{ color: '#5c587a', fontSize: 13 }}> / Recruiter Ops</span>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flex: 1, justifyContent: 'center' }}>
        {stats.map(({ label, value, color }) => (
          <div key={label} className="topbar-stat">
            <div className="topbar-stat-val" style={{ color }}>{value}</div>
            <div className="topbar-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {compareIds.length >= 2 && (
          <>
            <button onClick={openCompareModal} className="btn-primary" style={{ borderRadius: 8, padding: '5px 12px', fontSize: 12 }}>
              Compare ({compareIds.length})
            </button>
            <button onClick={clearCompare} className="btn-ghost" style={{ borderRadius: 8, padding: '5px 10px', fontSize: 12 }}>
              Clear
            </button>
          </>
        )}
        <button onClick={resetFilters} className="btn-ghost" style={{ borderRadius: 8, padding: '5px 12px', fontSize: 12 }}>
          Reset Filters
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8,
          background: 'rgba(57,255,106,0.08)', border: '1px solid rgba(57,255,106,0.2)', color: '#39ff6a', fontSize: 12,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#39ff6a', boxShadow: '0 0 6px #39ff6a' }} />
          Live
        </div>
      </div>
    </header>
  )
}
