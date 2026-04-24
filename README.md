# TalentOS — Recruiter Dashboard

A production-quality internal hiring dashboard for evaluating and shortlisting 1000+ candidates.

## ✦ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite |
| State | Zustand (central store, no prop drilling) |
| Styling | Tailwind CSS v3 + custom CSS |
| Fonts | Syne (display) + DM Sans (body) |

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

---

## 🏗️ Folder Structure

```
src/
├── App.jsx                        # Root layout
├── main.jsx                       # React entry
├── index.css                      # Global styles + Tailwind

├── data/
│   └── candidates.js              # Generator for 100 realistic candidates

├── store/
│   └── useCandidateStore.js       # Zustand store — all state + derived getters

├── utils/
│   └── priority.js                # Priority engine (score formula + labels)

└── components/
    ├── ui/
    │   └── index.jsx              # Reusable: PriorityBadge, ScoreBar, StarRating, SliderInput, Tooltip, Skeleton...
    │
    ├── layout/
    │   └── Topbar.jsx             # Top nav with live stats + compare/reset actions
    │
    ├── filters/
    │   └── Sidebar.jsx            # Score range sliders, search, sort, priority & review filters
    │
    ├── table/
    │   └── CandidateTable.jsx     # Sticky-header table with compare checkboxes + compare bar
    │
    ├── drawer/
    │   └── CandidateDrawer.jsx    # Slide-in panel: score sliders, star ratings, timestamp notes
    │
    └── comparison/
        └── CompareModal.jsx       # Side-by-side modal for 2–3 candidates
```

---

## 🧮 Priority Engine

```
Priority Score = 0.30 × Assignment
               + 0.25 × Video
               + 0.20 × ATS
               + 0.15 × GitHub
               + 0.10 × Communication

P0 (≥80)  → Interview immediately   🟢
P1 (65–79) → Strong shortlist        🟡
P2 (50–64) → Review later           🟠
P3 (<50)   → Reject                 🔴
```

Priority updates **live** whenever any score slider is moved — no manual refresh.

---

## 🎯 Feature Checklist

- [x] 100 candidates with realistic correlated score distributions
- [x] Live priority score calculation (updates on every slider move)
- [x] Search by name or college
- [x] Score range filters (Assignment, Video, ATS)
- [x] Review status filter (All / Reviewed / Pending)
- [x] Priority tier filter (All / P0 / P1 / P2 / P3)
- [x] Sort by Priority, Assignment, Video, Name
- [x] Sticky table header
- [x] Candidate detail drawer (smooth slide-in)
- [x] Editable score sliders in drawer
- [x] Assignment evaluation (6 criteria, star ratings)
- [x] Video evaluation (5 criteria, star ratings)
- [x] Timestamp notes system (e.g. `02:10 → clear explanation`)
- [x] General recruiter notes textarea
- [x] Mark as Reviewed toggle
- [x] Comparison mode (select 2–3, side-by-side modal)
- [x] "Top Pick" winner highlight in comparison
- [x] Highest score per category highlighted in comparison
- [x] Summary stats in topbar (live)
- [x] Empty state for zero results
- [x] Escape key closes drawer/modal
- [x] Glassmorphism + neon dark theme

---

## 🎨 Design System

| Variable | Value |
|----------|-------|
| Background | `#07050f` → `#080d20` gradient |
| Surface | `rgba(255,255,255,0.04)` with backdrop-blur |
| Accent | Neon purple `#a259ff` + cyan `#00d4ff` |
| P0 | `#39ff6a` (neon green) |
| P1 | `#ffd147` (gold) |
| P2 | `#ff8c2a` (amber) |
| P3 | `#ff4d6a` (red) |
| Display font | Syne 700/800 |
| Body font | DM Sans 400/500 |

---

## Live Demo

-- https://sage-lokum-3f6366.netlify.app/

---

## Setup 

-- Clone the repository

git clone https://github.com/YOUR_USERNAME/talentos-dashboard.git
cd talentos-dashboard

-- Install dependencies
npm install3️

-- Run locally
npm run dev

-- Open in browser:
http://localhost:5173

-- Build for production
npm run build

-- Output will be generated in the dist/ folder

## 🔮 Extending to 1000+ Candidates

The generator is ready — just change the count:

```js
// src/store/useCandidateStore.js
const initialCandidates = generateCandidates(1000) // change 100 → 1000
```

For large datasets, consider adding virtual scrolling via `@tanstack/react-virtual`.
