# Inception - Scenario D: The Unified Document Viewer

## Purpose

The Inception phase defines **what should be built, why it should be built, and the boundaries within which it must operate**.

**Status:** In Progress
**Last Updated:** 2026-08-13
**Current Objective:** Complete requirement analysis and establish technical direction for Scenario D

---

# 1. Problem Statement

Dealership staff need to view all documents related to a specific vehicle, but this information is currently fragmented across multiple dealership systems (Sales System and Service System). Staff must manually access each system separately to gather a complete picture of vehicle documentation.

## Why This Problem Matters

* **Operational Inefficiency:** Staff waste time switching between multiple systems to find vehicle documents
* **Incomplete Information:** Risk of missing critical documents when checking only one system
* **Poor User Experience:** Fragmented access creates friction in dealership operations
* **Data Silos:** Information isolation prevents a unified view of vehicle history

---

# 2. Goals

### Primary Goals

* [x] Provide a single unified interface for searching vehicle documents using VIN
* [x] Aggregate documents from multiple dealership systems in parallel
* [x] Clearly identify the source system for each document
* [x] Deliver results quickly through concurrent API requests

### Success Criteria

The solution successfully:
* Accepts a valid VIN as search input
* Retrieves documents from both Sales and Service systems concurrently
* Presents a consolidated list showing all documents with source attribution
* Handles partial failures gracefully (one system down, other still works)
* Completes searches within acceptable timeframes

---

# 3. Scope

## In Scope

* [x] Unified search interface accepting VIN input
* [x] Backend integration with two mocked external APIs (Sales System API, Service System API)
* [x] Parallel request execution to external systems
* [x] Document list aggregation and consolidation
* [x] Source system attribution for each document
* [x] Error handling for external API failures
* [x] VIN validation
* [x] Automated tests for core business logic
* [x] System design documentation
* [x] AI collaboration narrative

## Out of Scope

* [ ] Authentication and authorization (not mentioned in requirements)
* [ ] Document content viewing or download (only listing required)
* [ ] Document creation, update, or deletion
* [ ] Integration with real external systems (mocked APIs only)
* [ ] Document search by criteria other than VIN
* [ ] Historical search queries or audit trails
* [ ] Multi-tenancy or dealership-specific filtering
* [ ] Real-time document notifications
* [ ] Document version control
* [ ] Performance optimization beyond parallel requests

---

# 4. Actors and Users

| Actor              | Description                                | Responsibilities                              |
| ------------------ | ------------------------------------------ | --------------------------------------------- |
| Dealership Staff   | End user searching for vehicle documents   | Enters VIN, views aggregated document list    |
| Sales System API   | External system providing sales documents  | Returns sales-related documents for a VIN     |
| Service System API | External system providing service docs     | Returns service-related documents for a VIN   |
| System             | The Unified Document Viewer application    | Orchestrates search, aggregation, and display |

---

# 5. Functional Requirements

## FR-001 - VIN Search Interface

**Description:**
The system must provide an interface where users can enter a Vehicle Identification Number (VIN) to search for documents.

**Priority:** Must

**Acceptance Criteria:**
* [ ] User can input a VIN (17-character alphanumeric)
* [ ] System validates VIN format before search
* [ ] System provides clear feedback for invalid VINs
* [ ] Search can be initiated via user action

---

## FR-002 - Parallel Data Aggregation

**Description:**
The system must make parallel requests to both the Sales System API and Service System API when a VIN is searched.

**Priority:** Must

**Acceptance Criteria:**
* [ ] Requests to both APIs are initiated concurrently, not sequentially
* [ ] System does not wait for one API before calling the other
* [ ] Total search time is determined by the slowest API, not the sum of both

---

## FR-003 - Sales System Integration

**Description:**
The system must retrieve documents from the mocked Sales System API for a given VIN.

**Priority:** Must

**Acceptance Criteria:**
* [ ] System calls the Sales System API with the provided VIN
* [ ] System handles successful responses with document data
* [ ] System handles error responses gracefully
* [ ] System handles timeout scenarios

