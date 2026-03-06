/**
 * Answers collected from the schedule wizard (Ask.md / SCHEDULE_SCHEMA).
 */
export interface ScheduleWizardAnswers {
  wakeTime: string
  sleepTarget: string
  /** Raw input; parsed to array when building schedule (so commas/backspace behave normally). */
  prioritiesRaw: string
  exerciseMinutes: number
  /** Raw input; parsed to array when building schedule. */
  studySkillsRaw: string
  weeklyEvents: { title: string; day: number; durationHours: number }[]
}
