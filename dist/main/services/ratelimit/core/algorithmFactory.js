"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorithmFactory = void 0;
const redisClient_1 = require("../../../redis/redisClient");
const constants_1 = require("../../../utils/constants");
// Lazy imports to avoid circular deps
let TokenBucket;
let SlidingWindow;
let FixedWindow;
let LeakyBucket;
let CompositeLimiter;
const registry = new Map();
async function ensureLoaded() {
    if (!TokenBucket) {
        ({ TokenBucketAlgorithm: TokenBucket } = await Promise.resolve().then(() => __importStar(require('../algorithms/tokenBucket'))));
        ({ SlidingWindowAlgorithm: SlidingWindow } = await Promise.resolve().then(() => __importStar(require('../algorithms/slidingWindow'))));
        ({ FixedWindowAlgorithm: FixedWindow } = await Promise.resolve().then(() => __importStar(require('../algorithms/fixedWindow'))));
        ({ LeakyBucketAlgorithm: LeakyBucket } = await Promise.resolve().then(() => __importStar(require('../algorithms/leakyBucket'))));
        ({ CompositeLimiterAlgorithm: CompositeLimiter } = await Promise.resolve().then(() => __importStar(require('../algorithms/compositeLimiter'))));
    }
}
/**
 * Factory that creates and caches algorithm instances
 */
class AlgorithmFactory {
    client;
    constructor(client) {
        this.client = client || (0, redisClient_1.getRedisClient)();
    }
    async create(algorithmName) {
        await ensureLoaded();
        const cached = registry.get(algorithmName);
        if (cached)
            return cached;
        let algo;
        switch (algorithmName) {
            case constants_1.ALGORITHMS.TOKEN_BUCKET:
                algo = new TokenBucket(this.client);
                break;
            case constants_1.ALGORITHMS.SLIDING_WINDOW:
                algo = new SlidingWindow(this.client);
                break;
            case constants_1.ALGORITHMS.FIXED_WINDOW:
                algo = new FixedWindow(this.client);
                break;
            case constants_1.ALGORITHMS.LEAKY_BUCKET:
                algo = new LeakyBucket(this.client);
                break;
            case constants_1.ALGORITHMS.COMPOSITE:
                algo = new CompositeLimiter(this.client);
                break;
            default:
                throw new Error(`Unknown algorithm: ${algorithmName}`);
        }
        registry.set(algorithmName, algo);
        return algo;
    }
    getAvailableAlgorithms() {
        return Object.values(constants_1.ALGORITHMS);
    }
}
exports.AlgorithmFactory = AlgorithmFactory;
exports.default = AlgorithmFactory;
//# sourceMappingURL=algorithmFactory.js.map