---

## FR-004 - Service System Integration

**Description:**
The system must retrieve documents from the mocked Service System API for a given VIN.

**Priority:** Must

**Acceptance Criteria:**
* [ ] System calls the Service System API with the provided VIN
* [ ] System handles successful responses with document data
* [ ] System handles error responses gracefully
* [ ] System handles timeout scenarios

---

## FR-005 - Consolidated Document List

**Description:**
The system must present a single, consolidated list of all documents retrieved from both systems.

**Priority:** Must

**Acceptance Criteria:**
* [ ] All documents from both systems are displayed together
* [ ] Each document clearly shows its source system (Sales or Service)
* [ ] Documents are presented in a user-friendly format
* [ ] Empty results are handled appropriately

---

## FR-006 - Source Attribution

**Description:**
Each document in the consolidated list must clearly indicate which source system it came from.

**Priority:** Must

**Acceptance Criteria:**
* [ ] Every document shows "Sales System" or "Service System" as its source
* [ ] Source attribution is visually clear and unambiguous
* [ ] Source information cannot be missing or unclear

---

## FR-007 - Partial Failure Handling

**Description:**
The system should handle scenarios where one external API fails while the other succeeds.

**Priority:** Should

**Acceptance Criteria:**
* [ ] If Sales API fails, Service API documents are still displayed
* [ ] If Service API fails, Sales API documents are still displayed
* [ ] User is informed which system(s) failed
* [ ] Partial results are clearly indicated as incomplete

---

## FR-008 - Empty Results Handling

**Description:**
The system must handle cases where no documents are found for a VIN.

**Priority:** Must

**Acceptance Criteria:**
* [ ] System displays appropriate message when no documents found
* [ ] User can distinguish between "no documents" and "system error"
* [ ] System indicates whether both systems were successfully queried

---

# 6. Non-Functional Requirements

## Performance

* **Search Response Time:** Target < 3 seconds for typical searches (dependent on slowest external API)
* **Parallel Execution:** Must execute external API calls concurrently to minimize total latency
* **Timeout Handling:** External API calls should timeout after a reasonable duration (e.g., 5-10 seconds)

## Scalability

* **Concurrent Users:** Design should support multiple simultaneous searches
* **API Rate Limits:** Consider rate limiting implications for external systems (though mocked APIs may not enforce this)
* **Extensibility:** Architecture should accommodate adding additional document sources beyond the two initial systems

## Availability

* **Partial Degradation:** System should remain functional when one external API is unavailable
* **Error Recovery:** Graceful handling of transient failures

## Reliability

* **External API Failures:** System must not crash when external APIs fail
* **Data Consistency:** Results should accurately reflect what external systems return
* **Retry Strategy:** Consider retry logic for transient failures

## Security

* **Input Validation:** VIN input must be validated to prevent injection attacks
* **API Security:** Appropriate security measures for calling external APIs (though not explicitly required in assessment)
* **Data Protection:** Handle document metadata appropriately

## Observability

* **Logging:** Log search requests, external API calls, failures, and response times
* **Metrics:** Track search volume, API latency, error rates, success rates
* **Tracing:** Distributed tracing for request flow through the system
* **Monitoring:** Dashboards for operational health monitoring

## Maintainability

* **Code Quality:** Clean, well-structured code following best practices
* **Testing:** Comprehensive automated tests for core business logic
* **Documentation:** Clear README, system design, and inline documentation where helpful
* **Modularity:** Separation of concerns between aggregation logic and external integrations

## Compatibility

* **API Contracts:** Well-defined contracts for external system mocks
* **Data Formats:** Consistent document format in aggregated view

---

# 7. Constraints

**Assessment Constraints:**
* Must choose either backend OR frontend for full implementation (not both)
* External APIs must be mocked, not real integrations
* Must include automated tests for core business logic
* Must document AI collaboration approach
* Time-boxed assessment

