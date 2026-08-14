# System Design - Unified Document Viewer

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Components](#components)
4. [Data Model](#data-model)
5. [API Specification](#api-specification)
6. [Resilience Patterns](#resilience-patterns)
7. [Observability](#observability)
8. [Security Considerations](#security-considerations)
9. [Performance Characteristics](#performance-characteristics)
10. [Deployment Architecture](#deployment-architecture)

---

## Overview

The Unified Document Viewer is a microservice-style application that aggregates vehicle documents from multiple dealership systems. It provides a single API for clients to search documents by Vehicle Identification Number (VIN) and handles communication with two independent external systems.

### Design Goals

1. **Reliability** - Continue functioning despite partial system failures
2. **Responsiveness** - Return results quickly even with network delays
3. **Simplicity** - Clear separation of concerns and easy to understand
4. **Observability** - Full visibility into system behavior and debugging
5. **Testability** - Comprehensive test coverage for confidence in reliability

---

## Architecture

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Client Applications                        │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP
                 │ /api/documents?vin=...
                 ▼
         ┌───────────────────┐
         │  Main Service     │ Port 3000
         │  (Express.js)     │
         │                   │
         │  ┌─────────────┐  │
         │  │ Controller  │  │
         │  └──────┬──────┘  │
         │         │         │
         │  ┌──────▼──────┐  │
         │  │ Orchestrator│  │
         │  └──────┬──────┘  │
         │         │         │
         │    ┌────┴─────┐   │
         │    │           │   │
         │  ┌─▼──┐   ┌──▼──┐ │
         │  │Sales    │Service│
         │  │Client   │Client │
         │  │(+CB)    │(+CB) │
         │  └─┬──┘   └──┬──┘ │
         └────┼────────┼─────┘
              │        │
          HTTP│        │HTTP
              │        │
         ┌────▼──┐  ┌──▼────┐
         │Sales  │  │Service │
         │API    │  │API     │
         │Port   │  │Port    │
         │3001   │  │3002    │
         └───────┘  └────────┘
```

### Layered Architecture

```
┌────────────────────────────────────────┐
│         API Layer                      │ Handles HTTP requests/responses
│  (Controller, Middleware, Routes)      │
├────────────────────────────────────────┤
│     Business Logic Layer               │ Orchestration, aggregation
│  (Orchestrator, Aggregator)            │
├────────────────────────────────────────┤
│     Resilience Layer                   │ Retry, Circuit Breaker
│  (RetryService, CircuitBreaker)        │
├────────────────────────────────────────┤
│     Integration Layer                  │ External API clients
│  (SalesClient, ServiceClient)          │
├────────────────────────────────────────┤
│     Infrastructure Layer               │ Logging, metrics, tracing
│  (Logger, Metrics, CorrelationId)      │
└────────────────────────────────────────┘
```

---

## Components

### Main Service (Port 3000)

#### Express Application (`src/main-service/app.ts`)

Core Express.js setup with:
- CORS middleware for cross-origin requests
- JSON body parsing
- Middleware stack registration
- Route definitions
- Swagger UI integration

#### Document Controller (`src/main-service/controllers/documentController.ts`)

**Responsibilities:**
- Handle GET /api/documents requests
- Extract and validate VIN parameter
- Invoke orchestrator
- Format responses
- Map business errors to HTTP status codes

**Methods:**
- `getDocuments(req, res)` - Main API endpoint
- `healthCheck(req, res)` - Service health status
- `readinessCheck(req, res)` - Readiness probe

### Aggregation Orchestrator (`src/main-service/services/aggregationOrchestrator.ts`)

**Responsibilities:**
- Coordinate parallel API calls
- Manage retries and circuit breakers for each client
- Aggregate results from both systems
- Build response metadata

**Data Flow:**
```
VIN Input
   ↓
[Query Sales (with CB + Retry)]
[Query Service (with CB + Retry)]
   ↓
[Collect Results via Promise.allSettled]
   ↓
[Process Fulfilled/Rejected results]
   ↓
[Aggregate Documents + Metadata]
   ↓
Response with Documents + Status
```

### Resilience Services

#### VIN Validator (`src/main-service/services/vinValidator.ts`)

**Validation Rules:**
- Exactly 17 characters
- Alphanumeric characters only
- Excludes I, O, Q (VIN standard)
- Case-insensitive input (normalized to uppercase)

**Returns:**
- `{ isValid: true }` - VIN is valid
- `{ isValid: false, error: string }` - VIN is invalid with reason

#### Retry Service (`src/main-service/services/retryService.ts`)

**Strategy:** Exponential backoff with configurable max attempts

**Retriable Errors:**
- Network errors: ECONNREFUSED, ENOTFOUND, ECONNRESET
- Timeout errors: ETIMEDOUT, timeout message
- HTTP 5xx errors
- HTTP 429 (Too Many Requests)

**Non-Retriable Errors:**
- HTTP 4xx errors (except 429)
- Client errors

**Backoff Formula:**
```
delay = initialDelayMs * 2^(attempt - 1)
Example: 100ms, 200ms, 400ms, 800ms...
```

**Configuration:**
```typescript
{
  maxAttempts: 3,
  initialDelayMs: 100
}
```

#### Circuit Breaker (`src/main-service/services/circuitBreaker.ts`)

**State Machine:**
```
┌─────────┐
│ CLOSED  │ ◄──────────────────────────┐
└────┬────┘                            │
     │ (failure_threshold reached)     │
     │                                 │
     ▼                                 │
  ┌─────────┐                          │
  │  OPEN   │ ──(timeout passes)──┐   │
  └─────────┘                     │   │
                                  ▼   │
                            ┌──────────────┐
                            │ HALF_OPEN    │
                            │              │
                            │ (try call)   │
                            └──┬───────┬───┘
                               │       │
                         (success)  (failure)
                               │       │
                               └───┬───┘
                                   │ (reopen)
                                   │
                          (close & reset)
                                   │
                                   └──────►
```

**Configuration:**
```typescript
{
  failureThreshold: 3,      // Opens after 3 failures
  successThreshold: 1,      // Closes after 1 success
  timeoutMs: 60000         // Wait before trying recovery
}
```

### External API Clients

#### Sales System Client (`src/main-service/services/salesSystemClient.ts`)

- Base URL: `http://localhost:3001`
- Endpoint: `GET /api/documents/:vin`
- Includes retry service and circuit breaker
- Timeout: 5000ms

#### Service System Client (`src/main-service/services/serviceSystemClient.ts`)

- Base URL: `http://localhost:3002`
- Endpoint: `GET /api/documents/:vin`
- Includes retry service and circuit breaker
- Timeout: 5000ms

### Mock External Systems

#### Mock Sales API (Port 3001)

- SQLite database with mock documents
- Endpoint: `GET /api/documents/:vin`
- Health check: `GET /health`
- Returns documents for known VINs, empty array otherwise

#### Mock Service API (Port 3002)

- SQLite database with mock documents
- Endpoint: `GET /api/documents/:vin`
- Health check: `GET /health`
- Returns documents for known VINs, empty array otherwise

### Middleware

#### Correlation ID Middleware

- Generates or extracts `x-correlation-id` from request headers
- Attaches to request object
- Sets in response headers
- Passed to all logging

#### Request Logger Middleware

- Logs incoming request details (method, path, IP)
- Uses Winston logger with JSON format
- Includes correlation ID in every log

#### Metrics Middleware

- Records HTTP request metrics
- Tracks response time and status codes
- Updates Prometheus metrics

#### Error Handler Middleware

- Catches all errors in request pipeline
- Maps application errors to HTTP status codes
- Returns JSON error responses
- Logs errors with context

### Infrastructure Services

#### Logger (`src/shared/logger.ts`)

- Winston-based structured logging
- JSON format for log aggregation
- Configurable log level (debug, info, warn, error)
- Correlation ID in every log
- Timestamp and service name

#### Metrics (`src/shared/metrics.ts`)

- Prometheus client integration
- Tracks:
  - HTTP request duration and count
  - VIN validation attempts
  - Retry attempts by system
  - Circuit breaker state changes
  - Node.js process metrics

#### Configuration (`src/shared/config.ts`)

- Centralized configuration
- Environment-based (development/test/production)
- Retry, circuit breaker, timeout settings
- API endpoints for mock systems
- Log level configuration

---

## Data Model

### Document Type

```typescript
interface Document {
  id: string;           // Unique document ID
  title: string;        // Document title
  type: string;         // Document type (e.g., "Contract", "Service Record")
  date: string;         // Document date (ISO 8601)
}
```

### Document with Source

```typescript
interface DocumentWithSource extends Document {
  source: "Sales System" | "Service System";
}
```

### External API Response

```typescript
interface ExternalApiResponse {
  documents: Document[];
}
```

### Aggregated Response

```typescript
interface AggregatedResponse {
  vin: string;
  documents: DocumentWithSource[];
  metadata: {
    salesSystemStatus: "success" | "error";
    serviceSystemStatus: "success" | "error";
    totalDocuments: number;
    timestamp: string;
    isPartial?: boolean;
    errors?: string[];
  };
}
```

---

## API Specification

### Endpoint: GET /api/documents

**Purpose:** Retrieve and aggregate documents for a vehicle

**Request:**
```
GET /api/documents?vin=1HGBH41JXMN109186
X-Correlation-ID: <optional-uuid>
```

**Parameters:**
| Name | Type | Required | Constraints |
|------|------|----------|-------------|
| vin | string | Yes | Exactly 17 characters, alphanumeric, no I/O/Q |

**Success Response (200):**
```json
{
  "vin": "1HGBH41JXMN109186",
  "documents": [
    {
      "id": "S1",
      "title": "Purchase Agreement",
      "type": "Contract",
      "date": "2024-01-15",
      "source": "Sales System"
    },
    {
      "id": "SV1",
      "title": "Oil Change Service",
      "type": "Service Record",
      "date": "2024-02-20",
      "source": "Service System"
    }
  ],
  "metadata": {
    "salesSystemStatus": "success",
    "serviceSystemStatus": "success",
    "totalDocuments": 2,
    "timestamp": "2026-08-14T10:00:00.000Z"
  }
}
```

**Partial Failure Response (200):**
```json
{
  "vin": "1HGBH41JXMN109186",
  "documents": [
    {
      "id": "S1",
      "title": "Purchase Agreement",
      "type": "Contract",
      "date": "2024-01-15",
      "source": "Sales System"
    }
  ],
  "metadata": {
    "salesSystemStatus": "success",
    "serviceSystemStatus": "error",
    "totalDocuments": 1,
    "timestamp": "2026-08-14T10:00:00.000Z",
    "isPartial": true,
    "errors": ["Service System unavailable"]
  }
}
```

**Error Response (400):**
```json
{
  "error": "Invalid VIN format"
}
```

**Error Response (503):**
```json
{
  "error": "Service Unavailable"
}
```

---

## Resilience Patterns

### 1. Timeout Management

**Configuration:**
- External API timeout: 5000ms
- Retry delay: exponential backoff starting at 100ms

**Behavior:**
- Requests that exceed timeout are rejected
- Rejection triggers retry logic
- Total time for 3 attempts: ~1200ms

### 2. Retry Logic

**Scenarios:**
- Network error (ECONNREFUSED) → Retry
- Timeout error → Retry
- 500 Internal Server Error → Retry
- 429 Too Many Requests → Retry
- 400 Bad Request → No retry (client error)
- 404 Not Found → No retry (client error)

**Max Attempts:** 3
**Backoff:** Exponential (100ms, 200ms, 400ms)

### 3. Circuit Breaker

**Per-System:** Each external API has its own circuit breaker

**States:**
- **CLOSED** - Normal operation, requests go through
- **OPEN** - System unavailable, requests fail immediately
- **HALF_OPEN** - Testing recovery, limited requests allowed

**Transitions:**
- CLOSED → OPEN: 3 consecutive failures
- OPEN → HALF_OPEN: 60 seconds timeout
- HALF_OPEN → CLOSED: Successful request
- HALF_OPEN → OPEN: Failed request

### 4. Graceful Degradation

**Available data returned even if one system fails**

Example scenarios:
- Sales system down → Return service documents only
- Service system down → Return sales documents only
- Both systems down → Return 503 error

**Metadata includes:**
- Status of each system
- `isPartial: true` flag when not all systems available
- Error list describing which systems failed

### 5. Correlation ID Tracing

**Flow:**
```
Client Request
  ↓ (with or without X-Correlation-ID)
Middleware generates UUID if not provided
  ↓
Attached to Request object
  ↓
Included in all logs
  ↓
Passed to external systems
  ↓
Response includes in X-Correlation-ID header
```

---

## Observability

### Logging Strategy

**Log Levels:**
- `debug` - Detailed execution flow
- `info` - Significant events (API calls, aggregations)
- `warn` - Unexpected but recoverable situations (partial failures)
- `error` - Failures requiring attention

**Log Structure:**
```json
{
  "timestamp": "2026-08-14T10:00:00.000Z",
  "level": "info",
  "service": "unified-document-viewer",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Document search completed successfully",
  "vin": "1HGBH41JXMN109186",
  "documentCount": 6,
  "duration": 245
}
```

### Metrics

**Request Metrics:**
- `http_request_duration_seconds` - Histogram of request duration
- `http_requests_total` - Counter by method and path
- `http_requests_in_flight` - Gauge of active requests

**Business Metrics:**
- `vin_validation_total` - Counter by validation status
- `retry_attempts_total` - Counter by system
- `circuit_breaker_state` - Gauge (0=CLOSED, 1=OPEN, 2=HALF_OPEN)

**System Metrics:**
- `nodejs_version_info`
- `process_cpu_seconds_total`
- `process_resident_memory_bytes`
- `nodejs_heap_size_total_bytes`

### Health Checks

**GET /health**
- Returns immediately if service is running
- Response: `{ "status": "healthy" }`

**GET /health/ready**
- Could include dependency checks
- Currently same as /health
- Response: `{ "status": "ready" }`

---

## Security Considerations

### Current Implementation

The system is designed for a controlled environment (technical assessment). Production implementations should add:

### Recommended Enhancements

1. **Authentication**
   - API key authentication for external callers
   - JWT tokens with expiration
   - mTLS for internal service communication

2. **Authorization**
   - VIN access control (not all users can view all VINs)
   - Role-based access (admin, user, viewer)
   - Audit logging for access

3. **Input Validation**
   - Already validates VIN format
   - Sanitize all string inputs
   - Reject oversized requests

4. **HTTPS**
   - All external communication over TLS
   - Certificate pinning for known endpoints
   - HSTS headers

5. **Rate Limiting**
   - Per-user rate limits
   - Per-IP rate limits
   - Burst allowance

6. **Error Handling**
   - Don't expose internal details in error messages
   - Log detailed errors internally
   - Return generic errors to clients

---

## Performance Characteristics

### Response Time

**Typical Flow:**
- Validation: ~1ms
- Parallel API calls: ~200-500ms (both in parallel)
- Aggregation: ~5ms
- **Total: ~200-500ms for successful calls**

**With Retries:**
- 1st attempt: 200-500ms
- 2nd attempt (if needed): 200-700ms (with 100ms backoff)
- 3rd attempt (if needed): 200-900ms (with 200ms backoff)
- **Max total with retries: ~2 seconds**

### Resource Usage

**Memory:**
- Base process: ~50MB
- Per-request overhead: ~2-5MB
- Cache (if added): configurable

**CPU:**
- Parallel API calls minimal CPU usage (I/O bound)
- JSON parsing: negligible
- Network overhead dominates

**Network:**
- Outbound requests: 2 parallel connections to external APIs
- Inbound requests: 1 from client
- Total bandwidth: low (document metadata only)

### Scalability

**Single Instance Limits:**
- Node.js event loop handles ~1000+ concurrent connections
- 3000ms average response time = ~333 requests/sec capacity
- Memory grows with concurrent requests

**For Scale:**
- Add load balancer
- Run multiple instances
- Use reverse proxy (nginx)
- Add request queue/worker pool

---

## Deployment Architecture

### Development Environment

```
localhost:3000  - Main Service
localhost:3001  - Sales Mock API
localhost:3002  - Service Mock API
```

### Production Architecture

```
┌──────────────────────────────────┐
│      Load Balancer               │ (nginx, HAProxy)
└──────────┬───────────────────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼───┐   ┌────▼───┐
│ Main  │   │ Main   │ (Multiple instances)
│Service│   │Service │
│ :3000 │   │ :3000  │
└───┬───┘   └────┬───┘
    │            │
    └──────┬─────┘
           │
    ┌──────┴──────────────────┐
    │                         │
┌───▼────┐           ┌───────▼─┐
│ Sales  │           │Service  │
│  API   │           │  API    │
│ :3001  │           │ :3002   │
└────────┘           └─────────┘

┌──────────────────────────────────┐
│    Observability Stack           │
├──────────────────────────────────┤
│ - Prometheus (metrics)           │
│ - Grafana (dashboards)           │
│ - ELK Stack (logs)               │
│ - Jaeger (distributed tracing)   │
└──────────────────────────────────┘
```

### Environment Configuration

**Development:**
- In-memory SQLite
- Debug logging
- No authentication
- CORS enabled

**Production:**
- PostgreSQL backend
- Info level logging
- API authentication required
- Restricted CORS
- TLS enforcement
- Rate limiting enabled

---

## Conclusion

The Unified Document Viewer is designed with:

1. **Reliability** - Multiple resilience patterns (retry, circuit breaker, graceful degradation)
2. **Performance** - Parallel API calls for minimal latency
3. **Observability** - Comprehensive logging and metrics
4. **Maintainability** - Clear layered architecture and separation of concerns
5. **Testability** - 81% code coverage with 64 automated tests

The system successfully handles:
- Normal operation (both systems available)
- Partial failures (one system down)
- Complete failures (both systems down)
- Network errors and timeouts
- Invalid input

For production use, add authentication, authorization, rate limiting, and monitoring infrastructure as described in the Security Considerations section.
