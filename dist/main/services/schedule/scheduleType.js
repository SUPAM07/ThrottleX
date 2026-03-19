"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTimeRangeActive = isTimeRangeActive;
exports.isDayOfWeekActive = isDayOfWeekActive;
/**
 * Check if a time-range schedule is currently active.
 */
function isTimeRangeActive(schedule, now = new Date()) {
    const hour = now.getHours();
    if (schedule.startHour <= schedule.endHour) {
        return hour >= schedule.startHour && hour < schedule.endHour;
    }
    // Wraps midnight (e.g., 22:00–06:00)
    return hour >= schedule.startHour || hour < schedule.endHour;
}
/**
 * Check if a day-of-week schedule is currently active.
 */
function isDayOfWeekActive(schedule, now = new Date()) {
    const day = now.getDay();
    const hour = now.getHours();
    return schedule.days.includes(day) && hour >= schedule.startHour && hour < schedule.endHour;
}
//# sourceMappingURL=scheduleType.js.map