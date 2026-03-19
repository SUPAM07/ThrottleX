"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpSecurityService = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * IP allowlist/blocklist management for rate limiting security.
 * Supports CIDR ranges and single IP addresses.
 */
class IpSecurityService {
    allowlist = new Map();
    blocklist = new Map();
    /**
     * Add an IP or CIDR range to the allowlist.
     */
    allow(range, reason, expiresAt) {
        this.allowlist.set(range, { range, action: 'allow', reason, expiresAt });
        logger_1.default.info('IP allowlisted', { range, reason });
    }
    /**
     * Add an IP or CIDR range to the blocklist.
     */
    block(range, reason, expiresAt) {
        this.blocklist.set(range, { range, action: 'block', reason, expiresAt });
        logger_1.default.warn('IP blocklisted', { range, reason });
    }
    /**
     * Check if an IP is explicitly blocked.
     */
    isBlocked(ip) {
        this.cleanExpired(this.blocklist);
        return this.matchesAny(ip, this.blocklist);
    }
    /**
     * Check if an IP is explicitly allowed (bypasses rate limiting).
     */
    isAllowed(ip) {
        this.cleanExpired(this.allowlist);
        return this.matchesAny(ip, this.allowlist);
    }
    /**
     * Evaluate whether an IP should be rate limited.
     * Returns 'bypass' (allowed), 'block' (blocked), or 'limit' (normal rate limiting).
     */
    evaluate(ip) {
        if (this.isBlocked(ip))
            return 'block';
        if (this.isAllowed(ip))
            return 'bypass';
        return 'limit';
    }
    /**
     * Remove an IP from both lists.
     */
    remove(range) {
        this.allowlist.delete(range);
        this.blocklist.delete(range);
    }
    /**
     * Get all rules.
     */
    getRules() {
        this.cleanExpired(this.allowlist);
        this.cleanExpired(this.blocklist);
        return {
            allowlist: Array.from(this.allowlist.values()),
            blocklist: Array.from(this.blocklist.values()),
        };
    }
    matchesAny(ip, list) {
        for (const [range] of list) {
            if (this.ipMatchesRange(ip, range))
                return true;
        }
        return false;
    }
    ipMatchesRange(ip, range) {
        // Exact match
        if (ip === range)
            return true;
        // Simple CIDR check for /24, /16, /8
        if (range.includes('/')) {
            const [network, bits] = range.split('/');
            const maskBits = parseInt(bits, 10);
            const ipParts = ip.split('.').map(Number);
            const netParts = network.split('.').map(Number);
            const fullOctets = Math.floor(maskBits / 8);
            for (let i = 0; i < fullOctets && i < 4; i++) {
                if (ipParts[i] !== netParts[i])
                    return false;
            }
            return true;
        }
        return false;
    }
    cleanExpired(list) {
        const now = Date.now();
        for (const [key, rule] of list) {
            if (rule.expiresAt && now > rule.expiresAt) {
                list.delete(key);
            }
        }
    }
}
exports.IpSecurityService = IpSecurityService;
exports.default = IpSecurityService;
//# sourceMappingURL=ipSecurityService.js.map