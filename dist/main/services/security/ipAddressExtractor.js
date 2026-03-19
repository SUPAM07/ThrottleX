"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipExtractor = exports.IpAddressExtractor = void 0;
const constants_1 = require("../../utils/constants");
/**
 * Extracts the real client IP from multiple header sources with priority ordering
 */
class IpAddressExtractor {
    extract(req) {
        // Priority: CF-Connecting-IP > X-Forwarded-For > X-Real-IP > socket.remoteAddress
        const cfIp = req.headers[constants_1.HEADERS.CF_CONNECTING_IP.toLowerCase()];
        if (cfIp)
            return cfIp.trim();
        const forwarded = req.headers[constants_1.HEADERS.FORWARDED_FOR.toLowerCase()];
        if (forwarded) {
            const ips = forwarded.split(',').map((ip) => ip.trim());
            const firstPublic = ips.find((ip) => !this.isPrivate(ip));
            if (firstPublic)
                return firstPublic;
            if (ips[0])
                return ips[0];
        }
        const realIp = req.headers[constants_1.HEADERS.REAL_IP.toLowerCase()];
        if (realIp)
            return realIp.trim();
        return req.socket.remoteAddress || req.ip || '0.0.0.0';
    }
    isPrivate(ip) {
        const privateRanges = [
            /^10\./,
            /^172\.(1[6-9]|2\d|3[01])\./,
            /^192\.168\./,
            /^127\./,
            /^::1$/,
            /^fc00:/,
            /^fe80:/,
        ];
        return privateRanges.some((range) => range.test(ip));
    }
}
exports.IpAddressExtractor = IpAddressExtractor;
exports.ipExtractor = new IpAddressExtractor();
exports.default = IpAddressExtractor;
//# sourceMappingURL=ipAddressExtractor.js.map