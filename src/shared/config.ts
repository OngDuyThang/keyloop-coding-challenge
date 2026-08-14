import { AppConfig } from './types';

export const config: AppConfig = {
  mainService: {
    port: parseInt(process.env.MAIN_SERVICE_PORT || '3000', 10),
  },
  salesApi: {
    port: parseInt(process.env.SALES_API_PORT || '3001', 10),
    url: process.env.SALES_API_URL || 'http://localhost:3001',
  },
  serviceApi: {
    port: parseInt(process.env.SERVICE_API_PORT || '3002', 10),
    url: process.env.SERVICE_API_URL || 'http://localhost:3002',
  },
  retry: {
    maxAttempts: Math.min(
      parseInt(process.env.MAX_RETRY_ATTEMPTS || '3', 10),
      5
    ),
    initialDelayMs: parseInt(process.env.RETRY_INITIAL_DELAY_MS || '100', 10),
  },
  circuitBreaker: {
    failureThreshold: parseInt(
      process.env.CIRCUIT_BREAKER_FAILURE_THRESHOLD || '5',
      10
    ),
    successThreshold: parseInt(
      process.env.CIRCUIT_BREAKER_SUCCESS_THRESHOLD || '2',
      10
    ),
    timeoutMs: parseInt(
      process.env.CIRCUIT_BREAKER_TIMEOUT_MS || '30000',
      10
    ),
  },
  externalApiTimeoutMs: parseInt(
    process.env.EXTERNAL_API_TIMEOUT_MS || '5000',
    10
  ),
  logLevel: process.env.LOG_LEVEL || 'info',
  database: {
    salesDbPath: process.env.SALES_DB_PATH || './data/sales-system.db',
    serviceDbPath: process.env.SERVICE_DB_PATH || './data/service-system.db',
  },
};
