import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { config } from '../shared/config';
import { createChildLogger } from '../shared/logger';

const logger = createChildLogger('main-service');

const app = createApp();
const port = config.mainService.port;

app.listen(port, () => {
  logger.info(`Main service started`, {
    port,
    env: process.env.NODE_ENV || 'development',
    salesApiUrl: config.salesApi.url,
    serviceApiUrl: config.serviceApi.url,
    maxRetryAttempts: config.retry.maxAttempts,
    externalApiTimeout: config.externalApiTimeoutMs,
  });
  console.log(`\n🚀 Unified Document Viewer API running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  console.log(`❤️  Health Check: http://localhost:${port}/health`);
  console.log(`📊 Metrics: http://localhost:${port}/metrics\n`);
});
