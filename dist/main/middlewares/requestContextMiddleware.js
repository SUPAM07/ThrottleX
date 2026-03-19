"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestContextMiddleware = requestContextMiddleware;
const uuid_1 = require("uuid");
const tenantResolver_1 = require("../services/security/tenantResolver");
const ipAddressExtractor_1 = require("../services/security/ipAddressExtractor");
const constants_1 = require("../utils/constants");
async function requestContextMiddleware(req, res, next) {
    const correlationId = req.headers[constants_1.HEADERS.CORRELATION_ID.toLowerCase()] || (0, uuid_1.v4)();
    const ip = ipAddressExtractor_1.ipExtractor.extract(req);
    const { tenantId } = await tenantResolver_1.tenantResolver.resolve(req);
    req.context = {
        correlationId,
        tenantId,
        ip,
        startTime: Date.now(),
    };
    res.set(constants_1.HEADERS.CORRELATION_ID, correlationId);
    next();
}
exports.default = requestContextMiddleware;
//# sourceMappingURL=requestContextMiddleware.js.map