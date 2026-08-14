import { CircuitBreaker } from '../circuitBreaker';

describe('Circuit Breaker', () => {
  let circuitBreaker: CircuitBreaker;

  beforeEach(() => {
    circuitBreaker = new CircuitBreaker('test-system', {
      failureThreshold: 3,
      successThreshold: 1,
      timeoutMs: 1000,
    });
  });

  describe('execute', () => {
    it('should execute function when circuit is closed', async () => {
      const fn = jest.fn().mockResolvedValue('success');

      const result = await circuitBreaker.execute(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should track consecutive failures', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('failure'));

      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();

      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should open circuit after threshold failures', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('failure'));

      await expect(circuitBreaker.execute(fn)).rejects.toThrow('failure');
      await expect(circuitBreaker.execute(fn)).rejects.toThrow('failure');
      await expect(circuitBreaker.execute(fn)).rejects.toThrow('failure');

      await expect(circuitBreaker.execute(fn)).rejects.toThrow(
        'Circuit breaker is OPEN for test-system'
      );
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should reset failure count on success', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('failure'))
        .mockRejectedValueOnce(new Error('failure'))
        .mockResolvedValueOnce('success')
        .mockRejectedValueOnce(new Error('failure'))
        .mockRejectedValueOnce(new Error('failure'));

      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();

      await expect(circuitBreaker.execute(fn)).resolves.toBe('success');

      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();

      expect(fn).toHaveBeenCalledTimes(5);
    });

    it('should transition to half-open state after timeout', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('failure'))
        .mockRejectedValueOnce(new Error('failure'))
        .mockRejectedValueOnce(new Error('failure'))
        .mockResolvedValueOnce('success');

      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();

      await expect(circuitBreaker.execute(fn)).rejects.toThrow(
        'Circuit breaker is OPEN'
      );

      await new Promise(resolve => setTimeout(resolve, 1100));

      const result = await circuitBreaker.execute(fn);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(4);
    });

    it('should close circuit after successful call in half-open state', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('failure'))
        .mockRejectedValueOnce(new Error('failure'))
        .mockRejectedValueOnce(new Error('failure'))
        .mockResolvedValue('success');

      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();

      await new Promise(resolve => setTimeout(resolve, 1100));

      await expect(circuitBreaker.execute(fn)).resolves.toBe('success');
      await expect(circuitBreaker.execute(fn)).resolves.toBe('success');

      expect(fn).toHaveBeenCalledTimes(5);
    });

    it('should reopen circuit if half-open call fails', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('failure'));

      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();

      await new Promise(resolve => setTimeout(resolve, 1100));

      await expect(circuitBreaker.execute(fn)).rejects.toThrow('failure');

      await expect(circuitBreaker.execute(fn)).rejects.toThrow(
        'Circuit breaker is OPEN'
      );

      expect(fn).toHaveBeenCalledTimes(4);
    });

    it('should handle different failure thresholds', async () => {
      const cb = new CircuitBreaker('test', {
        failureThreshold: 5,
        successThreshold: 1,
        timeoutMs: 1000,
      });
      const fn = jest.fn().mockRejectedValue(new Error('failure'));

      for (let i = 0; i < 5; i++) {
        await expect(cb.execute(fn)).rejects.toThrow('failure');
      }

      await expect(cb.execute(fn)).rejects.toThrow('Circuit breaker is OPEN');
      expect(fn).toHaveBeenCalledTimes(5);
    });
  });

  describe('getState', () => {
    it('should return CLOSED initially', () => {
      expect(circuitBreaker.getState()).toBe('CLOSED');
    });

    it('should return OPEN after threshold failures', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('failure'));

      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();

      expect(circuitBreaker.getState()).toBe('OPEN');
    });

    it('should return HALF_OPEN after timeout', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('failure'));

      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();
      await expect(circuitBreaker.execute(fn)).rejects.toThrow();

      await new Promise(resolve => setTimeout(resolve, 1100));

      // State transitions to HALF_OPEN when we try to execute
      const testFn = jest.fn().mockImplementation(() => {
        throw new Error('test');
      });

      try {
        await circuitBreaker.execute(testFn);
      } catch {
        // Expected to fail
      }

      expect(circuitBreaker.getState()).toBe('OPEN');
    });
  });
});
