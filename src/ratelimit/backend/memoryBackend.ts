import { RateLimiterBackend } from "../core/rateLimiterBackend"

interface Entry {
  value: any
  expiry?: number
}

export class MemoryBackend implements RateLimiterBackend {

  private store = new Map<string, Entry>()

  async get(key: string): Promise<any> {

    const entry = this.store.get(key)

    if (!entry) return null

    if (entry.expiry && Date.now() > entry.expiry) {
      this.store.delete(key)
      return null
    }

    return entry.value
  }

  async set(
    key: string,
    value: any,
    ttl?: number
  ): Promise<void> {

    const entry: Entry = {
      value,
      expiry: ttl ? Date.now() + ttl : undefined
    }

    this.store.set(key, entry)
  }

  async increment(
    key: string,
    ttl?: number
  ): Promise<number> {

    const current = await this.get(key)

    const newValue = (current || 0) + 1

    await this.set(key, newValue, ttl)

    return newValue
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

}