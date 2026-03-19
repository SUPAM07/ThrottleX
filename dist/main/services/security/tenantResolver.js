"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantResolver = exports.TenantResolver = void 0;
const apiKeyService_1 = require("./apiKeyService");
const constants_1 = require("../../utils/constants");
class TenantResolver {
    async resolve(req) {
        // 1. Try API key
        const apiKey = req.headers[constants_1.HEADERS.API_KEY.toLowerCase()];
        if (apiKey) {
            const meta = await apiKeyService_1.apiKeyService.validate(apiKey);
            if (meta) {
                return { tenantId: meta.tenantId, source: 'api_key' };
            }
        }
        // 2. Try tenant header
        const tenantHeader = req.headers[constants_1.HEADERS.TENANT_ID.toLowerCase()];
        if (tenantHeader) {
            return { tenantId: tenantHeader, source: 'header' };
        }
        // 3. Default to IP-based tenant
        return { tenantId: 'default', source: 'default' };
    }
}
exports.TenantResolver = TenantResolver;
exports.tenantResolver = new TenantResolver();
exports.default = TenantResolver;
//# sourceMappingURL=tenantResolver.js.map