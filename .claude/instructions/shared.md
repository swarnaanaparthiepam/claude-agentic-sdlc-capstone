# Agentic SDLC Shared Instructions

## Common Rules for All Phase Agents

### Dynamic User Story IDs
- User Story IDs MUST come from runtime input or Jira MCP
- NEVER hardcode Jira keys, titles, URLs, or example User Story IDs
- All artifacts reference `<USER_STORY_ID>` dynamically

### Artifact Isolation
- Store ALL User Story artifacts under `docs/artifacts/<USER_STORY_ID>/`
- Keep artifacts isolated per User Story
- Do NOT read or modify another story's artifacts unless explicitly requested
- Do NOT create artifacts outside the designated directory

### Traceability
- Preserve traceability from each artifact back to `<USER_STORY_ID>`
- Link requirements to User Story acceptance criteria
- Link architecture to requirements
- Link implementation to architecture and plan
- Link tests to requirements

### No Assumptions
- Do NOT make assumptions about unclear requirements
- Ask focused clarification questions when information is missing
- Record all clarification Q&A in artifacts
- Wait for human responses before proceeding

### Human Approval Gates
- Respect human approval gates
- Do NOT proceed to the next phase while approval is pending
- Only workflow.md manages phase transitions
- Phase agents never self-approve or approve other phases

### Safe Failure
- Fail safely and report clearly
- Document: the blocker, affected phase/artifact, root cause, recovery action
- Then HALT for human intervention
- Do NOT attempt to work around blockers without human direction

### Independent Runnability
- **ALL phase agents support two invocation modes:**
  1. **Workflow Mode:** Invoked by workflow.md with full orchestration
  2. **Standalone Mode:** Invoked directly by users with User Story ID
- Each phase agent validates only the dependencies required for its phase
- Phase agents extract User Story ID from prompt/parameter in standalone mode
- Phase agents validate prerequisite artifacts exist before proceeding
- In workflow mode: assumes prerequisites approved by workflow
- In standalone mode: checks artifacts exist, provides recovery guidance if missing

### Artifact Quality
- Follow artifact templates for consistent structure
- Include all required sections
- Use clear, unambiguous language
- Maintain professional documentation quality

### Do NOT
- Delete or overwrite approved artifacts without explicit human instruction
- Commit fake, sample, or placeholder User Story artifacts
- Hardcode example SCRUM IDs (SCRUM-6, SCRUM-12, etc.)
- Skip validation of prerequisites
- Chain multiple phases without approval
- Modify Jira issues (read-only access)

### Status.md Updates
- **Workflow Mode:** workflow.md manages status.md updates (not phase agents)
- **Standalone Mode:** Phase agents do NOT update status.md (user manages state)
- Phase agents report completion differently per mode:
  - Workflow: Report to workflow (brief summary)
  - Standalone: Report to user (detailed next steps)
- workflow.md validates artifacts and updates state in workflow mode

## Artifact Templates

### status.md Structure
```markdown
# User Story: <USER_STORY_ID>

**Title:** <Title from Jira>

**Current Phase:** XX: Phase Name

**Completed Phases:**
- [X] 00: Input
- [X] 01: Requirements
- [ ] 02: Architecture
...

**Pending Human Approval:** XX: Phase Name OR None

**Blocked Phase:** None OR XX: Phase Name - <reason>

**Status:** IN_PROGRESS OR COMPLETE

**Last Updated:** YYYY-MM-DD

**Notes:**
- Phase 00 complete on YYYY-MM-DD. Retrieved from Jira.
- Phase 01 complete on YYYY-MM-DD. 8 functional requirements identified.
...

**PR Information:** (URL when Phase 08 complete)

**Confluence Status:** (URL and timestamp when published)
```

### User Story Artifact (user-story.md)
```markdown
# User Story: <USER_STORY_ID>

**Source:** Jira - <Jira URL>
**Retrieved:** <timestamp>

## Summary
<Title/summary from Jira>

## Description
<Full description from Jira>

## Acceptance Criteria
1. <AC 1>
2. <AC 2>
...

## Metadata
- **Status:** <Jira status>
- **Priority:** <Priority>
- **Assignee:** <Person>
- **Reporter:** <Person>
- **Created:** <Date>
- **Labels:** <Labels if any>

---
**Phase 00 Complete:** Ready for requirements analysis.
```

### Requirements Artifact (requirements.md)
```markdown
# Requirements — <USER_STORY_ID>

**Source:** docs/artifacts/<USER_STORY_ID>/user-story.md
**Analyzed:** <timestamp>

## Functional Requirements

### FR-1: <Requirement Title>
- **Description:** <Clear, unambiguous description>
- **Acceptance:** <How to verify this requirement is met>
- **Traceability:** Maps to AC-X from User Story

### FR-2: ...

## Non-Functional Requirements

### NFR-1: <Requirement Title>
- **Description:** <Clear specification>
- **Metric:** <How to measure>
- **Traceability:** Maps to <source>

### NFR-2: ...

## Clarifications Requested and Resolved

### Clarification 1
- **Question:** <Original question>
- **Human Response:** <Recorded answer>
- **Resolution:** <How this affects the requirements>

## Out-of-Scope
- <Item 1>
- <Item 2>

## Dependencies
- <External system or team>
- <Data source>

## Traceability
All requirements trace to User Story <USER_STORY_ID>.

---
**Status:** Ready for human approval.
```

## Phase Dependencies

| Phase | Requires | Produces |
|-------|----------|----------|
| 00 | Runtime User Story ID, Jira MCP | user-story.md, status.md |
| 01 | user-story.md | requirements.md |
| 02 | requirements.md | architecture.md |
| 03 | architecture.md | design-review.md |
| 04 | architecture.md, design-review.md | impl-plan.md |
| 05 | requirements.md, architecture.md, impl-plan.md | code + tests |
| 06 | implementation artifacts | review.md |
| 07 | review.md | verification.md |
| 08 | all artifacts | GitHub PR |

## Error Handling

### Missing Prerequisites
```
ERROR: Cannot proceed with Phase XX.
Missing required artifact: docs/artifacts/<USER_STORY_ID>/YY.md
Recovery: Complete Phase YY first, or restore missing artifact.
```

### Unapproved Prerequisites
```
ERROR: Cannot proceed with Phase XX.
Phase YY is not approved yet.
status.md shows: Pending Human Approval: YY: Phase Name
Recovery: Review and approve Phase YY, then retry Phase XX.
```

### Blocked Phase
```
ERROR: Phase XX is blocked.
Blocker: <reason from status.md>
Recovery: Resolve blocker, clear "Blocked Phase" in status.md, then retry.
```

### Artifact Validation Failed
```
ERROR: Phase XX produced invalid artifact.
Missing required sections: <list>
Recovery: Phase XX must regenerate artifact with all required sections.
```

## Workflow Integration

- **Workflow Mode:**
  - Phase agents invoked BY workflow.md via Agent tool
  - Agents receive User Story ID via prompt
  - Agents return completion status and artifact location to workflow
  - Agents report failures/blockers to workflow
  - workflow.md handles all status.md updates
  - workflow.md enforces approval gates

- **Standalone Mode:**
  - Phase agents invoked directly by users
  - Agents extract User Story ID from user prompt
  - Agents validate prerequisites themselves (not via workflow)
  - Agents report completion details to user
  - Agents do NOT update status.md
  - Agents provide clear next-step guidance

## Quality Standards

- Clear, professional documentation
- Complete traceability
- No ambiguous language
- Concrete, measurable criteria
- Evidence-based decisions
- Transparent reasoning
