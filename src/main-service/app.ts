import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { DocumentController } from './controllers/documentController';
import { correlationIdMiddleware } from './middleware/correlationId';
import { requestLogger } from './middleware/requestLogger';
import { metricsMiddleware } from './middleware/metricsMiddleware';
import { errorHandler } from './middleware/errorHandler';
import { register } from '../shared/metrics';
import { swaggerDocument } from './config/swagger';
import { createChildLogger } from '../shared/logger';

const logger = createChildLogger('main-service');

export function createApp(): Application {
  const app = express();
  const documentController = new DocumentController();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(correlationIdMiddleware);
  app.use(requestLogger);
  app.use(metricsMiddleware);

  // API Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Routes
  app.get('/api/documents', (req, res) =>
    documentController.getDocuments(req, res)
  );

  // Health checks
  app.get('/health', (req, res) => documentController.healthCheck(req, res));
  app.get('/health/ready', (req, res) =>
    documentController.readinessCheck(req, res)
  );

  // Metrics endpoint
  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({
      service: 'Unified Document Viewer API',
      version: '1.0.0',
      endpoints: {
        documents: '/api/documents?vin={vin}',
        documentation: '/api-docs',
        health: '/health',
        readiness: '/health/ready',
        metrics: '/metrics',
      },
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  logger.info('Main service application configured');

  return app;
}
