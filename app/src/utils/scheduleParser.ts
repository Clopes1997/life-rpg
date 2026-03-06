import { z } from 'zod'
import type { Schedule } from '../types'

const ScheduleProfileSchema = z.object({
  wakeTime: z.string(),
  sleepTarget: z.string(),
})

const TimeOfDaySchema = z.enum(['morning', 'afternoon', 'evening', 'flexible']).optional()

const WeekdayBlockSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  duration: z.number(),
  coinReward: z.number(),
  repeatable: z.boolean(),
  timeOfDay: TimeOfDaySchema,
})

const WeeklyEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  day: z.number().min(0).max(6),
  duration: z.number(),
  coinReward: z.number(),
  timeOfDay: TimeOfDaySchema,
})

const WeekendRulesSchema = z.object({
  restFocused: z.boolean(),
  minimumHabits: z.array(z.string()),
})

const MinimumDaySchema = z.object({
  tasks: z.array(z.string()),
})

const ThpOverrideSchema = z.object({
  replaceBlockIds: z.array(z.string()),
}).optional()

const ScheduleSchema = z.object({
  version: z.number(),
  profile: ScheduleProfileSchema,
  priorities: z.array(z.string()),
  weekdayBlocks: z.array(WeekdayBlockSchema),
  weeklyEvents: z.array(WeeklyEventSchema),
  weekendRules: WeekendRulesSchema,
  minimumDay: MinimumDaySchema,
  thpOverride: ThpOverrideSchema,
})

export type ScheduleParseResult =
  | { success: true; schedule: Schedule }
  | { success: false; error: string }

export function parseScheduleJson(json: string): ScheduleParseResult {
  try {
    const data = JSON.parse(json)
    const result = ScheduleSchema.safeParse(data)
    if (!result.success) {
      const msg = result.error.issues.map((e) => `${String(e.path.join('.'))}: ${e.message}`).join('; ')
      return { success: false, error: msg }
    }
    return { success: true, schedule: result.data as Schedule }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Invalid JSON' }
  }
}
