# Logging and Observability Tool Recommendations

## Context

Human requirement: "End-to-end monitoring" for the Unified Document Viewer assessment project.

Technology stack: Node.js, Express, TypeScript, Jest, SQLite

## Recommended Stack

### 1. Logging: Winston + Morgan

**Winston** (Application Logging)
- Most popular Node.js logging library
- Structured JSON logging support
- Multiple transports (console, file, etc.)
- Log levels (error, warn, info, debug)
- Supports correlation IDs for distributed tracing

**Morgan** (HTTP Request Logging)
- Express middleware for HTTP request logging
- Integrates seamlessly with Winston
- Provides request/response metrics

**Why:**
- Industry standard for Node.js/Express applications
- Mature, well-documented, stable
- Excellent TypeScript support
- Easy to configure and use
- Perfect for assessment demonstration

**Installation:**
```bash
npm install winston morgan
npm install --save-dev @types/morgan
```

### 2. Metrics: prom-client (Prometheus Client)

**prom-client**
- Prometheus metrics collection for Node.js
- Standard metric types (counter, gauge, histogram)
- Built-in Express middleware
- Exposes /metrics endpoint
- Industry-standard metric format

**Metrics to Track:**
- HTTP request count (by status code, endpoint)
- HTTP request duration (histogram)
- External API call count (by source system, status)
- External API call duration (by source system)
- Circuit breaker state changes
- Retry attempts count
- Active requests (gauge)

**Why:**
- Prometheus is industry standard for metrics
- Easy to visualize with Grafana (optional for demo)
- Built-in /metrics endpoint for monitoring
- Lightweight and performant
- Excellent for demonstrating observability

**Installation:**
```bash
npm install prom-client
```

### 3. Distributed Tracing: Correlation IDs (Manual Implementation)

**Approach:**
- Generate unique correlation ID for each incoming request
- Pass correlation ID through all logging calls
- Include correlation ID in external API calls (headers)
- Log correlation ID in all log entries

**Why:**
- Simple to implement manually
- No external service dependencies
- Demonstrates understanding of distributed tracing concepts
- Appropriate for assessment context
- Can use `uuid` package for ID generation

**Installation:**
```bash
npm install uuid
npm install --save-dev @types/uuid
```

### 4. Health Check Endpoints

**Approach:**
- `/health` - Basic health check (returns 200 OK)
- `/health/ready` - Readiness check (checks external API connectivity)
- `/health/live` - Liveness check (checks application is responsive)

**Why:**
- Standard Kubernetes-style health checks
- Demonstrates production-readiness thinking
- Easy to implement
- Useful for demonstrating resilience

## Alternative Options Considered

### OpenTelemetry
**Pros:** Comprehensive, vendor-neutral, future-proof
**Cons:** More complex setup, potentially over-engineered for assessment
**Decision:** Not recommended for time-boxed assessment

### Bunyan
**Pros:** Good structured logging, similar to Winston
**Cons:** Less active maintenance than Winston
**Decision:** Winston is more widely adopted

### Log4js
**Pros:** Java-like logging familiar to some developers
**Cons:** Less popular in Node.js ecosystem than Winston
**Decision:** Winston has better community support

### Custom Logging
**Pros:** Full control
**Cons:** Time-consuming, reinventing the wheel
**Decision:** Use battle-tested libraries

## Recommended Implementation Approach

### Step 1: Configure Winston Logger (Shared)
```typescript
// src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

export default logger;
```

### Step 2: Add Correlation ID Middleware
```typescript
// src/middleware/correlationId.ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
}
```

### Step 3: Add HTTP Request Logging
```typescript
// src/middleware/requestLogger.ts
import morgan from 'morgan';
import logger from '../utils/logger';

morgan.token('correlation-id', (req: any) => req.correlationId);

export const requestLogger = morgan(
  ':method :url :status :response-time ms - correlation-id: :correlation-id',
  {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  }
);
```

### Step 4: Configure Prometheus Metrics
```typescript
// src/utils/metrics.ts
import client from 'prom-client';

const register = new client.Registry();

// Default metrics (memory, CPU, etc.)
client.collectDefaultMetrics({ register });

// Custom metrics
export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

export const externalApiCallCounter = new client.Counter({
  name: 'external_api_calls_total',
  help: 'Total external API calls',
  labelNames: ['system', 'status'],
  registers: [register]
});

export const externalApiCallDuration = new client.Histogram({
  name: 'external_api_call_duration_seconds',
  help: 'External API call duration',
  labelNames: ['system'],
  registers: [register]
});

export { register };
```

### Step 5: Metrics Endpoint
```typescript
// Add to main Express app
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

## Environment Variables

Add to `.env` file:
```
LOG_LEVEL=info
MAX_RETRY_ATTEMPTS=3
```

## Log Output Example

**Structured JSON Log Entry:**
```json
{
  "timestamp": "2026-08-14T10:30:45.123Z",
  "level": "info",
  "message": "External API call",
  "correlationId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "system": "sales",
  "duration": 245,
  "status": 200,
  "documentsCount": 3
}
```

## Metrics Endpoint Output Example

```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/api/documents",status="200"} 42

# HELP http_request_duration_seconds HTTP request duration
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",route="/api/documents",status="200",le="0.1"} 35
http_request_duration_seconds_bucket{method="GET",route="/api/documents",status="200",le="0.5"} 40

# HELP external_api_calls_total Total external API calls
# TYPE external_api_calls_total counter
external_api_calls_total{system="sales",status="success"} 42
external_api_calls_total{system="service",status="success"} 41
external_api_calls_total{system="sales",status="error"} 1
```

## Benefits for Assessment

1. **Demonstrates Production Thinking:**
   - Industry-standard tools (Winston, Prometheus)
   - Structured logging
   - Distributed tracing concepts (correlation IDs)
   - Health check endpoints

2. **Easy to Demonstrate:**
   - View logs in console and files
   - Access /metrics endpoint to see metrics
   - Trace requests through correlation IDs
   - Show health check responses

3. **Time-Efficient:**
   - All libraries are quick to install and configure
   - Minimal boilerplate required
   - Well-documented libraries
   - TypeScript support out of the box

4. **Assessment-Appropriate:**
   - Not over-engineered (no external tracing services)
   - Shows understanding of observability principles
   - Sufficient for end-to-end monitoring requirement
   - Easy for evaluators to understand and test

## Summary

**Recommended Stack:**
- **Logging:** Winston + Morgan
- **Metrics:** prom-client (Prometheus)
- **Tracing:** Correlation IDs (uuid)
- **Health Checks:** Custom endpoints

**Total Additional Dependencies:** 4 packages (winston, morgan, prom-client, uuid)

**Setup Time:** ~1-2 hours for complete observability infrastructure

**Assessment Value:** High - demonstrates understanding of production observability patterns without over-engineering

---

**Ready to proceed with Construction phase using this observability stack.**
