/**
 * Generates structured Redis keys for rate limiters
 * Format: rl:{algorithm}:{tenant?}:{userId?}:{endpoint?}
 */
export declare class KeyGenerator {
    static generate(params: {
        algorithm: string;
        key: string;
        tenantId?: string;
        userId?: string;
        endpoint?: string;
        window?: number;
    }): string;
    static forIP(ip: string, algorithm: string, windowMs: number): string;
    static forTenant(tenantId: string, algorithm: string): string;
    static forEndpoint(endpoint: string, algorithm: string, windowMs: number): string;
    static forFixedWindow(baseKey: string, windowMs: number): string;
    private static sanitize;
}
export default KeyGenerator;
//# sourceMappingURL=keyGenerator.d.ts.map