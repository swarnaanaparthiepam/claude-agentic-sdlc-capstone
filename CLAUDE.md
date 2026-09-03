# Claude Code Project Instructions

## Project Overview

This is an Agentic SDLC Capstone project demonstrating a complete 8-phase Software Development Life Cycle workflow coordinated by Claude Code.

**Main workflow entry point:** `/workflow <USER_STORY_ID>`

## Architecture

### Workflow Coordination
- `.claude/workflow.md` is the SDLC coordinator
- Sequences Phases 00-08 with human approval gates
- Stateless between invocations (state in `status.md`)
- Never auto-advances through phases

### Phase Agents (9 agents)
- `00-input.md` through `08-pr.md`
- **Support TWO invocation modes:**
  1. **Workflow Mode:** Invoked BY workflow.md with orchestration
  2. **Standalone Mode:** Can be invoked directly by users
- Each agent has clear inputs, outputs, and responsibilities
- Agents do not call other agents
- Agents validate prerequisites and extract User Story ID independently

### State Management
- `docs/artifacts/<USER_STORY_ID>/status.md` is the single source of truth
- Records: current phase, completed phases, pending approval, blocked status, notes
- Updated by workflow.md after each phase completes
- Persists across Claude Code sessions

### Human Approval
- Required after EVERY phase
- Re-invoking `/workflow <ID>` after review = implicit approval
- Workflow checks status.md for pending approval state
- No phase can self-approve or skip approval

## Key Rules

### For Claude Code
1. **Two invocation patterns supported:**
   - **Full Workflow:** Use `/workflow <USER_STORY_ID>` for complete 8-phase orchestration
   - **Individual Phases:** Invoke agents directly (e.g., "Execute Phase 01 for CJS-2")
2. **In Workflow Mode:**
   - workflow.md orchestrates phases sequentially
   - One phase at a time, never auto-advances
   - Check status.md first, update after each phase
   - Enforce approval gates between phases
3. **In Standalone Mode:**
   - Agents validate prerequisites independently
   - Agents do NOT update status.md
   - Clear error messages if prerequisites missing
   - Provide next-step guidance to user

### For Phase Agents
1. **Support dual invocation modes** - Workflow Mode and Standalone Mode
2. **Extract User Story ID** - From prompt/parameter in any mode
3. **Validate inputs** - Check required artifacts exist before proceeding
4. **Create clear outputs** - Follow artifact templates from shared instructions
5. **Report appropriately** - Brief to workflow, detailed to users
6. **Never update status.md** - Only workflow.md manages state
7. **Provide recovery guidance** - Clear error messages with next steps

### Shared Instructions
- All agents follow `.claude/instructions/shared.md`
- Dynamic User Story IDs (never hardcoded)
- Artifact isolation per story
- Traceability from requirements to implementation
- Safe failure handling

## Usage Patterns

### Full Workflow Mode

#### Starting a new User Story
```
/workflow CJS-2
```
- Executes Phase 00 (Input)
- Fetches from Jira via Atlassian MCP
- Creates `docs/artifacts/CJS-2/user-story.md`
- Creates `docs/artifacts/CJS-2/status.md`
- Stops for approval

#### Continuing after approval
```
/workflow CJS-2
```
- Reads status.md
- Sees pending approval for Phase X
- Interprets re-invocation as approval
- Clears approval, marks Phase X complete
- Proceeds to Phase X+1
- Stops for next approval

### Standalone Mode (Direct Agent Invocation)

#### Run a single phase
```
"Execute Phase 00 for User Story CJS-2"
"Analyze requirements for CJS-2"
"Create architecture for CJS-2"
```
- Agent extracts User Story ID
- Validates prerequisites exist
- Creates artifact
- Reports completion with next steps
- Does NOT update status.md

### Checking status
Read: `docs/artifacts/SCRUM-123/status.md`

Or use dashboard:
```bash
npm run dashboard SCRUM-123
```

## MCP Integration

### Atlassian MCP (Jira)
- Configured in `.claude/mcp.json`
- Used ONLY in Phase 00 (Input)
- Fetches User Story from Jira
- Credentials from environment variables

### No Confluence MCP
- Confluence publishing handled by GitHub Actions
- Uses REST API, not MCP
- Triggered after PR merge

## Dashboard

Independent monitoring tool:
- Node.js + Express + SSE
- Reads `docs/artifacts/<USER_STORY_ID>/status.md`
- Watches file for changes (chokidar)
- Updates browser in real-time
- Works when Claude Code is closed
- Read-only (never modifies state)

