import React from 'react'
import { Topbar } from './components/layout/Topbar'
import { Sidebar } from './components/filters/Sidebar'
import { CandidateTable } from './components/table/CandidateTable'
import { CandidateDrawer } from './components/drawer/CandidateDrawer'
import { CompareModal } from './components/comparison/CompareModal'

export default function App() {
  return (
    <div className="app-root">
      <Topbar />
      <div className="app-main">
        <Sidebar />
        <CandidateTable />
      </div>
      <CandidateDrawer />
      <CompareModal />
    </div>
  )
}
