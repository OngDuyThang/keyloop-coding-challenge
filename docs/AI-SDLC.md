# AI-SDLC

## Purpose

This document defines the AI-assisted Software Development Life Cycle used by this project.

The goal is to make AI collaboration structured, repeatable, auditable, and efficient while keeping architectural and product decisions under human control.

AI is treated as an implementation and reasoning collaborator, not as the owner of project decisions.

---

## Core Principles

1. **Human owns decisions**

   * Product requirements, architecture, trade-offs, scope, and final acceptance remain human decisions.
   * AI may propose alternatives, identify risks, and implement approved decisions.

2. **Context before action**

   * AI must understand the relevant project context before modifying code or project artifacts.
   * Prefer existing project documentation over assumptions.

3. **Plan before implementation**

   * Non-trivial work should have an explicit plan before code changes begin.
   * The plan should identify affected areas, dependencies, risks, and validation steps.

4. **Small, verifiable changes**

   * Prefer incremental changes over large uncontrolled modifications.
   * Each meaningful change should be validated before continuing.

5. **Documentation is part of the system**

   * Important decisions, requirements, architecture, and state must be recorded in project files.
   * AI should update the appropriate documentation when implementation changes invalidate existing documentation.

6. **Evidence over assumption**

   * AI should inspect the repository and relevant artifacts before making claims about the implementation.
   * When uncertain, AI should explicitly identify the uncertainty instead of silently guessing.

7. **Token-efficient collaboration**

   * Read only the context required for the current task.
   * Reuse information already established in the current workflow.
   * Avoid repeatedly reading large documents when a focused section is sufficient.

---

# SDLC Phases

The project follows three primary phases:

```text
INCEPTION
    |
    v
CONSTRUCTION
    |
    v
BUILD & TEST
    |
    +----------------------+
    |                      |
    | requirements change  |
    | design change        |
    | implementation issue |
    | test failure         |
    |                      |
    +------> appropriate phase
```

The phases are iterative rather than strictly linear.

A project may return to an earlier phase when new information requires it.

---

# 1. Inception

**Purpose:** Define what should be built and establish the initial technical direction.

Primary artifact:

```text
ai-sdlc/phases/INCEPTION.md
```

## Responsibilities

Inception should establish:

* Problem statement
* Goals
* Scope
* Functional requirements
* Non-functional requirements
* Constraints
* Assumptions
* Actors and users
* Major use cases
* Initial system boundaries
* Initial architecture direction
* Key technical risks
* Open questions
* Acceptance criteria

## AI Collaboration

AI may assist with:

* Requirement clarification
* Requirement decomposition
* Identifying missing requirements
* Identifying ambiguities
* Proposing architecture alternatives
* Identifying technical risks
* Drafting acceptance criteria
* Reviewing requirements for contradictions

AI must not silently decide unresolved product or architectural questions.

Unresolved decisions should remain explicitly documented as open questions or decisions requiring human approval.

## Exit Criteria

Inception is complete when:

* The problem and scope are understood.
* Functional requirements are sufficiently defined.
* Important non-functional requirements are identified.
* Major constraints are known.
* The initial architecture direction is agreed upon.
* Important open questions are resolved or explicitly tracked.
* Construction can begin without relying on major assumptions.

---

# 2. Construction

**Purpose:** Design and implement the system according to the approved requirements and architecture.

Primary artifact:

```text
ai-sdlc/phases/CONSTRUCTION.md
```

## Responsibilities

Construction includes:

* Detailed technical design
* Domain modeling
* API design
* Database design
* Component design
* Module boundaries
* Dependency decisions
* Implementation
* Refactoring
* Code review
* Technical documentation

## AI Collaboration

Before implementing non-trivial work, AI should:

1. Inspect the relevant existing implementation.
2. Read the relevant requirements and architecture.
3. Identify affected components.
4. Propose an implementation plan.
5. Identify risks and possible side effects.
6. Implement the approved approach.
7. Review the resulting changes.
8. Update affected documentation.

AI should prefer modifying the existing architecture consistently rather than introducing unnecessary new patterns.

## Change Discipline

For each meaningful implementation task:

```text
Understand
    |
    v
Plan
    |
    v
Implement
    |
    v
Review
    |
    v
Validate
    |
    v
Document
```

If implementation reveals that the approved design is insufficient, do not silently work around it.

