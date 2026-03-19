"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = __importDefault(require("../utils/logger"));
const constants_1 = require("../utils/constants");
function errorHandler(err, req, res, _next) {
    const statusCode = err.statusCode || constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const correlationId = req.context?.correlationId || 'unknown';
    logger_1.default.error('Unhandled error', {
        error: err.message,
        code: err.code,
        stack: err.stack,
        correlationId,
        path: req.path,
        method: req.method,
    });
    res.status(statusCode).json({
        error: statusCode >= 500 ? 'Internal Server Error' : err.message,
        code: err.code,
        correlationId,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack, details: err.details }),
    });
}
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map