**Technical Constraints:**
* Technology stack is free choice (no mandated languages or frameworks)
* Must demonstrate consideration for scalability, performance, reliability, maintainability, observability

**Scope Constraints:**
* Single scenario focus (Scenario D only)
* Document listing only (no document viewing or manipulation)
* VIN-based search only

---

# 8. Assumptions

| ID    | Assumption                                                                 | Reason                                  | Confidence | Impact if Wrong                                  |
| ----- | -------------------------------------------------------------------------- | --------------------------------------- | ---------- | ------------------------------------------------ |
| A-001 | VINs follow standard 17-character format                                   | Industry standard for VIN format        | High       | Need to support alternative VIN formats          |
| A-002 | External APIs return document lists synchronously (not streaming)          | Typical REST API pattern                | High       | Need to implement streaming response handling    |
| A-003 | Document metadata from external systems includes at minimum an identifier  | Reasonable assumption for document APIs | Medium     | Need to define fallback document representation  |
| A-004 | External API mocks will be created as part of implementation               | Assessment requires mocked systems      | High       | Need to clarify mock ownership                   |
| A-005 | No authentication required for the unified viewer itself                   | Not mentioned in requirements           | Medium     | Need to add authentication layer                 |
| A-006 | Both external APIs use similar protocols (e.g., both REST)                 | Common in enterprise systems            | Medium     | Need adapter pattern for different protocols     |
| A-007 | Document uniqueness is determined by (source + document ID)                | Reasonable assumption                   | Medium     | Need to implement deduplication logic            |
| A-008 | External APIs may return duplicate documents for the same VIN              | Possible in real systems                | Low        | Minimal impact, display all results              |
| A-009 | Network latency to external APIs is the primary performance concern        | Standard distributed system assumption  | High       | Need to optimize other areas (DB, computation)   |
| A-010 | External API responses are reasonably sized (not gigabytes of documents)   | Practical constraint                    | High       | Need to implement pagination or streaming        |
| A-011 | The "unified view" does not require document deduplication across systems  | Requirements don't mention it           | Medium     | Need to implement deduplication logic            |
| A-012 | Observability requirements are for demonstration purposes, not production  | Assessment context                      | High       | Need production-grade observability              |

---

# 9. Use Cases

## UC-001 - Successful Document Search

**Actor:** Dealership Staff

**Goal:** Retrieve all documents for a vehicle using its VIN

**Preconditions:**
* User has access to the Unified Document Viewer
* User knows the VIN of the vehicle
* Both external systems are operational

**Main Flow:**
1. User enters a valid 17-character VIN
2. System validates the VIN format
3. System makes parallel requests to Sales System API and Service System API
4. Both APIs return document lists successfully
5. System aggregates documents from both sources
6. System displays consolidated list with source attribution for each document
7. User views the complete document list

**Expected Result:**
User sees a single list containing all documents from both systems, with each document clearly labeled with its source system.

---

## UC-002 - Search with Partial System Failure

**Actor:** Dealership Staff

**Goal:** Retrieve available documents when one external system is down

**Preconditions:**
* User has access to the Unified Document Viewer
* User knows the VIN of the vehicle
* One external system is unavailable or returning errors

**Main Flow:**
1. User enters a valid VIN
2. System validates the VIN format
3. System makes parallel requests to both APIs
4. One API returns successfully with documents
5. Other API fails or times out
6. System displays documents from the successful API
7. System shows warning message indicating one system was unavailable
8. User views partial results with clear indication of incompleteness

**Expected Result:**
User sees documents from the available system and understands that results are incomplete.

---

## UC-003 - Search with No Documents Found

**Actor:** Dealership Staff

**Goal:** Understand that no documents exist for a given VIN

**Preconditions:**
* User has access to the Unified Document Viewer
* Both external systems are operational
* The VIN has no associated documents in either system

**Main Flow:**
1. User enters a valid VIN
2. System validates the VIN format
3. System makes parallel requests to both APIs
4. Both APIs return successfully but with empty document lists
5. System displays message indicating no documents found
6. Message confirms both systems were checked successfully

