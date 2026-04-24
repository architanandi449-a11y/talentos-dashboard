import React, { useState, useEffect } from 'react'
import { useCandidateStore } from '../../store/useCandidateStore'
import { calcPriorityScore, getPriorityLabel, getPriorityMeta } from '../../utils/priority'
import { ASGN_RATING_LABELS, VID_RATING_LABELS } from '../../data/candidates'
import { PriorityBadge, SliderInput, StarRating, SectionHeading, ReviewedDot } from '../ui'

const SCORE_FIELDS = [
  { key: 'assignment_score', label: 'Assignment Score', weight: '30%' },
  { key: 'video_score', label: 'Video Score', weight: '25%' },
  { key: 'ats_score', label: 'ATS Score', weight: '20%' },
  { key: 'github_score', label: 'GitHub Score', weight: '15%' },
  { key: 'communication_score', label: 'Communication Score', weight: '10%' },
]

const TimestampNotes = ({ candidate }) => {
  const addTimestamp = useCandidateStore((s) => s.addTimestamp)
  const removeTimestamp = useCandidateStore((s) => s.removeTimestamp)
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')

  const handleAdd = () => {
    if (!time.trim() || !note.trim()) return
    addTimestamp(candidate.id, time.trim(), note.trim())
    setTime('')
    setNote('')
  }

  return (
    <div>
      <p style={{ fontSize: 10, color: '#5c587a', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 8 }}>
        Timestamp Notes
      </p>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 6, padding: 8 }}>
          <input
            type="text" placeholder="02:10" value={time}
            onChange={(e) => setTime(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="input-glass"
            style={{ width: 56, borderRadius: 6, padding: '5px 7px', fontSize: 11 }}
          />
          <input
            type="text" placeholder="Note at this timestamp..." value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="input-glass"
            style={{ flex: 1, borderRadius: 6, padding: '5px 7px', fontSize: 11 }}
          />
          <button
            onClick={handleAdd}
            className="btn-accent"
            style={{ borderRadius: 6, padding: '5px 12px', fontSize: 13, fontWeight: 700, flexShrink: 0 }}
          >+</button>
        </div>

        {candidate.timestamps.length > 0 ? (
          <div style={{ maxHeight: 140, overflowY: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {candidate.timestamps.map((ts) => (
              <div key={ts.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '5px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#00d4ff', minWidth: 36, flexShrink: 0 }}>{ts.time}</span>
                <span style={{ fontSize: 11, color: '#9b96b4', flex: 1 }}>{ts.note}</span>
                <button
                  onClick={() => removeTimestamp(candidate.id, ts.id)}
                  style={{ color: '#ff4d6a', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, lineHeight: 1, opacity: 0.7, flexShrink: 0 }}
                >×</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '10px', textAlign: 'center', fontSize: 11, color: '#5c587a', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            No timestamps yet
          </div>
        )}
      </div>
    </div>
  )
}

export const CandidateDrawer = () => {
  const drawerOpen = useCandidateStore((s) => s.drawerOpen)
  const selectedId = useCandidateStore((s) => s.selectedId)
  const closeDrawer = useCandidateStore((s) => s.closeDrawer)
  const updateCandidateScore = useCandidateStore((s) => s.updateCandidateScore)
  const toggleReviewed = useCandidateStore((s) => s.toggleReviewed)
  const updateAsgnRating = useCandidateStore((s) => s.updateAsgnRating)
  const updateVidRating = useCandidateStore((s) => s.updateVidRating)
  const updateNotes = useCandidateStore((s) => s.updateNotes)
  const candidate = useCandidateStore((s) => s.candidates.find((c) => c.id === s.selectedId))

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeDrawer() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeDrawer])

  const ps = candidate ? calcPriorityScore(candidate) : 0
  const label = candidate ? getPriorityLabel(ps) : 'P3'
  const meta = getPriorityMeta(label)
  const initials = candidate ? candidate.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : ''

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeDrawer}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: drawerOpen ? 'blur(2px)' : 'none',
          WebkitBackdropFilter: drawerOpen ? 'blur(2px)' : 'none',
          zIndex: 100,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'all' : 'none',
          transition: 'opacity 0.25s',
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', top: 0, right: drawerOpen ? 0 : -460,
        width: 460, height: '100vh',
        background: 'linear-gradient(180deg, #0f0c22 0%, #090820 100%)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        zIndex: 101,
        transition: 'right 0.3s cubic-bezier(0.25,0.8,0.25,1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {candidate && (
          <>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(162,89,255,0.3), rgba(0,212,255,0.2))',
                  border: '1px solid rgba(162,89,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#a259ff',
                }}>{initials}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700, color: '#e8e4f5' }}>
                      {candidate.name}
                    </span>
                    {candidate.reviewed && <ReviewedDot />}
                  </div>
                  <p style={{ fontSize: 12, color: '#9b96b4', marginTop: 3 }}>{candidate.college}</p>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="btn-ghost"
                style={{ borderRadius: 8, width: 30, height: 30, padding: 0, fontSize: 14, flexShrink: 0 }}
                title="Close (Esc)"
              >✕</button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

              {/* Priority block */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16, borderRadius: 12, padding: '14px 16px', marginBottom: 14,
                background: meta.bg, border: `1px solid ${meta.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 10, color: '#9b96b4', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                    Priority Score
                  </div>
                  <div style={{
                    fontFamily: 'Syne, sans-serif', fontSize: 38, fontWeight: 800,
                    color: meta.color, lineHeight: 1, textShadow: `0 0 20px ${meta.glow}`,
                  }}>{ps}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <PriorityBadge label={label} size="lg" />
                  <span style={{ fontSize: 11, color: '#9b96b4' }}>{meta.description}</span>
                </div>
              </div>

              {/* Reviewed button */}
              <button
                onClick={() => toggleReviewed(candidate.id)}
                style={{
                  width: '100%', borderRadius: 8, padding: '8px', marginBottom: 18,
                  fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: candidate.reviewed ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${candidate.reviewed ? '#00d4ff' : 'rgba(255,255,255,0.1)'}`,
                  color: candidate.reviewed ? '#00d4ff' : '#9b96b4',
                  transition: 'all 0.2s',
                }}
              >
                {candidate.reviewed ? '✓ Reviewed' : 'Mark as Reviewed'}
              </button>

              {/* Score sliders */}
              <div style={{ marginBottom: 20 }}>
                <SectionHeading>Score Breakdown — Live Edit</SectionHeading>
                {SCORE_FIELDS.map(({ key, label: lbl, weight }) => (
                  <SliderInput
                    key={key}
                    label={lbl}
                    value={candidate[key]}
                    weight={weight}
                    onChange={(v) => updateCandidateScore(candidate.id, key, v)}
                  />
                ))}
                <p style={{ fontSize: 11, color: '#5c587a', textAlign: 'center', marginTop: 6, padding: '6px 0', background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}>
                  Priority score updates instantly as you edit
                </p>
              </div>

              {/* Assignment eval */}
              <div style={{ marginBottom: 20 }}>
                <SectionHeading>Assignment Evaluation</SectionHeading>
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 12 }}>
                  {Object.entries(ASGN_RATING_LABELS).map(([key, lbl]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, lastChild: { marginBottom: 0 } }}>
                      <span style={{ fontSize: 12, color: '#9b96b4', flex: 1 }}>{lbl}</span>
                      <StarRating
                        value={candidate.asgnRatings[key]}
                        onChange={(v) => updateAsgnRating(candidate.id, key, v)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Video eval */}
              <div style={{ marginBottom: 20 }}>
                <SectionHeading>Video Evaluation</SectionHeading>
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 12, marginBottom: 12 }}>
                  {Object.entries(VID_RATING_LABELS).map(([key, lbl]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: '#9b96b4', flex: 1 }}>{lbl}</span>
                      <StarRating
                        value={candidate.vidRatings[key]}
                        onChange={(v) => updateVidRating(candidate.id, key, v)}
                      />
                    </div>
                  ))}
                </div>
                <TimestampNotes candidate={candidate} />
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 16 }}>
                <SectionHeading>Recruiter Notes</SectionHeading>
                <textarea
                  value={candidate.notes}
                  onChange={(e) => updateNotes(candidate.id, e.target.value)}
                  placeholder="Add notes about this candidate..."
                  className="input-glass"
                  rows={4}
                  style={{ width: '100%', borderRadius: 10, padding: 10, fontSize: 12, lineHeight: 1.6, resize: 'vertical' }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