## Artifacts

Each User Story gets isolated directory:
```
docs/artifacts/<USER_STORY_ID>/
  status.md           - Phase state and approval tracking
  user-story.md       - Original Jira story
  requirements.md     - Functional/non-functional requirements
  architecture.md     - High-level design
  design-review.md    - Design review findings
  impl-plan.md        - Implementation plan
  review.md           - Code review findings
  verification.md     - Test results
  confluence-status.json - Publication metadata
```

## Important Constraints

### Do NOT
- Skip phases or approval gates
- Auto-approve any phase
- Invoke phase agents directly (use workflow.md)
- Hardcode User Story IDs
- Modify approved artifacts without human direction
- Create artifacts outside `docs/artifacts/<USER_STORY_ID>/`
- Mix artifacts from different User Stories

### DO
- Use workflow.md as single entry point
- Check status.md before every action
- Validate prerequisites before each phase
- Create clear, traceable artifacts
- Report blockers and halt safely
- Update status.md after every phase

## Phase Sequence

```
00: Input          → user-story.md   → APPROVAL
01: Requirements   → requirements.md → APPROVAL
02: Architecture   → architecture.md → APPROVAL
03: Design Review  → design-review.md → APPROVAL
04: Planning       → impl-plan.md    → APPROVAL
05: Implementation → code + tests    → APPROVAL
06: Review         → review.md       → APPROVAL
07: Verification   → verification.md → APPROVAL
08: PR             → GitHub PR       → COMPLETE (workflow ends)
```

**Note:** Confluence publishing happens automatically via GitHub Actions after PR merge.

## Recovery Scenarios

### Interrupted mid-phase
- Read status.md to determine current phase
- Re-invoke workflow with same User Story ID
- Workflow resumes from interrupted phase

### Approval not provided
- Workflow halts with "Pending Human Approval: Phase X"
- Human reviews artifact
- Re-invoke workflow to approve and continue

### Phase blocked
- status.md shows "Blocked Phase: X - <reason>"
- Human resolves blocker
- Update status.md to clear blocked state
- Re-invoke workflow to retry

### Missing artifact
- Workflow validates expected artifact exists
- If missing, reports error and halts
- Human either restores artifact or reruns phase

## Application Development

**Important:** No application code exists initially.

The application (Login Page) will be:
- Designed in Phase 02 (Architecture)
- Reviewed in Phase 03 (Design Review)
- Planned in Phase 04 (Implementation Planning)
- **Created in Phase 05 (Implementation)**

Phase 05 agent will create the application structure, source code, and tests based on the approved architecture and plan.

## Security

**CRITICAL RULES - NEVER VIOLATE:**

1. **NEVER commit `mcp.json` or `.claude/mcp.json`** - These files contain MCP server credentials and must NEVER be pushed to git
2. **NEVER commit `.env` files** - Environment variables contain secrets
3. **Token Masking Policy:** If you discover any token/credential in code:
   - STOP and do not commit the file
   - Replace with `!@#$$$#@` or `${ENVIRONMENT_VARIABLE}`
   - Alert immediately
   - Use `git filter-branch` to remove from history if already committed
4. **Always use environment variables** for credentials in config files
5. **Template Pattern:** Use `.example` files (e.g., `mcp.json.example`) with placeholders

**GitHub Push Protection:**
- GitHub will block pushes containing detected secrets
- Do NOT bypass without proper review and remediation
- See `SECURITY.md` for complete incident response procedures

**What to do if credentials are exposed:**
1. Revoke the token immediately
2. Remove from git history using `git filter-branch`
3. Force push to overwrite remote
4. Document the incident
5. See `SECURITY.md` for detailed steps

**Protected Files:**
- `mcp.json` - MCP server credentials (in .gitignore)
- `.claude/mcp.json` - Claude MCP config (in .gitignore)
- `.env` - Environment variables (in .gitignore)
- `.env.local` - Local overrides (in .gitignore)

**Credential Storage:**
- Local Development: Use `.env` file (gitignored)
- CI/CD: Use GitHub Secrets
- Production: Use secure vault (AWS Secrets Manager, Azure Key Vault)

## Workflow Completion

After Phase 08:
- PR created on GitHub
- status.md shows "Status: COMPLETE"
- Workflow reports PR URL and ends
- Human reviews and merges PR (not automated)
- GitHub Action automatically publishes to Confluence after PR merge
- Confluence publication metadata written to `confluence-status.json`
