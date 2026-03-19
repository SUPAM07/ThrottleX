"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChildLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const { combine, timestamp, printf, colorize, errors } = winston_1.default.format;
const logFormat = printf(({ level, message, timestamp, correlationId, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `[${timestamp}] [${level.toUpperCase()}]${correlationId ? ` [${correlationId}]` : ''} ${message} ${metaStr}`;
});
const createLogger = () => {
    const level = process.env.LOG_LEVEL || 'info';
    const isDevelopment = process.env.NODE_ENV === 'development';
    const transports = [
        new winston_1.default.transports.Console({
            format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), errors({ stack: true }), logFormat),
        }),
    ];
    if (!isDevelopment) {
        transports.push(new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: combine(timestamp(), errors({ stack: true }), winston_1.default.format.json()),
        }), new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            format: combine(timestamp(), errors({ stack: true }), winston_1.default.format.json()),
        }));
    }
    return winston_1.default.createLogger({
        level,
        transports,
        exitOnError: false,
    });
};
const logger = createLogger();
const createChildLogger = (context) => logger.child(context);
exports.createChildLogger = createChildLogger;
exports.default = logger;
//# sourceMappingURL=logger.js.map