**Expected Result:**
User understands no documents exist for this VIN, not that an error occurred.

---

## UC-004 - Search with Invalid VIN

**Actor:** Dealership Staff

**Goal:** Receive clear feedback when entering an invalid VIN

**Preconditions:**
* User has access to the Unified Document Viewer

**Main Flow:**
1. User enters an invalid VIN (wrong length, invalid characters, etc.)
2. System validates the VIN format
3. System detects invalid VIN
4. System displays error message explaining VIN format requirements
5. System does not make external API calls

**Expected Result:**
User receives immediate feedback about invalid VIN without wasting external API calls.

---

## UC-005 - Search with Both Systems Down

**Actor:** Dealership Staff

**Goal:** Understand system status when all external systems are unavailable

**Preconditions:**
* User has access to the Unified Document Viewer
* Both external systems are unavailable

**Main Flow:**
1. User enters a valid VIN
2. System validates the VIN format
3. System makes parallel requests to both APIs
4. Both APIs fail or timeout
5. System displays error message indicating systems are unavailable
6. System suggests trying again later

**Expected Result:**
User understands the system cannot fulfill the request due to external system unavailability.

---

# 10. System Boundaries

```text
+------------------------------------------------------+
|         UNIFIED DOCUMENT VIEWER SYSTEM               |
|                                                      |
|  - VIN validation                                    |
|  - Parallel API orchestration                        |
|  - Document aggregation logic                        |
|  - Source attribution                                |
|  - Error handling and partial failure management     |
|  - User interface (if frontend chosen)               |
|  - API layer (if backend chosen)                     |
|  - Observability (logging, metrics, tracing)         |
|                                                      |
+------------------------------------------------------+
       |                                    |
       v                                    v
 [Sales System API]              [Service System API]
 (Mocked External)               (Mocked External)
```

### Internal Responsibilities

* VIN input validation
* Concurrent external API invocation
* Response aggregation and consolidation
* Source system attribution
* Error and timeout handling
* Partial failure management
* Result presentation
* Logging and observability

### External Responsibilities

* Sales document storage and retrieval (Sales System API)
* Service document storage and retrieval (Service System API)
* Document metadata management in source systems
* Source system availability and reliability

---

# 11. External Integrations

| Integration        | Purpose                         | Protocol | Direction | Criticality |
| ------------------ | ------------------------------- | -------- | --------- | ----------- |
| Sales System API   | Retrieve sales documents by VIN | REST     | Outbound  | High        |
| Service System API | Retrieve service docs by VIN    | REST     | Outbound  | High        |

### Sales System API

* **Authentication:** TBD (likely none for mocked version)
* **Expected Failure Behavior:** Return error status codes or timeout
* **Timeout Requirements:** 5-10 seconds recommended
* **Retry Requirements:** Consider retry on transient failures
* **Rate Limits:** N/A for mocked API
* **Data Exchanged:** VIN (request), Document list (response)
* **Availability Dependency:** System should function with partial data if this fails

### Service System API

* **Authentication:** TBD (likely none for mocked version)
* **Expected Failure Behavior:** Return error status codes or timeout
* **Timeout Requirements:** 5-10 seconds recommended
* **Retry Requirements:** Consider retry on transient failures
* **Rate Limits:** N/A for mocked API
* **Data Exchanged:** VIN (request), Document list (response)
* **Availability Dependency:** System should function with partial data if this fails

---

# 12. Initial Architecture Direction

```text
[User/Client]
    |
    v
[Unified Document Viewer Service]
    |
    +-- [VIN Validator]
    |
    +-- [Aggregation Orchestrator]
         |
         +----> [Sales System Client] -----> [Sales System API Mock]
         |
         +----> [Service System Client] ---> [Service System API Mock]
         |
         v
    [Result Aggregator]
    [Error Handler]
```

## Architecture Goals

