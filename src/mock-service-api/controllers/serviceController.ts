import { Request, Response } from 'express';
import { ServiceDatabase } from '../db/database';
import { ExternalApiResponse, ErrorResponse } from '../../shared/types';
import { createChildLogger } from '../../shared/logger';

const logger = createChildLogger('service-controller');

export class ServiceController {
  private db: ServiceDatabase;

  constructor(db: ServiceDatabase) {
    this.db = db;
  }

  async getDocumentsByVin(req: Request, res: Response): Promise<void> {
    const { vin } = req.params;
    const correlationId = req.correlationId;

    logger.info('Service System API request', {
      correlationId,
      vin,
    });

    try {
      const documents = await this.db.getDocumentsByVin(vin);

      const response: ExternalApiResponse = {
        documents,
      };

      logger.info('Service System API response', {
        correlationId,
        vin,
        documentCount: documents.length,
      });

      res.status(200).json(response);
    } catch (error) {
      logger.error('Service System API error', {
        correlationId,
        vin,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const errorResponse: ErrorResponse = {
        error: 'Internal Server Error',
        message: 'Database error',
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(errorResponse);
    }
  }

  async healthCheck(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'healthy',
      service: 'service-system-api',
      timestamp: new Date().toISOString(),
    });
  }
}
