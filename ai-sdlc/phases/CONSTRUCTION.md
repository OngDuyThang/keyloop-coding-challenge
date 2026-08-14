# Construction

## Purpose

The Construction phase designs and implements the system according to approved requirements and architecture from Inception.

**Status:** In Progress
**Last Updated:** 2026-08-14
**Current Objective:** Implement Unified Document Viewer backend service with approved technology stack

---

# 1. Construction Overview

## Approved Architecture

**System Components:**
1. Main Service: Unified Document Viewer API
2. Mock Sales System API
3. Mock Service System API

**Technology Stack:**
- Runtime: Node.js with TypeScript
- Framework: Express.js (all 3 services)
- Database: SQLite (2 instances for mock APIs)
- Testing: Jest
- API Documentation: OpenAPI/Swagger UI
- Logging: Winston + Morgan
- Metrics: prom-client (Prometheus)
- Tracing: Correlation IDs (uuid)

**Architecture Pattern:**
- 3 independent Express servers
- Main service orchestrates parallel calls to mock APIs
- Retry logic with circuit breaker
- Structured logging with correlation IDs
- Health check endpoints

---

# 2. Implementation Plan

## Phase 1: Project Setup
- [x] Initialize Node.js project (package.json)
- [x] Configure TypeScript (tsconfig.json)
- [x] Create project folder structure
- [x] Install dependencies
- [x] Configure linting and formatting (ESLint, Prettier)
- [x] Set up environment variables (.env template)

## Phase 2: Observability Infrastructure
- [x] Configure Winston logger
- [x] Configure Morgan HTTP logging
- [x] Set up Prometheus metrics (prom-client)
- [x] Implement correlation ID middleware
- [x] Create health check endpoints

## Phase 3: Mock External APIs
- [x] Design SQLite schema for Sales System
- [x] Design SQLite schema for Service System
- [x] Implement Sales System API (Express + SQLite)
- [x] Implement Service System API (Express + SQLite)
- [x] Seed databases with mock data
- [x] Add logging to mock APIs
- [ ] Test mock APIs independently

## Phase 4: Main Service - Core Logic
- [x] Implement VIN validator
- [x] Implement external API client (Sales)
- [x] Implement external API client (Service)
- [x] Implement retry logic
- [x] Implement circuit breaker pattern
- [x] Implement aggregation orchestrator
- [x] Implement result aggregator

## Phase 5: Main Service - API Layer
- [x] Create Express server setup
- [x] Implement GET /api/documents endpoint
- [x] Add request validation middleware
- [x] Add error handling middleware
- [x] Add logging middleware
- [x] Add metrics middleware
- [x] Implement health check endpoints

## Phase 6: OpenAPI/Swagger Documentation
- [x] Configure swagger-ui-express
- [x] Define OpenAPI specification
- [x] Document /api/documents endpoint
- [x] Document request/response schemas
- [x] Document error responses

## Phase 7: Testing
- [ ] Unit tests: VIN validator
- [ ] Unit tests: Retry logic
- [ ] Unit tests: Circuit breaker
- [ ] Unit tests: Aggregation logic
- [ ] Integration tests: Mock APIs
- [ ] Integration tests: Main service
- [ ] Integration tests: End-to-end flow
- [ ] Edge case tests: Partial failures
- [ ] Edge case tests: Timeouts
- [ ] Edge case tests: Invalid VINs

## Phase 8: Documentation
- [ ] README.md with setup instructions
- [ ] API usage examples
- [ ] Testing instructions
- [ ] Environment variable documentation
- [ ] Update SYSTEM-DESIGN.md

---

# 3. Project Structure

