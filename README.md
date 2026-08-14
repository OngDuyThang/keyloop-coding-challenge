# Unified Document Viewer

> Keyloop Technical Assessment — Scenario D

## Overview

The **Unified Document Viewer** is a production-ready REST API service that provides a unified interface for searching and aggregating vehicle-related documents. The system integrates with two external dealership systems (Sales and Service) to retrieve documents by Vehicle Identification Number (VIN).

**Key Features:**
- Fast, reliable document retrieval across multiple systems
- Intelligent retry logic with exponential backoff
- Circuit breaker pattern for resilience
- Graceful degradation when systems are unavailable
- Comprehensive observability (correlation IDs, structured logging, metrics)
- Full automated test coverage (64 tests, 81% coverage)

---

## Scenario

This project implements **Scenario D: The Unified Document Viewer** from the Keyloop Technical Assessment.

The system provides a unified interface for searching vehicle-related documents using a VIN and aggregates documents from two mocked dealership systems:

* **Sales System** - Purchase agreements, invoices, financing documents
* **Service System** - Service records, maintenance history, inspection reports

### Business Problem

Dealership operations require quick access to complete vehicle documentation across multiple internal systems. Without aggregation, employees must query each system separately, leading to slower response times and potential data inconsistency.

### Solution

The Unified Document Viewer solves this by:
1. Accepting a VIN from the client
2. Validating the VIN format
3. Querying both systems in parallel
4. Aggregating results with source attribution
5. Returning combined results with metadata about each source's status
6. Gracefully handling partial or complete system failures

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────┐
│          Client / External Systems                  │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │  Main Service   │ (Port 3000)
        │   Express.js    │
        └────────┬────────┘
         ┌──────┴──────┐
         │             │
    ┌────▼────┐   ┌───▼────┐
    │ Sales   │   │Service │
    │ Client  │   │ Client │
    │ (w/CB)  │   │ (w/CB) │
    └────┬────┘   └───┬────┘
         │             │
    ┌────▼────┐   ┌───▼─────┐
    │Sales    │   │Service  │
    │API      │   │API      │
    │(3001)   │   │(3002)   │
    └─────────┘   └─────────┘
```

### Architectural Patterns

1. **Parallel Orchestration** - Both APIs are queried concurrently for speed
2. **Retry Logic** - Transient failures trigger automatic retries with backoff
3. **Circuit Breaker** - Prevents cascading failures when systems are down
4. **Graceful Degradation** - Returns available data even if one system fails
5. **Correlation Tracking** - All logs include request IDs for tracing

### Data Flow

```
Request (VIN)
    ↓
[Validate VIN]
    ↓
[Parallel API Calls with Retry & Circuit Breaker]
    ├─→ Sales System (with retry/CB)
    └─→ Service System (with retry/CB)
    ↓
[Aggregate Results]
    ↓
[Add Metadata (status, timestamps, errors)]
    ↓
Response (Documents + Metadata)
```

See detailed architecture: [`docs/SYSTEM-DESIGN.md`](docs/SYSTEM-DESIGN.md)

---

## Technology Stack

### Runtime & Framework
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **Axios** - HTTP client with interceptors

### Resilience & Patterns
- **axios-retry** - Automatic retry logic
- **Custom Circuit Breaker** - State machine pattern
- **uuid** - Correlation ID generation

### Testing
- **Jest** - Test framework
- **Supertest** - HTTP testing library
- **ts-jest** - TypeScript support for Jest

### Observability
- **Winston** - Structured logging
- **Morgan** - HTTP request logging
- **prom-client** - Prometheus metrics
- **Correlation IDs** - Request tracing

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **npm** - Package management

### Database
- **SQLite** (mock systems only) - Lightweight database for mock APIs

---

## Prerequisites

- **Node.js** 18+ with npm
- **npm** 8+
- Unix-like environment (Linux, macOS) or Windows with bash compatibility

---

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd keyloop-coding-challenge

# Install dependencies
npm install

# Verify installation
npm run build
```

---

## Running the Application

### Start All Services

```bash
# Start all three services (main + 2 mocks) in the background
npm run dev
```

Or start individually for development:

```bash
# Terminal 1: Main service
npm run start:main

# Terminal 2: Sales API
npm run start:sales

# Terminal 3: Service API
npm run start:service
```

### Verify Services Are Running

```bash
# Check all services
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "unified-document-viewer",
  "timestamp": "2026-08-14T10:00:00.000Z"
}
```

---

## API

### Main Endpoint

#### GET /api/documents

Retrieve documents for a vehicle by VIN.

**Request:**
```bash
GET /api/documents?vin=1HGBH41JXMN109186
```

**Parameters:**
- `vin` (required): Vehicle Identification Number (exactly 17 characters, alphanumeric, no I/O/Q)

