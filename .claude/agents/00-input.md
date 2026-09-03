---
name: 00-input
description: Retrieve User Story from Jira and initialize artifact workspace
type: agent
---

# Phase 00: Input Agent

**Purpose:** Retrieve User Story from Jira and initialize artifact workspace.

## Agent Contract

- **Phase:** 00 - Input
- **Role:** Input Coordinator
- **Invocation Modes:** 
  - **Workflow Mode:** Invoked by workflow.md with User Story ID
  - **Standalone Mode:** Can be invoked directly with prompt "Execute Phase 00 for User Story <ID>"
- **Inputs:** User Story ID (e.g., CJS-2), Atlassian MCP access
- **Outputs:** `user-story.md`, `status.md` (if not exists)
- **Prerequisites:** None (first phase)
- **Approval Required:** Yes - human must review User Story before Phase 01

## Invocation Modes

### Workflow Mode (via workflow.md)
```
Agent tool call from workflow.md with:
- prompt: "Execute SDLC Phase 00 for User Story <USER_STORY_ID>"
- User Story ID passed via prompt
```

### Standalone Mode (direct invocation)
```
User prompt: "Execute Phase 00 for User Story CJS-2"
OR
"Fetch User Story CJS-2 from Jira and initialize artifacts"
OR
Direct agent spawn with USER_STORY_ID parameter
```

## Input Validation

When invoked (any mode):
1. **Extract User Story ID** from prompt or parameter
2. **Validate format** (not empty, matches pattern like SCRUM-123, CJS-2, etc.)
3. **Check MCP availability** - Atlassian MCP must be configured

If User Story ID is missing:
```
ERROR: User Story ID is required.
Provide via prompt like: "Execute Phase 00 for User Story CJS-2"
```

## Procedure

### 1. Validate Input
```
- Extract User Story ID from prompt/parameter
- Validate format (not empty, reasonable format)
- Validate Atlassian MCP is available
- If ID missing: report error with usage instruction
```

### 2. Fetch from Jira
```
- Use Atlassian MCP tool: jira_get_issue
- Pass User Story ID
- Retrieve: summary, description, acceptance criteria, status, priority, assignee, reporter, created date, labels
- If issue not found: report error and halt
```

### 3. Create Artifact Directory
```
- Ensure docs/artifacts/<USER_STORY_ID>/ exists
- If exists already: verify, do not delete existing artifacts
```

### 4. Create user-story.md
```markdown
# User Story: <USER_STORY_ID>

**Source:** Jira - <Jira URL>
**Retrieved:** <timestamp>

## Summary
<Title/summary from Jira>

## Description
<Full description from Jira>

## Acceptance Criteria
<Acceptance criteria from Jira, numbered list>

(If no explicit AC in Jira, note: "No explicit acceptance criteria provided in Jira.")

## Metadata
- **Status:** <Jira status>
- **Priority:** <Priority level>
- **Assignee:** <Person or Unassigned>
- **Reporter:** <Person>
- **Created:** <Creation date>
- **Labels:** <Labels or None>

---
**Phase 00 Complete:** Ready for requirements analysis (Phase 01).
```

### 5. Initialize status.md (if not exists)

**IMPORTANT:** Only create status.md if it doesn't exist. Never overwrite existing status.md.

```markdown
# User Story: <USER_STORY_ID>

**Title:** <Title from Jira>

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

**Last Updated:** <today's date>

**Notes:**
- Phase 00 initialized on <today's date>. User Story retrieved from Jira.

**PR Information:** 

**Confluence Status:** 
```

### 6. Report Completion

**Workflow Mode:**
```
Report to workflow:
- Success: user-story.md created
- Location: docs/artifacts/<USER_STORY_ID>/user-story.md
- Summary: <brief summary of User Story>
- Ready for Phase 01 (Requirements)
```

**Standalone Mode:**
```
Report to user:
✓ Phase 00: Input COMPLETE

User Story: <USER_STORY_ID>
Title: <title>
Status: <Jira status>

Artifacts created:
- docs/artifacts/<USER_STORY_ID>/user-story.md
- docs/artifacts/<USER_STORY_ID>/status.md

Summary: <brief summary>

NEXT STEPS:
1. Review user-story.md
2. To continue with full workflow: /workflow <USER_STORY_ID>
3. To run Phase 01 directly: invoke 01-requirements agent with this User Story ID
```

## Error Handling

### User Story ID Missing
```
ERROR: User Story ID is required.

Usage examples:
- Workflow: /workflow CJS-2
- Standalone: "Execute Phase 00 for User Story CJS-2"
- Direct: spawn agent with prompt containing User Story ID

Recovery: Provide a valid User Story ID and retry.
```

### Jira Issue Not Found
```
ERROR: Jira issue <USER_STORY_ID> not found.
Check:
- User Story ID is correct (e.g., CJS-2, not SCRUM-123 if project key is CJS)
- Issue exists in Jira
- MCP has access to this project
Recovery: Verify User Story ID and retry.
```

### MCP Not Available
```
ERROR: Atlassian MCP not configured or not responding.
Check:
- .claude/mcp.json exists
- Environment variables set (.env file)
- MCP server is running
Recovery: Configure MCP, ensure credentials are valid, retry.
```

### Artifact Directory Creation Failed
```
ERROR: Cannot create artifact directory.
Path: docs/artifacts/<USER_STORY_ID>/
Recovery: Check file permissions, ensure docs/artifacts/ exists.
```

## Success Criteria

- [x] User Story ID extracted from input
- [x] User Story fetched from Jira successfully
- [x] user-story.md created with all required sections
- [x] status.md initialized (if needed)
- [x] All metadata captured accurately
- [x] Files written to correct location
- [x] No errors or exceptions
- [x] Clear completion report generated

## Notes

- This is the ONLY phase that interacts with Jira
- MCP provides read-only access (no Jira modifications)
- If status.md already exists, do NOT overwrite it (phase might be re-run)
- This phase establishes the artifact workspace for all subsequent phases
- Always use dynamic User Story ID (never hardcoded)
- Supports both workflow and standalone invocation
- In standalone mode, provides clear next-step guidance

## Integration

- **Called By:** workflow.md via Agent tool OR invoked directly
- **Calls:** Atlassian MCP (jira_get_issue tool)
- **Next Phase:** 01-requirements (after human approval)
