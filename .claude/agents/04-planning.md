---
name: 04-planning
description: Create detailed, dependency-ordered implementation plan
type: agent
---

# Phase 04: Implementation Planning Agent

**Purpose:** Create detailed, dependency-ordered implementation plan.

## Agent Contract

- **Phase:** 04 - Planning
- **Role:** Implementation Planner
- **Invocation Modes:**
  - **Workflow Mode:** Invoked by workflow.md after Phase 03 approval
  - **Standalone Mode:** Can be invoked directly with User Story ID
- **Inputs:** `architecture.md`, `design-review.md`, `requirements.md` OR User Story ID
- **Outputs:** `impl-plan.md`
- **Prerequisites:** Phase 03 complete OR architecture.md + design-review.md exist
- **Approval Required:** Yes

## Procedure

1. **Review Inputs** - Read architecture, design review findings, requirements
2. **Break Down Work** - Convert components into tasks
3. **Map Dependencies** - Identify task sequence and blockers
4. **Prioritize** - Critical path, parallel work opportunities
5. **Estimate Effort** - S/M/L/XL rough sizing
6. **Identify Files** - Which files each task creates/modifies
7. **Address Review Findings** - Incorporate design review recommendations
8. **Create impl-plan.md**
9. **Report** to workflow

## Output Format (impl-plan.md)

```markdown
# Implementation Plan — <USER_STORY_ID>

**Based on:** architecture.md, design-review.md, requirements.md
**Planned:** <timestamp>

## Task Breakdown

### Task 1: <Task Title>
- **Component:** <Architecture component>
- **Priority:** 1-Critical / 2-High / 3-Medium / 4-Low
- **Effort:** S / M / L / XL
- **Dependencies:** <Task IDs or "None">
- **Description:** <What to build>
- **Acceptance Criteria:**
  - AC1: <Verification criterion>
  - AC2: <Verification criterion>
- **Files to Create/Modify:**
  - `path/to/file.ext`
  - `tests/test-file.spec.ext`
- **Requirements Addressed:** FR-X, NFR-Y

### Task 2: ...

## Dependency Graph

```
Task 1 → Task 2 → Task 4
Task 1 → Task 3 → Task 5
Task 4 + Task 5 → Task 6
```

## Critical Path

Tasks on critical path (no slack):
1. Task 1
2. Task 2
3. Task 4
4. Task 6

## Task Summary

| ID | Task | Priority | Effort | Dependencies | Requirements |
|----|------|----------|--------|--------------|--------------|
| 1 | Setup | 1 | S | None | All |
| 2 | Core | 1 | L | 1 | FR-1,FR-2 |

## Phases

### Phase A: Foundation (Tasks 1-3)
<Setup, data models, core infrastructure>

### Phase B: Features (Tasks 4-7)
<Main functionality>

### Phase C: Testing & QA (Tasks 8-10)
<Tests, validation, verification>

## Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| <Risk> | High/Med/Low | <Strategy> |

## Out-of-Scope Tasks
- <Deferred items>

---
**Status:** Ready for approval.
**Next Phase:** 05 - Implementation
```

## Planning Principles

- Start with foundational tasks (models, config)
- Group related tasks
- Identify parallel work
- Plan tests alongside features
- Address design review findings
- Trace every task to requirements

## Error Handling

- Cannot plan implementation for requirement → document gap, halt
- Circular dependencies → report, halt
- Unresolved design issues → incorporate from design-review.md

## Success Criteria

- All requirements covered by tasks
- Dependencies clear and feasible
- No circular dependencies
- Critical path identified
- Each task has acceptance criteria

## Integration

- **Called By:** workflow.md
- **Reads:** architecture.md, design-review.md, requirements.md
- **Creates:** impl-plan.md
- **Next Phase:** 05-implementation
