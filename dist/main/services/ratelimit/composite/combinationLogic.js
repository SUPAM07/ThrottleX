"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombinationLogic = void 0;
/**
 * Combination logic for composite rate limiting.
 * Determines the final allow/deny decision from multiple component results.
 */
class CombinationLogic {
    /**
     * Combine results from multiple rate limit components.
     *
     * - AND: All components must allow → request is allowed
     * - OR:  Any component allows → request is allowed
     * - PRIORITY: Use the result from the highest-weight component
     */
    static combine(results, mode) {
        if (results.length === 0) {
            throw new Error('CombinationLogic: no component results provided');
        }
        switch (mode) {
            case 'AND':
                return this.combineAnd(results);
            case 'OR':
                return this.combineOr(results);
            case 'PRIORITY':
                return this.combinePriority(results);
            default:
                throw new Error(`CombinationLogic: unknown mode "${mode}"`);
        }
    }
    static combineAnd(results) {
        const allowed = results.every((r) => r.response.allowed);
        // Use the most restrictive (lowest remaining) component's view
        const mostRestrictive = results.reduce((prev, curr) => curr.response.remaining < prev.response.remaining ? curr : prev);
        return {
            ...mostRestrictive.response,
            allowed,
            metadata: {
                combinationMode: 'AND',
                components: results.map((r) => ({
                    id: r.component.id,
                    allowed: r.response.allowed,
                    remaining: r.response.remaining,
                })),
            },
        };
    }
    static combineOr(results) {
        const allowed = results.some((r) => r.response.allowed);
        // Use the most permissive component's view
        const mostPermissive = results.reduce((prev, curr) => curr.response.remaining > prev.response.remaining ? curr : prev);
        return {
            ...mostPermissive.response,
            allowed,
            metadata: {
                combinationMode: 'OR',
                components: results.map((r) => ({
                    id: r.component.id,
                    allowed: r.response.allowed,
                    remaining: r.response.remaining,
                })),
            },
        };
    }
    static combinePriority(results) {
        // Sort by weight descending, take the winner
        const sorted = [...results].sort((a, b) => b.component.weight - a.component.weight);
        const winner = sorted[0];
        return {
            ...winner.response,
            metadata: {
                combinationMode: 'PRIORITY',
                selectedComponent: winner.component.id,
                components: results.map((r) => ({
                    id: r.component.id,
                    weight: r.component.weight,
                    allowed: r.response.allowed,
                })),
            },
        };
    }
}
exports.CombinationLogic = CombinationLogic;
exports.default = CombinationLogic;
//# sourceMappingURL=combinationLogic.js.map