* **Separation of Concerns:** Clear separation between validation, orchestration, external communication, and aggregation
* **Concurrent Execution:** Parallel external API calls to minimize latency
* **Resilience:** Graceful degradation when external systems fail
* **Testability:** Components designed for easy unit and integration testing
* **Extensibility:** Easy to add additional document sources in the future
* **Observability:** Built-in logging, metrics, and tracing

## Initial Architectural Decisions

| ID      | Decision                                              | Reason                                                | Status   |
| ------- | ----------------------------------------------------- | ----------------------------------------------------- | -------- |
| ADR-001 | Implement as backend service using Express            | Allows focus on aggregation logic and API design      | Approved |
| ADR-002 | Use concurrent/async programming for parallel API calls | Required to meet parallel execution requirement       | Approved |
| ADR-003 | Mock external APIs as separate Express HTTP services  | Simulates real integration points                     | Approved |
| ADR-004 | REST API with OpenAPI/Swagger UI for testing         | Standard protocol with interactive testing capability | Approved |
| ADR-005 | JSON for API request/response format                  | Standard, language-agnostic format                    | Approved |
| ADR-006 | Include circuit breaker pattern for external APIs     | Improves resilience and prevents cascading failures   | Approved |
| ADR-007 | Structured logging with correlation IDs               | Enables distributed tracing across service boundaries | Approved |
| ADR-008 | Node.js/TypeScript with Express, Jest, SQLite         | Strong async support, excellent ecosystem, fast dev   | Approved |
| ADR-009 | Retry logic with configurable max attempts (≤5)       | Improves resilience for transient failures            | Approved |
| ADR-010 | SQLite databases for mock API data storage            | Local persistence, simple setup, appropriate for demo | Approved |

---

# 13. Data Requirements

| Data            | Purpose                            | Source                       | Owner            | Sensitivity |
| --------------- | ---------------------------------- | ---------------------------- | ---------------- | ----------- |
| VIN             | Vehicle identifier for search      | User input                   | User             | Low         |
| Document List   | Sales documents for vehicle        | Sales System API             | Sales System     | Medium      |
| Document List   | Service documents for vehicle      | Service System API           | Service System   | Medium      |
| Source Attribution | Identify which system provided doc | Unified Document Viewer      | This System      | Low         |
| Error Information | Failure details for troubleshooting | Unified Document Viewer      | This System      | Low         |

## Document Data Model (Expected from External APIs)

Each document from external systems should include:
* Document ID (unique within source system)
* Document Title/Name
* Document Type (e.g., "Sales Contract", "Service Invoice")
* Date (creation or last modified)
* Additional metadata as available

The aggregated view adds:
* Source System (Sales/Service)

---

# 14. API / Interface Requirements

| Interface                    | Consumer           | Purpose                      | Protocol | Status   |
| ---------------------------- | ------------------ | ---------------------------- | -------- | -------- |
| Unified Search API           | Frontend/Client    | Accept VIN, return docs      | REST     | Proposed |
| Sales System API (Mock)      | Unified Viewer     | Retrieve sales documents     | REST     | Proposed |
| Service System API (Mock)    | Unified Viewer     | Retrieve service documents   | REST     | Proposed |

### Unified Search API (if backend implementation chosen)

**Endpoint:** `GET /api/documents?vin={vin}` or `POST /api/documents/search`

**Request:**
```json
{
  "vin": "1HGBH41JXMN109186"
}
```

**Response (Success):**
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
    "totalDocuments": 2
  }
}
```

**Response (Partial Failure):**
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
    "isPartial": true
  }
}
```

---

# 15. Risks

