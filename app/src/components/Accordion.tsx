import { useState } from 'react'
import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'

export interface AccordionProps {
  /** Title shown in the header (always visible). */
  title: string
  /** Optional summary line, e.g. "5 / 12 quests" */
  summary?: string
  /** Whether the section is open by default. */
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

export function Accordion({ title, summary, defaultOpen = true, children, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className={clsx('rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden', className)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left hover:bg-[var(--surface-raised)]/50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-[var(--text)]">{title}</span>
        <div className="flex items-center gap-2">
          {summary != null && (
            <span className="text-xs text-[var(--text-muted)]">{summary}</span>
          )}
          <ChevronDown
            size={18}
            className={clsx('text-[var(--text-muted)] transition-transform', open && 'rotate-180')}
            aria-hidden
          />
        </div>
      </button>
      {open && <div className="px-5 pb-5 pt-0 border-t border-[var(--border)]/50">{children}</div>}
    </div>
  )
}
