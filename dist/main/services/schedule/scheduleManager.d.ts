import type { RateLimitConfig } from '../../models';
import type { Schedule } from './scheduleType';
import type { TransitionConfig } from './transitionConfig';
interface ScheduleEntry {
    id: string;
    schedule: Schedule;
    transition: TransitionConfig;
}
/**
 * Manages schedule-based rate limit configuration changes.
 * Evaluates registered schedules and returns the effective configuration.
 */
export declare class ScheduleManager {
    private readonly entries;
    /**
     * Register a new schedule with its transition configuration.
     */
    register(id: string, schedule: Schedule, transition: TransitionConfig): void;
    /**
     * Remove a schedule by ID.
     */
    unregister(id: string): boolean;
    /**
     * Evaluate all schedules and return the config overrides for a key.
     * Returns null if no schedule is active for the key.
     */
    evaluate(key: string, now?: Date): Partial<RateLimitConfig> | null;
    private isScheduleActive;
    /**
     * List all registered schedules.
     */
    listSchedules(): ScheduleEntry[];
}
export default ScheduleManager;
//# sourceMappingURL=scheduleManager.d.ts.map