import type { RateLimitResponse } from '../../../models';
import type { ComponentResult } from './limitComponent';
export type CombinationMode = 'AND' | 'OR' | 'PRIORITY';
/**
 * Combination logic for composite rate limiting.
 * Determines the final allow/deny decision from multiple component results.
 */
export declare class CombinationLogic {
    /**
     * Combine results from multiple rate limit components.
     *
     * - AND: All components must allow → request is allowed
     * - OR:  Any component allows → request is allowed
     * - PRIORITY: Use the result from the highest-weight component
     */
    static combine(results: ComponentResult[], mode: CombinationMode): RateLimitResponse;
    private static combineAnd;
    private static combineOr;
    private static combinePriority;
}
export default CombinationLogic;
//# sourceMappingURL=combinationLogic.d.ts.map