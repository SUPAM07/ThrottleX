"use strict";
/**
 * Anomaly scoring functions for the adaptive rate limiting engine.
 * Provides normalized scores based on statistical deviations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.zScoreToAnomalyScore = zScoreToAnomalyScore;
exports.rejectionAnomalyScore = rejectionAnomalyScore;
exports.combinedAnomalyScore = combinedAnomalyScore;
exports.classifyAnomaly = classifyAnomaly;
/**
 * Calculate anomaly score from a z-score.
 * Returns a value between 0.0 (normal) and 1.0 (highly anomalous).
 */
function zScoreToAnomalyScore(zScore, threshold = 2.5) {
    return Math.min(1.0, Math.abs(zScore) / threshold);
}
/**
 * Calculate anomaly score from the ratio of rejections.
 * High rejection rates indicate potential abuse or misconfigured limits.
 */
function rejectionAnomalyScore(rejectionRate, highThreshold = 0.8) {
    if (rejectionRate >= highThreshold)
        return 1.0;
    if (rejectionRate >= highThreshold * 0.5)
        return rejectionRate / highThreshold;
    return 0.0;
}
/**
 * Combine multiple anomaly scores into a weighted aggregate.
 */
function combinedAnomalyScore(scores) {
    if (scores.length === 0)
        return 0;
    const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
    if (totalWeight === 0)
        return 0;
    const weighted = scores.reduce((sum, s) => sum + s.score * s.weight, 0);
    return Math.min(1.0, weighted / totalWeight);
}
function classifyAnomaly(score) {
    if (score < 0.1)
        return 'none';
    if (score < 0.3)
        return 'low';
    if (score < 0.6)
        return 'medium';
    if (score < 0.85)
        return 'high';
    return 'critical';
}
//# sourceMappingURL=anomalyScore.js.map