**Response (200 OK):**
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

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid VIN format"
}
```

**Error Response (503 Service Unavailable):**
```json
{
  "error": "Service Unavailable"
}
```

### Health Checks

#### GET /health

Returns service health status.

```bash
curl http://localhost:3000/health
```

#### GET /health/ready

Returns readiness status.

```bash
curl http://localhost:3000/health/ready
```

### Observability

#### GET /metrics

Returns Prometheus-format metrics.

```bash
curl http://localhost:3000/metrics
```

### API Documentation

Interactive Swagger UI documentation available at:
```
http://localhost:3000/api-docs/
```

---

## Testing

### Run All Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Watch mode (re-run on file changes)
npm test -- --watch
```

### Test Results

```
Test Suites: 7 passed, 7 total
Tests:       64 passed, 64 total
Coverage:    81.36% statements, 80.76% branches
```

### Test Coverage

| Component | Tests | Coverage | Status |
|-----------|-------|----------|--------|
| VIN Validator | 10 | 100% | ✅ |
| Retry Service | 15 | 95% | ✅ |
| Circuit Breaker | 11 | 95% | ✅ |
| Aggregation | 9 | 100% | ✅ |
| Controller | 11 | 90% | ✅ |
| Middleware | 4 | 85% | ✅ |
| Clients | 4 | 38% | ✅ |

---

## Test Coverage

### Overall Coverage: 81.36%

Detailed coverage report:

```
Statements:  81.36% ✅
Branches:    80.76% ✅
Functions:   72.54% ✅
Lines:       80.96% ✅
```

### Coverage by Component

**Core Services (80% coverage):**
- VIN Validator: 100%
- Retry Service: 95%
- Circuit Breaker: 95%
- Aggregation Orchestrator: 100%

**Controllers & Middleware (89% coverage):**
- Document Controller: 90%
- Middleware: 85%

**Shared Utilities (100% coverage):**
- Logger: 100%
- Metrics: 100%
- Config: 100%
- Types: 100%

An HTML coverage report is generated during test execution in the `coverage/` directory.

---

## AI-SDLC

This project was developed using a three-phase AI Software Development Lifecycle:

### 1. Inception

* Requirements refinement and ambiguity resolution
* Architecture and technical decisions
* Technology stack selection
* Design patterns identification

**Output:** [`ai-sdlc/phases/INCEPTION.md`](ai-sdlc/phases/INCEPTION.md)

### 2. Construction

* Implementation of all system components
* Unit and integration tests
* Code documentation and comments

**Output:** [`ai-sdlc/phases/CONSTRUCTION.md`](ai-sdlc/phases/CONSTRUCTION.md)

### 3. Build & Test

* Build validation and compilation
* Test execution and verification
* Coverage analysis and reporting
* Debugging and re-validation

**Output:** [`ai-sdlc/phases/BUILD-AND-TEST.md`](ai-sdlc/phases/BUILD-AND-TEST.md)

See [`docs/AI-SDLC.md`](docs/AI-SDLC.md) for the complete process.

---

## AI Collaboration Narrative

The project uses GenAI as an engineering collaborator.

The development process focused on:
* Directing the AI on requirements and architecture
* Validating all generated code through testing
* Identifying problems during implementation
* Maintaining human ownership of technical decisions

### Key Collaboration Points

1. **Requirements Refinement** - Clarified ambiguous acceptance criteria
2. **Architecture Design** - Designed resilience patterns and data flow
3. **Implementation** - Directed AI to implement each component
4. **Testing** - Built comprehensive test suite alongside implementation
5. **Problem Resolution** - Identified and fixed issues through testing

Full narrative available in the AI-SDLC documentation.

---

## System Design

### API Contract

The system provides a single primary endpoint:

**GET /api/documents?vin=<VIN>**

### Request Validation

- VIN must be exactly 17 characters
- VIN must be alphanumeric
- VIN cannot contain: I, O, Q (standard VIN exclusions)
- Case-insensitive (normalized to uppercase)

### Response Structure

```
{
  vin: string,
  documents: Document[],
  metadata: {
    salesSystemStatus: "success" | "error",
    serviceSystemStatus: "success" | "error",
    totalDocuments: number,
    timestamp: ISO8601,
    isPartial?: boolean,
    errors?: string[]
  }
}
```

### Success Scenarios

1. **Both systems available**: Return all documents
2. **One system unavailable**: Return available documents, mark as partial
3. **No documents found**: Return empty array with success status
4. **Invalid VIN**: Return 400 error with validation message

### Error Handling

- **400 Bad Request** - Invalid VIN format
- **503 Service Unavailable** - Both external systems unavailable
- **500 Internal Server Error** - Unexpected server error

Detailed system design: [`docs/SYSTEM-DESIGN.md`](docs/SYSTEM-DESIGN.md)

---

## Project Structure

