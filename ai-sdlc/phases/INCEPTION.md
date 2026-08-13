# Inception

## Purpose

The Inception phase defines **what should be built, why it should be built, and the boundaries within which it must operate**.

The output of this phase should provide enough clarity for Construction to begin without relying on major undocumented assumptions.

---

# 1. Problem Statement

Describe the problem this system or feature is intended to solve.

```text
[Describe the problem here]
```

## Why This Problem Matters

```text
[Explain the business/user/technical impact]
```

---

# 2. Goals

Define the outcomes the system should achieve.

### Primary Goals

* [ ] [Goal 1]
* [ ] [Goal 2]
* [ ] [Goal 3]

### Success Criteria

```text
[Describe how we know the goals have been achieved]
```

---

# 3. Scope

## In Scope

The following functionality is included:

* [ ] [Scope item 1]
* [ ] [Scope item 2]
* [ ] [Scope item 3]

## Out of Scope

The following functionality is explicitly excluded:

* [ ] [Out-of-scope item 1]
* [ ] [Out-of-scope item 2]
* [ ] [Out-of-scope item 3]

Out-of-scope items should not be implemented unless the scope is explicitly changed.

---

# 4. Actors and Users

Identify the users, systems, or external actors interacting with the system.

| Actor   | Description   | Responsibilities   |
| ------- | ------------- | ------------------ |
| [Actor] | [Description] | [Responsibilities] |

---

# 5. Functional Requirements

Functional requirements describe **what the system must do**.

## FR-001 - [Requirement Name]

**Description:**

[Describe the required behavior.]

**Priority:**

* Must
* Should
* Could
* Won't

**Acceptance Criteria:**

* [ ] [Criterion 1]
* [ ] [Criterion 2]
* [ ] [Criterion 3]

---

## FR-002 - [Requirement Name]

**Description:**

[Describe the required behavior.]

**Priority:**

* Must
* Should
* Could
* Won't

**Acceptance Criteria:**

* [ ] [Criterion 1]
* [ ] [Criterion 2]
* [ ] [Criterion 3]

---

# 6. Non-Functional Requirements

Non-functional requirements describe **how the system should behave**.

## Performance

```text
[Latency, throughput, response time, processing requirements]
```

## Scalability

```text
[Expected traffic, users, data volume, growth expectations]
```

## Availability

```text
[Availability requirements, downtime tolerance, recovery expectations]
```

## Reliability

```text
[Failure handling, retries, consistency, durability requirements]
```

## Security

```text
[Authentication, authorization, data protection, security requirements]
```

## Observability

```text
[Logging, metrics, tracing, monitoring requirements]
```

## Maintainability

```text
[Code quality, modularity, operational requirements]
```

## Compatibility

```text
[Browser, device, API, database, infrastructure, or integration constraints]
```

---

# 7. Constraints

Document constraints that influence the solution.

Examples:

* Existing technology stack
* Existing infrastructure
* Existing APIs
* Database constraints
* Third-party services
* Budget constraints
* Time constraints
* Deployment constraints
* Backward compatibility
* Regulatory requirements

```text
[Constraint 1]

[Constraint 2]

[Constraint 3]
```

---

# 8. Assumptions

Record assumptions being made because information is not yet available.

Each assumption should be treated as potentially changeable.

| ID    | Assumption   | Reason   | Confidence      | Impact if Wrong |
| ----- | ------------ | -------- | --------------- | --------------- |
| A-001 | [Assumption] | [Reason] | High/Medium/Low | [Impact]        |

AI must not silently convert assumptions into requirements.

---

# 9. Use Cases

Describe the primary user/system interactions.

## UC-001 - [Use Case Name]

**Actor:**

[Actor]

**Goal:**

[Desired outcome]

**Preconditions:**

* [Condition]

**Main Flow:**

1. [Step]
2. [Step]
3. [Step]

**Alternative Flow:**

1. [Alternative scenario]

**Failure Flow:**

1. [Failure scenario]

**Expected Result:**

[Result]

---

# 10. System Boundaries

Define what belongs inside the system and what remains external.

```text
+------------------------------------------------------+
|                    SYSTEM                            |
|                                                      |
|  [Component / Responsibility]                        |
|                                                      |
|  [Component / Responsibility]                        |
|                                                      |
+------------------------------------------------------+
       |                    |                    |
       v                    v                    v
 [External A]          [External B]          [External C]
```

### Internal Responsibilities

* [Responsibility]

### External Responsibilities

* [Responsibility]

---

# 11. External Integrations

Document external systems and services.

| Integration | Purpose   | Protocol            | Direction          | Criticality       |
| ----------- | --------- | ------------------- | ------------------ | ----------------- |
| [System]    | [Purpose] | [REST/GraphQL/etc.] | [Inbound/Outbound] | [High/Medium/Low] |

For each critical integration, identify:

* Authentication method
* Expected failure behavior
* Timeout requirements
* Retry requirements
* Rate limits
* Data exchanged
* Availability dependency

---

