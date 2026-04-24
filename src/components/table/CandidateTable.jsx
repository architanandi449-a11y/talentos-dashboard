import React from 'react'
import { useCandidateStore } from '../../store/useCandidateStore'
import { calcPriorityScore, getPriorityLabel } from '../../utils/priority'
import { PriorityBadge, ScoreBar, ReviewedDot, EmptyState } from '../ui'

const TH_STYLE = {
  textAlign: 'left',
  padding: '9px 12px',
  fontSize: 10,
  color: '#5c587a',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  fontWeight: 600,
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  whiteSpace: 'nowrap',
}

const CandidateRow = React.memo(({ candidate, isSelected, isCompare, onSelect, onToggleCompare }) => {
  const ps = calcPriorityScore(candidate)
  const label = getPriorityLabel(ps)

  const initials = candidate.name.split(' ').map((n) => n[0]).join('').slice(0, 2)

  let rowBg = 'transparent'
  if (isSelected) rowBg = 'rgba(162,89,255,0.08)'
  else if (isCompare) rowBg = 'rgba(0,212,255,0.04)'

  return (
    <tr
      onClick={() => onSelect(candidate.id)}
      style={{
        background: rowBg,
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        cursor: 'pointer',
        transition: 'background 0.15s',
        boxShadow: isSelected ? 'inset 2px 0 0 #a259ff' : 'none',
      }}
      onMouseEnter={(e) => { if (!isSelected && !isCompare) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = rowBg }}
    >
      {/* Compare checkbox */}
      <td style={{ width: 36, padding: '0 0 0 12px' }} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isCompare}
          onChange={() => onToggleCompare(candidate.id)}
          title="Select for comparison"
        />
      </td>

      {/* Name + College */}
      <td style={{ padding: '8px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(162,89,255,0.25), rgba(0,212,255,0.15))',
            border: '1px solid rgba(162,89,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#a259ff',
          }}>{initials}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 500, color: '#e8e4f5' }}>
              {candidate.name}
              {candidate.reviewed && <ReviewedDot />}
            </div>
            <div style={{ fontSize: 10, color: '#5c587a', marginTop: 1 }}>{candidate.college}</div>
          </div>
        </div>
      </td>

      {/* Scores */}
      <td style={{ padding: '8px 12px', width: 120 }}><ScoreBar score={candidate.assignment_score} width={50} /></td>
      <td style={{ padding: '8px 12px', width: 110 }}><ScoreBar score={candidate.video_score} width={44} /></td>
      <td style={{ padding: '8px 12px', width: 100 }}><ScoreBar score={candidate.ats_score} width={44} /></td>
      <td style={{ padding: '8px 12px', width: 80 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#9b96b4' }}>{candidate.github_score}</span>
      </td>

      {/* Priority */}
      <td style={{ padding: '8px 12px', width: 120 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <PriorityBadge label={label} />
          <span style={{ fontSize: 10, color: '#5c587a' }}>{ps}</span>
        </div>
      </td>

      {/* Arrow */}
      <td style={{ padding: '8px 8px', width: 36 }}>
        <span style={{ color: '#5c587a', fontSize: 16, padding: '2px 5px', borderRadius: 4, background: 'rgba(255,255,255,0.04)' }}>›</span>
      </td>
    </tr>
  )
})
CandidateRow.displayName = 'CandidateRow'

export const CandidateTable = () => {
  const selectedId = useCandidateStore((s) => s.selectedId)
  const compareIds = useCandidateStore((s) => s.compareIds)
  const selectCandidate = useCandidateStore((s) => s.selectCandidate)
  const toggleCompare = useCandidateStore((s) => s.toggleCompare)
  const openCompareModal = useCandidateStore((s) => s.openCompareModal)
  const clearCompare = useCandidateStore((s) => s.clearCompare)
  const filtered = useCandidateStore((s) => s.getFilteredCandidates())

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      {/* Sub-header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: '#9b96b4' }}>
          {filtered.length} candidate{filtered.length !== 1 ? 's' : ''} matched
        </span>
        <span style={{ fontSize: 10, color: '#5c587a' }}>Click row to review · Check to compare (max 3)</span>
      </div>

      {/* Compare bar */}
      {compareIds.length >= 2 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '7px 16px', flexShrink: 0,
          background: 'rgba(162,89,255,0.07)', borderBottom: '1px solid rgba(162,89,255,0.18)',
        }}>
          <span style={{ fontSize: 11, color: '#a259ff' }}>
            {compareIds.length} selected for comparison
          </span>
          <button onClick={openCompareModal} className="btn-primary" style={{ borderRadius: 6, padding: '4px 12px', fontSize: 11 }}>
            Compare Side-by-Side
          </button>
          <button onClick={clearCompare} className="btn-ghost" style={{ borderRadius: 6, padding: '4px 10px', fontSize: 11 }}>
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <EmptyState title="No candidates match" description="Try adjusting your filters or search query" />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                position: 'sticky', top: 0, zIndex: 10,
                background: 'rgba(13,10,30,0.97)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              }}>
                <th style={{ ...TH_STYLE, width: 36 }} />
                <th style={TH_STYLE}>Candidate</th>
                <th style={{ ...TH_STYLE, width: 120 }}>Assignment</th>
                <th style={{ ...TH_STYLE, width: 110 }}>Video</th>
                <th style={{ ...TH_STYLE, width: 100 }}>ATS</th>
                <th style={{ ...TH_STYLE, width: 80 }}>GitHub</th>
                <th style={{ ...TH_STYLE, width: 120 }}>Priority</th>
                <th style={{ ...TH_STYLE, width: 36 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <CandidateRow
                  key={c.id}
                  candidate={c}
                  isSelected={c.id === selectedId}
                  isCompare={compareIds.includes(c.id)}
                  onSelect={selectCandidate}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
