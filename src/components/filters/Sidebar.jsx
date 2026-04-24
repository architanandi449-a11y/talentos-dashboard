import React from 'react'
import { useCandidateStore } from '../../store/useCandidateStore'

const PRIORITY_OPTIONS = ['all', 'P0', 'P1', 'P2', 'P3']
const REVIEW_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'pending', label: 'Pending' },
]
const SORT_OPTIONS = [
  { value: 'priority', label: 'Priority Score' },
  { value: 'assignment', label: 'Assignment Score' },
  { value: 'video', label: 'Video Score' },
  { value: 'name', label: 'Name (A–Z)' },
]
const PRIORITY_COLORS = {
  P0: '#39ff6a', P1: '#ffd147', P2: '#ff8c2a', P3: '#ff4d6a',
}
const PRIORITY_GUIDE = [
  { p: 'P0', range: '≥80', desc: 'Interview now', color: '#39ff6a' },
  { p: 'P1', range: '65–79', desc: 'Strong shortlist', color: '#ffd147' },
  { p: 'P2', range: '50–64', desc: 'Review later', color: '#ff8c2a' },
  { p: 'P3', range: '<50', desc: 'Reject', color: '#ff4d6a' },
]

const RangeGroup = ({ label, minKey, maxKey }) => {
  const filters = useCandidateStore((s) => s.filters)
  const setFilter = useCandidateStore((s) => s.setFilter)
  const minVal = filters[minKey]
  const maxVal = filters[maxKey]

  return (
    <div style={{ marginBottom: 14 }}>
      <span className="filter-label">{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
        <span style={{ fontSize: 10, color: '#5c587a', width: 22, flexShrink: 0 }}>Min</span>
        <input
          type="range" min={0} max={100} value={minVal}
          onChange={(e) => setFilter(minKey, Number(e.target.value))}
          style={{ flex: 1, background: `linear-gradient(to right, #a259ff ${minVal}%, rgba(255,255,255,0.1) ${minVal}%)` }}
        />
        <span style={{ fontSize: 10, color: '#9b96b4', width: 24, textAlign: 'right', flexShrink: 0 }}>{minVal}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <span style={{ fontSize: 10, color: '#5c587a', width: 22, flexShrink: 0 }}>Max</span>
        <input
          type="range" min={0} max={100} value={maxVal}
          onChange={(e) => setFilter(maxKey, Number(e.target.value))}
          style={{ flex: 1, background: `linear-gradient(to right, #a259ff ${maxVal}%, rgba(255,255,255,0.1) ${maxVal}%)` }}
        />
        <span style={{ fontSize: 10, color: '#9b96b4', width: 24, textAlign: 'right', flexShrink: 0 }}>{maxVal}</span>
      </div>
    </div>
  )
}

export const Sidebar = () => {
  const filters = useCandidateStore((s) => s.filters)
  const sort = useCandidateStore((s) => s.sort)
  const setFilter = useCandidateStore((s) => s.setFilter)
  const setSort = useCandidateStore((s) => s.setSort)

  return (
    <aside style={{
      width: 248,
      flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>

        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <label className="filter-label">Search</label>
          <div style={{ position: 'relative', marginTop: 6 }}>
            <span style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: '#5c587a', pointerEvents: 'none', fontSize: 14,
            }}>⌕</span>
            <input
              type="text"
              placeholder="Name or college..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="input-glass"
              style={{ width: '100%', borderRadius: 8, paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7 }}
            />
          </div>
        </div>

        {/* Sort */}
        <div style={{ marginBottom: 16 }}>
          <label className="filter-label">Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-glass"
            style={{ width: '100%', borderRadius: 8, padding: '7px 10px', marginTop: 6, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235c587a\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', WebkitAppearance: 'none', appearance: 'none' }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} style={{ background: '#0d0a1e' }}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Score ranges */}
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
          <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 10, color: '#5c587a', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 12 }}>
            Score Ranges
          </p>
          <RangeGroup label="Assignment Score" minKey="asgnMin" maxKey="asgnMax" />
          <RangeGroup label="Video Score" minKey="vidMin" maxKey="vidMax" />
          <RangeGroup label="ATS Score" minKey="atsMin" maxKey="atsMax" />
        </div>

        {/* Review status */}
        <div style={{ marginBottom: 16 }}>
          <label className="filter-label">Review Status</label>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            {REVIEW_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setFilter('reviewStatus', o.value)}
                className={`seg-btn${filters.reviewStatus === o.value ? ' active' : ''}`}
                style={{ flex: 1 }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority filter */}
        <div style={{ marginBottom: 16 }}>
          <label className="filter-label">Priority</label>
          <div style={{ display: 'flex', gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
            {PRIORITY_OPTIONS.map((p) => {
              const isActive = filters.priority === p
              const color = PRIORITY_COLORS[p]
              return (
                <button
                  key={p}
                  onClick={() => setFilter('priority', p)}
                  className={`seg-btn${isActive ? ' active' : ''}`}
                  style={
                    isActive && p !== 'all'
                      ? { color, borderColor: color, background: `${color}18` }
                      : !isActive && p !== 'all'
                      ? { color: color + '88' }
                      : {}
                  }
                >
                  {p === 'all' ? 'All' : p}
                </button>
              )
            })}
          </div>
        </div>

        {/* Priority legend */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 12 }}>
          <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 10, color: '#5c587a', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 8 }}>
            Priority Guide
          </p>
          {PRIORITY_GUIDE.map(({ p, range, desc, color }) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}88`, flexShrink: 0 }} />
              <span style={{ color, fontSize: 11, fontWeight: 600, fontFamily: 'Syne, sans-serif', width: 20 }}>{p}</span>
              <span style={{ color: '#5c587a', fontSize: 10, width: 36 }}>{range}</span>
              <span style={{ color: '#9b96b4', fontSize: 10 }}>{desc}</span>
            </div>
          ))}
        </div>

      </div>
    </aside>
  )
}
