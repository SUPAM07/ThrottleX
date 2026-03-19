"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadGenerator = void 0;
const timeUtils_1 = require("../utils/timeUtils");
/**
 * Generates concurrent requests at a target rate.
 * Used by the benchmark suite for load testing.
 */
class LoadGenerator {
    running = false;
    requestCount = 0;
    /**
     * Generate load at a target rate for a specified duration.
     *
     * @param targetRps    Target requests per second
     * @param durationMs   How long to generate load
     * @param concurrency  Number of concurrent workers
     * @param requestFn    Function to execute per request
     * @returns Total requests generated
     */
    async generate(targetRps, durationMs, concurrency, requestFn) {
        this.running = true;
        this.requestCount = 0;
        const stopAt = (0, timeUtils_1.nowMs)() + durationMs;
        const delayBetweenRequests = Math.max(0, 1000 / (targetRps / concurrency));
        const worker = async () => {
            while (this.running && (0, timeUtils_1.nowMs)() < stopAt) {
                const id = this.requestCount++;
                try {
                    await requestFn(id);
                }
                catch {
                    // Errors are counted but don't stop generation
                }
                if (delayBetweenRequests > 0) {
                    await this.sleep(delayBetweenRequests);
                }
            }
        };
        const workers = Array.from({ length: concurrency }, () => worker());
        await Promise.all(workers);
        this.running = false;
        return this.requestCount;
    }
    /**
     * Stop the generator.
     */
    stop() {
        this.running = false;
    }
    /**
     * Get the current request count.
     */
    getRequestCount() {
        return this.requestCount;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.LoadGenerator = LoadGenerator;
exports.default = LoadGenerator;
//# sourceMappingURL=loadGenerator.js.map