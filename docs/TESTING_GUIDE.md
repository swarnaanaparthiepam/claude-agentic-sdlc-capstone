# Testing Guide: Agentic SDLC Capstone

This document describes how to test both workflow orchestration and individual agent invocation.

## Test Scenario: CJS-2

**User Story ID:** CJS-2 (from Jira)

## Testing Modes

### Mode 1: Full Workflow Orchestration

Test the complete 8-phase SDLC pipeline with human-in-the-loop approval gates.

**Commands:**

```bash
# Initialize workflow for CJS-2
/workflow CJS-2

# After reviewing Phase 00 output (user-story.md), approve and continue
/workflow CJS-2

# After reviewing Phase 01 output (requirements.md), approve and continue
/workflow CJS-2

# Continue pattern for all 8 phases...
```

**Expected Behavior:**
1. Each invocation runs ONE phase
2. Creates expected artifact in `docs/artifacts/CJS-2/`
3. Updates `docs/artifacts/CJS-2/status.md`
4. Sets "Pending Human Approval" for that phase
5. Reports artifact location and waits
6. Re-invocation clears approval and advances to next phase

**State File:** `docs/artifacts/CJS-2/status.md` tracks:
- Current Phase
- Completed Phases (checkboxes)
- Pending Human Approval
- Blocked Phase (if any)
- Status (IN_PROGRESS → COMPLETE)

### Mode 2: Independent Agent Invocation

Test individual agents without workflow orchestration.

#### Phase 00: Input
```
User prompt: "Execute Phase 00 for User Story CJS-2"
```

