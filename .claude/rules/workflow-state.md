# Workflow State Management Rules

## Single Source of Truth

**Primary State File:**
```
docs/artifacts/<USER_STORY_ID>/status.md
```

This file is the **ONLY** authoritative source for workflow state.

## State Schema

### Required Fields
```yaml
User Story ID: <ID>
Status: <PENDING_APPROVAL|IN_PROGRESS|COMPLETE|BLOCKED>
Current Phase: <00-08>
Completed Phases: [list]
Pending Approval: <Phase X|None>
Blocked Phase: <Phase X - reason|None>
Last Updated: <timestamp>
```

### Status Values

#### PENDING_APPROVAL
- Workflow waiting for human approval
- Cannot auto-advance
- Re-invoking workflow = approval signal

#### IN_PROGRESS
- Phase currently executing
- Workflow active
- May be interrupted and resumed

#### COMPLETE
- All 8 phases finished
- PR created
- Workflow ended (no further phases)

#### BLOCKED
- Cannot proceed due to issue
- Requires human intervention
- Must be manually unblocked

## State Transitions

### Phase Completion
```
IN_PROGRESS → Phase completes → PENDING_APPROVAL
```

### Approval
```
PENDING_APPROVAL → Human reviews → Re-invoke workflow → IN_PROGRESS (next phase)
```

### Blocking
```
IN_PROGRESS → Error/Issue → BLOCKED
```

### Unblocking
```
BLOCKED → Human fixes → Update status.md → IN_PROGRESS
```

### Completion
```
IN_PROGRESS (Phase 08) → PR created → COMPLETE
```

## Update Responsibilities

### Workflow Commands (ONLY)
- Updates `status.md` after each phase
- Records completed phases
- Sets pending approval state
- Detects and clears approval on re-invocation
- Marks workflow as COMPLETE

### Phase Agents (NEVER)
- Do NOT update `status.md`
- Do NOT manage workflow state
- Do NOT advance phases
- Only create their specific artifacts

## State Persistence

### Across Sessions
- State persists in `status.md` file
- Claude Code sessions can close/restart
- Workflow resumes from saved state
- No in-memory state required

### Concurrent Safety
- One workflow per User Story at a time
- Status file acts as lock
- Check status before starting new phase

## Validation Rules

### Before Phase Execution
1. Verify `status.md` exists
2. Check `Current Phase` matches expected
3. Ensure no `BLOCKED` status
4. Validate prerequisites from previous phases

### After Phase Execution
1. Update `Completed Phases` list
2. Set `PENDING_APPROVAL` status
3. Update `Last Updated` timestamp
4. Write notes if needed

## Recovery Procedures

### Missing status.md
```bash
# Re-run Phase 00 to recreate
/run-sdlc-workflow <USER_STORY_ID>
```

### Corrupted status.md
1. Read from git history: `git log docs/artifacts/<ID>/status.md`
2. Restore last known good state
3. Resume workflow

### State Mismatch
1. Read `status.md` to determine truth
2. Check filesystem for actual artifacts
3. Reconcile and update `status.md`
4. Resume from actual state

## Anti-Patterns (DO NOT)

❌ **Store state in memory**
- Always read from `status.md`
- Never assume state from previous turn

❌ **Skip state updates**
- Every phase must update state
- Even if phase fails

❌ **Auto-approve phases**
- Must wait for human re-invocation
- No automatic advancement

❌ **Modify state from agents**
- Only workflow commands update state
- Agents are stateless

❌ **Hardcode phase progression**
- Always read current phase from `status.md`
- Never assume "next" phase

## Example State File

```markdown
# Workflow Status: CJS-2

**User Story ID:** CJS-2

**Status:** PENDING_APPROVAL

**Current Phase:** 02-Architecture

**Completed Phases:**
- Phase 00: Input ✓
- Phase 01: Requirements ✓
- Phase 02: Architecture ✓

**Pending Approval:** Phase 02 - Architecture

**Blocked Phase:** None

**Last Updated:** 2026-09-07T14:30:00Z

## Notes
- Architecture approved by tech lead
- Ready to proceed to Phase 03
```

## Dashboard Integration

The monitoring dashboard:
- Reads `status.md` (read-only)
- Watches file for changes (chokidar)
- Updates UI in real-time
- Never modifies state
- Independent of Claude Code

Dashboard polls or watches for state changes but never writes.
