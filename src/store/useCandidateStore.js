import { create } from 'zustand'
import { generateCandidates } from '../data/candidates'
import { calcPriorityScore, getPriorityLabel } from '../utils/priority'

const initialCandidates = generateCandidates(100)

export const useCandidateStore = create((set, get) => ({
  // ─── Data ────────────────────────────────────────────────
  candidates: initialCandidates,

  // ─── Selection ───────────────────────────────────────────
  selectedId: null,
  compareIds: [],

  // ─── Filters ─────────────────────────────────────────────
  filters: {
    search: '',
    asgnMin: 0,
    asgnMax: 100,
    vidMin: 0,
    vidMax: 100,
    atsMin: 0,
    atsMax: 100,
    reviewStatus: 'all',   // 'all' | 'reviewed' | 'pending'
    priority: 'all',       // 'all' | 'P0' | 'P1' | 'P2' | 'P3'
  },

  // ─── Sort ────────────────────────────────────────────────
  sort: 'priority',  // 'priority' | 'assignment' | 'video' | 'name'

  // ─── UI State ────────────────────────────────────────────
  drawerOpen: false,
  compareModalOpen: false,

  // ─── Actions ─────────────────────────────────────────────

  selectCandidate: (id) => set({ selectedId: id, drawerOpen: true }),

  closeDrawer: () => set({ drawerOpen: false, selectedId: null }),

  updateCandidateScore: (id, field, value) => {
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }))
  },

  toggleReviewed: (id) => {
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id ? { ...c, reviewed: !c.reviewed } : c
      ),
    }))
  },

  toggleShortlisted: (id) => {
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id ? { ...c, shortlisted: !c.shortlisted } : c
      ),
    }))
  },

  updateAsgnRating: (id, key, value) => {
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id
          ? { ...c, asgnRatings: { ...c.asgnRatings, [key]: value } }
          : c
      ),
    }))
  },

  updateVidRating: (id, key, value) => {
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id
          ? { ...c, vidRatings: { ...c.vidRatings, [key]: value } }
          : c
      ),
    }))
  },

  addTimestamp: (id, time, note) => {
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id
          ? { ...c, timestamps: [...c.timestamps, { time, note, id: Date.now() }] }
          : c
      ),
    }))
  },

  removeTimestamp: (candidateId, tsId) => {
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === candidateId
          ? { ...c, timestamps: c.timestamps.filter((t) => t.id !== tsId) }
          : c
      ),
    }))
  },

  updateNotes: (id, notes) => {
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id ? { ...c, notes } : c
      ),
    }))
  },

  // ─── Filter Actions ──────────────────────────────────────

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }))
  },

  setSort: (sort) => set({ sort }),

  resetFilters: () => set({
    filters: {
      search: '',
      asgnMin: 0, asgnMax: 100,
      vidMin: 0, vidMax: 100,
      atsMin: 0, atsMax: 100,
      reviewStatus: 'all',
      priority: 'all',
    },
  }),

  // ─── Compare Actions ─────────────────────────────────────

  toggleCompare: (id) => {
    const { compareIds } = get()
    if (compareIds.includes(id)) {
      set({ compareIds: compareIds.filter((x) => x !== id) })
    } else if (compareIds.length < 3) {
      set({ compareIds: [...compareIds, id] })
    }
  },

  clearCompare: () => set({ compareIds: [] }),

  openCompareModal: () => set({ compareModalOpen: true }),
  closeCompareModal: () => set({ compareModalOpen: false }),

  // ─── Derived Getters ─────────────────────────────────────

  getFilteredCandidates: () => {
    const { candidates, filters, sort } = get()

    let result = candidates.filter((c) => {
      const q = filters.search.toLowerCase()
      if (q && !c.name.toLowerCase().includes(q) && !c.college.toLowerCase().includes(q)) return false
      if (c.assignment_score < filters.asgnMin || c.assignment_score > filters.asgnMax) return false
      if (c.video_score < filters.vidMin || c.video_score > filters.vidMax) return false
      if (c.ats_score < filters.atsMin || c.ats_score > filters.atsMax) return false
      if (filters.reviewStatus === 'reviewed' && !c.reviewed) return false
      if (filters.reviewStatus === 'pending' && c.reviewed) return false
      if (filters.priority !== 'all') {
        const ps = calcPriorityScore(c)
        if (getPriorityLabel(ps) !== filters.priority) return false
      }
      return true
    })

    result.sort((a, b) => {
      switch (sort) {
        case 'priority': return calcPriorityScore(b) - calcPriorityScore(a)
        case 'assignment': return b.assignment_score - a.assignment_score
        case 'video': return b.video_score - a.video_score
        case 'name': return a.name.localeCompare(b.name)
        default: return calcPriorityScore(b) - calcPriorityScore(a)
      }
    })

    return result
  },

  getStats: () => {
    const { candidates } = get()
    const reviewed = candidates.filter((c) => c.reviewed).length
    const shortlisted = candidates.filter((c) => {
      const lbl = getPriorityLabel(calcPriorityScore(c))
      return lbl === 'P0' || lbl === 'P1'
    }).length
    return {
      total: candidates.length,
      reviewed,
      shortlisted,
      pending: candidates.length - reviewed,
    }
  },

  getCandidate: (id) => get().candidates.find((c) => c.id === id),
}))
