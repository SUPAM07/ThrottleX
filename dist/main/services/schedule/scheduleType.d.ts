/**
 * Schedule type definitions for time-based rate limit adjustments.
 */
export type ScheduleType = 'time_range' | 'cron' | 'day_of_week' | 'recurring';
export interface TimeRangeSchedule {
    type: 'time_range';
    startHour: number;
    endHour: number;
    timezone?: string;
}
export interface CronSchedule {
    type: 'cron';
    expression: string;
}
export interface DayOfWeekSchedule {
    type: 'day_of_week';
    days: number[];
    startHour: number;
    endHour: number;
}
export interface RecurringSchedule {
    type: 'recurring';
    intervalMs: number;
    durationMs: number;
}
export type Schedule = TimeRangeSchedule | CronSchedule | DayOfWeekSchedule | RecurringSchedule;
/**
 * Check if a time-range schedule is currently active.
 */
export declare function isTimeRangeActive(schedule: TimeRangeSchedule, now?: Date): boolean;
/**
 * Check if a day-of-week schedule is currently active.
 */
export declare function isDayOfWeekActive(schedule: DayOfWeekSchedule, now?: Date): boolean;
//# sourceMappingURL=scheduleType.d.ts.map