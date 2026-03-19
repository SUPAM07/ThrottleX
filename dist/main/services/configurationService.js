"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurationService = exports.ConfigurationService = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Configuration service supporting hot-reload from environment variables and
 * runtime overrides stored in memory (backed by Redis for persistence).
 */
class ConfigurationService {
    overrides = new Map();
    patterns = new Map();
    dynamicDefaults = {};
    lastReloadAt = Date.now();
    reloadListeners = [];
    getDefaultConfig() {
        const envDefaults = {
            defaultAlgorithm: process.env.DEFAULT_ALGORITHM || 'token_bucket',
            defaultLimit: parseInt(process.env.DEFAULT_RATE_LIMIT || '100', 10),
            defaultWindowMs: parseInt(process.env.DEFAULT_WINDOW_MS || '60000', 10),
            adaptiveEnabled: process.env.ADAPTIVE_ENABLED !== 'false',
            geoEnabled: process.env.GEO_ENABLED !== 'false',
            circuitBreakerEnabled: process.env.CIRCUIT_BREAKER_ENABLED !== 'false',
            metricsEnabled: process.env.METRICS_ENABLED !== 'false',
        };
        return { ...envDefaults, ...this.dynamicDefaults };
    }
    updateDefaultConfig(newDefaults) {
        this.dynamicDefaults = { ...this.dynamicDefaults, ...newDefaults };
        logger_1.default.info('Default configuration dynamically updated', { defaults: this.dynamicDefaults });
    }
    /**
     * Get the effective configuration for a specific key,
     * merging defaults with any active override or matching pattern.
     */
    getEffectiveConfig(key) {
        // 1. Exact Key Match
        const override = this.overrides.get(key);
        if (override) {
            if (override.expiresAt && Date.now() > override.expiresAt) {
                this.overrides.delete(key);
            }
            else {
                return override.config;
            }
        }
        // 2. Pattern Match
        const now = Date.now();
        for (const [pattern, patternOverride] of this.patterns) {
            if (patternOverride.expiresAt && now > patternOverride.expiresAt) {
                this.patterns.delete(pattern);
                continue;
            }
            const regexStr = '^' + pattern.replace(/\*/g, '.*') + '$';
            if (new RegExp(regexStr).test(key)) {
                return patternOverride.config;
            }
        }
        // 3. Fallback to default
        return null;
    }
    setOverride(key, config, expiresAt) {
        this.overrides.set(key, { key, config, expiresAt });
        logger_1.default.info('Configuration override set', { key, config, expiresAt });
    }
    removeOverride(key) {
        const existed = this.overrides.delete(key);
        if (existed) {
            logger_1.default.info('Configuration override removed', { key });
        }
        return existed;
    }
    setPatternOverride(pattern, config, expiresAt) {
        this.patterns.set(pattern, { key: pattern, config, expiresAt });
        logger_1.default.info('Pattern configuration set', { pattern, config, expiresAt });
    }
    removePatternOverride(pattern) {
        const existed = this.patterns.delete(pattern);
        if (existed) {
            logger_1.default.info('Pattern configuration removed', { pattern });
        }
        return existed;
    }
    listOverrides() {
        const now = Date.now();
        const active = [];
        for (const [k, v] of this.overrides) {
            if (v.expiresAt && now > v.expiresAt) {
                this.overrides.delete(k);
            }
            else {
                active.push(v);
            }
        }
        return active;
    }
    listPatternOverrides() {
        const now = Date.now();
        const active = [];
        for (const [k, v] of this.patterns) {
            if (v.expiresAt && now > v.expiresAt) {
                this.patterns.delete(k);
            }
            else {
                active.push(v);
            }
        }
        return active;
    }
    onReload(listener) {
        this.reloadListeners.push(listener);
    }
    /**
     * Reload configuration from environment variables and notify listeners
     */
    reload() {
        this.lastReloadAt = Date.now();
        const config = this.getDefaultConfig();
        logger_1.default.info('Configuration reloaded', config);
        // Notify elements like the RateLimiterService to flush buckets/caches if applicable
        for (const listener of this.reloadListeners) {
            try {
                listener();
            }
            catch (err) {
                logger_1.default.error('Error executing configuration reload listener', { err });
            }
        }
        return config;
    }
    getLastReloadAt() {
        return this.lastReloadAt;
    }
}
exports.ConfigurationService = ConfigurationService;
// Ensure singleton pattern for global state retention
exports.configurationService = new ConfigurationService();
exports.default = exports.configurationService;
//# sourceMappingURL=configurationService.js.map