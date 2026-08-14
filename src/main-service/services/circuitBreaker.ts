import { CircuitBreakerConfig } from '../../shared/types';
import {
  circuitBreakerStateGauge,
  circuitBreakerStateChangeCounter,
} from '../../shared/metrics';
import logger from '../../shared/logger';

enum CircuitBreakerState {
  CLOSED = 0,
  OPEN = 1,
  HALF_OPEN = 2,
}

export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private nextAttemptTime = 0;

  constructor(
    private systemName: string,
    private config: CircuitBreakerConfig
  ) {
    circuitBreakerStateGauge.set({ system: this.systemName }, CircuitBreakerState.CLOSED);
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitBreakerState.OPEN) {
      if (Date.now() < this.nextAttemptTime) {
        throw new Error(`Circuit breaker is OPEN for ${this.systemName}`);
      }
      this.transitionTo(CircuitBreakerState.HALF_OPEN);
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.successCount++;

      if (this.successCount >= this.config.successThreshold) {
        this.transitionTo(CircuitBreakerState.CLOSED);
        this.successCount = 0;
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.successCount = 0;

    if (
      this.state === CircuitBreakerState.HALF_OPEN ||
      this.failureCount >= this.config.failureThreshold
    ) {
      this.transitionTo(CircuitBreakerState.OPEN);
      this.nextAttemptTime = Date.now() + this.config.timeoutMs;
    }
  }

  private transitionTo(newState: CircuitBreakerState): void {
    const oldState = this.state;

    if (oldState === newState) {
      return;
    }

    this.state = newState;

    circuitBreakerStateGauge.set({ system: this.systemName }, newState);
    circuitBreakerStateChangeCounter.inc({
      system: this.systemName,
      from_state: CircuitBreakerState[oldState],
      to_state: CircuitBreakerState[newState],
    });

    logger.warn('Circuit breaker state changed', {
      system: this.systemName,
      fromState: CircuitBreakerState[oldState],
      toState: CircuitBreakerState[newState],
      failureCount: this.failureCount,
      successCount: this.successCount,
    });
  }

  getState(): string {
    return CircuitBreakerState[this.state];
  }

  getFailureCount(): number {
    return this.failureCount;
  }
}