```
keyloop-coding-challenge/
├── src/
│   ├── main-service/
│   │   ├── server.ts
│   │   ├── app.ts
│   │   ├── controllers/
│   │   │   └── documentController.ts
│   │   ├── services/
│   │   │   ├── vinValidator.ts
│   │   │   ├── aggregationOrchestrator.ts
│   │   │   ├── salesSystemClient.ts
│   │   │   ├── serviceSystemClient.ts
│   │   │   ├── retryService.ts
│   │   │   └── circuitBreaker.ts
│   │   ├── middleware/
│   │   │   ├── correlationId.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── requestLogger.ts
│   │   │   └── metricsMiddleware.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── config/
│   │       └── swagger.ts
│   ├── mock-sales-api/
│   │   ├── server.ts
│   │   ├── app.ts
│   │   ├── db/
│   │   │   ├── database.ts
│   │   │   ├── schema.sql
│   │   │   └── seed.ts
│   │   └── controllers/
│   │       └── salesController.ts
│   ├── mock-service-api/
│   │   ├── server.ts
│   │   ├── app.ts
│   │   ├── db/
│   │   │   ├── database.ts
│   │   │   ├── schema.sql
│   │   │   └── seed.ts
│   │   └── controllers/
│   │       └── serviceController.ts
│   └── shared/
│       ├── logger.ts
│       ├── metrics.ts
│       └── types.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── helpers/
├── logs/
├── data/
│   ├── sales-system.db
│   └── service-system.db
├── package.json
├── tsconfig.json
├── .env.example
├── .eslintrc.json
├── .prettierrc
└── jest.config.js
```

---

# 4. Implementation Progress

## Current Status: Project Setup

### Completed
- [x] Construction phase planning
- [x] Project structure design
- [x] Project setup (package.json, tsconfig, eslint, prettier)
- [x] Folder structure created
- [x] Dependencies installed
- [x] Shared utilities (logger, metrics, config, types)
- [x] Observability infrastructure complete
- [x] VIN validator implemented
- [x] Retry service with exponential backoff
- [x] Circuit breaker pattern implemented
- [x] Sales System client with resilience
- [x] Service System client with resilience
- [x] Aggregation orchestrator with parallel execution
- [x] Mock Sales API (Express + SQLite + seed data)
- [x] Mock Service API (Express + SQLite + seed data)
- [x] Main service Express app with all middleware
- [x] Document controller with VIN validation
- [x] OpenAPI/Swagger documentation
- [x] Health check endpoints
- [x] Metrics endpoint
- [x] TypeScript build successful (28 source files → 28 compiled files)

### In Progress
- [ ] Testing (next phase)

### Not Started
- Unit tests
- Integration tests
- End-to-end tests
- Documentation updates

---

# 5. Technical Decisions

## TD-001 - Port Assignments

**Decision:**
- Main Service: Port 3000
- Sales System API: Port 3001
- Service System API: Port 3002

**Reason:**
- Clear separation, easy to remember
- Sequential numbering
- Standard development ports

**Status:** Proposed

---

## TD-002 - VIN Validation Rules

**Decision:**
VIN validation will check:
- Exactly 17 characters
- Alphanumeric only
- Uppercase only
- No I, O, Q characters (per VIN standard)

**Reason:**
- Follows ISO 3779 VIN standard
- Prevents invalid lookups to external APIs
- Clear error messages for users

**Status:** Proposed

---

## TD-003 - Database Schema for Mock APIs

**Sales System Schema:**
```sql
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  vin TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  metadata TEXT
);

CREATE INDEX idx_vin ON documents(vin);
```

**Service System Schema:**
```sql
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  vin TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  metadata TEXT
);

CREATE INDEX idx_vin ON documents(vin);
```

**Reason:**
- Simple schema appropriate for demo
- VIN index for fast lookups
- Metadata as JSON text for flexibility
- Both systems use same schema (realistic for assessment)

**Status:** Proposed

---

## TD-004 - Retry Strategy

**Decision:**
- Retry on: 5xx errors, network timeouts, connection refused
- Do not retry on: 4xx errors (except 429 rate limit)
- Exponential backoff: 100ms, 200ms, 400ms, 800ms, 1600ms
- Max attempts: From env variable (default 3, max 5)

**Reason:**
- 5xx errors and network issues are typically transient
- 4xx errors indicate client problems (no point retrying)
- Exponential backoff reduces load during outages
- Configurable for different environments

