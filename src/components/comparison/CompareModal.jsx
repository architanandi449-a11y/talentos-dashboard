import React, { useEffect } from 'react'
import { useCandidateStore } from '../../store/useCandidateStore'
import { calcPriorityScore, getPriorityLabel, getPriorityMeta, getScoreColor } from '../../utils/priority'
import { PriorityBadge } from '../ui'

const COMPARE_ROWS = [
  { key: 'assignment_score', label: 'Assignment', weight: '30%' },
  { key: 'video_score', label: 'Video', weight: '25%' },
  { key: 'ats_score', label: 'ATS', weight: '20%' },
  { key: 'github_score', label: 'GitHub', weight: '15%' },
  { key: 'communication_score', label: 'Communication', weight: '10%' },
]

const CandidateColumn = ({ candidate, isWinner, maxScores }) => {
  const ps = calcPriorityScore(candidate)
  const label = getPriorityLabel(ps)
  const meta = getPriorityMeta(label)
  const initials = candidate.name.split(' ').map((n) => n[0]).join('').slice(0, 2)

  return (
    <div style={{
      flex: 1, borderRadius: 12, padding: 16, minWidth: 0,
      background: isWinner ? meta.bg : 'rgba(255,255,255,0.03)',
      border: `1px solid ${isWinner ? meta.border : 'rgba(255,255,255,0.07)'}`,
      transition: 'all 0.3s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(162,89,255,0.25), rgba(0,212,255,0.15))',
          border: '1px solid rgba(162,89,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#a259ff',
        }}>{initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: '#e8e4f5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {candidate.name}
          </div>
          <div style={{ fontSize: 10, color: '#5c587a', marginTop: 2 }}>{candidate.college}</div>
        </div>
      </div>

      {/* Priority */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderRadius: 8, padding: '10px 12px', marginBottom: 14,
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div>
          <div style={{ fontSize: 9, color: '#5c587a', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Priority Score</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800, color: meta.color, lineHeight: 1.1, textShadow: `0 0 16px ${meta.glow}` }}>
            {ps}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <PriorityBadge label={label} size="lg" />
          {isWinner && (
            <div style={{ fontSize: 10, color: meta.color, fontFamily: 'Syne, sans-serif', fontWeight: 600, marginTop: 4 }}>
              Top Pick
            </div>
          )}
        </div>
      </div>

      {/* Score rows */}
      {COMPARE_ROWS.map(({ key, label: rowLabel, weight }) => {
        const score = candidate[key]
        const isHighest = maxScores[key] === score
        const color = getScoreColor(score)
        return (
          <div key={key} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#9b96b4' }}>{rowLabel}</span>
              <span style={{ fontSize: 10, color: 'rgba(162,89,255,0.6)' }}>{weight}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 2, transition: 'width 0.5s ease' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 24, textAlign: 'right' }}>{score}</span>
            </div>
            {isHighest && (
              <span style={{ fontSize: 9, color: '#39ff6a', display: 'block', marginTop: 2 }}>↑ Highest</span>
            )}
          </div>
        )
      })}

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, marginTop: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#5c587a' }}>Reviewed</span>
          <span style={{ fontSize: 11, color: candidate.reviewed ? '#00d4ff' : '#5c587a' }}>
            {candidate.reviewed ? '✓ Yes' : '—'}
          </span>
        </div>
      </div>
    </div>
  )
}

export const CompareModal = () => {
  const compareIds = useCandidateStore((s) => s.compareIds)
  const compareModalOpen = useCandidateStore((s) => s.compareModalOpen)
  const closeCompareModal = useCandidateStore((s) => s.closeCompareModal)
  const clearCompare = useCandidateStore((s) => s.clearCompare)
  const candidates = useCandidateStore((s) => s.candidates)

  const compared = compareIds.map((id) => candidates.find((c) => c.id === id)).filter(Boolean)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeCompareModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeCompareModal])

  if (!compareModalOpen || !compared.length) return null

  const maxScores = {}
  COMPARE_ROWS.forEach(({ key }) => {
    maxScores[key] = Math.max(...compared.map((c) => c[key]))
  })
  const topPs = Math.max(...compared.map(calcPriorityScore))

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) closeCompareModal() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.2s ease both',
      }}
    >
      <div
        style={{
          background: '#0f0c22',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          width: '100%',
          maxWidth: 860,
          maxHeight: '88vh',
          overflow: 'auto',
          animation: 'scaleIn 0.22s cubic-bezier(0.25,0.8,0.25,1) both',
        }}
      >
        {/* Modal header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#e8e4f5' }}>
              Side-by-Side Comparison
            </h2>
            <p style={{ fontSize: 11, color: '#5c587a', marginTop: 3 }}>
              Comparing {compared.length} candidates · Green = highest in category
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { clearCompare(); closeCompareModal() }}
              className="btn-ghost"
              style={{ borderRadius: 8, padding: '5px 12px', fontSize: 12 }}
            >
              Clear & Close
            </button>
            <button
              onClick={closeCompareModal}
              className="btn-ghost"
              style={{ borderRadius: 8, width: 30, height: 30, padding: 0, fontSize: 14 }}
            >✕</button>
          </div>
        </div>

        {/* Columns */}
        <div style={{ display: 'flex', gap: 14, padding: 20 }}>
          {compared.map((c) => (
            <CandidateColumn
              key={c.id}
              candidate={c}
              isWinner={calcPriorityScore(c) === topPs}
              maxScores={maxScores}
            />
          ))}
        </div>

        {/* Formula footer */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{
            borderRadius: 10, padding: '10px 14px',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 10, color: '#5c587a', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
              Formula:
            </span>
            {COMPARE_ROWS.map(({ label, weight }) => (
              <span key={label} style={{ fontSize: 11, color: '#9b96b4' }}>
                <span style={{ color: 'rgba(162,89,255,0.8)' }}>{weight}</span> × {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