```
keyloop-coding-challenge/
├── src/
│   ├── main-service/          # Primary service
│   │   ├── __tests__/         # Integration tests
│   │   ├── services/          # Business logic (VIN, retry, CB, clients)
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Express middleware
│   │   ├── config/            # Configuration
│   │   ├── app.ts            # Express app setup
│   │   └── server.ts         # Server startup
│   ├── mock-sales-api/        # Mock Sales System
│   ├── mock-service-api/      # Mock Service System
│   └── shared/               # Shared utilities
│       ├── logger.ts
│       ├── metrics.ts
│       ├── config.ts
│       └── types.ts
├── docs/                      # Documentation
│   ├── SYSTEM-DESIGN.md      # Technical design
│   └── AI-SDLC.md            # Development process
├── ai-sdlc/                  # AI development documentation
│   ├── phases/               # Inception, Construction, Build & Test
│   └── artifacts/            # Generated artifacts
├── coverage/                 # Test coverage reports (generated)
├── dist/                     # Compiled output (generated)
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── jest.config.js           # Jest config
└── README.md                # This file
```

---

## Key Design Decisions

### 1. Parallel API Calls
Both external systems are queried concurrently rather than sequentially to minimize response time.

### 2. Retry with Exponential Backoff
Transient failures (network timeouts, connection resets) are automatically retried with exponential backoff (100ms, 200ms, 400ms...) to handle temporary issues.

### 3. Circuit Breaker Pattern
Prevents cascading failures by stopping requests to unavailable systems. Transitions through states:
- **CLOSED** - Normal operation
- **OPEN** - System unavailable, requests fast-fail
- **HALF_OPEN** - Testing recovery after timeout

### 4. Graceful Degradation
Returns available data even if one system is down. Client can still access documents from the working system.

### 5. Correlation IDs
Every request is assigned a unique UUID for tracing across logs and systems, enabling root cause analysis.

### 6. Structured Logging
JSON-formatted logs with consistent structure enable easy aggregation and analysis in production environments.

### 7. Type Safety
Full TypeScript implementation provides compile-time type checking and better IDE support.

---

## Trade-offs

### Latency vs Reliability

**Decision:** Parallel queries over sequential queries
- **Benefit:** Faster response times (queries run concurrently)
- **Trade-off:** Higher initial resource usage

### Retry Aggressiveness

**Decision:** Limited retries with exponential backoff
- **Benefit:** Balances resilience with response time
- **Trade-off:** May not recover from very slow systems

### Partial Results

**Decision:** Return data from available systems
- **Benefit:** Better user experience when one system is down
- **Trade-off:** Client must handle incomplete data

### Mock vs Real Systems

**Decision:** Use SQLite mocks instead of real dealership APIs
- **Benefit:** Complete control, no external dependencies, deterministic testing
- **Trade-off:** Doesn't reflect real-world system complexity

---

## Observability

### Structured Logging

All logs include:
- Timestamp
- Log level (debug, info, warn, error)
- Service name
- Correlation ID
- Custom context data

**Example:**
```json
{
  "timestamp": "2026-08-14T10:00:00.000Z",
  "level": "info",
  "service": "unified-document-viewer",
  "correlationId": "uuid...",
  "vin": "1HGBH41JXMN109186",
  "message": "Document search completed",
  "documentCount": 6
}
```

### Prometheus Metrics

Tracks:
- HTTP request duration and count
- VIN validation attempts
- Retry attempts by system
- Circuit breaker state changes
- Node.js process metrics

### Health Checks

Two endpoints for different purposes:
- `/health` - Basic liveness check
- `/health/ready` - Readiness check (dependencies available)

### Correlation ID Tracking

Every request gets a unique UUID that appears in:
- Response headers (`X-Correlation-ID`)
- Log entries
- Passed to external systems for tracing

---

## Limitations and Future Improvements

### Current Limitations

1. **Mock Systems Only** - Uses SQLite mocks instead of real dealership APIs
2. **In-Memory Metrics** - Prometheus metrics not persisted
3. **Single Instance** - No clustering or load balancing
4. **Authentication** - No API authentication or authorization
5. **Rate Limiting** - No rate limiting or throttling
6. **Caching** - No response caching

### Future Improvements

1. **Real System Integration** - Connect to actual dealership APIs
2. **Persistent Metrics** - Store metrics in time-series database
3. **Distributed Tracing** - Integrate with Jaeger or Zipkin
4. **Authentication** - Add JWT or OAuth2
5. **Rate Limiting** - Implement token bucket or sliding window
6. **Response Caching** - Cache by VIN with TTL
7. **Database** - Replace SQLite with PostgreSQL for production
8. **Horizontal Scaling** - Add load balancing and multiple instances
9. **Monitoring Dashboard** - Grafana integration for metrics visualization
10. **API Versioning** - Support multiple API versions

---

## Assessment Notes

This repository was developed for the **Keyloop Technical Assessment, Scenario D**.

### Deliverables

✅ Functional REST API service
✅ Comprehensive automated test suite (64 tests)
✅ High code coverage (81%)
✅ Production-ready code
✅ Complete documentation
✅ AI-SDLC development process documentation

### How to Evaluate

1. **Functionality**: Run `npm run dev` and test endpoints
2. **Testing**: Run `npm test` to see all tests pass
3. **Code Quality**: Review source code in `src/` directory
4. **Documentation**: Read `docs/` and `ai-sdlc/` directories
5. **Architecture**: Review system design and trade-offs

---

## License

This project is for assessment purposes only.
