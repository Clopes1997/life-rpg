import type { Schedule, WeekdayBlock, WeeklyEvent } from '../types'
import type { ScheduleWizardAnswers } from '../types/ScheduleWizard'

/** Convert "Job Hunting" -> job_hunting */
function toId(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

/** Convert "job_hunting" -> "Job Hunting" */
function toTitle(id: string): string {
  return id
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function defaultCategory(id: string): string {
  const lower = id.toLowerCase()
  if (lower.includes('job') || lower.includes('work') || lower.includes('career')) return 'Career'
  if (lower.includes('exercise') || lower.includes('workout') || lower.includes('health')) return 'Health'
  if (lower.includes('code') || lower.includes('study') || lower.includes('skill')) return 'Skills'
  if (lower.includes('music') || lower.includes('sing') || lower.includes('creative')) return 'Creative'
  return 'Daily'
}

function parseCommaList(raw: string): string[] {
  return raw.split(',').map((s) => s.trim()).filter(Boolean)
}

/**
 * Build a valid Schedule from wizard answers. Used when user is brand new and creates schedule via wizard.
 */
export function buildScheduleFromWizardAnswers(answers: ScheduleWizardAnswers): Schedule {
  const priorities = parseCommaList(answers.prioritiesRaw)
  const studySkills = parseCommaList(answers.studySkillsRaw)
  const blockIds = new Set<string>()
  const weekdayBlocks: WeekdayBlock[] = []

  for (const p of priorities) {
    const id = toId(p) || 'priority'
    if (blockIds.has(id)) continue
    blockIds.add(id)
    weekdayBlocks.push({
      id,
      title: toTitle(id),
      category: defaultCategory(id),
      duration: 1,
      coinReward: 25,
      repeatable: true,
    })
  }

  if (answers.exerciseMinutes > 0) {
    const id = 'exercise'
    if (!blockIds.has(id)) {
      blockIds.add(id)
      weekdayBlocks.push({
        id,
        title: 'Exercise',
        category: 'Health',
        duration: Math.max(0.25, answers.exerciseMinutes / 60),
        coinReward: 20,
        repeatable: false,
      })
    }
  }

  for (const s of studySkills) {
    const id = toId(s) || `skill_${blockIds.size}`
    if (blockIds.has(id)) continue
    blockIds.add(id)
    weekdayBlocks.push({
      id,
      title: toTitle(id),
      category: 'Skills',
      duration: 1,
      coinReward: 25,
      repeatable: true,
    })
  }

  const priorityIds = priorities.map(toId).filter(Boolean)
  if (answers.exerciseMinutes > 0 && !priorityIds.includes('exercise')) {
    priorityIds.push('exercise')
  }

  const weeklyEvents: WeeklyEvent[] = answers.weeklyEvents.map((e, i) => ({
    id: toId(e.title) || `weekly_${i}`,
    title: e.title.trim() || `Weekly ${i + 1}`,
    day: e.day,
    duration: e.durationHours,
    coinReward: 25,
  }))

  const minimumHabits = priorityIds.slice(0, 3)
  const minimumDayTasks = priorityIds.slice(0, 3)

  return {
    version: 1,
    profile: {
      wakeTime: answers.wakeTime || '08:00',
      sleepTarget: answers.sleepTarget || '23:00',
    },
    priorities: priorityIds,
    weekdayBlocks,
    weeklyEvents,
    weekendRules: {
      restFocused: true,
      minimumHabits: minimumHabits.length ? minimumHabits : (weekdayBlocks.slice(0, 2).map((b) => b.id)),
    },
    minimumDay: {
      tasks: minimumDayTasks.length ? minimumDayTasks : (weekdayBlocks.slice(0, 2).map((b) => b.id)),
    },
  }
}
