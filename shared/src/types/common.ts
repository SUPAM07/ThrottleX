export type Environment = 'development' | 'staging' | 'production';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  checks: Record<string, boolean>;
}

export interface AppConfig {
  env: Environment;
  port: number;
  logLevel: LogLevel;
}
