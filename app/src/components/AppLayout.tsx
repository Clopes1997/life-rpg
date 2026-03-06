import { useGameStore } from '../store/gameStore'
import { clearGameState } from '../systems/saveSystem'
import { WalletDisplay } from './WalletDisplay'
import { clsx } from 'clsx'

export type AppTab = 'dashboard' | 'store' | 'history' | 'stats'

export interface AppLayoutProps {
  children: React.ReactNode
  activeTab: AppTab
  onTabChange: (tab: AppTab) => void
}

function formatLastRewardDate(iso: string): string {
  const d = new Date(iso)
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayISO = yesterday.toISOString().slice(0, 10)
  if (iso.startsWith(today)) return 'today'
  if (iso.startsWith(yesterdayISO)) return 'yesterday'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  const { wallet, streak, rewardHistory } = useGameStore()
  const lastPurchase = rewardHistory.find((r) => r.type === 'shop')

  const tabs: { id: AppTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'store', label: 'Store' },
    { id: 'history', label: 'History' },
    { id: 'stats', label: 'Stats' },
  ]

  return (
    <div className="max-w-[1100px] mx-auto flex flex-col gap-8">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center gap-6">
          <div className="text-[22px] font-extrabold tracking-tight">
            ⚔️ Life <span className="text-[var(--accent)]">RPG</span>
          </div>
          <nav className="flex gap-1" role="tablist" aria-label="Main navigation">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                aria-controls={`panel-${id}`}
                id={`tab-${id}`}
                onClick={() => onTabChange(id)}
                className={clsx(
                  'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                  activeTab === id
                    ? 'bg-[var(--accent)] text-black'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
                )}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <WalletDisplay coins={wallet} />
          {lastPurchase && (
            <div className="text-xs text-[var(--text-muted)]">
              Last reward: <span className="text-[var(--text)] font-medium">{lastPurchase.label}</span>
              {' – '}{formatLastRewardDate(lastPurchase.timestamp)}
            </div>
          )}
          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-2 text-sm font-semibold">
            <span className="text-base" aria-hidden>🔥</span>
            <span>{streak.current} day streak</span>
          </div>
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={() => {
                clearGameState()
                window.location.reload()
              }}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)]"
              title="Clear saved data and reload (temporary)"
            >
              Clear cache
            </button>
          )}
        </div>
      </header>
      <main className="flex flex-col gap-8">
        {children}
      </main>
    </div>
  )
}
