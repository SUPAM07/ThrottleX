"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleManager = void 0;
const scheduleType_1 = require("./scheduleType");
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Manages schedule-based rate limit configuration changes.
 * Evaluates registered schedules and returns the effective configuration.
 */
class ScheduleManager {
    entries = [];
    /**
     * Register a new schedule with its transition configuration.
     */
    register(id, schedule, transition) {
        this.entries.push({ id, schedule, transition });
        // Sort by priority descending
        this.entries.sort((a, b) => b.transition.priority - a.transition.priority);
        logger_1.default.info('Schedule registered', { id, type: schedule.type });
    }
    /**
     * Remove a schedule by ID.
     */
    unregister(id) {
        const idx = this.entries.findIndex((e) => e.id === id);
        if (idx >= 0) {
            this.entries.splice(idx, 1);
            return true;
        }
        return false;
    }
    /**
     * Evaluate all schedules and return the config overrides for a key.
     * Returns null if no schedule is active for the key.
     */
    evaluate(key, now = new Date()) {
        for (const entry of this.entries) {
            if (entry.transition.key !== key && entry.transition.key !== '*')
                continue;
            const active = this.isScheduleActive(entry.schedule, now);
            if (active) {
                return entry.transition.activeConfig;
            }
            else if (entry.transition.inactiveConfig) {
                return entry.transition.inactiveConfig;
            }
        }
        return null;
    }
    isScheduleActive(schedule, now) {
        switch (schedule.type) {
            case 'time_range':
                return (0, scheduleType_1.isTimeRangeActive)(schedule, now);
            case 'day_of_week':
                return (0, scheduleType_1.isDayOfWeekActive)(schedule, now);
            case 'cron':
                // Cron scheduling requires a full cron parser; mark as inactive for basic use
                return false;
            case 'recurring':
                // Check if within the current recurrence window
                const elapsed = now.getTime() % schedule.intervalMs;
                return elapsed < schedule.durationMs;
            default:
                return false;
        }
    }
    /**
     * List all registered schedules.
     */
    listSchedules() {
        return [...this.entries];
    }
}
exports.ScheduleManager = ScheduleManager;
exports.default = ScheduleManager;
//# sourceMappingURL=scheduleManager.js.map