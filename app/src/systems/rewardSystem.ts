/**
 * Centralized reward system: buffers quest rewards, aggregates them,
 * updates wallet/history, and triggers the reward popup.
 */

const BUFFER_MS = 400

interface BufferedReward {
  label: string
  amount: number
}

export interface RewardPopupPayload {
  totalCoins: number
  labels: string[]
}

export interface RewardStoreApi {
  addCoins: (amount: number, label: string, type: 'quest' | 'streak' | 'random' | 'shop') => void
  /** Add reward to the single active toast (creates or accumulates). */
  addRewardToToast: (amount: number, labels: string[]) => void
}

let buffer: BufferedReward[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

function flush(getStore: () => RewardStoreApi): void {
  if (buffer.length === 0) return
  const total = buffer.reduce((sum, r) => sum + r.amount, 0)
  const labels = buffer.map((r) => r.label)
  const label = labels.length === 1 ? labels[0]! : labels.join(', ')
  const store = getStore()
  store.addCoins(total, label, 'quest')
  store.addRewardToToast(total, labels)
  buffer = []
  if (flushTimer != null) {
    clearTimeout(flushTimer)
    flushTimer = null
  }
}

/**
 * Record a quest completion reward. Rewards within BUFFER_MS are aggregated
 * into a single wallet update and one popup.
 */
export function recordQuestReward(
  label: string,
  amount: number,
  getStore: () => RewardStoreApi
): void {
  buffer.push({ label, amount })
  if (flushTimer != null) clearTimeout(flushTimer)
  flushTimer = setTimeout(() => flush(getStore), BUFFER_MS)
}
