import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { seedServiceDatabase } from './db/seed';
import { config } from '../shared/config';
import { createChildLogger } from '../shared/logger';

const logger = createChildLogger('service-api');

async function start() {
  try {
    // Seed database on startup
    await seedServiceDatabase();

    const app = await createApp();
    const port = config.serviceApi.port;

    app.listen(port, () => {
      logger.info('Service System API started', {
        port,
        env: process.env.NODE_ENV || 'development',
      });
      console.log(`\n🔧 Service System API (Mock) running on http://localhost:${port}`);
      console.log(`❤️  Health Check: http://localhost:${port}/health\n`);
    });
  } catch (error) {
    logger.error('Failed to start Service System API', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
}

start();
