"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geoResolver = exports.GeoResolver = void 0;
const geoip_lite_1 = __importDefault(require("geoip-lite"));
const localCache_1 = require("../cache/localCache");
const constants_1 = require("../../utils/constants");
class GeoResolver {
    resolve(ip, req) {
        // Check CDN headers first (more accurate)
        if (req) {
            const cfCountry = req.headers[constants_1.HEADERS.CF_IP_COUNTRY.toLowerCase()];
            if (cfCountry && cfCountry !== 'XX') {
                return { ip, country: cfCountry, source: 'cdn_header' };
            }
            const cfViewerCountry = req.headers[constants_1.HEADERS.CLOUDFRONT_VIEWER_COUNTRY.toLowerCase()];
            if (cfViewerCountry) {
                return { ip, country: cfViewerCountry, source: 'cdn_header' };
            }
        }
        // Check cache
        const cached = localCache_1.globalCache.get(`geo:${ip}`);
        if (cached)
            return cached;
        // GeoIP lookup
        const geo = geoip_lite_1.default.lookup(ip);
        const result = {
            ip,
            country: geo?.country,
            region: geo?.region,
            city: geo?.city,
            latitude: geo?.ll?.[0],
            longitude: geo?.ll?.[1],
            source: geo ? 'geoip' : 'unknown',
        };
        localCache_1.globalCache.set(`geo:${ip}`, result, constants_1.CACHE_TTL.GEO_LOOKUP);
        return result;
    }
}
exports.GeoResolver = GeoResolver;
exports.geoResolver = new GeoResolver();
exports.default = GeoResolver;
//# sourceMappingURL=geoResolver.js.map