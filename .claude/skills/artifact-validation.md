# Artifact Validation Skill

**Purpose:** Validate SDLC phase prerequisites, dependencies, and artifact completeness.

## When to Use

Use this skill before running a phase to ensure:
- Required input artifacts exist
- Input artifacts are complete (have all required sections)
- Previous phases are marked as approved in status.md
- No circular dependencies or blockers

## Phase Dependencies

| Phase | ID | Requires | Produces |
|-------|----|---------|-----------| 
| Input | 00 | User Story ID, Jira MCP | user-story.md, status.md |
| Requirements | 01 | user-story.md | requirements.md |
| Architecture | 02 | requirements.md (approved) | architecture.md |
| Design Review | 03 | architecture.md | design-review.md |
| Planning | 04 | architecture.md (approved), design-review.md (approved) | impl-plan.md |
| Implementation | 05 | requirements.md, architecture.md, impl-plan.md (all approved) | code + tests |
| Review | 06 | implementation code/tests | review.md |
| Verification | 07 | review.md (approved), code + tests | verification.md |
| PR | 08 | all artifacts 00-07 (all approved) | GitHub PR |

## Validation Procedure

### Input Parameters
- `user_story_id` - The User Story ID (e.g., SCRUM-123)
- `phase_id` - The phase to validate (00-08)

### Steps

1. **Validate Artifact Directory Exists**
```python
artifact_dir = f"docs/artifacts/{user_story_id}"
if not exists(artifact_dir):
    return {
        "passed": False,
        "reason": f"Artifact directory does not exist: {artifact_dir}",
        "recovery": "Run Phase 00 (Input) first to initialize artifacts."
    }
```

2. **Validate status.md Exists**
```python
status_file = f"{artifact_dir}/status.md"
if not exists(status_file):
    return {
        "passed": False,
        "reason": "status.md not found",
        "recovery": "Run Phase 00 (Input) to create status.md, or manually create it."
    }

status = read_status_md(status_file)
```

3. **Check for Blocked Phase**
```python
if status["Blocked Phase"] != "None":
    return {
        "passed": False,
        "reason": f"Workflow is blocked: {status['Blocked Phase']}",
        "recovery": "Resolve the blocker, clear 'Blocked Phase' in status.md, then retry."
    }
```

4. **Validate Phase-Specific Prerequisites**

#### Phase 00 (Input)
```python
# No prerequisites (first phase)
return {"passed": True}
```

#### Phase 01 (Requirements)
```python
# Requires: user-story.md
if not exists(f"{artifact_dir}/user-story.md"):
    return {
        "passed": False,
        "reason": "user-story.md not found",
        "recovery": "Run Phase 00 (Input) to fetch User Story from Jira."
    }

# Check Phase 00 is complete (not necessarily approved yet)
if not status["Completed Phases"]["00"]:
    return {
        "passed": False,
        "reason": "Phase 00 (Input) not complete",
        "recovery": "Complete Phase 00 first."
    }

return {"passed": True}
```

#### Phase 02 (Architecture)
```python
# Requires: requirements.md (approved)
if not exists(f"{artifact_dir}/requirements.md"):
    return {
        "passed": False,
        "reason": "requirements.md not found",
        "recovery": "Run Phase 01 (Requirements) first."
    }

if not status["Completed Phases"]["01"]:
    return {
        "passed": False,
        "reason": "Phase 01 (Requirements) not approved yet",
        "recovery": "Review and approve requirements.md, then retry."
    }

return {"passed": True}
```

#### Phase 03 (Design Review)
```python
# Requires: architecture.md
if not exists(f"{artifact_dir}/architecture.md"):
    return {
        "passed": False,
        "reason": "architecture.md not found",
        "recovery": "Run Phase 02 (Architecture) first."
    }

if not status["Completed Phases"]["02"]:
    return {
        "passed": False,
        "reason": "Phase 02 (Architecture) not approved yet",
        "recovery": "Review and approve architecture.md, then retry."
    }

return {"passed": True}
```

#### Phase 04 (Planning)
```python
# Requires: architecture.md (approved), design-review.md (approved)
required_artifacts = ["architecture.md", "design-review.md"]
for artifact in required_artifacts:
    if not exists(f"{artifact_dir}/{artifact}"):
        return {
            "passed": False,
            "reason": f"{artifact} not found",
            "recovery": f"Complete phase that creates {artifact}."
        }

required_phases = ["02", "03"]
for phase in required_phases:
    if not status["Completed Phases"][phase]:
        return {
            "passed": False,
            "reason": f"Phase {phase} not approved yet",
            "recovery": f"Approve Phase {phase} before continuing."
        }

return {"passed": True}
```

