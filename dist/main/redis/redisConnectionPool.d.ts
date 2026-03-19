import Redis from 'ioredis';
export declare class RedisConnectionPool {
    private pool;
    private idle;
    private readonly size;
    constructor(size?: number);
    initialize(): Promise<void>;
    acquire(): Promise<{
        client: Redis;
        index: number;
    }>;
    release(index: number): void;
    executeWithClient<T>(fn: (client: Redis) => Promise<T>): Promise<T>;
    getStats(): {
        total: number;
        idle: number;
        busy: number;
    };
    close(): Promise<void>;
}
export declare function getConnectionPool(): Promise<RedisConnectionPool>;
export default RedisConnectionPool;
//# sourceMappingURL=redisConnectionPool.d.ts.map