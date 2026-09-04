# Agentic SDLC Workflow

**Purpose:** Coordinates the 8-phase SDLC pipeline with human approval gates between each phase.

**Entry Point:** `/workflow <USER_STORY_ID>`

## Overview

This workflow sequences Phases 00-08, enforcing human approval after every phase. It maintains persistent state in `status.md` and is stateless between invocations.

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

**Note:** Confluence publishing is handled automatically by GitHub Actions when the PR is opened, synchronized, or reopened (not part of the SDLC phases).

## Coordination Logic

### Inputs
- `<USER_STORY_ID>` - Jira issue key (e.g., SCRUM-123)

### State File
- `docs/artifacts/<USER_STORY_ID>/status.md`

### Execution Flow

```
START /workflow <USER_STORY_ID>
  ↓
READ or CREATE status.md
  ↓
DETERMINE current phase from status.md
  ↓
CHECK for pending approval
  ↓
  YES → Clear approval (re-invocation = approval)
  NO → Continue
  ↓
VALIDATE prerequisites for current phase
  ↓
INVOKE phase agent via Agent tool
  ↓
WAIT for agent completion
  ↓
VALIDATE expected artifact exists
  ↓
UPDATE status.md:
  - Mark previous phase complete
  - Set current phase
  - Set pending approval
  - Append notes
  ↓
REPORT to human:
  "Phase X complete. Review artifact at <path>.
   To approve and continue: /workflow <USER_STORY_ID>"
  ↓
HALT (wait for human re-invocation)
```

## Detailed Procedure

### 1. Initialize State

```python
user_story_id = <argument from /workflow command>
artifact_dir = f"docs/artifacts/{user_story_id}"
status_file = f"{artifact_dir}/status.md"

# Ensure directory exists
if not exists(artifact_dir):
    create_directory(artifact_dir)

# Read or create status
if exists(status_file):
    status = read_status_md(status_file)
else:
    status = create_initial_status(user_story_id)
    write_status_md(status_file, status)
```

### 2. Determine Current Phase

```python
# Phase sequence
phases = [
    {"id": "00", "name": "Input", "agent": "00-input", "artifact": "user-story.md"},
    {"id": "01", "name": "Requirements", "agent": "01-requirements", "artifact": "requirements.md"},
    {"id": "02", "name": "Architecture", "agent": "02-architecture", "artifact": "architecture.md"},
    {"id": "03", "name": "Design Review", "agent": "03-design-review", "artifact": "design-review.md"},
    {"id": "04", "name": "Planning", "agent": "04-planning", "artifact": "impl-plan.md"},
    {"id": "05", "name": "Implementation", "agent": "05-implementation", "artifact": "code+tests"},
    {"id": "06", "name": "Review", "agent": "06-review", "artifact": "review.md"},
    {"id": "07", "name": "Verification", "agent": "07-verification", "artifact": "verification.md"},
    {"id": "08", "name": "PR", "agent": "08-pr", "artifact": "GitHub PR"}
]

current_phase_id = status["Current Phase"].split(":")[0]  # e.g., "02"
current_phase = find_phase_by_id(current_phase_id)
```

### 3. Check Approval Status

```python
pending_approval = status["Pending Human Approval"]

if pending_approval != "None":
    # Human re-invoked workflow = implicit approval
    phase_to_approve = pending_approval.split(":")[0]
    
    # Mark phase as complete
    status["Completed Phases"][phase_to_approve] = True
    
    # Clear pending approval
    status["Pending Human Approval"] = "None"
    
    # Append approval note
    status["Notes"].append(f"Phase {phase_to_approve} approved by human on {today()}")
    
    # Move to next phase
    next_phase_index = int(phase_to_approve) + 1
    if next_phase_index < len(phases):
        current_phase = phases[next_phase_index]
        status["Current Phase"] = f"{current_phase['id']}: {current_phase['name']}"
    else:
        # All phases complete
        status["Status"] = "COMPLETE"
        report("All phases complete. PR created. Workflow finished.")
        return
    
    # Save updated status
    write_status_md(status_file, status)
```

### 4. Check for Blocked Phase

```python
if status["Blocked Phase"] != "None":
    report(f"ERROR: Workflow blocked.\n"
           f"Blocked Phase: {status['Blocked Phase']}\n"
           f"Resolution: Address blocker, clear 'Blocked Phase' in status.md, then re-invoke workflow.")
    halt()
```

### 5. Validate Prerequisites

```python
# Use artifact-validation skill
validation_result = validate_phase_prerequisites(user_story_id, current_phase["id"])

if not validation_result.passed:
    status["Blocked Phase"] = f"{current_phase['id']}: {validation_result.reason}"
    write_status_md(status_file, status)
    report(f"ERROR: Cannot proceed with Phase {current_phase['id']}.\n"
           f"Reason: {validation_result.reason}\n"
           f"Recovery: {validation_result.recovery}")
    halt()
```

### 6. Invoke Phase Agent

```python
try:
    # Spawn phase agent via Claude Code Agent tool
    agent_result = agent(
        name=current_phase["agent"],
        description=f"Execute Phase {current_phase['id']}: {current_phase['name']}",
        prompt=f"Execute SDLC Phase {current_phase['id']} for User Story {user_story_id}. "
               f"Follow the agent contract in .claude/agents/{current_phase['agent']}.md. "
               f"Artifacts directory: {artifact_dir}",
        run_in_background=False  # Wait for completion
    )
    
    if agent_result.error:
        raise Exception(agent_result.error)
        
except Exception as e:
    status["Blocked Phase"] = f"{current_phase['id']}: Agent execution failed - {str(e)}"
    write_status_md(status_file, status)
    report(f"ERROR: Phase {current_phase['id']} agent failed.\n"
           f"Error: {str(e)}\n"
           f"Recovery: Check agent logs, fix issue, retry workflow.")
    halt()
```