Return to the appropriate design or requirements discussion and record the resulting decision.

## Exit Criteria

Construction is complete when:

* Required functionality has been implemented.
* The implementation follows the approved architecture.
* Important technical decisions are documented.
* Code has been reviewed.
* Known implementation risks have been addressed.
* The system is ready for validation.

---

# 3. Build & Test

**Purpose:** Verify that the implemented system satisfies its requirements and is technically sound.

Primary artifact:

```text
ai-sdlc/phases/BUILD-AND-TEST.md
```

## Responsibilities

Build & Test includes:

* Building
* Unit testing
* Integration testing
* End-to-end testing
* Static analysis
* Linting
* Type checking
* Security validation where applicable
* Performance validation where required
* Regression testing
* Defect fixing

## AI Collaboration

AI may assist with:

* Generating tests
* Identifying missing test cases
* Diagnosing failures
* Fixing implementation defects
* Reviewing test coverage
* Identifying edge cases
* Analyzing build and test output

Test results must be treated as evidence.

AI must not claim that a requirement is satisfied without appropriate validation.

## Failure Handling

When validation fails:

```text
Test / Build Failure
        |
        v
Identify Root Cause
        |
        +----------------------+
        |                      |
        v                      v
Implementation issue      Design issue
        |                      |
        v                      v
Fix in Construction      Return to Construction
        |                      |
        +----------+-----------+
                   |
                   v
              Re-validate
```

If a failure reveals that a requirement or architectural decision is incorrect, return to the appropriate earlier phase instead of applying an implementation workaround.

## Exit Criteria

Build & Test is complete when:

* The project builds successfully.
* Required automated tests pass.
* Relevant quality checks pass.
* Important acceptance criteria are validated.
* Known defects are resolved or explicitly accepted.
* The implementation is ready for delivery.

---

# Iteration Between Phases

The lifecycle is intentionally iterative.

A change discovered in a later phase may require returning to an earlier phase.

Examples:

```text
Requirement ambiguity
    -> Inception

Architecture problem
    -> Construction

Implementation defect
    -> Construction

Test failure
    -> Construction / Build & Test

Requirement discovered during testing
    -> Inception

Performance problem
    -> Construction / Build & Test
```

Do not force a later-phase problem into an earlier implementation decision merely to preserve a linear workflow.

The correct phase should own the correction.

---

# Project File Relationship

The AI-SDLC process is represented by project artifacts:

```text
docs/
├── AI-SDLC.md
├── AI-COLLABORATION-NARRATIVE.md
└── SYSTEM-DESIGN.md

ai-sdlc/
├── STATE.md
└── phases/
    ├── INCEPTION.md
    ├── CONSTRUCTION.md
    └── BUILD-AND-TEST.md
```

## AI-SDLC.md

Defines the lifecycle itself.

This is the stable process definition.

It should not normally be modified during ordinary implementation work.

## AI-COLLABORATION-NARRATIVE.md

Records how AI was used throughout the project.

It provides a human-readable narrative of:

* Important AI interactions
* Major decisions
* Alternatives considered
* Human approvals
* Significant implementation changes
* Lessons learned

## SYSTEM-DESIGN.md

Contains the project's technical architecture and system design.

It should reflect the currently approved architecture.

## STATE.md

Contains the current project execution state.

It should allow a new AI session to quickly understand:

* Current phase
* Current objective
* Current task
* Completed work
* Active decisions
* Open questions
* Known issues
* Next recommended action

## Phase Files

Each phase file contains the working information relevant to that phase.

```text
INCEPTION.md
    Requirements
    Scope
    Constraints
    Architecture direction
    Open questions

CONSTRUCTION.md
    Technical design
    Implementation decisions
    Current implementation work
    Risks

BUILD-AND-TEST.md
    Validation strategy
    Test results
    Build results
    Known defects
    Acceptance status
```

---

# State Management

`ai-sdlc/STATE.md` is the primary entry point for recovering project execution context.

At the beginning of a new AI session:

1. Read `CLAUDE.md`.
2. Read `ai-sdlc/STATE.md`.
3. Identify the current phase.
4. Read only the relevant phase documentation.
5. Read additional project documentation only when required.
6. Inspect the relevant source code before implementation.

The goal is to recover enough context to continue safely without unnecessarily consuming context or tokens.

---

