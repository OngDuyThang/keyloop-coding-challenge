# CLAUDE.md

# Keyloop Coding Challenge - Claude Instructions

## 1. Project Overview

This repository contains the implementation for the **Keyloop Technical Assessment - Scenario D: The Unified Document Viewer**.

The assessment requires a solution that demonstrates:

- Problem solving and system design
- Technical execution
- AI engineering and verification
- Clear communication and presentation

The assessment explicitly expects GenAI to be used as an engineering collaborator and evaluates how the candidate directs, validates, refines, and takes ownership of AI-generated work.

---

# 2. Repository Structure

```text
keyloop-coding-challenge/
│
├── CLAUDE.md
├── README.md
│
├── reference/
│   └── KeyloopCodingChallange.pdf
│
├── ai-sdlc/
│   ├── AUDIT.md
│   ├── STATE.md
│   └── phases/
│       ├── INCEPTION.md
│       ├── CONSTRUCTION.md
│       └── BUILD-AND-TEST.md
│
└── docs/
    ├── AI-SDLC.md
    ├── AI-COLLABORATION-NARRATIVE.md
    └── SYSTEM-DESIGN.md
```

### File responsibilities

| Location                             | Responsibility                                        |
| ------------------------------------ | ----------------------------------------------------- |
| `CLAUDE.md`                          | Instructions governing Claude's behaviour             |
| `reference/`                         | Source/reference material provided for the assessment |
| `docs/AI-SDLC.md`                    | Stable definition of the project's AI-SDLC process    |
| `docs/SYSTEM-DESIGN.md`              | Final system design documentation                     |
| `docs/AI-COLLABORATION-NARRATIVE.md` | Final AI collaboration narrative                      |
| `ai-sdlc/STATE.md`                   | Current AI-SDLC phase and execution state             |
| `ai-sdlc/phases/INCEPTION.md`        | Living Inception-phase decisions and working state    |
| `ai-sdlc/phases/CONSTRUCTION.md`     | Living Construction-phase state                       |
| `ai-sdlc/phases/BUILD-AND-TEST.md`   | Living Build & Test-phase state                       |
| `ai-sdlc/AUDIT.md`                   | Audit trail of material AI-SDLC state changes         |
| `README.md`                          | Final project documentation and submission guide      |

Do not confuse stable documentation in `docs/` with mutable working state in `ai-sdlc/`.

---

# 3. Reference Material

The official challenge specification is stored at:

```text
reference/KeyloopCodingChallange.pdf
```

This file is the authoritative source for the assessment requirements.

Claude must consult this document when establishing or verifying project requirements.

Do not invent assessment requirements that are not supported by the reference document.

When the assessment is ambiguous, document an explicit assumption rather than silently treating an interpretation as a requirement.

---

# 4. Initial Session Protocol

When beginning work on this repository, Claude must follow this sequence.

## Step 1 - Understand operating instructions

Read:

```text
CLAUDE.md
```

This file defines how Claude must operate in this project.

## Step 2 - Learn the AI-SDLC process

Read:

```text
docs/AI-SDLC.md
```

This defines the three development phases:

1. Inception
2. Construction
3. Build & Test

### Important

`docs/AI-SDLC.md` is stable process documentation.

Claude MUST NOT modify `docs/AI-SDLC.md` as part of normal AI-SDLC execution.

It may only be modified when the human explicitly requests a change to the AI-SDLC methodology or explicitly instructs Claude to modify this file.

### Token efficiency rule

Claude should normally read `docs/AI-SDLC.md` once at the beginning of a project or session to understand the workflow.

Do NOT repeatedly reread the entire file before every action.

Only reread it when:

- The file has changed.
- The user explicitly asks to revisit the process.
- Claude encounters uncertainty about the defined AI-SDLC workflow.
- A task explicitly requires information contained in that document.

Once understood, follow the established process from working memory.

## Step 3 - Read the assessment reference

Read:

```text
reference/KeyloopCodingChallange.pdf
```

Extract only the requirements relevant to the current task.

Do NOT repeatedly reread the entire PDF when the required information is already known.