| ID    | Risk                                      | Probability | Impact | Mitigation                                    | Status |
| ----- | ----------------------------------------- | ----------- | ------ | --------------------------------------------- | ------ |
| R-001 | External API timeout affects UX           | Medium      | Medium | Implement reasonable timeouts, show progress  | Open   |
| R-002 | Unclear how to mock external APIs         | Low         | Medium | Use simple HTTP mock servers or in-memory stubs | Open |
| R-003 | Parallel execution complexity             | Medium      | Medium | Use well-tested async/concurrency libraries   | Open   |
| R-004 | VIN validation rules may be incomplete    | Medium      | Low    | Document assumptions, use basic validation    | Open   |
| R-005 | Inconsistent document formats from APIs   | Low         | Medium | Define clear contracts for mock APIs          | Open   |
| R-006 | Testing parallel execution is complex     | Medium      | Medium | Use test frameworks with async support        | Open   |
| R-007 | Both systems down = no value to user      | Low         | High   | Acceptable for assessment, note in docs       | Open   |
| R-008 | Scope creep beyond assessment requirements | Medium     | Medium | Strict adherence to defined scope             | Open   |
| R-009 | Over-engineering for assessment context   | Medium      | Low    | Balance demo-quality with architectural principles | Open |
| R-010 | Insufficient observability implementation | Low         | Medium | Include at least basic logging and metrics    | Open   |

---

# 16. Open Questions

| ID    | Question                                                  | Owner | Impact | Status   | Resolution                                                |
| ----- | --------------------------------------------------------- | ----- | ------ | -------- | --------------------------------------------------------- |
| Q-001 | Should we implement backend or frontend?                  | Human | High   | Resolved | Backend with GET /api/documents?vin={vin} + Swagger UI   |
| Q-002 | What technology stack should we use?                      | Human | High   | Resolved | Node.js, Express, TypeScript, Jest, SQLite                |
| Q-003 | How should mock external APIs be implemented?             | Human | Medium | Resolved | Two Express servers on different ports with SQLite        |
| Q-004 | Should we implement a database for any persistence?       | Human | Medium | Resolved | Two SQLite DBs for mock external API data                 |
| Q-005 | What level of observability is sufficient for assessment? | Human | Low    | Resolved | End-to-end monitoring (logging tool TBD)                  |
| Q-006 | Should we implement retry logic for failed API calls?     | Human | Low    | Resolved | Yes, retry N times (N from env, N ≤ 5)                    |
| Q-007 | What document metadata should mock APIs return?           | Human | Medium | Resolved | Use JSON structure from section 14 API contracts          |

---

# 17. Decisions

## DEC-001 - Focus on Scenario D

**Context:**
The assessment offers four scenarios (A, B, C, D). We must choose one.

**Options Considered:**
1. Scenario A: Unified Service Scheduler
2. Scenario B: Intelligent Inventory Dashboard
3. Scenario C: Sales Lead Management Tool
4. Scenario D: Unified Document Viewer

**Decision:**
Scenario D - The Unified Document Viewer

**Reason:**
* Clearly defined integration problem (parallel API calls, aggregation)
* Good demonstration of distributed systems concepts
* Appropriate scope for time-boxed assessment
* Clear acceptance criteria

**Consequences:**
* Focus all effort on document aggregation use case
* Other scenarios are out of scope

**Status:** Approved (implicit from project setup)

---

## DEC-002 - Mock External APIs

**Context:**
The assessment requires mocked external APIs for Sales and Service systems.

**Options Considered:**
1. In-memory mocks/stubs within the application
2. Separate HTTP mock servers
3. Use mock server libraries/frameworks

**Decision:**
TBD - Pending technology stack decision

**Reason:**
Depends on chosen technology stack and implementation approach

**Consequences:**
* Affects testing strategy
* Affects deployment complexity
* Affects demonstration approach

**Status:** Proposed

---

# 18. Acceptance Criteria

## Inception Acceptance Criteria

* [x] Problem statement is clearly defined
* [x] Goals are established
* [x] Scope is defined (in-scope and out-of-scope)
* [x] Out-of-scope boundaries are documented
* [x] Actors and primary use cases are identified
* [x] Functional requirements are sufficiently defined
* [x] Important non-functional requirements are identified
* [x] Constraints are documented
* [x] Important assumptions are documented
* [x] System boundaries are understood
* [x] Critical external integrations are identified
* [x] Initial architecture direction is proposed
* [x] Major risks are identified
* [x] Critical open questions are documented
* [x] Initial acceptance criteria are defined
* [ ] Open questions Q-001 through Q-003 are resolved (technology decisions)
* [ ] Architecture decisions ADR-001 through ADR-007 are approved
* [ ] Human approval to proceed to Construction

