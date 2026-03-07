export interface RateLimiterBackend {

    get(key: string): Promise<any>
  
    set(
      key: string,
      value: any,
      ttl?: number
    ): Promise<void>
  
    increment(
      key: string,
      ttl?: number
    ): Promise<number>
  
    delete(key: string): Promise<void>
  
  }