Revisit the reference when:

- A requirement needs verification.
- A new requirement is being discussed.
- An ambiguity needs to be resolved against the original assessment.
- The user explicitly asks to verify something against the assessment.

## Step 4 - Determine the current AI-SDLC state

Read:

```text
ai-sdlc/STATE.md
```

`STATE.md` is the primary source of truth for the current AI-SDLC phase and state.

Use it to determine:

- Current phase
- Current status
- Current objective
- Whether the phase is ready to proceed
- What was last completed
- What should happen next
- Whether human input or approval is required

After determining the current phase, read the corresponding phase file under:

```text
ai-sdlc/phases/
```

For example:

```text
ai-sdlc/phases/INCEPTION.md
```

Do not read every phase file when only the current phase is relevant.

## Step 5 - Continue with the human in the loop

Claude must not assume that understanding the repository means it has permission to immediately implement the entire project.

The user remains the decision maker for significant requirements and architectural choices.

When important decisions remain unresolved, Claude should surface them and allow the human to refine or approve them before proceeding.

---

# 5. AI-SDLC

This project follows three phases:

```text
INCEPTION
    ↓
CONSTRUCTION
    ↓
BUILD & TEST
```

The detailed process is defined in:

```text
docs/AI-SDLC.md
```

The process is iterative.

A discovery during Construction or Build & Test may require returning to Inception when a requirement or architectural decision must be reconsidered.

The current phase must always be recorded in:

```text
ai-sdlc/STATE.md
```

---

# 6. Phase 1 - Inception

The purpose of Inception is to transform the assessment requirements into an explicit technical direction before substantial implementation.

The living state of Inception is:

```text
ai-sdlc/phases/INCEPTION.md
```

Inception includes:

- Requirement refinement
- Ambiguity identification
- Clarification questions
- Assumptions
- Functional requirements
- Non-functional requirements
- Constraints
- Alternative solutions
- Trade-offs
- Technology selection
- Architecture decisions
- API contract
- Data model
- Error handling
- Testing strategy
- Observability strategy
- Scalability and reliability considerations

### Inception behaviour

During Inception:

- Do not prematurely implement substantial code.
- Ask questions when ambiguity materially affects the solution.
- Distinguish explicit requirements from assumptions.
- Present meaningful alternatives when appropriate.
- Explain important trade-offs.
- Record decisions in `ai-sdlc/phases/INCEPTION.md`.
- Update `ai-sdlc/STATE.md` when the current state changes.
- Record material AI-SDLC changes in `ai-sdlc/AUDIT.md`.

The goal is not to eliminate every possible uncertainty.

The goal is to establish enough clarity that Construction can proceed confidently.

### Inception audit rule

Whenever Claude materially changes the Inception state, Claude must:

1. Update `ai-sdlc/phases/INCEPTION.md`.
2. Update `ai-sdlc/STATE.md` if the current state changed.
3. Append an audit record to `ai-sdlc/AUDIT.md`.

This includes material changes to:

- Requirements
- Assumptions
- Decisions
- Architecture
- Technical choices
- Constraints
- Open questions
- Inception status

---

# 7. Phase 2 - Construction

Construction begins after the relevant Inception decisions have been established.

The living state of Construction is:

```text
ai-sdlc/phases/CONSTRUCTION.md
```

Construction includes:

- Project setup
- Application implementation
- Domain/business logic
- External API integrations
- Persistence
- API endpoints
- Error handling
- Unit tests
- Integration tests where appropriate
- Observability
- Documentation

Construction MUST follow the decisions established during Inception.

If implementation reveals that an existing decision is incorrect or incomplete:

1. Stop the affected work.
2. Explain the discovered issue.
3. Determine whether the issue requires an Inception decision.
4. Update `ai-sdlc/phases/INCEPTION.md` when appropriate.
5. Update `ai-sdlc/STATE.md` if the current state changes.
6. Record the material decision change in `ai-sdlc/AUDIT.md`.
7. Obtain human confirmation when the change materially affects architecture or requirements.
8. Continue Construction.

Do NOT silently alter important architectural decisions.

