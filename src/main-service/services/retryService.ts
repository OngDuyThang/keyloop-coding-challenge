import { RetryConfig } from '../../shared/types';
import { retryAttemptCounter } from '../../shared/metrics';
import logger from '../../shared/logger';
import { AxiosError } from 'axios';

export class RetryService {
  constructor(private config: RetryConfig) {}

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    systemName: string,
    correlationId?: string
  ): Promise<T> {
    let lastError: Error | undefined;
    const maxAttempts = this.config.maxAttempts;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await operation();

        if (attempt > 1) {
          logger.info('Retry successful', {
            correlationId,
            system: systemName,
            attempt,
          });
        }

        return result;
      } catch (error) {
        lastError = error as Error;

        retryAttemptCounter.inc({
          system: systemName,
          attempt: attempt.toString(),
        });

        const shouldRetry = this.shouldRetry(error as Error, attempt, maxAttempts);

        if (!shouldRetry) {
          logger.warn('Not retrying - non-retriable error or max attempts reached', {
            correlationId,
            system: systemName,
            attempt,
            maxAttempts,
            error: lastError.message,
          });
          throw lastError;
        }

        const delay = this.calculateDelay(attempt);

        logger.warn('Retry attempt', {
          correlationId,
          system: systemName,
          attempt,
          maxAttempts,
          nextDelayMs: delay,
          error: lastError.message,
        });

        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  private shouldRetry(error: Error, attempt: number, maxAttempts: number): boolean {
    if (attempt >= maxAttempts) {
      return false;
    }

    if (this.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      // Retry on network errors
      if (!axiosError.response) {
        return true;
      }

      const status = axiosError.response.status;

      // Retry on 5xx errors and 429 (rate limit)
      if (status >= 500 || status === 429) {
        return true;
      }

      // Don't retry on 4xx errors (except 429)
      if (status >= 400 && status < 500) {
        return false;
      }
    }

    // Retry on timeout errors
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      return true;
    }

    // Retry on connection errors
    if (
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ECONNRESET')
    ) {
      return true;
    }

    return false;
  }

  private calculateDelay(attempt: number): number {
    // Exponential backoff: initialDelay * 2^(attempt - 1)
    return this.config.initialDelayMs * Math.pow(2, attempt - 1);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isAxiosError(error: any): error is AxiosError {
    return error.isAxiosError === true;
  }
}