#### Phase 05 (Implementation)
```python
# Requires: requirements.md, architecture.md, impl-plan.md (all approved)
required_artifacts = ["requirements.md", "architecture.md", "impl-plan.md"]
for artifact in required_artifacts:
    if not exists(f"{artifact_dir}/{artifact}"):
        return {
            "passed": False,
            "reason": f"{artifact} not found",
            "recovery": f"Complete phase that creates {artifact}."
        }

required_phases = ["01", "02", "04"]
for phase in required_phases:
    if not status["Completed Phases"][phase]:
        return {
            "passed": False,
            "reason": f"Phase {phase} not approved yet",
            "recovery": f"Approve Phase {phase} before starting implementation."
        }

return {"passed": True}
```

#### Phase 06 (Review)
```python
# Requires: implementation code/tests (Phase 05 complete)
if not status["Completed Phases"]["05"]:
    return {
        "passed": False,
        "reason": "Phase 05 (Implementation) not complete",
        "recovery": "Complete and approve implementation first."
    }

# Note: Code/tests are in repo, not artifact directory
return {"passed": True}
```

#### Phase 07 (Verification)
```python
# Requires: review.md (approved)
if not exists(f"{artifact_dir}/review.md"):
    return {
        "passed": False,
        "reason": "review.md not found",
        "recovery": "Run Phase 06 (Review) first."
    }

if not status["Completed Phases"]["06"]:
    return {
        "passed": False,
        "reason": "Phase 06 (Review) not approved yet",
        "recovery": "Review and approve review.md, then retry."
    }

return {"passed": True}
```

#### Phase 08 (PR)
```python
# Requires: all artifacts 00-07 (all approved)
required_artifacts = [
    "user-story.md",
    "requirements.md",
    "architecture.md",
    "design-review.md",
    "impl-plan.md",
    "review.md",
    "verification.md"
]

for artifact in required_artifacts:
    if not exists(f"{artifact_dir}/{artifact}"):
        return {
            "passed": False,
            "reason": f"{artifact} not found",
            "recovery": f"Complete phase that creates {artifact}."
        }

required_phases = ["00", "01", "02", "03", "04", "05", "06", "07"]
for phase in required_phases:
    if not status["Completed Phases"][phase]:
        return {
            "passed": False,
            "reason": f"Phase {phase} not approved yet",
            "recovery": f"Approve Phase {phase} before creating PR."
        }

return {"passed": True}
```

## Artifact Completeness Checks

### User Story (user-story.md)
Required sections:
- Summary
- Description
- Acceptance Criteria
- Metadata (Status, Priority, etc.)

### Requirements (requirements.md)
Required sections:
- Functional Requirements (at least one)
- Non-Functional Requirements (at least one)
- Traceability to User Story

### Architecture (architecture.md)
Required sections:
- High-Level Architecture Overview
- Components (at least one)
- Data Flow
- Non-Functional Requirements Addressed

### Design Review (design-review.md)
Required sections:
- Review Summary
- Findings (if any)
- Recommendations
- Approval Status

### Implementation Plan (impl-plan.md)
Required sections:
- Task Breakdown (at least one task)
- Dependencies
- Critical Path
- Task Summary Table

### Code Review (review.md)
Required sections:
- Review Summary
- Plan Completion Verification
- Code Quality Review
- Status (ready/needs changes/blocked)

### Verification (verification.md)
Required sections:
- Verification Results
- Requirements Coverage
- Test Results
- Status (pass/fail)

## Usage in Workflow

```python
# Before invoking phase agent
validation = validate_phase_prerequisites(user_story_id, phase_id)

if not validation["passed"]:
    # Block workflow
    status["Blocked Phase"] = f"{phase_id}: {validation['reason']}"
    write_status_md(status_file, status)
    report(f"ERROR: {validation['reason']}\nRecovery: {validation['recovery']}")
    halt()

# Proceed with phase
```

## Return Format

```python
{
    "passed": True/False,
    "reason": "Description of validation failure (if any)",
    "recovery": "Suggested recovery action (if validation failed)"
}
```

## Notes

- This skill is called BY workflow.md (not by phase agents)
- Validation is strict: all prerequisites must exist and be approved
- Clear error messages guide recovery
- Prevents phases from running with missing inputs
- Ensures SDLC sequence integrity