### Construction audit rule

Whenever Claude materially changes the Construction state, Claude must:

1. Update `ai-sdlc/phases/CONSTRUCTION.md`.
2. Update `ai-sdlc/STATE.md` if the current state changed.
3. Append an audit record to `ai-sdlc/AUDIT.md`.

---

# 8. Phase 3 - Build & Test

Build & Test exists to independently validate the implementation.

The living state of Build & Test is:

```text
ai-sdlc/phases/BUILD-AND-TEST.md
```

It includes:

- Dependency installation
- Build
- Type checking
- Linting where configured
- Unit tests
- Integration tests where configured
- Test coverage
- HTML coverage report
- Application startup verification
- API verification
- Debugging
- Re-running validation after fixes

Claude MUST use actual command execution to establish whether the project builds and tests successfully.

Never claim:

- "Build passed"
- "Tests passed"
- "Coverage is X%"
- "Application works"

unless the corresponding validation was actually executed.

Generated code is not considered complete merely because it looks correct.

### Build & Test audit rule

Whenever Claude materially changes the Build & Test state, Claude must:

1. Update `ai-sdlc/phases/BUILD-AND-TEST.md`.
2. Update `ai-sdlc/STATE.md` if the current state changed.
3. Append an audit record to `ai-sdlc/AUDIT.md`.

This includes material validation events such as:

- Build result
- Test result
- Coverage result
- Validation failure
- Important discovered defect
- Validation strategy change
- Transition back to Construction
- Transition back to Inception

---

# 9. Human-in-the-Loop Gates

The human remains responsible for final technical decisions.

Claude should pause for human input when:

- A requirement is materially ambiguous.
- Multiple architectural solutions have significant trade-offs.
- A major technology choice is required.
- An architectural decision must change.
- An assumption materially affects system behaviour.
- A security, reliability, scalability, or data-integrity decision has significant consequences.
- The user explicitly requests review or approval.

Claude may make reasonable low-impact implementation decisions without blocking unnecessarily.

The objective is:

```text
AI autonomy for execution
+
Human control over important decisions
```

Not:

```text
Human manually approving every line of code
```

---

# 10. AI-SDLC Audit

`ai-sdlc/AUDIT.md` is the audit trail for material changes made by Claude to the AI-SDLC working state.

Claude is responsible for maintaining this file.

The audit applies to ALL THREE phases:

- Inception
- Construction
- Build & Test

Whenever Claude changes a material AI-SDLC state, Claude must:

1. Update the relevant phase file.
2. Update `ai-sdlc/STATE.md` when applicable.
3. Append an audit record to `ai-sdlc/AUDIT.md`.

Each audit entry should include:

- Timestamp
- Phase
- What changed
- Previous state
- New state
- Reason
- Source of the change
- Affected files

Do not silently delete or rewrite historical audit entries.

Minor wording, formatting, typo, or non-semantic documentation changes do not require an audit entry unless they alter project meaning.

---

# 11. Decision Precedence

When information conflicts, use this precedence:

```text
1. User's explicit instruction
2. Official assessment requirements
   reference/KeyloopCodingChallange.pdf
3. Approved decisions in ai-sdlc/phases/INCEPTION.md
4. Current state in ai-sdlc/STATE.md
5. Project documentation in docs/
6. Claude's implementation judgement
```

Claude must not override a higher-priority decision based solely on personal preference.

If a higher-priority requirement conflicts with an existing lower-priority decision, identify the conflict and update the affected AI-SDLC decision through the appropriate process.

---

# 12. Token Efficiency

This project intentionally uses modular documentation to reduce unnecessary context consumption.

Claude should:

- Read stable documents only when necessary.
- Avoid repeatedly reading the entire `docs/AI-SDLC.md`.
- Avoid rereading the entire assessment PDF when only a specific requirement is needed.
- Read only the current phase file unless another phase is relevant.
- Use `ai-sdlc/STATE.md` as the first source for determining the current state.
- Prefer targeted searches or specific sections over repeatedly loading entire documents.
- Keep large generated outputs out of persistent instruction files.
- Avoid duplicating the same information across multiple markdown files.

