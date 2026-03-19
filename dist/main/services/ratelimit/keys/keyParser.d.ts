/**
 * Parses structured rate-limit Redis keys back into their component parts.
 *
 * Key format: `rl:{algorithm}:{identifier}`
 * Example:    `rl:token_bucket:user:12345`  →  { prefix: 'rl', algorithm: 'token_bucket', identifier: 'user:12345' }
 */
export interface ParsedKey {
    prefix: string;
    algorithm: string;
    identifier: string;
    raw: string;
}
export declare class KeyParser {
    private static readonly PREFIX;
    /**
     * Parse a Redis rate-limit key into its component parts.
     * Returns null if the key does not match the expected format.
     */
    static parse(key: string): ParsedKey | null;
    /**
     * Extract just the algorithm name from a key.
     */
    static extractAlgorithm(key: string): string | null;
    /**
     * Extract just the identifier from a key.
     */
    static extractIdentifier(key: string): string | null;
    /**
     * Validate that a key matches the expected rate-limit key format.
     */
    static isValid(key: string): boolean;
}
export default KeyParser;
//# sourceMappingURL=keyParser.d.ts.map