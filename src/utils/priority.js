/**
 * Priority Engine
 * 
 * Priority Score = 0.30 × Assignment + 0.25 × Video + 0.20 × ATS + 0.15 × GitHub + 0.10 × Comm
 *
 * P0 (>=80): Interview immediately
 * P1 (65–79): Strong shortlist
 * P2 (50–64): Review later
 * P3 (<50): Reject
 */

export const WEIGHTS = {
  assignment_score: 0.30,
  video_score: 0.25,
  ats_score: 0.20,
  github_score: 0.15,
  communication_score: 0.10,
}

export const calcPriorityScore = (candidate) => {
  const score =
    WEIGHTS.assignment_score * candidate.assignment_score +
    WEIGHTS.video_score * candidate.video_score +
    WEIGHTS.ats_score * candidate.ats_score +
    WEIGHTS.github_score * candidate.github_score +
    WEIGHTS.communication_score * candidate.communication_score

  return Math.round(score)
}

export const getPriorityLabel = (score) => {
  if (score >= 80) return 'P0'
  if (score >= 65) return 'P1'
  if (score >= 50) return 'P2'
  return 'P3'
}

export const getPriorityMeta = (label) => {
  const map = {
    P0: {
      color: '#39ff6a',
      bg: 'rgba(57,255,106,0.12)',
      border: 'rgba(57,255,106,0.3)',
      glow: 'rgba(57,255,106,0.4)',
      description: 'Interview immediately',
      dotClass: 'bg-priority-p0',
    },
    P1: {
      color: '#ffd147',
      bg: 'rgba(255,209,71,0.12)',
      border: 'rgba(255,209,71,0.3)',
      glow: 'rgba(255,209,71,0.4)',
      description: 'Strong shortlist',
      dotClass: 'bg-priority-p1',
    },
    P2: {
      color: '#ff8c2a',
      bg: 'rgba(255,140,42,0.12)',
      border: 'rgba(255,140,42,0.3)',
      glow: 'rgba(255,140,42,0.3)',
      description: 'Review later',
      dotClass: 'bg-priority-p2',
    },
    P3: {
      color: '#ff4d6a',
      bg: 'rgba(255,77,106,0.12)',
      border: 'rgba(255,77,106,0.3)',
      glow: 'rgba(255,77,106,0.3)',
      description: 'Reject',
      dotClass: 'bg-priority-p3',
    },
  }
  return map[label] || map['P3']
}

export const getScoreColor = (score) => {
  if (score >= 80) return '#39ff6a'
  if (score >= 65) return '#a259ff'
  if (score >= 50) return '#00d4ff'
  if (score >= 35) return '#ff8c2a'
  return '#ff4d6a'
}
