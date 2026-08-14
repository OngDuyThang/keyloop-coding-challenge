import express, { Application } from 'express';
import cors from 'cors';
import { ServiceDatabase } from './db/database';
import { ServiceController } from './controllers/serviceController';
import { correlationIdMiddleware } from '../main-service/middleware/correlationId';
import { requestLogger } from '../main-service/middleware/requestLogger';
import { errorHandler } from '../main-service/middleware/errorHandler';
import { createChildLogger } from '../shared/logger';

const logger = createChildLogger('service-api');

export async function createApp(): Promise<Application> {
  const app = express();
  const db = new ServiceDatabase();

  // Initialize database
  await db.initialize();

  const controller = new ServiceController(db);

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(correlationIdMiddleware);
  app.use(requestLogger);

  // Routes
  app.get('/api/documents/:vin', (req, res) =>
    controller.getDocumentsByVin(req, res)
  );

  app.get('/health', (req, res) => controller.healthCheck(req, res));

  app.get('/', (_req, res) => {
    res.json({
      service: 'Service System API (Mock)',
      version: '1.0.0',
      endpoints: {
        documents: '/api/documents/:vin',
        health: '/health',
      },
    });
  });

  // Error handler
  app.use(errorHandler);

  logger.info('Service System API configured');

  return app;
}