# Token-Efficient Context Loading

AI should use progressive context loading.

Preferred order:

```text
CLAUDE.md
    |
    v
STATE.md
    |
    v
Current phase file
    |
    v
Relevant design / requirements
    |
    v
Relevant source code
    |
    v
Tests / supporting files
```

Do not automatically load every project document for every task.

Read additional documentation when:

* The task depends on it.
* The current information is insufficient.
* A decision needs to be verified.
* The implementation may affect another subsystem.

Once a document has been read and its relevant information is understood, avoid rereading the entire document unnecessarily.

---

# Human-in-the-Loop Workflow

The human remains the final authority for:

* Scope
* Requirements
* Architecture
* Major technical trade-offs
* External dependencies
* Security-sensitive decisions
* Breaking changes
* Final acceptance

AI should clearly distinguish between:

```text
FACT
Known from repository or documentation.

ASSUMPTION
Reasonable but not yet verified.

PROPOSAL
An option suggested by AI.

DECISION
An approved direction.

RESULT
Something verified through implementation or testing.
```

This distinction prevents AI-generated assumptions from becoming accidental project requirements.

---

# Decision Workflow

For significant decisions:

```text
Problem
   |
   v
Context / Constraints
   |
   v
Options
   |
   v
Trade-offs
   |
   v
Human Decision
   |
   v
Document Decision
   |
   v
Implement
   |
   v
Validate
```

The final decision should be recorded in the appropriate project artifact.

---

# Change Management

When a change affects an existing requirement, architecture, or implementation:

1. Identify what changed.
2. Identify which project artifacts are affected.
3. Determine the appropriate lifecycle phase.
4. Update the relevant documentation.
5. Implement the change.
6. Validate the change.
7. Update `STATE.md`.
8. Record significant collaboration or decision history in `AI-COLLABORATION-NARRATIVE.md`.

Avoid allowing documentation and implementation to drift apart.

---

# Auditability

Important project decisions should be traceable.

A significant feature should ideally have this relationship:

```text
Requirement
    |
    v
Design Decision
    |
    v
Implementation
    |
    v
Test / Validation
```

This makes it possible to answer:

* Why does this feature exist?
* Why was this architecture selected?
* What implementation satisfies the requirement?
* How was the implementation validated?
* What changed and why?

The AI collaboration narrative provides additional context for significant AI-assisted decisions.

---

# Definition of Done

A task is not considered complete merely because code has been written.

A meaningful task should satisfy:

```text
[ ] Requirement understood
[ ] Relevant design understood
[ ] Implementation completed
[ ] Code reviewed
[ ] Tests added or updated where appropriate
[ ] Build / validation completed
[ ] Documentation updated where necessary
[ ] STATE.md updated when project state changed
[ ] Significant decisions recorded
```

The exact validation requirements depend on the task.

---

# AI Behavior Rules

AI working within this SDLC should:

* Inspect before modifying.
* Plan before implementing non-trivial changes.
* Prefer existing project conventions.
* Avoid unnecessary architectural changes.
* Keep changes focused.
* Explain significant trade-offs.
* Surface uncertainty.
* Never fabricate repository state.
* Never claim tests passed without running or otherwise verifying them.
* Never silently change requirements.
* Never silently override architectural decisions.
* Keep project state synchronized.
* Return to the correct lifecycle phase when new information invalidates an earlier decision.

---

# Completion Model

The lifecycle is complete for a delivery when:

```text
Requirements
    |
    v
Approved Design
    |
    v
Implemented System
    |
    v
Validated System
    |
    v
Documented State
    |
    v
Human Acceptance
```

After delivery, future changes begin another iteration through the appropriate phase.

The SDLC is therefore not a one-time sequence but a controlled feedback loop:

```text
             +----------------+
             |    INCEPTION   |
             +-------+--------+
                     |
                     v
             +----------------+
             |  CONSTRUCTION  |
             +-------+--------+
                     |
                     v
             +----------------+
             | BUILD & TEST   |
             +-------+--------+
                     |
                     v
             +----------------+
             |    DELIVERY    |
             +-------+--------+
                     |
                     | change / feedback
                     |
                     +----------------------+
                                            |
                                            v
                                      Appropriate Phase
```

The objective is not to make AI autonomous.

The objective is to make AI collaboration predictable, traceable, efficient, and aligned with human engineering decisions.
