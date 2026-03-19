/**
 * Adaptation signal types emitted by the traffic pattern analyzer.
 * Used to communicate between the anomaly detection engine and the rate limiter.
 */
export type AdaptationSignal = 'SCALE_UP' | 'SCALE_DOWN' | 'ALERT' | 'THROTTLE' | 'STABLE';
export interface SignalEvent {
    signal: AdaptationSignal;
    timestamp: number;
    key?: string;
    reason: string;
    metadata?: Record<string, unknown>;
}
/**
 * Create a signal event with current timestamp.
 */
export declare function createSignalEvent(signal: AdaptationSignal, reason: string, key?: string, metadata?: Record<string, unknown>): SignalEvent;
/**
 * Check whether a signal indicates a capacity adjustment is needed.
 */
export declare function isCapacitySignal(signal: AdaptationSignal): boolean;
//# sourceMappingURL=adaptationSignal.d.ts.map