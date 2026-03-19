"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyAuthMiddleware = apiKeyAuthMiddleware;
const apiKeyService_1 = require("../services/security/apiKeyService");
const constants_1 = require("../utils/constants");
function apiKeyAuthMiddleware(required = true) {
    return async (req, res, next) => {
        const apiKey = req.headers[constants_1.HEADERS.API_KEY.toLowerCase()];
        if (!apiKey) {
            if (!required) {
                next();
                return;
            }
            res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                error: 'Unauthorized',
                message: 'X-API-Key header is required',
            });
            return;
        }
        const meta = await apiKeyService_1.apiKeyService.validate(apiKey);
        if (!meta) {
            res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                error: 'Forbidden',
                message: 'Invalid or expired API key',
            });
            return;
        }
        req.apiKeyMeta = meta;
        next();
    };
}
exports.default = apiKeyAuthMiddleware;
//# sourceMappingURL=apiKeyAuthMiddleware.js.map