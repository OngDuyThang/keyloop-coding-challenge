import { RetryService } from '../retryService';
import { AxiosError } from 'axios';

describe('Retry Service', () => {
  let retryService: RetryService;

  beforeEach(() => {
    retryService = new RetryService({
      maxAttempts: 3,
      initialDelayMs: 100,
    });
  });

  describe('executeWithRetry', () => {
    it('should return result on first success', async () => {
      const operation = jest.fn().mockResolvedValue('success');

      const result = await retryService.executeWithRetry(operation, 'test-system');

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on transient failures and succeed', async () => {
      const operation = jest
        .fn()
        .mockRejectedValueOnce(new Error('ECONNREFUSED'))
        .mockRejectedValueOnce(new Error('timeout'))
        .mockResolvedValueOnce('success');

      const result = await retryService.executeWithRetry(operation, 'test-system');

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should throw after max attempts on retriable errors', async () => {
      const operation = jest
        .fn()
        .mockRejectedValue(new Error('ECONNREFUSED'));

      await expect(retryService.executeWithRetry(operation, 'test-system')).rejects.toThrow(
        'ECONNREFUSED'
      );
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should retry on 500 status code', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 500 },
        message: 'Internal Server Error',
      } as AxiosError;

      const operation = jest
        .fn()
        .mockRejectedValueOnce(axiosError)
        .mockResolvedValueOnce('success');

      const result = await retryService.executeWithRetry(operation, 'test-system');

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on 503 status code', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 503 },
        message: 'Service Unavailable',
      } as AxiosError;

      const operation = jest
        .fn()
        .mockRejectedValueOnce(axiosError)
        .mockResolvedValueOnce('success');

      const result = await retryService.executeWithRetry(operation, 'test-system');

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on 429 rate limit', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 429 },
        message: 'Too Many Requests',
      } as AxiosError;

      const operation = jest
        .fn()
        .mockRejectedValueOnce(axiosError)
        .mockResolvedValueOnce('success');

      const result = await retryService.executeWithRetry(operation, 'test-system');

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should NOT retry on 400 Bad Request', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 400 },
        message: 'Bad Request',
      } as AxiosError;

      const operation = jest.fn().mockRejectedValue(axiosError);

      await expect(retryService.executeWithRetry(operation, 'test-system')).rejects.toMatchObject({
        message: 'Bad Request',
      });
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should NOT retry on 404 Not Found', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
        message: 'Not Found',
      } as AxiosError;

      const operation = jest.fn().mockRejectedValue(axiosError);

      await expect(retryService.executeWithRetry(operation, 'test-system')).rejects.toMatchObject({
        message: 'Not Found',
      });
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on network errors (no response)', async () => {
      const axiosError = {
        isAxiosError: true,
        response: undefined,
        message: 'Network Error',
      } as AxiosError;

      const operation = jest
        .fn()
        .mockRejectedValueOnce(axiosError)
        .mockResolvedValueOnce('success');

      const result = await retryService.executeWithRetry(operation, 'test-system');

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on ECONNREFUSED errors', async () => {
      const operation = jest
        .fn()
        .mockRejectedValueOnce(new Error('ECONNREFUSED'))
        .mockResolvedValueOnce('success');

      const result = await retryService.executeWithRetry(operation, 'test-system');

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on ENOTFOUND errors', async () => {
      const operation = jest
        .fn()
        .mockRejectedValueOnce(new Error('ENOTFOUND'))
        .mockResolvedValueOnce('success');

      const result = await retryService.executeWithRetry(operation, 'test-system');

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on timeout errors', async () => {
      const operation = jest
        .fn()
        .mockRejectedValueOnce(new Error('Request timeout'))
        .mockResolvedValueOnce('success');

      const result = await retryService.executeWithRetry(operation, 'test-system');

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should use exponential backoff', async () => {
      const operation = jest
        .fn()
        .mockRejectedValueOnce(new Error('timeout'))
        .mockRejectedValueOnce(new Error('timeout'))
        .mockResolvedValueOnce('success');

      const startTime = Date.now();
      await retryService.executeWithRetry(operation, 'test-system');
      const duration = Date.now() - startTime;

      // First retry: 100ms, Second retry: 200ms = ~300ms total
      expect(duration).toBeGreaterThanOrEqual(250);
      expect(duration).toBeLessThan(500);
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should handle different max attempts with retriable errors', async () => {
      const customRetry = new RetryService({
        maxAttempts: 5,
        initialDelayMs: 10,
      });

      const operation = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'));

      await expect(customRetry.executeWithRetry(operation, 'test-system')).rejects.toThrow(
        'ECONNREFUSED'
      );
      expect(operation).toHaveBeenCalledTimes(5);
    });

    it('should pass correlationId through retries', async () => {
      const operation = jest
        .fn()
        .mockRejectedValueOnce(new Error('timeout'))
        .mockResolvedValueOnce('success');

      await retryService.executeWithRetry(operation, 'test-system', 'correlation-123');

      expect(operation).toHaveBeenCalledTimes(2);
    });
  });
});
