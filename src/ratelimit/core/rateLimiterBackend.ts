export interface RateLimiterBackend {

  get(key: string): Promise<any>

  set(key: string, value: any, ttl?: number): Promise<void>

  increment(key: string, ttl?: number): Promise<number>

  delete(key: string): Promise<void>

  update<T>(
    key: string,
    updater: (value: T | null) => T,
    ttl?: number
  ): Promise<T>

}