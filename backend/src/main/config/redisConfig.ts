import dotenv from 'dotenv';
dotenv.config();

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
  tls?: boolean;
}

function buildRedisConfig(): Pick<RedisConfig, 'url' | 'tls'> {
  // Support Upstash Redis REST credentials — convert to ioredis-compatible rediss:// URL
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    let host: string;
    try {
      host = new URL(process.env.UPSTASH_REDIS_REST_URL).hostname;
    } catch {
      throw new Error(`Invalid UPSTASH_REDIS_REST_URL: "${process.env.UPSTASH_REDIS_REST_URL}". Expected a valid URL, e.g. https://your-db.upstash.io`);
    }
    return {
      url: `rediss://default:${process.env.UPSTASH_REDIS_REST_TOKEN}@${host}:6380`,
      tls: true,
    };
  }
  return {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    tls: process.env.REDIS_TLS === 'true',
  };
}

const { url: redisUrl, tls: redisTls } = buildRedisConfig();

const redisConfig: RedisConfig = {
  url: redisUrl,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
  connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '5000', 10),
  commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT || '2000', 10),
  poolSize: parseInt(process.env.REDIS_POOL_SIZE || '10', 10),
  enableReadyCheck: true,
  lazyConnect: false,
  keepAlive: 30000,
  keyPrefix: 'rl:',
  tls: redisTls,
};

export default redisConfig;
