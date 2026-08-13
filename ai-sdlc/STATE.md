# Project State

## Purpose

This file is the **single source of truth for the current execution state of the project**.

It exists so a new AI session can quickly recover project context without rereading the entire repository.

This file should describe **where the project is now**, not the complete history of how it got there.

---

# 1. Current Status

**Lifecycle Phase:**

Inception / Construction / Build & Test / Completed

**Overall Status:**

Not Started / In Progress / Blocked / Ready for Delivery / Completed

**Last Updated:**

[YYYY-MM-DD]

**Current Objective:**

[One short sentence describing the current objective]

---

# 2. Current Task

**Task:**

[Describe the task currently being worked on]

**Why:**

[Why this task is currently being worked on]

**Expected Outcome:**

[What should be true when this task is complete]

**Status:**

Not Started / In Progress / Blocked / Completed

---

# 3. Progress

## Completed

* [Completed item]
* [Completed item]
* [Completed item]

## In Progress

* [Current item]

## Not Started

* [Upcoming item]
* [Upcoming item]

---

# 4. Current Context

Summarize only the information necessary for an AI session to continue the current work safely.

### Relevant Requirements

* [Requirement]
* [Requirement]

### Relevant Architecture

* [Architecture detail]
* [Architecture detail]

### Relevant Implementation

* [Implementation detail]
* [Implementation detail]

### Relevant Constraints

* [Constraint]
* [Constraint]

---

# 5. Active Decisions

These are decisions that currently affect implementation.

| ID      | Decision   | Status   | Impact   |
| ------- | ---------- | -------- | -------- |
| DEC-001 | [Decision] | Approved | [Impact] |
| DEC-002 | [Decision] | Approved | [Impact] |

Only include decisions that are currently relevant.

Historical decisions that no longer affect the current state belong in the appropriate project documentation.

---

# 6. Open Questions

Questions that are still unresolved.

| ID    | Question   | Priority | Owner    | Status |
| ----- | ---------- | -------- | -------- | ------ |
| Q-001 | [Question] | High     | Human/AI | Open   |
| Q-002 | [Question] | Medium   | Human/AI | Open   |

AI must not silently resolve these questions.

When a question is resolved, move the resulting decision into **Active Decisions** and record the full decision where appropriate.

---

# 7. Known Issues

Current problems that affect development or delivery.

| ID        | Issue   | Severity | Impact   | Status |
| --------- | ------- | -------- | -------- | ------ |
| ISSUE-001 | [Issue] | High     | [Impact] | Open   |

Include:

* Bugs
* Broken tests
* Build problems
* Architecture concerns
* Dependency problems
* Environment issues
* Known technical debt affecting current work

Do not use this section as a general backlog.

---

# 8. Blockers

Things preventing meaningful progress.

| ID        | Blocker   | Required Action | Owner    | Status |
| --------- | --------- | --------------- | -------- | ------ |
| BLOCK-001 | [Blocker] | [Action]        | Human/AI | Open   |

If there are no blockers:

```text
None
```

---

# 9. Validation State

Record the latest known validation status.

## Build

**Status:**

Not Run / Passing / Failing

**Last Run:**

[YYYY-MM-DD]

**Notes:**

[Relevant result]

## Tests

**Status:**

Not Run / Passing / Failing

**Last Run:**

[YYYY-MM-DD]

**Notes:**

[Relevant result]

## Lint / Type Check

**Status:**

Not Run / Passing / Failing

**Last Run:**

[YYYY-MM-DD]

**Notes:**

[Relevant result]

## Other Validation

```text
[Relevant validation result]
```

Never mark validation as passing unless it has actually been verified.

---

# 10. Recent Changes

Keep only a short summary of recent changes that are relevant to continuing work.

* [Recent change]
* [Recent change]
* [Recent change]

Detailed history belongs in version control and `AI-COLLABORATION-NARRATIVE.md`.

---

# 11. Next Steps

The recommended continuation path.

1. [Next action]
2. [Next action]
3. [Next action]

The first item should normally be the most appropriate action for the next AI session.

---

# 12. Session Handoff

Use this section when ending an AI session or handing work to another AI session.

### What Was Done

[Short summary]

### What Was Not Done

[Short summary]

### Important Context

[Information the next session must know]

### Recommended Next Action

[Specific next action]

### Files Recently Changed

* `[path/to/file]`
* `[path/to/file]`

---

# 13. AI Session Instructions

When starting a new session:

1. Read `CLAUDE.md`.
2. Read this file.
3. Identify the current lifecycle phase.
4. Identify the current objective.
5. Review active decisions and open questions.
6. Review known issues and blockers.
7. Read the relevant phase documentation.
8. Inspect relevant source files before making changes.
9. Continue from the **Next Steps** section unless new information changes the plan.

Do not restart analysis from scratch if the existing state already provides sufficient context.

---

# 14. State Update Rules

Update this file when:

* The lifecycle phase changes.
* The current objective changes.
* A significant task is completed.
* A new task becomes active.
* An important decision is approved.
* An open question is resolved.
* A significant issue is discovered or resolved.
* A blocker appears or disappears.
* Validation status changes.
* A session ends with meaningful unfinished work.

Keep the file concise.

Do not turn `STATE.md` into a project history log.

The goal is **fast and reliable context recovery**.

---

# 15. Current State

Replace the template sections above with the actual project state as the project progresses.

The most important information for a new AI session should always be near the top of this document:

```text
Current Phase
    ↓
Current Objective
    ↓
Current Task
    ↓
Active Decisions
    ↓
Open Questions / Blockers
    ↓
Next Steps
```
