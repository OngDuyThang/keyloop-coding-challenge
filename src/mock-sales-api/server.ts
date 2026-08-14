import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { seedSalesDatabase } from './db/seed';
import { config } from '../shared/config';
import { createChildLogger } from '../shared/logger';

const logger = createChildLogger('sales-api');

async function start() {
  try {
    // Seed database on startup
    await seedSalesDatabase();

    const app = await createApp();
    const port = config.salesApi.port;

    app.listen(port, () => {
      logger.info('Sales System API started', {
        port,
        env: process.env.NODE_ENV || 'development',
      });
      console.log(`\n🏢 Sales System API (Mock) running on http://localhost:${port}`);
      console.log(`❤️  Health Check: http://localhost:${port}/health\n`);
    });
  } catch (error) {
    logger.error('Failed to start Sales System API', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
}

start();
