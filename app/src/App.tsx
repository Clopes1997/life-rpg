import { useEffect, useState } from 'react'
import { loadGameState } from './systems/saveSystem'
import { useGameStore } from './store/gameStore'
import { AppLayout, type AppTab } from './components/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { StorePage } from './pages/StorePage'
import { HistoryPage } from './pages/HistoryPage'
import { StatsPage } from './pages/StatsPage'

function App() {
  const { setFromLoadedState } = useGameStore()
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard')

  useEffect(() => {
    const loaded = loadGameState()
    if (loaded) {
      setFromLoadedState(loaded)
    }
  }, [setFromLoadedState])

  const tabContent =
    activeTab === 'dashboard' ? (
      <Dashboard />
    ) : activeTab === 'store' ? (
      <StorePage />
    ) : activeTab === 'stats' ? (
      <StatsPage />
    ) : (
      <HistoryPage />
    )

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6">
      <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {tabContent}
      </AppLayout>
    </div>
  )
}

export default App
