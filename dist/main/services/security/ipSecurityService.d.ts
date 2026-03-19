interface IpRule {
    range: string;
    action: 'allow' | 'block';
    reason?: string;
    expiresAt?: number;
}
/**
 * IP allowlist/blocklist management for rate limiting security.
 * Supports CIDR ranges and single IP addresses.
 */
export declare class IpSecurityService {
    private readonly allowlist;
    private readonly blocklist;
    /**
     * Add an IP or CIDR range to the allowlist.
     */
    allow(range: string, reason?: string, expiresAt?: number): void;
    /**
     * Add an IP or CIDR range to the blocklist.
     */
    block(range: string, reason?: string, expiresAt?: number): void;
    /**
     * Check if an IP is explicitly blocked.
     */
    isBlocked(ip: string): boolean;
    /**
     * Check if an IP is explicitly allowed (bypasses rate limiting).
     */
    isAllowed(ip: string): boolean;
    /**
     * Evaluate whether an IP should be rate limited.
     * Returns 'bypass' (allowed), 'block' (blocked), or 'limit' (normal rate limiting).
     */
    evaluate(ip: string): 'bypass' | 'block' | 'limit';
    /**
     * Remove an IP from both lists.
     */
    remove(range: string): void;
    /**
     * Get all rules.
     */
    getRules(): {
        allowlist: IpRule[];
        blocklist: IpRule[];
    };
    private matchesAny;
    private ipMatchesRange;
    private cleanExpired;
}
export default IpSecurityService;
//# sourceMappingURL=ipSecurityService.d.ts.map