### 7. Validate Artifact Created

```python
# Check expected artifact exists
artifact_path = f"{artifact_dir}/{current_phase['artifact']}"

if current_phase["artifact"] != "code+tests" and current_phase["artifact"] != "GitHub PR":
    if not exists(artifact_path):
        status["Blocked Phase"] = f"{current_phase['id']}: Expected artifact not created"
        write_status_md(status_file, status)
        report(f"ERROR: Phase {current_phase['id']} did not create expected artifact.\n"
               f"Expected: {artifact_path}\n"
               f"Recovery: Re-run phase or investigate agent failure.")
        halt()
```

### 8. Update Status and Set Approval Gate

```python
# Update status.md
status["Current Phase"] = f"{current_phase['id']}: {current_phase['name']}"
status["Pending Human Approval"] = f"{current_phase['id']}: {current_phase['name']}"
status["Last Updated"] = today()
status["Notes"].append(
    f"Phase {current_phase['id']} complete on {today()}. "
    f"Artifact: {current_phase['artifact']}"
)

write_status_md(status_file, status)
```

### 9. Report and Halt

```python
report(
    f"✓ Phase {current_phase['id']}: {current_phase['name']} COMPLETE\n\n"
    f"Artifact created: {artifact_path}\n"
    f"Status: {status_file}\n\n"
    f"ACTION REQUIRED:\n"
    f"1. Review the artifact carefully\n"
    f"2. Verify completeness and quality\n"
    f"3. When ready to proceed: /workflow {user_story_id}\n\n"
    f"(Re-invoking the workflow = approval of this phase)"
)

halt()
```

## Initial Status Creation

```python
def create_initial_status(user_story_id):
    return {
        "User Story ID": user_story_id,
        "Title": "(to be populated by Phase 00)",
        "Current Phase": "00: Input",
        "Completed Phases": {
            "00": False, "01": False, "02": False, "03": False,
            "04": False, "05": False, "06": False, "07": False, "08": False
        },
        "Pending Human Approval": "None",
        "Blocked Phase": "None",
        "Status": "IN_PROGRESS",
        "Last Updated": today(),
        "Notes": [f"Workflow initialized for {user_story_id} on {today()}"],
        "PR Information": "",
        "Confluence Status": "(Published automatically by GitHub Actions when PR is opened)"

    }
```

## Error Handling

### Missing User Story ID
```
ERROR: User Story ID is required.
Usage: /workflow <USER_STORY_ID>
Example: /workflow SCRUM-123
```

### Invalid Phase
```
ERROR: Invalid phase ID in status.md.
Current Phase: <value>
Expected: 00-08
Recovery: Manually correct status.md or reinitialize.
```

### Agent Invocation Failed
```
ERROR: Failed to invoke phase agent.
Phase: XX
Agent: XX-agent-name
Error: <error message>
Recovery: Check agent file exists, verify format, retry.
```

### Artifact Validation Failed
```
ERROR: Expected artifact not found after phase completion.
Phase: XX
Expected: docs/artifacts/<USER_STORY_ID>/XX.md
Recovery: Re-run phase or manually create artifact.
```

## Completion Behavior

When Phase 08 completes:
```python
status["Status"] = "COMPLETE"
status["Completed Phases"]["08"] = True
status["Pending Human Approval"] = "None"
status["PR Information"] = agent_result.pr_url

write_status_md(status_file, status)

report(
    f"🎉 SDLC COMPLETE for {user_story_id}\n\n"
    f"Pull Request: {agent_result.pr_url}\n"
    f"All artifacts: {artifact_dir}\n\n"
    f"Next steps:\n"
    f"1. Review and merge PR\n"
    f"2. Confluence publishing happens automatically via GitHub Actions when the PR is opened, synchronized, or reopened\n"
    f"3. Close Jira ticket\n"
)
```

## Recovery Scenarios

### Resume from Interruption
- Read status.md to determine current phase
- Re-invoke: `/workflow <USER_STORY_ID>`
- Workflow continues from current phase

### Skip Approval (Emergency)
- Manually edit status.md
- Change `Pending Human Approval: None`
- Mark phase as complete in `Completed Phases`
- Re-invoke workflow

### Retry Failed Phase
- Clear `Blocked Phase` in status.md
- Re-invoke workflow
- Phase re-executes

### Rollback to Previous Phase
- Manually edit status.md
- Set current phase to desired phase
- Mark subsequent phases as incomplete
- Delete artifacts for subsequent phases
- Re-invoke workflow

## Integration Points

### With Phase Agents
- Workflow invokes agents via Agent tool
- Agents are stateless and independently testable
- Agents follow contracts in `.claude/agents/*.md`

### With Dashboard
- Dashboard reads status.md independently
- Workflow updates trigger dashboard refresh
- Dashboard displays current state in real-time

### With GitHub Actions
- Workflow creates PR (Phase 08)
- Opening the PR triggers Confluence publishing
- Synchronizing the PR triggers Confluence publishing
- Reopening the PR triggers Confluence publishing
- GitHub Actions publish to Confluence
- Confluence publication status is reported in the GitHub Actions workflow summary

## Notes

- Workflow is stateless (all state in status.md)
- Human re-invocation = implicit approval
- One phase per invocation
- Never auto-advances
- Safe failure handling
- Clear error messages
- Comprehensive logging in status.md