**Status:** Proposed

---

## TD-005 - Circuit Breaker Configuration

**Decision:**
- Failure threshold: 5 consecutive failures
- Success threshold: 2 consecutive successes (to close)
- Timeout: 30 seconds (half-open attempts)
- Per external system (independent circuit breakers)

**Reason:**
- Prevents cascading failures
- Quick recovery when service returns
- Independent circuits allow partial degradation
- Conservative thresholds for demo

**Status:** Proposed

---

## TD-006 - Logging Levels

**Decision:**
- ERROR: External API failures, unhandled errors
- WARN: Retry attempts, circuit breaker state changes, partial failures
- INFO: HTTP requests, successful operations, health checks
- DEBUG: Detailed operation flow, data transformations

**Reason:**
- Clear separation of concerns
- Easy to filter in production
- Appropriate detail at each level
- Follows common logging practices

**Status:** Proposed

---

# 6. API Contracts

## Main Service API

### GET /api/documents

**Query Parameters:**
- `vin` (required): 17-character Vehicle Identification Number

**Success Response (200):**
```json
{
  "vin": "1HGBH41JXMN109186",
  "documents": [
    {
      "id": "DOC123",
      "title": "Sales Contract",
      "type": "Contract",
      "date": "2024-01-15",
      "source": "Sales System"
    },
    {
      "id": "SVC456",
      "title": "Oil Change Service",
      "type": "Service Record",
      "date": "2024-03-20",
      "source": "Service System"
    }
  ],
  "metadata": {
    "salesSystemStatus": "success",
    "serviceSystemStatus": "success",
    "totalDocuments": 2,
    "timestamp": "2026-08-14T10:30:45.123Z"
  }
}
```

**Partial Success (200):**
```json
{
  "vin": "1HGBH41JXMN109186",
  "documents": [
    {
      "id": "DOC123",
      "title": "Sales Contract",
      "type": "Contract",
      "date": "2024-01-15",
      "source": "Sales System"
    }
  ],
  "metadata": {
    "salesSystemStatus": "success",
    "serviceSystemStatus": "error",
    "errors": ["Service System unavailable"],
    "totalDocuments": 1,
    "isPartial": true,
    "timestamp": "2026-08-14T10:30:45.123Z"
  }
}
```

**Error Response (400 - Invalid VIN):**
```json
{
  "error": "Invalid VIN format",
  "message": "VIN must be exactly 17 alphanumeric characters (excluding I, O, Q)",
  "timestamp": "2026-08-14T10:30:45.123Z"
}
```

**Error Response (503 - All Systems Down):**
```json
{
  "error": "Service Unavailable",
  "message": "Unable to retrieve documents from any external system",
  "metadata": {
    "salesSystemStatus": "error",
    "serviceSystemStatus": "error",
    "errors": ["Sales System unavailable", "Service System unavailable"]
  },
  "timestamp": "2026-08-14T10:30:45.123Z"
}
```

---

## Mock Sales System API

### GET /api/documents/:vin

**Path Parameters:**
- `vin`: Vehicle Identification Number

**Success Response (200):**
```json
{
  "documents": [
    {
      "id": "SALES-001",
      "title": "Sales Contract",
      "type": "Contract",
      "date": "2024-01-15"
    }
  ]
}
```

**No Documents (200):**
```json
{
  "documents": []
}
```

**Error Response (500):**
```json
{
  "error": "Internal Server Error",
  "message": "Database error"
}
```

---

## Mock Service System API

### GET /api/documents/:vin

**Path Parameters:**
- `vin`: Vehicle Identification Number

**Success Response (200):**
```json
{
  "documents": [
    {
      "id": "SERVICE-001",
      "title": "Oil Change",
      "type": "Service Record",
      "date": "2024-03-20"
    }
  ]
}
```

**No Documents (200):**
```json
{
  "documents": []
}
```

**Error Response (500):**
```json
{
  "error": "Internal Server Error",
  "message": "Database error"
}
```

---