## System Acceptance Criteria

These are the criteria for the final system to be considered complete:

* [ ] System accepts VIN input through a search interface
* [ ] System validates VIN format (17 characters, alphanumeric)
* [ ] System makes parallel requests to Sales and Service system APIs
* [ ] System aggregates documents from both sources into consolidated list
* [ ] Each document clearly shows its source system
* [ ] System handles partial failures gracefully (one system down)
* [ ] System handles empty results appropriately
* [ ] System includes automated tests for core business logic
* [ ] System includes observability features (logging, metrics)
* [ ] System Design Document is complete
* [ ] README includes setup, run, test instructions
* [ ] AI Collaboration Narrative is documented
* [ ] Code is clean, maintainable, and follows best practices

---

# 19. Technology Decision Framework

Since the open questions require technology decisions, here is a framework for evaluating options:

## Backend vs Frontend Implementation

**Backend Pros:**
* Focus on core aggregation and orchestration logic
* Easier to demonstrate parallel API calls
* API contracts are clearer artifacts
* Testing infrastructure/resilience patterns is more natural
* Better alignment with "Build for the Future" (scalability, reliability)

**Backend Cons:**
* Need to mock or stub the UI layer
* May need tools like cURL or Postman for demonstration

**Frontend Pros:**
* Visual demonstration is more intuitive
* User experience is tangible
* Can mock backend with simple JSON files

**Frontend Cons:**
* Parallel API call orchestration must be demonstrated in browser or during build
* Limited opportunity to show backend scalability/reliability patterns
* Testing async frontend logic can be complex

**Recommendation:** Backend implementation - better alignment with assessment goals around scalability, reliability, and distributed systems

---

## Technology Stack Considerations

**Backend Technology Options:**
* **Node.js/TypeScript:** Good async support, popular, extensive ecosystem
* **Python (FastAPI/Flask):** Clean async support, good for rapid development
* **Java/Spring Boot:** Enterprise-grade, excellent observability, more verbose
* **Go:** Excellent concurrency primitives, simple deployment

**Key Evaluation Criteria:**
* Async/concurrent programming support (critical for parallel API calls)
* Testing framework maturity
* Observability library ecosystem
* Development speed for time-boxed assessment
* Demonstration clarity

**Mock API Implementation:**
* Simple HTTP servers (e.g., Express.js for Node, Flask for Python)
* Mock server libraries (e.g., WireMock, Mockoon)
* In-memory test doubles

---

# 20. Inception Exit Criteria

Inception will be considered complete when:

* [x] All sections of this document are filled with relevant information
* [x] Problem statement, goals, scope are clearly defined
* [x] Functional requirements are documented
* [x] Non-functional requirements are identified
* [x] Use cases cover primary scenarios
* [x] System boundaries are understood
* [x] Initial architecture direction is proposed
* [x] Risks are identified
* [x] Critical open questions (Q-001 through Q-007) are resolved
* [x] Technology stack decision is made (Node.js, Express, TypeScript, Jest, SQLite)
* [x] Implementation approach (backend vs frontend) is decided (Backend)
* [x] Mock API approach is defined (Two Express servers with SQLite)
* [x] Architectural decisions are approved by human (ADR-001 through ADR-010)
* [x] STATE.md is updated to reflect Inception completion (pending)
* [x] Human provides explicit approval to proceed to Construction

---

# 21. Current Inception Status

**Status:** Completed

**Last Updated:** 2026-08-14

**Current Objective:** Inception phase complete with all decisions approved

**Next Action:** Transition to Construction phase

**Owner:** Both (AI completed analysis, Human approved all decisions)

**Completion Percentage:** 100% (analysis complete, all decisions approved, ready for Construction)