**Expected:**
- Fetches CJS-2 from Jira via Atlassian MCP
- Creates `docs/artifacts/CJS-2/user-story.md`
- Creates `docs/artifacts/CJS-2/status.md` (only if doesn't exist)
- Reports completion with next steps
- Does NOT update status.md if it already exists

**Error Cases:**
- No User Story ID provided → Clear error with usage example
- Jira issue not found → Error with recovery steps
- MCP not available → Configuration guidance

#### Phase 01: Requirements
```
User prompt: "Analyze requirements for User Story CJS-2"
```

**Prerequisites:** `docs/artifacts/CJS-2/user-story.md` must exist

**Expected:**
- Reads user-story.md
- Extracts functional and non-functional requirements
- Creates `docs/artifacts/CJS-2/requirements.md`
- Reports completion with next steps
- Does NOT update status.md

**Error Cases:**
- No User Story ID → Clear error
- user-story.md missing → Error with recovery (run Phase 00 or create manually)

#### Phase 02: Architecture
```
User prompt: "Design architecture for User Story CJS-2"
```

**Prerequisites:** 
- `docs/artifacts/CJS-2/requirements.md` must exist

**Expected:**
- Reads requirements.md
- Designs high-level architecture
- Creates `docs/artifacts/CJS-2/architecture.md`
- Reports completion

**Error Cases:**
- requirements.md missing → Error with recovery

#### Phase 03: Design Review
```
User prompt: "Review design for User Story CJS-2"
```

**Prerequisites:**
- `docs/artifacts/CJS-2/architecture.md` must exist

**Expected:**
- Reviews architecture.md
- Identifies risks and issues
- Creates `docs/artifacts/CJS-2/design-review.md`

#### Phase 04: Planning
```
User prompt: "Create implementation plan for User Story CJS-2"
```

**Prerequisites:**
- `docs/artifacts/CJS-2/architecture.md` must exist
- `docs/artifacts/CJS-2/design-review.md` must exist

**Expected:**
- Creates task breakdown
- Maps dependencies
- Creates `docs/artifacts/CJS-2/impl-plan.md`

#### Phase 05: Implementation
```
User prompt: "Implement application for User Story CJS-2"
```

**Prerequisites:**
- `docs/artifacts/CJS-2/requirements.md` must exist
- `docs/artifacts/CJS-2/architecture.md` must exist
- `docs/artifacts/CJS-2/impl-plan.md` must exist

**Expected:**
- Creates application structure
- Implements features per plan
- Writes tests
- Creates feature branch: `feature/CJS-2`
- Reports files created, tests passing

#### Phase 06: Review
```
User prompt: "Review code for User Story CJS-2"
```

**Prerequisites:**
- Feature branch `feature/CJS-2` must exist
- `docs/artifacts/CJS-2/impl-plan.md` must exist

**Expected:**
- Reviews all code changes
- Verifies plan completion
- Checks security, quality, tests
- Creates `docs/artifacts/CJS-2/review.md`

#### Phase 07: Verification
```
User prompt: "Verify implementation for User Story CJS-2"
```

**Prerequisites:**
- Feature branch code + tests exist
- `docs/artifacts/CJS-2/requirements.md` must exist
- `docs/artifacts/CJS-2/review.md` must exist

**Expected:**
- Runs all tests
- Verifies all requirements met
- Performs manual testing
- Creates `docs/artifacts/CJS-2/verification.md`

#### Phase 08: PR
```
User prompt: "Create PR for User Story CJS-2"
```

**Prerequisites:**
- All artifacts 00-07 must exist
- Feature branch `feature/CJS-2` pushed to GitHub
- Verification must show PASS

**Expected:**
- Creates GitHub Pull Request
- PR description includes all artifacts
- Reports PR URL
- Marks workflow COMPLETE (if in workflow mode)

## Validation Checklist

### Workflow Mode
- [ ] Each phase stops for human approval
- [ ] Re-invocation advances to next phase
- [ ] status.md correctly updated after each phase
- [ ] Approval gate prevents skipping phases
- [ ] Blockers halt workflow with clear message
- [ ] Phase 08 marks status as COMPLETE

### Standalone Mode
- [ ] Each agent accepts User Story ID in prompt
- [ ] Agents validate prerequisites before proceeding
- [ ] Clear error messages when prerequisites missing
- [ ] Agents create expected artifacts
- [ ] Agents do NOT update status.md
- [ ] Completion reports include next-step guidance

### Error Handling
- [ ] Missing User Story ID → usage guidance
- [ ] Missing prerequisites → recovery steps
- [ ] MCP unavailable → configuration help
- [ ] Jira issue not found → clear error
- [ ] Artifact validation failure → specific missing items

## Test Artifacts Location

All artifacts for CJS-2 stored in:
```
docs/artifacts/CJS-2/
  ├── status.md            # Workflow state (managed by workflow.md)
  ├── user-story.md        # Phase 00 output
  ├── requirements.md      # Phase 01 output
  ├── architecture.md      # Phase 02 output
  ├── design-review.md     # Phase 03 output
  ├── impl-plan.md         # Phase 04 output
  ├── review.md            # Phase 06 output
  └── verification.md      # Phase 07 output
```

Plus application code in feature branch: `feature/CJS-2`

## Recovery Testing

### Interrupt and Resume (Workflow Mode)
1. Start workflow: `/workflow CJS-2`
2. Complete Phase 00
3. Stop (simulate interruption)
4. Resume: `/workflow CJS-2`
5. **Expected:** Workflow resumes from Phase 01

### Retry Failed Phase
1. Edit status.md: Set `Blocked Phase: 03: Design Review - Test blocker`
2. Run `/workflow CJS-2`
3. **Expected:** Workflow halts with blocker message
4. Edit status.md: Set `Blocked Phase: None`
5. Run `/workflow CJS-2`
6. **Expected:** Workflow retries Phase 03

### Manual Status Manipulation
1. Edit status.md: Mark Phase 02 incomplete
2. Run `/workflow CJS-2`
3. **Expected:** Workflow validates and re-runs Phase 02

## Dashboard Testing

With the Node.js dashboard running:

```bash
npm run dashboard CJS-2
```

**Expected:**
- Dashboard displays current phase
- Real-time updates as workflow progresses
- Completed phases shown with checkmarks
- Current phase highlighted
- Pending approval status visible

## Integration Testing

### Jira MCP Integration
- Phase 00 successfully fetches from Jira
- All metadata captured (status, priority, assignee, etc.)
- Acceptance criteria parsed correctly

### GitHub Integration  
- Feature branch created correctly
- Phase 08 creates PR successfully
- PR description includes all artifacts

### Dashboard Integration
- Monitors status.md file changes
- Updates browser in real-time
- Works independently of Claude Code process

## Performance Testing

### Workflow Mode
- Each phase completes within reasonable time
- No timeout errors
- State persists correctly across invocations

### Standalone Mode
- Prerequisite validation is fast
- Clear error messages appear immediately
- No unnecessary file system operations

## Expected User Experience

### Workflow Mode
```
User: /workflow CJS-2

Claude: ✓ Phase 00: Input COMPLETE
        
        User Story: CJS-2
        Title: [fetched title]
        
        Artifact: docs/artifacts/CJS-2/user-story.md
        
        ACTION REQUIRED:
        1. Review user-story.md
        2. To approve and continue: /workflow CJS-2

User: /workflow CJS-2

Claude: ✓ Phase 01: Requirements COMPLETE
        ...
```

### Standalone Mode
```
User: Execute Phase 01 for User Story CJS-2

Claude: ✓ Phase 01: Requirements COMPLETE
        
        User Story: CJS-2
        Functional Requirements: 5
        Non-Functional Requirements: 3
        
        Artifact: docs/artifacts/CJS-2/requirements.md
        
        NEXT STEPS:
        1. Review requirements.md
        2. To continue workflow: /workflow CJS-2
        3. To run Phase 02 directly: invoke 02-architecture agent
```

## Success Criteria

✅ **Workflow Mode:**
- All 8 phases execute sequentially
- Human approval gates enforced
- status.md correctly maintained
- PR created successfully
- Clear completion message

✅ **Standalone Mode:**
- Each agent runs independently
- Prerequisites validated
- Clear error messages
- Artifacts created correctly
- Next-step guidance provided

✅ **Both Modes:**
- No hard failures or crashes
- Traceability maintained
- Artifacts follow templates
- User Story ID never hardcoded
- Recovery scenarios work
