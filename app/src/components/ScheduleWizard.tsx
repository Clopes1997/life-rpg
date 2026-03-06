import { useState } from 'react'
import type { ScheduleWizardAnswers } from '../types/ScheduleWizard'
import type { Schedule, TimeOfDay } from '../types'
import { buildScheduleFromWizardAnswers } from '../utils/scheduleWizard'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const TIME_OF_DAY_OPTIONS: { value: TimeOfDay; label: string }[] = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'flexible', label: 'Anytime (flexible)' },
]

const defaultAnswers: ScheduleWizardAnswers = {
  wakeTime: '08:00',
  sleepTarget: '23:00',
  prioritiesRaw: '',
  defaultTimeOfDay: 'flexible',
  defaultDurationHours: 1,
  exerciseMinutes: 30,
  studySkillsRaw: '',
  weeklyEvents: [],
}

interface ScheduleWizardProps {
  onComplete: (schedule: Schedule) => void
  onCancel?: () => void
}

export function ScheduleWizard({ onComplete, onCancel }: ScheduleWizardProps) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<ScheduleWizardAnswers>(defaultAnswers)

  const update = (patch: Partial<ScheduleWizardAnswers>) => {
    setAnswers((a) => ({ ...a, ...patch }))
  }

  const schedule = buildScheduleFromWizardAnswers(answers)

  const handleDownload = () => {
    const json = JSON.stringify(schedule, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'life-rpg-schedule.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleUseSchedule = () => {
    onComplete(schedule)
  }

  if (step === 1) {
    return (
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold mb-4">Create your schedule</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">A few questions to build your daily quests.</p>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">What time do you wake up?</label>
            <input
              type="time"
              value={answers.wakeTime}
              onChange={(e) => update({ wakeTime: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-[var(--text)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">What time do you aim to sleep?</label>
            <input
              type="time"
              value={answers.sleepTarget}
              onChange={(e) => update({ sleepTarget: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-[var(--text)]"
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          {onCancel && (
            <button type="button" onClick={onCancel} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
              Cancel
            </button>
          )}
          <button type="button" onClick={() => setStep(2)} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:opacity-90 ml-auto">
            Next
          </button>
        </div>
      </section>
    )
  }

  if (step === 2) {
    return (
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold mb-4">Daily priorities</h2>
        <p className="text-sm text-[var(--text-muted)] mb-2">What are your daily priorities? (e.g. job hunting, coding, exercise)</p>
        <p className="text-xs text-[var(--text-muted)] mb-3">Separate with commas.</p>
        <input
          type="text"
          value={answers.prioritiesRaw}
          onChange={(e) => update({ prioritiesRaw: e.target.value })}
          placeholder="job hunting, coding practice, exercise"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--text-muted)]"
        />
        <div className="flex justify-between mt-6">
          <button type="button" onClick={() => setStep(1)} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
            Back
          </button>
          <button type="button" onClick={() => setStep(3)} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
            Next
          </button>
        </div>
      </section>
    )
  }

  if (step === 3) {
    return (
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold mb-4">When and how long</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">When do you usually do these tasks? Default duration for each block (exercise will use its own).</p>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Time of day (phase)</label>
            <select
              value={answers.defaultTimeOfDay}
              onChange={(e) => update({ defaultTimeOfDay: e.target.value as TimeOfDay })}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-[var(--text)]"
            >
              {TIME_OF_DAY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Default duration (hours per task)</label>
            <input
              type="number"
              min={0.25}
              max={8}
              step={0.25}
              value={answers.defaultDurationHours}
              onChange={(e) => update({ defaultDurationHours: Math.max(0.25, parseFloat(e.target.value) || 1) })}
              className="w-full max-w-[120px] rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-[var(--text)]"
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button type="button" onClick={() => setStep(2)} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
            Back
          </button>
          <button type="button" onClick={() => setStep(4)} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
            Next
          </button>
        </div>
      </section>
    )
  }

  if (step === 4) {
    return (
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold mb-4">Exercise</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Do you exercise? How many minutes per day? (0 to skip)</p>
        <input
          type="number"
          min={0}
          max={180}
          value={answers.exerciseMinutes}
          onChange={(e) => update({ exerciseMinutes: Math.max(0, parseInt(e.target.value, 10) || 0) })}
          className="w-full max-w-[120px] rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-[var(--text)]"
        />
        <span className="ml-2 text-sm text-[var(--text-muted)]">minutes</span>
        <div className="flex justify-between mt-6">
          <button type="button" onClick={() => setStep(3)} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
            Back
          </button>
          <button type="button" onClick={() => setStep(5)} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
            Next
          </button>
        </div>
      </section>
    )
  }

  if (step === 5) {
    return (
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold mb-4">Study or skills</h2>
        <p className="text-sm text-[var(--text-muted)] mb-2">Do you study or practice skills? Which ones? (optional, comma-separated)</p>
        <input
          type="text"
          value={answers.studySkillsRaw}
          onChange={(e) => update({ studySkillsRaw: e.target.value })}
          placeholder="python, react, music"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--text-muted)]"
        />
        <div className="flex justify-between mt-6">
          <button type="button" onClick={() => setStep(4)} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
            Back
          </button>
          <button type="button" onClick={() => setStep(6)} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
            Next
          </button>
        </div>
      </section>
    )
  }

  if (step === 6) {
    return (
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold mb-4">Weekly events</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Any weekly events on fixed days? (e.g. voice acting lesson, therapy). Optional.</p>
        <div className="space-y-3 mb-4">
          {answers.weeklyEvents.map((ev, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] p-3">
              <input
                type="text"
                value={ev.title}
                onChange={(e) => {
                  const next = [...answers.weeklyEvents]
                  next[i] = { ...next[i], title: e.target.value }
                  update({ weeklyEvents: next })
                }}
                placeholder="Event name"
                className="flex-1 min-w-[120px] rounded border border-[var(--border)] bg-[var(--surface-raised)] px-2 py-1.5 text-sm"
              />
              <select
                value={ev.day}
                onChange={(e) => {
                  const next = [...answers.weeklyEvents]
                  next[i] = { ...next[i], day: parseInt(e.target.value, 10) }
                  update({ weeklyEvents: next })
                }}
                className="rounded border border-[var(--border)] bg-[var(--surface-raised)] px-2 py-1.5 text-sm text-[var(--text)]"
              >
                {DAY_NAMES.map((name, d) => (
                  <option key={d} value={d}>{name}</option>
                ))}
              </select>
              <input
                type="number"
                min={0.25}
                step={0.25}
                value={ev.durationHours}
                onChange={(e) => {
                  const next = [...answers.weeklyEvents]
                  next[i] = { ...next[i], durationHours: parseFloat(e.target.value) || 1 }
                  update({ weeklyEvents: next })
                }}
                className="w-16 rounded border border-[var(--border)] bg-[var(--surface-raised)] px-2 py-1.5 text-sm text-right"
              />
              <span className="text-sm text-[var(--text-muted)]">hrs</span>
              <input
                type="number"
                min={0}
                placeholder="Coins"
                value={ev.coinReward ?? 25}
                onChange={(e) => {
                  const next = [...answers.weeklyEvents]
                  next[i] = { ...next[i], coinReward: parseInt(e.target.value, 10) || 25 }
                  update({ weeklyEvents: next })
                }}
                className="w-14 rounded border border-[var(--border)] bg-[var(--surface-raised)] px-2 py-1.5 text-sm text-right"
              />
              <span className="text-sm text-[var(--text-muted)]">coins</span>
              <button
                type="button"
                onClick={() => update({ weeklyEvents: answers.weeklyEvents.filter((_, j) => j !== i) })}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => update({ weeklyEvents: [...answers.weeklyEvents, { title: '', day: 1, durationHours: 1, coinReward: 25 }] })}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6"
        >
          + Add weekly event
        </button>
        <div className="flex justify-between">
          <button type="button" onClick={() => setStep(5)} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
            Back
          </button>
          <button type="button" onClick={() => setStep(7)} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
            Generate schedule
          </button>
        </div>
      </section>
    )
  }

  // step 7: done — show download + use
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="text-lg font-bold mb-2">Your schedule is ready</h2>
      <p className="text-sm text-[var(--text-muted)] mb-4">
        You can download the JSON file to keep a backup or edit it later. Then apply it to start your daily quests.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-raised)]"
        >
          Download schedule JSON
        </button>
        <button
          type="button"
          onClick={handleUseSchedule}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          Use this schedule
        </button>
      </div>
    </section>
  )
}
