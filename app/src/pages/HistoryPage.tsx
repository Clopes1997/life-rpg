import { useGameStore } from '../store/gameStore'
import { Coins } from 'lucide-react'

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  })
}

export function HistoryPage() {
  const { rewardHistory } = useGameStore()

  const purchases = rewardHistory.filter((r) => r.type === 'shop')

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span aria-hidden>📜</span>
        Purchase history
      </h2>
      {purchases.length === 0 ? (
        <p className="text-[var(--text-muted)] text-sm">
          No purchases yet. Complete quests to earn coins, then spend them in the Store.
        </p>
      ) : (
        <ul className="space-y-2">
          {purchases.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Coins size={18} className="text-[var(--accent)] shrink-0" aria-hidden />
                <span className="font-medium text-[var(--text)] truncate">{r.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[var(--accent)] font-semibold">-{Math.abs(r.amount)}</span>
                <span className="text-xs text-[var(--text-muted)]">
                  {formatTimestamp(r.timestamp)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
