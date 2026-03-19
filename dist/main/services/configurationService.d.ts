import type { ConfigurationResponse, RateLimitConfig } from '../models';
interface ConfigOverride {
    key: string;
    config: Partial<RateLimitConfig>;
    expiresAt?: number;
}
/**
 * Configuration service supporting hot-reload from environment variables and
 * runtime overrides stored in memory (backed by Redis for persistence).
 */
export declare class ConfigurationService {
    private overrides;
    private patterns;
    private dynamicDefaults;
    private lastReloadAt;
    private reloadListeners;
    getDefaultConfig(): ConfigurationResponse;
    updateDefaultConfig(newDefaults: Partial<ConfigurationResponse>): void;
    /**
     * Get the effective configuration for a specific key,
     * merging defaults with any active override or matching pattern.
     */
    getEffectiveConfig(key: string): Partial<RateLimitConfig> | null;
    setOverride(key: string, config: Partial<RateLimitConfig>, expiresAt?: number): void;
    removeOverride(key: string): boolean;
    setPatternOverride(pattern: string, config: Partial<RateLimitConfig>, expiresAt?: number): void;
    removePatternOverride(pattern: string): boolean;
    listOverrides(): ConfigOverride[];
    listPatternOverrides(): ConfigOverride[];
    onReload(listener: () => void): void;
    /**
     * Reload configuration from environment variables and notify listeners
     */
    reload(): ConfigurationResponse;
    getLastReloadAt(): number;
}
export declare const configurationService: ConfigurationService;
export default configurationService;
//# sourceMappingURL=configurationService.d.ts.map