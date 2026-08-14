import { Request, Response } from 'express';
import { VinValidator } from '../services/vinValidator';
import { AggregationOrchestrator } from '../services/aggregationOrchestrator';
import { ErrorResponse } from '../../shared/types';
import logger from '../../shared/logger';

export class DocumentController {
  private orchestrator: AggregationOrchestrator;

  constructor() {
    this.orchestrator = new AggregationOrchestrator();
  }

  async getDocuments(req: Request, res: Response): Promise<void> {
    const correlationId = req.correlationId;
    const { vin } = req.query;

    logger.info('Document search request received', {
      correlationId,
      vin,
    });

    // Validate VIN parameter
    if (!vin || typeof vin !== 'string') {
      const errorResponse: ErrorResponse = {
        error: 'Bad Request',
        message: 'VIN query parameter is required',
        timestamp: new Date().toISOString(),
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Validate VIN format
    const validation = VinValidator.validate(vin, correlationId);
    if (!validation.isValid) {
      const errorResponse: ErrorResponse = {
        error: 'Invalid VIN format',
        message:
          validation.error ||
          'VIN must be exactly 17 alphanumeric characters (excluding I, O, Q)',
        timestamp: new Date().toISOString(),
      };
      res.status(400).json(errorResponse);
      return;
    }

    const normalizedVin = VinValidator.normalize(vin);

    try {
      // Aggregate documents from external systems
      const result = await this.orchestrator.aggregateDocuments(
        normalizedVin,
        correlationId
      );

      logger.info('Document search completed successfully', {
        correlationId,
        vin: normalizedVin,
        documentCount: result.documents.length,
        isPartial: result.metadata.isPartial,
      });

      res.status(200).json(result);
    } catch (error) {
      logger.error('Document search failed', {
        correlationId,
        vin: normalizedVin,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const errorResponse: ErrorResponse = {
        error: 'Service Unavailable',
        message: 'Unable to retrieve documents from any external system',
        metadata: {
          salesSystemStatus: 'error',
          serviceSystemStatus: 'error',
        },
        timestamp: new Date().toISOString(),
      };

      res.status(503).json(errorResponse);
    }
  }

  async healthCheck(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'healthy',
      service: 'unified-document-viewer',
      timestamp: new Date().toISOString(),
    });
  }

  async readinessCheck(req: Request, res: Response): Promise<void> {
    const correlationId = req.correlationId;

    // Check if external systems are reachable
    // For now, just return healthy (can be enhanced to ping external systems)
    logger.debug('Readiness check', { correlationId });

    res.status(200).json({
      status: 'ready',
      service: 'unified-document-viewer',
      timestamp: new Date().toISOString(),
    });
  }
}
