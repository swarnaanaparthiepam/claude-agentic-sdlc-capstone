# Quick Start Guide: Agentic SDLC

## Two Ways to Use This System

### 🔄 Full Workflow Mode (Recommended)
Complete 8-phase SDLC with human-in-the-loop approval gates.

```bash
# Start workflow for Jira issue CJS-2
/workflow CJS-2

# Review Phase 00 output: docs/artifacts/CJS-2/user-story.md
# When satisfied, approve and continue:
/workflow CJS-2

# Review Phase 01 output: docs/artifacts/CJS-2/requirements.md
# Approve and continue:
/workflow CJS-2

# Repeat for all 8 phases
```

**Workflow manages:**
- ✓ Phase sequencing
- ✓ Prerequisite validation
- ✓ Approval gates
- ✓ State tracking (status.md)
- ✓ Error handling

---

### 🎯 Standalone Mode (Advanced)
Run individual phases directly for debugging or flexibility.

```bash
# Phase 00: Fetch from Jira
"Execute Phase 00 for User Story CJS-2"

# Phase 01: Requirements analysis
"Analyze requirements for CJS-2"

# Phase 02: Architecture design
"Design architecture for CJS-2"

# Phase 03: Design review
"Review design for CJS-2"

# Phase 04: Implementation planning
"Create implementation plan for CJS-2"

# Phase 05: Code implementation
"Implement application for CJS-2"

# Phase 06: Code review
"Review code for CJS-2"

# Phase 07: Verification & testing
"Verify implementation for CJS-2"

# Phase 08: Create PR
"Create PR for CJS-2"
```

**Standalone mode:**
- ✓ Validates prerequisites independently
- ✓ Clear error messages if missing dependencies
- ✓ Does NOT update status.md (manual tracking)
- ✓ Provides next-step guidance

---

## Prerequisites

### Required
- ✅ Atlassian MCP configured (`.claude/mcp.json` + `.env`)
- ✅ Valid Jira credentials with access to CJS project
- ✅ Git repository initialized
- ✅ GitHub repository configured (for Phase 08)

### Optional
- GitHub CLI (`gh`) installed (for automated PR creation in Phase 08)
- Dashboard: `npm run dashboard CJS-2` (real-time monitoring)

---

## Artifacts Created

Each phase creates artifacts in `docs/artifacts/<USER_STORY_ID>/`:

| Phase | Artifact | Description |
|-------|----------|-------------|
| 00 | `user-story.md` | Jira User Story details |
| 00 | `status.md` | Workflow state tracking |
| 01 | `requirements.md` | Functional & non-functional requirements |
| 02 | `architecture.md` | High-level design |
| 03 | `design-review.md` | Design review findings |
| 04 | `impl-plan.md` | Implementation plan with tasks |
| 05 | Code + Tests | Feature branch: `feature/<USER_STORY_ID>` |
| 06 | `review.md` | Code review report |
| 07 | `verification.md` | Test results and verification |
| 08 | GitHub PR | Pull request with all artifacts |

---

## Example: CJS-2 Full Workflow

```bash
# Step 1: Initialize
/workflow CJS-2

✓ Phase 00: Input COMPLETE
Artifact: docs/artifacts/CJS-2/user-story.md
ACTION REQUIRED: Review and approve

# Step 2: Review user-story.md, then approve
/workflow CJS-2

✓ Phase 01: Requirements COMPLETE
Functional Requirements: 5
Non-Functional Requirements: 3
Artifact: docs/artifacts/CJS-2/requirements.md
ACTION REQUIRED: Review and approve

# Step 3: Review requirements.md, then approve
/workflow CJS-2

✓ Phase 02: Architecture COMPLETE
Components: 3
Artifact: docs/artifacts/CJS-2/architecture.md
ACTION REQUIRED: Review and approve

# Continue for all 8 phases...
```

---

## Example: CJS-2 Standalone Phases

```bash
# Phase 00: Fetch from Jira
User: "Execute Phase 00 for User Story CJS-2"

✓ Phase 00: Input COMPLETE
User Story: CJS-2
Title: Create login page
Status: To Do
Artifact: docs/artifacts/CJS-2/user-story.md

NEXT STEPS:
1. Review user-story.md
2. To continue workflow: /workflow CJS-2
3. To run Phase 01 directly: "Analyze requirements for CJS-2"

# Phase 01: Requirements
User: "Analyze requirements for CJS-2"

✓ Phase 01: Requirements COMPLETE
User Story: CJS-2
Functional Requirements: 5
Non-Functional Requirements: 3
Artifact: docs/artifacts/CJS-2/requirements.md

NEXT STEPS:
1. Review requirements.md
2. To continue workflow: /workflow CJS-2
3. To run Phase 02 directly: "Design architecture for CJS-2"
```

