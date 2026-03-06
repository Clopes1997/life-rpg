import { Coins } from 'lucide-react'

export interface PurchaseConfirmModalProps {
  title: string
  cost: number
  description: string
  icon: string
  onConfirm: () => void
  onCancel: () => void
}

export function PurchaseConfirmModal({
  title,
  cost,
  description,
  icon,
  onConfirm,
  onCancel,
}: PurchaseConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="purchase-modal-title"
    >
      <div
        className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="purchase-modal-title" className="text-lg font-bold mb-4">
          Confirm Purchase
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl" aria-hidden>
            {icon}
          </span>
          <div>
            <div className="font-semibold text-[var(--text)]">{title}</div>
            <div className="flex items-center gap-1.5 text-[var(--accent)] font-medium">
              <Coins size={18} aria-hidden />
              <span>Cost: {cost} coins</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)] mb-6">{description}</p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-raised)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
          >
            Buy Reward
          </button>
        </div>
      </div>
    </div>
  )
}