# 7. Dependencies

## Production Dependencies
```json
{
  "express": "^4.18.2",
  "sqlite3": "^5.1.6",
  "winston": "^3.11.0",
  "morgan": "^1.10.0",
  "prom-client": "^15.1.0",
  "uuid": "^9.0.1",
  "swagger-ui-express": "^5.0.0",
  "dotenv": "^16.3.1",
  "axios": "^1.6.2"
}
```

## Development Dependencies
```json
{
  "typescript": "^5.3.3",
  "@types/node": "^20.10.5",
  "@types/express": "^4.17.21",
  "@types/morgan": "^1.9.9",
  "@types/uuid": "^9.0.7",
  "@types/swagger-ui-express": "^4.1.6",
  "jest": "^29.7.0",
  "@types/jest": "^29.5.11",
  "ts-jest": "^29.1.1",
  "ts-node": "^10.9.2",
  "nodemon": "^3.0.2",
  "eslint": "^8.56.0",
  "@typescript-eslint/eslint-plugin": "^6.15.0",
  "@typescript-eslint/parser": "^6.15.0",
  "prettier": "^3.1.1",
  "supertest": "^6.3.3",
  "@types/supertest": "^6.0.2"
}
```

---

# 8. Environment Variables

```.env
# Server Ports
MAIN_SERVICE_PORT=3000
SALES_API_PORT=3001
SERVICE_API_PORT=3002

# External API URLs
SALES_API_URL=http://localhost:3001
SERVICE_API_URL=http://localhost:3002

# Retry Configuration
MAX_RETRY_ATTEMPTS=3
RETRY_INITIAL_DELAY_MS=100

# Circuit Breaker Configuration
CIRCUIT_BREAKER_FAILURE_THRESHOLD=5
CIRCUIT_BREAKER_SUCCESS_THRESHOLD=2
CIRCUIT_BREAKER_TIMEOUT_MS=30000

# Timeout Configuration
EXTERNAL_API_TIMEOUT_MS=5000

# Logging
LOG_LEVEL=info

# Database Paths
SALES_DB_PATH=./data/sales-system.db
SERVICE_DB_PATH=./data/service-system.db
```

---

# 9. Current Implementation

## Session: 2026-08-14

### Starting Construction Phase

**Objective:** Set up project structure and initialize Node.js/TypeScript project

**Next Steps:**
1. Initialize package.json
2. Configure TypeScript
3. Create folder structure
4. Install dependencies
5. Begin implementing mock APIs

---

# 10. Issues and Resolutions

No issues yet - construction just starting.

---

# 11. Code Review Notes

To be populated as code is reviewed during implementation.

---

# 12. Testing Strategy

## Unit Tests
- VIN validator (valid/invalid cases)
- Retry logic (success after retry, max retries exceeded)
- Circuit breaker (open/half-open/closed transitions)
- Aggregation logic (successful merge, partial data, empty results)

## Integration Tests
- Mock APIs (CRUD operations, database interactions)
- Main service to mock APIs (successful aggregation)
- Partial failure scenarios (one API down)
- Complete failure scenarios (both APIs down)
- Timeout scenarios

## End-to-End Tests
- Full flow from HTTP request to aggregated response
- Correlation ID propagation
- Logging verification
- Metrics verification

## Test Coverage Goal
- Minimum 80% code coverage
- 100% coverage for business logic (VIN validation, aggregation)

---

# 13. Construction Status

**Phase:** Construction
**Status:** Core Implementation Complete - Testing Pending
**Completion:** 75%
**Current Focus:** All core services implemented and building successfully

**Last Updated:** 2026-08-14

**Summary:**
All three services (Main Service, Sales API Mock, Service API Mock) have been fully implemented with:
- Complete observability stack (Winston, Morgan, Prometheus)
- Resilience patterns (retry logic, circuit breaker)
- Parallel API orchestration
- VIN validation
- OpenAPI/Swagger documentation
- Health checks
- SQLite databases with seed data

**Next:** Testing phase (unit, integration, e2e tests)
