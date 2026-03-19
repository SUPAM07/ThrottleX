export interface RedisConfig {
    url: string;
    password?: string;
    db: number;
    maxRetriesPerRequest: number;
    connectTimeout: number;
    commandTimeout: number;
    poolSize: number;
    enableReadyCheck: boolean;
    lazyConnect: boolean;
    keepAlive: number;
    keyPrefix: string;
}
declare const redisConfig: RedisConfig;
export default redisConfig;
//# sourceMappingURL=redisConfig.d.ts.map