# 12. Initial Architecture Direction

This section defines the high-level architecture direction.

It is intentionally not the detailed technical design.

```text
[Client]
    |
    v
[Entry Point]
    |
    v
[Application]
    |
    +----> [Database]
    |
    +----> [External Service]
```

## Architecture Goals

* [Goal]
* [Goal]
* [Goal]

## Initial Architectural Decisions

| ID      | Decision   | Reason   | Status            |
| ------- | ---------- | -------- | ----------------- |
| ADR-001 | [Decision] | [Reason] | Proposed/Approved |

Detailed architecture belongs in `SYSTEM-DESIGN.md` once the design is sufficiently established.

---

# 13. Data Requirements

Identify the major data required by the system.

| Data   | Purpose   | Source   | Owner   | Sensitivity |
| ------ | --------- | -------- | ------- | ----------- |
| [Data] | [Purpose] | [Source] | [Owner] | [Level]     |

At this stage, focus on **what data is required**, not detailed database implementation.

Detailed schema and persistence decisions belong to Construction.

---

# 14. API / Interface Requirements

Identify major interfaces required by the system.

| Interface | Consumer   | Purpose   | Protocol            | Status   |
| --------- | ---------- | --------- | ------------------- | -------- |
| [API]     | [Consumer] | [Purpose] | [REST/GraphQL/etc.] | Proposed |

Detailed API contracts should be defined during Construction.

---

# 15. Risks

Identify risks that could affect the project.

| ID    | Risk   | Probability     | Impact          | Mitigation   | Status |
| ----- | ------ | --------------- | --------------- | ------------ | ------ |
| R-001 | [Risk] | High/Medium/Low | High/Medium/Low | [Mitigation] | Open   |

AI should actively look for risks that are easy to overlook, including:

* Hidden dependencies
* Scalability bottlenecks
* Security weaknesses
* Data consistency problems
* External service dependencies
* Operational complexity
* Migration risks
* Backward compatibility
* Failure scenarios

---

# 16. Open Questions

Questions that must be answered before the affected decision can be finalized.

| ID    | Question   | Owner    | Impact          | Status |
| ----- | ---------- | -------- | --------------- | ------ |
| Q-001 | [Question] | Human/AI | High/Medium/Low | Open   |

Open questions should not be silently resolved by AI.

When a question is resolved, document the resulting decision.

---

# 17. Decisions

Record important decisions made during Inception.

## DEC-001 - [Decision Title]

**Context:**

[Why was this decision necessary?]

**Options Considered:**

1. [Option A]
2. [Option B]
3. [Option C]

**Decision:**

[Selected option]

**Reason:**

[Why this option was selected]

**Consequences:**

[Positive and negative consequences]

**Status:**

Proposed / Approved / Superseded

---

# 18. Acceptance Criteria

Define the conditions required for the system or feature to be considered acceptable.

* [ ] All Must-have functional requirements are satisfied.
* [ ] Required non-functional requirements are addressed.
* [ ] Critical use cases are supported.
* [ ] Known critical risks have mitigation plans.
* [ ] Major architectural decisions are approved.
* [ ] No critical open questions remain.
* [ ] Construction can begin without major undocumented assumptions.

Additional acceptance criteria:

* [ ] [Criterion]
* [ ] [Criterion]

---

# 19. Inception AI Collaboration

AI should support the Inception process by:

1. Reading the existing project context.
2. Identifying missing or ambiguous requirements.
3. Asking targeted clarification questions.
4. Separating facts, assumptions, proposals, and decisions.
5. Proposing alternatives where useful.
6. Identifying risks and edge cases.
7. Reviewing requirements for contradictions.
8. Helping define measurable acceptance criteria.
9. Updating documentation after approved decisions.

AI must not:

* Invent requirements.
* Assume business decisions without approval.
* Treat a proposal as an approved decision.
* Introduce implementation details unnecessarily.
* Hide uncertainty.
* Declare Inception complete without satisfying the exit criteria.

---

# 20. Inception Exit Criteria

Inception is complete when:

* [ ] Problem statement is clearly defined.
* [ ] Goals are established.
* [ ] Scope is defined.
* [ ] Out-of-scope boundaries are documented.
* [ ] Actors and primary use cases are identified.
* [ ] Functional requirements are sufficiently defined.
* [ ] Important non-functional requirements are identified.
* [ ] Constraints are documented.
* [ ] Important assumptions are documented.
* [ ] System boundaries are understood.
* [ ] Critical external integrations are identified.
* [ ] Initial architecture direction is agreed upon.
* [ ] Major risks are identified.
* [ ] Critical open questions are resolved.
* [ ] Acceptance criteria are defined.
* [ ] Construction can begin without major undocumented assumptions.

---

# 21. Current Inception Status

**Status:**

Not Started / In Progress / Ready for Construction / Completed

**Last Updated:**

[YYYY-MM-DD]

**Current Objective:**

[Current objective]

**Next Action:**

[Next action]

**Owner:**

[Human / AI / Both]
