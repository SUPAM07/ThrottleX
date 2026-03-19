import Redis from 'ioredis';
export declare function createRedisClient(): Redis;
export declare function getRedisClient(): Redis;
export declare function pingRedis(): Promise<boolean>;
export declare function closeRedis(): Promise<void>;
export default getRedisClient;
//# sourceMappingURL=redisClient.d.ts.map