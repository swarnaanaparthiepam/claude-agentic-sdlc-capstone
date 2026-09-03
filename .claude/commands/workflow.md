---
name: workflow
description: Execute the complete 8-phase SDLC workflow with human approval gates
args: <USER_STORY_ID>
---

# SDLC Workflow Command

**Purpose:** Coordinate the 8-phase SDLC pipeline with human approval gates between each phase.

**Usage:** `/workflow <USER_STORY_ID>`

## Overview

This command sequences Phases 00-08, enforcing human approval after every phase. It maintains persistent state in `status.md` and is stateless between invocations.

## Phases

1. **Phase 00: Input** - Retrieve User Story from Jira → user-story.md
2. **Phase 01: Requirements** - Analyze requirements → requirements.md
3. **Phase 02: Architecture** - Design architecture → architecture.md
4. **Phase 03: Design Review** - Review design → design-review.md
5. **Phase 04: Planning** - Create implementation plan → impl-plan.md
6. **Phase 05: Implementation** - Build code and tests → working application
7. **Phase 06: Review** - Code review → review.md
8. **Phase 07: Verification** - Verify and test → verification.md
9. **Phase 08: PR** - Create pull request → GitHub PR

## Execution Logic

### On Each Invocation

1. **Extract User Story ID** from arguments
2. **Initialize or Read** status.md
3. **Check for Pending Approval**
   - If pending: clear it (re-invocation = implicit approval)
   - Mark previous phase complete
   - Advance to next phase
4. **Check for Blockers** - halt if any
5. **Validate Prerequisites** - use artifact-validation skill
6. **Invoke Current Phase Agent** via Agent tool
7. **Validate Output Artifact** created
8. **Update status.md** - set pending approval, update notes
9. **Report to Human** - artifact location, next steps
10. **Halt** - wait for human re-invocation

### State Management

- **State File:** `docs/artifacts/<USER_STORY_ID>/status.md`
- **Phase Tracking:** Completed phases, current phase, pending approval
- **Blocker Tracking:** Blocked phase with reason
- **Status:** IN_PROGRESS → COMPLETE

### Approval Flow

```
/workflow CJS-2   (first time)
  ↓
Phase 00 executes
  ↓
status.md: "Pending Human Approval: 00: Input"
  ↓
Human reviews user-story.md
  ↓
/workflow CJS-2   (approval via re-invocation)
  ↓
Workflow clears approval, marks 00 complete
  ↓
Phase 01 executes
  ↓
status.md: "Pending Human Approval: 01: Requirements"
  ↓
... repeat until Phase 08 complete
```

## Phase Configuration

```javascript
const PHASES = [
  {id: "00", name: "Input", agent: "00-input", artifact: "user-story.md"},
  {id: "01", name: "Requirements", agent: "01-requirements", artifact: "requirements.md"},
  {id: "02", name: "Architecture", agent: "02-architecture", artifact: "architecture.md"},
  {id: "03", name: "Design Review", agent: "03-design-review", artifact: "design-review.md"},
  {id: "04", name: "Planning", agent: "04-planning", artifact: "impl-plan.md"},
  {id: "05", name: "Implementation", agent: "05-implementation", artifact: "code+tests"},
  {id: "06", name: "Review", agent: "06-review", artifact: "review.md"},
  {id: "07", name: "Verification", agent: "07-verification", artifact: "verification.md"},
  {id: "08", name: "PR", agent: "08-pr", artifact: "GitHub PR"}
];
```

## Error Handling

### Missing User Story ID
```
ERROR: User Story ID is required.
Usage: /workflow <USER_STORY_ID>
Example: /workflow CJS-2
```

### Blocked Phase
```
ERROR: Workflow is blocked.
Blocked Phase: <phase> - <reason>
Recovery: Resolve the blocker, clear 'Blocked Phase' in status.md, retry.
```

### Agent Invocation Failed
```
ERROR: Phase agent failed to execute.
Phase: <phase>
Error: <error details>
Recovery: Check agent logs, fix issue, retry workflow.
```

### Artifact Not Created
```
ERROR: Expected artifact not found after phase completion.
Expected: docs/artifacts/<USER_STORY_ID>/<artifact>
Recovery: Re-run phase or investigate agent failure.
```

## Initial Status Creation

When `status.md` doesn't exist, create:

```markdown
# User Story: <USER_STORY_ID>

**Title:** (to be populated by Phase 00)

**Current Phase:** 00: Input

**Completed Phases:**
- [ ] 00: Input
- [ ] 01: Requirements
- [ ] 02: Architecture
- [ ] 03: Design Review
- [ ] 04: Planning
- [ ] 05: Implementation
- [ ] 06: Review
- [ ] 07: Verification
- [ ] 08: PR

**Pending Human Approval:** None

**Blocked Phase:** None

**Status:** IN_PROGRESS

**Last Updated:** <today>

**Notes:**
- Workflow initialized for <USER_STORY_ID> on <today>

**PR Information:** 

**Confluence Status:** 
```

## Completion Behavior

When Phase 08 completes:

```markdown
**Status:** COMPLETE
**Completed Phases:** [All checked]
**Pending Human Approval:** None
**PR Information:** <PR URL>
```

Report:
```
🎉 SDLC COMPLETE for <USER_STORY_ID>

Pull Request: <PR URL>
All artifacts: docs/artifacts/<USER_STORY_ID>/

Next steps:
1. Review and merge PR
2. Publish to Confluence (GitHub Action)
3. Close Jira ticket
```

## Recovery Scenarios

### Resume from Interruption
- Read status.md to determine current phase
- Re-invoke: `/workflow <USER_STORY_ID>`
- Workflow continues from current phase

### Skip Approval (Emergency)
- Manually edit status.md
- Change `Pending Human Approval: None`
- Mark phase as complete
- Re-invoke workflow

### Retry Failed Phase
- Clear `Blocked Phase` in status.md
- Re-invoke workflow
- Phase re-executes

### Rollback to Previous Phase
- Manually edit status.md
- Set current phase to desired phase
- Mark subsequent phases incomplete
- Delete artifacts for subsequent phases
- Re-invoke workflow

## Integration Points

- **Phase Agents:** Invoked via Agent tool with subagent_type
- **Artifact Validation:** Uses artifact-validation skill
- **State Persistence:** status.md file
- **Dashboard:** Monitors status.md for real-time updates
- **GitHub:** Creates PR in Phase 08
- **Confluence:** Published via GitHub Action after PR merge

## Notes

- Workflow is stateless (all state in status.md)
- Human re-invocation = implicit approval
- One phase per invocation
- Never auto-advances
- Safe failure handling
- Clear error messages
- Comprehensive logging in status.md
- Each phase agent can also run independently
