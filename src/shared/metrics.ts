import client from 'prom-client';

const register = new client.Registry();

// Default metrics (memory, CPU, event loop lag, etc.)
client.collectDefaultMetrics({ register });

// Custom metrics for HTTP requests
export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status', 'service'],
  registers: [register],
});

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status', 'service'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Custom metrics for external API calls
export const externalApiCallCounter = new client.Counter({
  name: 'external_api_calls_total',
  help: 'Total number of external API calls',
  labelNames: ['system', 'status'],
  registers: [register],
});

export const externalApiCallDuration = new client.Histogram({
  name: 'external_api_call_duration_seconds',
  help: 'External API call duration in seconds',
  labelNames: ['system'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Custom metrics for retry attempts
export const retryAttemptCounter = new client.Counter({
  name: 'retry_attempts_total',
  help: 'Total number of retry attempts',
  labelNames: ['system', 'attempt'],
  registers: [register],
});

// Custom metrics for circuit breaker state
export const circuitBreakerStateGauge = new client.Gauge({
  name: 'circuit_breaker_state',
  help: 'Circuit breaker state (0=closed, 1=open, 2=half-open)',
  labelNames: ['system'],
  registers: [register],
});

export const circuitBreakerStateChangeCounter = new client.Counter({
  name: 'circuit_breaker_state_changes_total',
  help: 'Total number of circuit breaker state changes',
  labelNames: ['system', 'from_state', 'to_state'],
  registers: [register],
});

// Custom metrics for VIN validation
export const vinValidationCounter = new client.Counter({
  name: 'vin_validation_total',
  help: 'Total number of VIN validations',
  labelNames: ['status'],
  registers: [register],
});

export { register };
