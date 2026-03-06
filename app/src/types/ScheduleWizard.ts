import type { TimeOfDay } from './Schedule'

/**
 * Answers collected from the schedule wizard (Ask.md / SCHEDULE_SCHEMA).
 */
export interface ScheduleWizardAnswers {
  wakeTime: string
  sleepTarget: string
  /** Raw input; parsed to array when building schedule (so commas/backspace behave normally). */
  prioritiesRaw: string
  /** Default time of day for generated blocks (morning / afternoon / evening / anytime). */
  defaultTimeOfDay: TimeOfDay
  /** Default duration in hours for priority/study blocks (exercise has its own). */
  defaultDurationHours: number
  exerciseMinutes: number
  /** Raw input; parsed to array when building schedule. */
  studySkillsRaw: string
  weeklyEvents: { title: string; day: number; durationHours: number; coinReward: number }[]
}
