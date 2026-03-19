/**
 * Anomaly scoring functions for the adaptive rate limiting engine.
 * Provides normalized scores based on statistical deviations.
 */
/**
 * Calculate anomaly score from a z-score.
 * Returns a value between 0.0 (normal) and 1.0 (highly anomalous).
 */
export declare function zScoreToAnomalyScore(zScore: number, threshold?: number): number;
/**
 * Calculate anomaly score from the ratio of rejections.
 * High rejection rates indicate potential abuse or misconfigured limits.
 */
export declare function rejectionAnomalyScore(rejectionRate: number, highThreshold?: number): number;
/**
 * Combine multiple anomaly scores into a weighted aggregate.
 */
export declare function combinedAnomalyScore(scores: {
    score: number;
    weight: number;
}[]): number;
/**
 * Classify an anomaly score into a severity level.
 */
export type AnomalySeverity = 'none' | 'low' | 'medium' | 'high' | 'critical';
export declare function classifyAnomaly(score: number): AnomalySeverity;
//# sourceMappingURL=anomalyScore.d.ts.map