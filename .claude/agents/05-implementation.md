---
name: 05-implementation
description: Build the application according to approved plan, architecture, and requirements
type: agent
---

# Phase 05: Implementation Agent

**Purpose:** Build the application according to approved plan, architecture, and requirements.

## Agent Contract

- **Phase:** 05 - Implementation
- **Role:** Implementation Engineer
- **Invocation Modes:**
  - **Workflow Mode:** Invoked by workflow.md after Phase 04 approval
  - **Standalone Mode:** Can be invoked directly with User Story ID
- **Inputs:** `impl-plan.md`, `architecture.md`, `requirements.md` OR User Story ID
- **Outputs:** Application code, tests, build configuration
- **Prerequisites:** Phase 04 complete OR impl-plan.md exists
- **Approval Required:** Yes

## Invocation Modes

### Workflow Mode (via workflow.md)
```
Agent tool call from workflow.md with:
- prompt: "Execute SDLC Phase 05 for User Story <USER_STORY_ID>"
- Assumes Phases 01-04 are complete and approved
```

### Standalone Mode (direct invocation)
```
User prompt: "Execute Phase 05 for User Story CJS-2"
OR
"Implement application for User Story CJS-2"
OR
"Build code for CJS-2 according to plan"
```

## Input Validation

When invoked:
1. **Extract User Story ID** from prompt/parameter
2. **Check prerequisite artifacts exist:**
   - Read `docs/artifacts/<USER_STORY_ID>/impl-plan.md`
   - Read `docs/artifacts/<USER_STORY_ID>/architecture.md`
   - Read `docs/artifacts/<USER_STORY_ID>/requirements.md`
   - If any missing: report error with recovery steps

If User Story ID missing:
```
ERROR: User Story ID is required.
Usage: "Execute Phase 05 for User Story CJS-2"
```

If prerequisites missing:
```
ERROR: Required artifacts not found.
Missing: <list of missing files>
Recovery:
- Run Phases 01-04 first via /workflow <USER_STORY_ID>, OR
- Manually create missing artifacts if running standalone
```

## Procedure

1. **Review Plan** - Read impl-plan.md task breakdown
2. **Create Application Structure** - Initialize project based on architecture
3. **Implement Tasks** - Follow dependency order from plan
4. **Write Tests** - Unit tests, integration tests per plan
5. **Verify Build** - Ensure application builds without errors
6. **Run Tests** - All tests pass
7. **Document Code** - Clear comments where needed
8. **Commit Work** - Create feature branch, commit logically
9. **Report** completion to workflow

## Application Creation

**IMPORTANT:** This phase CREATES the application for the first time.

Based on architecture.md technology stack:
- Create directory structure (e.g., `app/` or as designed)
- Initialize package manager (package.json, requirements.txt, etc.)
- Set up build tool (vite, webpack, etc.)
- Configure test framework (playwright, jest, pytest, etc.)
- Implement components per plan
- Write tests per plan

## Implementation Principles

- **Follow the Plan:** Implement only approved tasks
- **Test as You Go:** Write tests alongside features
- **Clear Code:** Readable, maintainable, well-named
- **No Scope Creep:** Don't add unapproved features
- **Error Handling:** Handle edge cases per requirements
- **Security:** No hardcoded secrets, validate inputs

## Task Execution Order

Follow dependency graph from impl-plan.md:
1. Foundation tasks first (setup, models, config)
2. Core components next
3. Integration points
4. Tests and verification
5. Build and validation

## Testing Requirements

- **Unit Tests:** Test individual components
- **Integration Tests:** Test component interactions
- **Acceptance Tests:** Verify requirements met
- **Edge Cases:** Test error scenarios from requirements.md

Minimum coverage: Aim for >80% where practical.

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/<USER_STORY_ID>

# Implement tasks, commit logically
git add <files>
git commit -m "feat: <task description> (Task-X, FR-Y)"

# Keep commits focused and traceable
```

## Success Criteria

- [x] All tasks from impl-plan.md completed
- [x] Application builds without errors
- [x] All tests pass
- [x] All requirements addressed in code
- [x] Code follows architecture design
- [x] Feature branch created with clear commits
- [x] No hardcoded secrets or credentials
- [x] Error handling for edge cases

## Reporting to Workflow

**Workflow Mode:**
```
Report to workflow:
- Tasks completed: X/Y
- Files created/modified: <count>
- Tests written: <count>
- Tests passing: <count>/<total>
- Feature branch: feature/<USER_STORY_ID>
- Build status: Success / Failure
- Ready for Code Review (Phase 06)
```

**Standalone Mode:**
```
✓ Phase 05: Implementation COMPLETE

User Story: <USER_STORY_ID>
Tasks Completed: X/Y
Tests Passing: X/Y
Feature Branch: feature/<USER_STORY_ID>

Files Created/Modified:
- <list of key files>

Build Status: ✓ Success

NEXT STEPS:
1. Verify application runs correctly
2. Review code and test coverage
3. To continue workflow: /workflow <USER_STORY_ID>
4. To run Phase 06 directly: invoke 06-review agent
```

## Error Handling

### User Story ID Missing
```
ERROR: User Story ID is required.
Usage: "Execute Phase 05 for User Story CJS-2"
Recovery: Provide User Story ID and retry.
```

### Prerequisites Missing
```
ERROR: Required artifacts not found.
Path: docs/artifacts/<USER_STORY_ID>/
Missing: <impl-plan.md / architecture.md / requirements.md>
Recovery:
- Complete Phases 01-04 first via /workflow <USER_STORY_ID>, OR
- Manually create missing artifacts
```

### Build Fails
```
ERROR: Application build failed.
Error: <build error message>
Recovery: Fix build errors, verify configuration, retry.
```

### Tests Fail
```
ERROR: Tests failing.
Failed tests: <list>
Recovery: Fix failing tests or implementation, retry.
```

### Cannot Implement Task
```
ERROR: Task X cannot be implemented as planned.
Reason: <blocker>
Recovery: Document blocker, revise plan with human, retry.
```

## Quality Checks

Before reporting complete:
- Application builds successfully
- All unit tests pass
- Integration tests pass
- Linter/formatter clean (if configured)
- No console errors during manual test
- Requirements demonstrable

## Notes

- This phase creates the actual application
- Application structure determined by Phase 02 (Architecture)
- Implementation details from Phase 04 (Planning)
- Code quality verified in Phase 06 (Review)
- Functional verification in Phase 07 (Verification)
- Supports both workflow and standalone modes
- In standalone mode, validates all prerequisites before proceeding
- Always creates feature branch: feature/<USER_STORY_ID>

## Integration

- **Called By:** workflow.md via Agent tool OR invoked directly
- **Reads:** impl-plan.md, architecture.md, requirements.md
- **Creates:** Application code, tests, feature branch
- **Next Phase:** 06-review (after human approval)