---

## Error Handling

### Missing User Story ID
```
ERROR: User Story ID is required.
Usage: /workflow CJS-2
OR: "Execute Phase 00 for User Story CJS-2"
```

### Missing Prerequisite
```
ERROR: requirements.md not found.
Path: docs/artifacts/CJS-2/requirements.md
Recovery:
- Run Phase 01 first via /workflow CJS-2, OR
- Manually create requirements.md if running standalone
```

### Jira Issue Not Found
```
ERROR: Jira issue CJS-2 not found.
Check:
- User Story ID is correct (CJS-2, not SCRUM-123)
- Issue exists in Jira
- MCP has access to this project
Recovery: Verify User Story ID and retry.
```

---

## Monitoring Progress

### Via status.md
```bash
# Check workflow state
cat docs/artifacts/CJS-2/status.md

# Shows:
# - Current Phase
# - Completed Phases (checkboxes)
# - Pending Human Approval
# - Blocked Phase (if any)
# - Status (IN_PROGRESS / COMPLETE)
```

### Via Dashboard
```bash
# Start dashboard
npm run dashboard CJS-2

# Open browser: http://localhost:3000
# Real-time updates as workflow progresses
```

---

## Recovery Scenarios

### Resume Interrupted Workflow
```bash
# Workflow was interrupted at Phase 03
# Check status.md to see current state
cat docs/artifacts/CJS-2/status.md

# Resume workflow from current phase
/workflow CJS-2
```

### Retry Failed Phase
```bash
# Phase 04 failed, status.md shows blocker
# Fix the issue, clear blocker in status.md

# Edit status.md: Set "Blocked Phase: None"
# Retry workflow
/workflow CJS-2
```

### Rollback to Previous Phase
```bash
# Edit status.md:
# - Set "Current Phase: 02: Architecture"
# - Uncheck phases 03-08
# - Delete artifacts for phases 03-08

# Resume workflow from Phase 02
/workflow CJS-2
```

---

## Tips & Best Practices

### Workflow Mode
✅ **DO:**
- Review each artifact before approving
- Read status.md to understand current state
- Use dashboard for real-time monitoring
- Let workflow manage prerequisites

❌ **DON'T:**
- Manually edit artifacts after phase completion (without re-running phase)
- Skip approval gates (defeats purpose of HITL)
- Delete status.md mid-workflow

### Standalone Mode
✅ **DO:**
- Run phases in order (00 → 01 → 02 → ...)
- Verify prerequisites exist before invoking
- Read error messages carefully for recovery steps
- Use for debugging specific phases

❌ **DON'T:**
- Expect status.md to update automatically
- Skip prerequisite phases
- Mix standalone and workflow modes without understanding state

---

## Troubleshooting

### MCP Not Available
```bash
# Check MCP configuration
cat .claude/mcp.json

# Check environment variables
cat .env

# Verify Jira credentials
# Test MCP connection (via Jira test query)
```

### Git Issues
```bash
# Ensure repository initialized
git status

# Check remote configured
git remote -v

# Verify GitHub CLI
gh --version
```

### Artifact Validation Fails
```bash
# Check artifact exists
ls docs/artifacts/CJS-2/

# Verify artifact format (compare to template in agent docs)
cat docs/artifacts/CJS-2/requirements.md
```

---

## Support

### Documentation
- `CLAUDE.md` - Project instructions and architecture
- `TESTING_GUIDE.md` - Comprehensive testing guide
- `REFACTORING_SUMMARY.md` - Technical details of dual-mode architecture
- `.claude/agents/*.md` - Individual agent documentation

### Agent Files
- `.claude/agents/00-input.md` through `08-pr.md` - Phase agent contracts
- `.claude/commands/workflow.md` - Workflow orchestration logic
- `.claude/instructions/shared.md` - Common rules for all agents

### Skills
- `.claude/skills/artifact-validation.md` - Prerequisite validation logic

---

## Next Steps

1. **Test Workflow Mode:**
   ```bash
   /workflow CJS-2
   ```

2. **Test Standalone Phase:**
   ```bash
   "Execute Phase 00 for User Story CJS-2"
   ```

3. **Monitor Progress:**
   ```bash
   npm run dashboard CJS-2
   ```

4. **Review Artifacts:**
   ```bash
   ls docs/artifacts/CJS-2/
   ```

Happy building! 🚀