### Stable files

```text
CLAUDE.md
docs/AI-SDLC.md
reference/KeyloopCodingChallange.pdf
```

The reference PDF is authoritative source material and must not be modified.

`docs/AI-SDLC.md` defines the stable AI-SDLC methodology and MUST NOT be modified during normal execution.

### Mutable files

```text
ai-sdlc/STATE.md
ai-sdlc/AUDIT.md
ai-sdlc/phases/INCEPTION.md
ai-sdlc/phases/CONSTRUCTION.md
ai-sdlc/phases/BUILD-AND-TEST.md
docs/SYSTEM-DESIGN.md
docs/AI-COLLABORATION-NARRATIVE.md
README.md
```

These files should evolve as the project evolves.

---

# 13. Scenario D Requirements

The project implements:

**Scenario D - The Unified Document Viewer**

The assessment requires:

1. A unified search interface using a Vehicle Identification Number (VIN).
2. Backend aggregation from two mocked external systems:
   - Sales System API
   - Service System API
3. Parallel requests to the two external APIs.
4. A consolidated document list.
5. Clear identification of the source system for each document.

The implementation must also consider:

- Scalability
- Performance
- Reliability
- Maintainability
- Observability

The exact technical implementation must be established during Inception rather than assumed prematurely.

---

# 14. Testing Principles

Tests should validate meaningful behaviour rather than exist only to increase coverage.

Important areas to consider include:

- VIN validation
- Successful aggregation
- Empty results
- Documents from both systems
- Partial results
- External API failures
- External API timeouts
- Unexpected external responses
- Source attribution
- Parallel external requests
- Core business logic

The final implementation must contain automated tests for core business logic.

---

# 15. Documentation

The final repository must provide:

- Working code
- `README.md`
- System Design Document
- Automated tests
- AI Collaboration Narrative

The final README should document:

- Application purpose
- Architecture
- Technology choices
- Installation
- Running the application
- API usage
- Testing
- Coverage
- AI-SDLC
- AI Collaboration Narrative
- Important design decisions
- Trade-offs
- Observability
- Limitations and future improvements

The AI Collaboration Narrative should describe:

- How AI was directed
- How requirements were refined
- How decisions were made
- How generated code was verified
- Problems discovered
- How failures were corrected
- How tests and Build & Test were used
- How human ownership was maintained

The final narrative should be maintained in:

```text
docs/AI-COLLABORATION-NARRATIVE.md
```

---

# 16. Definition of Done

A meaningful feature is complete only after:

```text
Requirement understood
        ↓
Decision established
        ↓
Implementation
        ↓
Tests
        ↓
Build
        ↓
Test execution
        ↓
Coverage
        ↓
Verification
        ↓
Fix discovered issues
        ↓
Re-validation
        ↓
Documentation
```

Do not mark work complete merely because code has been generated.

---

# 17. Recovering the Current Operating State

`ai-sdlc/STATE.md` is the single source of truth for the current AI-SDLC execution state.

If Claude forgets, loses context, reconnects to the repository in a new session, or is otherwise uncertain about where the project currently is:

1. Read `ai-sdlc/STATE.md`.
2. Determine the current phase.
3. Determine the current status and objective.
4. Read the corresponding phase file under `ai-sdlc/phases/`.
5. Review the latest relevant audit entries in `ai-sdlc/AUDIT.md` if historical context is necessary.
6. Resume from the recorded state.
7. Do not restart completed work unless explicitly instructed.

Claude should NOT infer the current phase merely from which files exist.

The phase and state recorded in `ai-sdlc/STATE.md` take precedence.

The current phase file should then be used to understand the detailed work already performed in that phase.

At the beginning of this project, `STATE.md` should indicate that the project is in:

```text
INCEPTION
```

The immediate objective is to refine Scenario D and establish the technical decisions required before Construction.

The user will provide refinement questions and decisions during the Inception phase.

Claude should help analyze those questions, identify implications and trade-offs, maintain the Inception state, update the global state when necessary, and audit material changes.