---
name: run-phase
description: Execute a single SDLC phase for a User Story (standalone mode)
args: <USER_STORY_ID> <PHASE_NUMBER>
---

# Run Single Phase Command

**Purpose:** Execute a specific SDLC phase independently without full workflow orchestration.

**Usage:** `/run-phase <USER_STORY_ID> <PHASE_NUMBER>`

**Examples:**
```bash
/run-phase CJS-2 00    # Run Phase 00: Input
/run-phase CJS-2 01    # Run Phase 01: Requirements
/run-phase CJS-2 05    # Run Phase 05: Implementation
```

## Overview

This command allows you to run individual phases without going through the full workflow. Useful for:
- Re-running a phase after corrections
- Testing phase agents independently
- Skipping workflow orchestration for specific operations
- Development and debugging of phase agents

## How It Works

1. **Extract Arguments**
   - `USER_STORY_ID`: Jira key (e.g., CJS-2, SCRUM-123)
   - `PHASE_NUMBER`: Two-digit phase number (00-08)

2. **Validate Phase Number**
   - Must be 00-08
   - Maps to agent file: `.claude/agents/<PHASE_NUMBER>-*.md`

3. **Check Prerequisites**
   - Validates required input artifacts exist
   - Does NOT check workflow state or approvals
   - Phase agent performs its own prerequisite checks

4. **Invoke Phase Agent**
   - Calls agent in standalone mode
   - Agent extracts User Story ID
   - Agent validates dependencies
   - Agent creates artifact

5. **Report Completion**
   - Shows artifact location
   - Does NOT update status.md
   - Provides next-step guidance

## Phase Mapping

| Phase | Agent | Artifact | Prerequisites |
|-------|-------|----------|---------------|
| 00 | 00-input | user-story.md | Jira MCP access |
| 01 | 01-requirements | requirements.md | user-story.md |
| 02 | 02-architecture | architecture.md | requirements.md |
| 03 | 03-design-review | design-review.md | architecture.md |
| 04 | 04-planning | impl-plan.md | architecture.md, design-review.md |
| 05 | 05-implementation | code + tests | requirements.md, architecture.md, impl-plan.md |
| 06 | 06-review | review.md | implementation artifacts |
| 07 | 07-verification | verification.md | review.md |
| 08 | 08-pr | GitHub PR | all artifacts + code |

## Execution Logic

```python
# Parse arguments
args = parse_command_args()  # e.g., ["CJS-2", "01"]
user_story_id = args[0]
phase_number = args[1]

# Validate phase number
if not phase_number.match(/^0[0-8]$/):
    error("Invalid phase number. Must be 00-08.")
    halt()

# Map to agent
phase_map = {
    "00": "00-input",
    "01": "01-requirements",
    "02": "02-architecture",
    "03": "03-design-review",
    "04": "04-planning",
    "05": "05-implementation",
    "06": "06-review",
    "07": "07-verification",
    "08": "08-pr"
}

agent_name = phase_map[phase_number]

# Invoke agent in standalone mode
try:
    result = agent(
        subagent_type=agent_name,
        description=f"Execute Phase {phase_number} for {user_story_id}",
        prompt=f"Execute SDLC Phase {phase_number} for User Story {user_story_id}. "
               f"Run in STANDALONE MODE (not workflow mode). "
               f"Validate your prerequisites independently. "
               f"Artifacts directory: docs/artifacts/{user_story_id}",
        run_in_background=False
    )
    
    report(f"✓ Phase {phase_number} complete for {user_story_id}\n\n"
           f"Output: {result.artifact_path}\n\n"
           f"Note: This was a standalone execution.\n"
           f"status.md was NOT updated.\n"
           f"To continue full workflow: /run-sdlc-workflow {user_story_id}")
    
except Exception as e:
    error(f"Phase {phase_number} failed: {str(e)}")
    halt()
```

## Key Differences from Full Workflow

| Aspect | `/run-sdlc-workflow` (Full) | `/run-phase` (Standalone) |
|--------|---------------------------|-------------------------|
| **Orchestration** | workflow.md coordinates | Direct agent invocation |
| **State Management** | Updates status.md | Does NOT update status.md |
| **Prerequisites** | Workflow validates | Agent validates |
| **Approval Gates** | Enforced | Bypassed |
| **Use Case** | Production SDLC flow | Development, re-runs, testing |

## Error Handling

### Missing Arguments
```
ERROR: Invalid arguments.
Usage: /run-phase <USER_STORY_ID> <PHASE_NUMBER>
Example: /run-phase CJS-2 01
```

### Invalid Phase Number
```
ERROR: Invalid phase number: 99
Phase number must be 00-08.
Available phases:
  00: Input
  01: Requirements
  02: Architecture
  03: Design Review
  04: Planning
  05: Implementation
  06: Review
  07: Verification
  08: PR
```

### Missing Prerequisites
```
ERROR: Cannot execute Phase 02.
Missing required artifact: docs/artifacts/CJS-2/requirements.md
Recovery: Run Phase 01 first or restore missing artifact.
```

### Agent Execution Failed
```
ERROR: Phase agent failed.
Phase: 01
Error: <error details>
Recovery: Check error message, fix issue, retry.
```

## Examples

### Re-run Requirements After Corrections
```bash
# User story changed, need to update requirements
/run-phase CJS-2 01

# Review updated artifact
cat docs/artifacts/CJS-2/requirements.md

# Continue with workflow if satisfied
/run-sdlc-workflow CJS-2
```

### Test Implementation Phase Independently
```bash
# All prerequisites ready, test implementation
/run-phase CJS-2 05

# Check generated code
ls -la src/

# If good, use workflow to proceed to review
/run-sdlc-workflow CJS-2
```

### Skip to PR Creation (Advanced)
```bash
# All phases complete but PR not created yet
/run-phase CJS-2 08

# PR created, workflow complete
```

## When to Use This Command

### ✅ Good Use Cases
- **Re-running a phase** after fixing issues
- **Testing phase agents** during development
- **Skipping workflow overhead** for quick operations
- **Debugging phase logic** independently
- **Manual phase execution** when workflow is blocked

### ❌ Avoid Using For
- **Normal SDLC flow** - Use `/run-sdlc-workflow` instead
- **Production workflows** - Approval gates are important
- **State tracking** - Use full workflow for status.md updates
- **Traceability** - Full workflow maintains audit trail

## Integration with Full Workflow

You can mix both commands:

```bash
# Start with full workflow
/run-sdlc-workflow CJS-2  # Phase 00 complete

# Continue with workflow
/run-sdlc-workflow CJS-2  # Phase 01 complete

# Oops, found issue in requirements, re-run standalone
/run-phase CJS-2 01       # Fixed requirements.md

# Back to full workflow
/run-sdlc-workflow CJS-2  # Phase 02 executes
```

**Important:** After using `/run-phase`, manually verify the output before continuing with `/run-sdlc-workflow`. The workflow won't know about standalone executions.

## Notes

- **No state updates** - status.md is NOT modified
- **No approval tracking** - Bypasses workflow approval gates
- **Independent validation** - Agent checks its own prerequisites
- **Manual recovery** - User manages workflow state
- **Development tool** - Primarily for testing and debugging
- **Quick operations** - Faster than full workflow for single phases

## Related Commands

- `/run-sdlc-workflow <USER_STORY_ID>` - Full SDLC workflow with approvals
- Direct agent invocation: `"Execute Phase 01 for CJS-2"` - Same as `/run-phase` but more verbose
