import {
  AggregatedResponse,
  DocumentWithSource,
  SystemType,
} from '../../shared/types';
import { SalesSystemClient } from './salesSystemClient';
import { ServiceSystemClient } from './serviceSystemClient';
import logger from '../../shared/logger';

export class AggregationOrchestrator {
  private salesClient: SalesSystemClient;
  private serviceClient: ServiceSystemClient;

  constructor() {
    this.salesClient = new SalesSystemClient();
    this.serviceClient = new ServiceSystemClient();
  }

  async aggregateDocuments(
    vin: string,
    correlationId?: string
  ): Promise<AggregatedResponse> {
    logger.info('Starting document aggregation', { correlationId, vin });

    const startTime = Date.now();

    // Execute both API calls in parallel
    const [salesResult, serviceResult] = await Promise.allSettled([
      this.salesClient.getDocumentsByVin(vin, correlationId),
      this.serviceClient.getDocumentsByVin(vin, correlationId),
    ]);

    const duration = Date.now() - startTime;

    logger.info('Parallel API calls completed', {
      correlationId,
      vin,
      duration,
      salesStatus: salesResult.status,
      serviceStatus: serviceResult.status,
    });

    // Process results
    const documents: DocumentWithSource[] = [];
    const errors: string[] = [];
    let salesSystemStatus: 'success' | 'error' = 'error';
    let serviceSystemStatus: 'success' | 'error' = 'error';

    // Process Sales System results
    if (salesResult.status === 'fulfilled') {
      salesSystemStatus = 'success';
      const salesDocuments = salesResult.value.documents.map((doc) => ({
        ...doc,
        source: SystemType.Sales as const,
      }));
      documents.push(...salesDocuments);

      logger.debug('Sales System documents retrieved', {
        correlationId,
        count: salesDocuments.length,
      });
    } else {
      errors.push('Sales System unavailable');
      logger.warn('Sales System call failed', {
        correlationId,
        error: salesResult.reason?.message,
      });
    }

    // Process Service System results
    if (serviceResult.status === 'fulfilled') {
      serviceSystemStatus = 'success';
      const serviceDocuments = serviceResult.value.documents.map((doc) => ({
        ...doc,
        source: SystemType.Service as const,
      }));
      documents.push(...serviceDocuments);

      logger.debug('Service System documents retrieved', {
        correlationId,
        count: serviceDocuments.length,
      });
    } else {
      errors.push('Service System unavailable');
      logger.warn('Service System call failed', {
        correlationId,
        error: serviceResult.reason?.message,
      });
    }

    // Check if both systems failed
    if (salesSystemStatus === 'error' && serviceSystemStatus === 'error') {
      logger.error('All external systems failed', { correlationId, vin });
      throw new Error('Unable to retrieve documents from any external system');
    }

    const isPartial = salesSystemStatus === 'error' || serviceSystemStatus === 'error';

    const response: AggregatedResponse = {
      vin,
      documents,
      metadata: {
        salesSystemStatus,
        serviceSystemStatus,
        totalDocuments: documents.length,
        timestamp: new Date().toISOString(),
        ...(isPartial && { isPartial: true }),
        ...(errors.length > 0 && { errors }),
      },
    };

    logger.info('Document aggregation completed', {
      correlationId,
      vin,
      totalDocuments: documents.length,
      isPartial,
      duration,
    });

    return response;
  }
}
