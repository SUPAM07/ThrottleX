"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
const constants_1 = require("../constants");
const logger_1 = __importDefault(require("../logger"));
class CircuitBreaker {
    name;
    opts;
    state = constants_1.CIRCUIT_STATES.CLOSED;
    failureCount = 0;
    successCount = 0;
    lastFailureTime = null;
    halfOpenAttempts = 0;
    constructor(name, opts = {
        failureThreshold: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD || '5', 10),
        successThreshold: 2,
        timeoutMs: parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT_MS || '30000', 10),
        halfOpenRequests: parseInt(process.env.CIRCUIT_BREAKER_HALF_OPEN_REQUESTS || '3', 10),
    }) {
        this.name = name;
        this.opts = opts;
    }
    async execute(fn, fallback) {
        if (this.state === constants_1.CIRCUIT_STATES.OPEN) {
            if (this.shouldAttemptReset()) {
                this.transitionTo(constants_1.CIRCUIT_STATES.HALF_OPEN);
            }
            else {
                if (fallback)
                    return fallback();
                throw new Error(`Circuit breaker [${this.name}] is OPEN`);
            }
        }
        if (this.state === constants_1.CIRCUIT_STATES.HALF_OPEN) {
            if (this.halfOpenAttempts >= this.opts.halfOpenRequests) {
                if (fallback)
                    return fallback();
                throw new Error(`Circuit breaker [${this.name}] HALF_OPEN limit reached`);
            }
            this.halfOpenAttempts++;
        }
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            if (fallback)
                return fallback();
            throw error;
        }
    }
    onSuccess() {
        this.failureCount = 0;
        if (this.state === constants_1.CIRCUIT_STATES.HALF_OPEN) {
            this.successCount++;
            if (this.successCount >= this.opts.successThreshold) {
                this.transitionTo(constants_1.CIRCUIT_STATES.CLOSED);
            }
        }
    }
    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        if (this.state === constants_1.CIRCUIT_STATES.CLOSED &&
            this.failureCount >= this.opts.failureThreshold) {
            this.transitionTo(constants_1.CIRCUIT_STATES.OPEN);
        }
        else if (this.state === constants_1.CIRCUIT_STATES.HALF_OPEN) {
            this.transitionTo(constants_1.CIRCUIT_STATES.OPEN);
        }
    }
    shouldAttemptReset() {
        return (this.lastFailureTime !== null &&
            Date.now() - this.lastFailureTime >= this.opts.timeoutMs);
    }
    transitionTo(newState) {
        logger_1.default.warn(`Circuit breaker [${this.name}]: ${this.state} → ${newState}`);
        this.state = newState;
        if (newState === constants_1.CIRCUIT_STATES.CLOSED) {
            this.failureCount = 0;
            this.successCount = 0;
        }
        if (newState === constants_1.CIRCUIT_STATES.HALF_OPEN) {
            this.halfOpenAttempts = 0;
            this.successCount = 0;
        }
    }
    getState() {
        return this.state;
    }
    getStats() {
        return {
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            lastFailureTime: this.lastFailureTime,
        };
    }
}
exports.CircuitBreaker = CircuitBreaker;
exports.default = CircuitBreaker;
//# sourceMappingURL=circuitBreaker.js.map