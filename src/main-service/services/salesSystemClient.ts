import axios, { AxiosInstance } from 'axios';
import { ExternalApiResponse } from '../../shared/types';
import { config } from '../../shared/config';
import { RetryService } from './retryService';
import { CircuitBreaker } from './circuitBreaker';
import {
  externalApiCallCounter,
  externalApiCallDuration,
} from '../../shared/metrics';
import logger from '../../shared/logger';

export class SalesSystemClient {
  private axiosInstance: AxiosInstance;
  private retryService: RetryService;
  private circuitBreaker: CircuitBreaker;
  private readonly systemName = 'sales';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.salesApi.url,
      timeout: config.externalApiTimeoutMs,
    });

    this.retryService = new RetryService(config.retry);
    this.circuitBreaker = new CircuitBreaker(
      this.systemName,
      config.circuitBreaker
    );
  }

  async getDocumentsByVin(
    vin: string,
    correlationId?: string
  ): Promise<ExternalApiResponse> {
    const start = Date.now();

    try {
      logger.info('Calling Sales System API', {
        correlationId,
        vin,
        system: this.systemName,
      });

      const result = await this.circuitBreaker.execute(() =>
        this.retryService.executeWithRetry(
          () => this.makeApiCall(vin, correlationId),
          this.systemName,
          correlationId
        )
      );

      const duration = (Date.now() - start) / 1000;
      externalApiCallDuration.observe({ system: this.systemName }, duration);
      externalApiCallCounter.inc({ system: this.systemName, status: 'success' });

      logger.info('Sales System API call successful', {
        correlationId,
        vin,
        documentCount: result.documents.length,
        duration,
      });

      return result;
    } catch (error) {
      const duration = (Date.now() - start) / 1000;
      externalApiCallDuration.observe({ system: this.systemName }, duration);
      externalApiCallCounter.inc({ system: this.systemName, status: 'error' });

      logger.error('Sales System API call failed', {
        correlationId,
        vin,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      });

      throw error;
    }
  }

  private async makeApiCall(
    vin: string,
    correlationId?: string
  ): Promise<ExternalApiResponse> {
    const response = await this.axiosInstance.get<ExternalApiResponse>(
      `/api/documents/${vin}`,
      {
        headers: {
          'x-correlation-id': correlationId || 'unknown',
        },
      }
    );

    return response.data;
  }
}
