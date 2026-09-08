# Claude Code Project Instructions

> **🚀 EXECUTION ENTRY POINT**
> 
> This file is the **primary entry point** for Claude Code execution in this repository.
> All Claude Code operations start here and follow the rules, agents, and workflows defined below.

## Project Overview

This is an Agentic SDLC Capstone project demonstrating a complete 8-phase Software Development Life Cycle workflow coordinated by Claude Code.

### Quick Start

**Primary Command:** `/run-sdlc-workflow <USER_STORY_ID>`

Example:
```bash
/run-sdlc-workflow CJS-2
```

This executes the complete 8-phase SDLC pipeline with human approval gates between phases.

**Secondary Command:** `/run-phase <USER_STORY_ID> <PHASE_NUMBER>`

Example:
```bash
/run-phase CJS-2 01    # Run Phase 01: Requirements independently
```

This executes a single phase in standalone mode (bypasses workflow orchestration, no status.md updates).

**Note:** Commands are defined in `.claude/commands/run-sdlc-workflow.md` and `.claude/commands/run-phase.md`.

## Architecture

### Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│ CLAUDE.md (YOU ARE HERE - Execution Entry Point)           │
│ • Defines project structure                                  │
│ • References all rules and agents                           │
│ • Provides usage patterns                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ .claude/commands/ (Workflow Commands)                       │
│ • /run-sdlc-workflow <USER_STORY_ID>                        │
│ • /run-phase <USER_STORY_ID> <PHASE_NUMBER>                 │
│ • Sequences Phases 00-08                                    │
│ • Enforces approval gates                                   │
│ • Manages status.md state                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ .claude/agents/*.md (Phase Agents 00-08)                    │
│ • Invoked by commands OR directly by users                  │
│ • Execute specific SDLC phases                              │
│ • Create phase artifacts                                    │
│ • Follow rules from .claude/rules/                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ docs/artifacts/<USER_STORY_ID>/ (Outputs)                   │
│ • status.md (workflow state)                                │
│ • Phase artifacts (requirements.md, architecture.md, etc.)  │
│ • Implementation code                                       │
└─────────────────────────────────────────────────────────────┘
```

### Repository Structure
```
CLAUDE.md          ← YOU ARE HERE (Execution Entry Point)
│
.claude/
├── commands/      ← Workflow commands (run-sdlc-workflow.md, run-phase.md)
├── agents/        ← Phase agents (00-08)
│   ├── 00-input.md
│   ├── 01-requirements.md
│   ├── 02-architecture.md
│   ├── 03-design-review.md
│   ├── 04-planning.md
│   ├── 05-implementation.md
│   ├── 06-review.md
│   ├── 07-verification.md
│   └── 08-pr.md
├── rules/         ← All workflow rules (MUST follow)
│   ├── agent-operations.md   (agent behavior)
│   ├── secrets.md            (security rules)
│   ├── git.md                (git workflow)
│   ├── workflow-state.md     (state management)
│   └── code-quality.md       (coding standards)
├── skills/        ← Validation and expertise skills
├── commands/      ← Workflow commands
├── hooks/         ← Git hooks (pre-commit)
└── settings.json  ← Project settings

docs/artifacts/    ← Per-story SDLC artifacts (outputs)
└── <USER_STORY_ID>/
    ├── status.md
    ├── user-story.md
    ├── requirements.md
    ├── architecture.md
    └── ... (all phase outputs)
```

### Workflow Coordination
- Commands in `.claude/commands/` coordinate the SDLC pipeline
- Sequences Phases 00-08 with human approval gates
- Stateless between invocations (state in `status.md`)
- Never auto-advances through phases

### Phase Agents (9 agents)
- `00-input.md` through `08-pr.md`
- **Support TWO invocation modes:**
  1. **Workflow Mode:** Invoked BY commands with orchestration
  2. **Standalone Mode:** Can be invoked directly by users
- Each agent has clear inputs, outputs, and responsibilities
- Agents do not call other agents
- Agents validate prerequisites and extract User Story ID independently

### State Management
- `docs/artifacts/<USER_STORY_ID>/status.md` is the single source of truth
- Records: current phase, completed phases, pending approval, blocked status, notes
- Updated by workflow commands after each phase completes
- Persists across Claude Code sessions

### Human Approval
- Required after EVERY phase
- Re-invoking `/run-sdlc-workflow <ID>` after review = implicit approval
- Workflow checks status.md for pending approval state
- No phase can self-approve or skip approval

## Execution Modes

Claude Code supports two invocation patterns in this repository:

### Command Comparison

| Feature | `/run-sdlc-workflow` | `/run-phase` |
|---------|---------------------|--------------|
| **Purpose** | Full SDLC pipeline | Single phase execution |
| **Phases Executed** | Sequential (00→01→...→08) | One specific phase |
| **Approval Gates** | ✅ Enforced | ❌ Bypassed |
| **Updates status.md** | ✅ Yes | ❌ No |
| **Prerequisites** | Workflow validates | Agent validates |
| **Use Case** | Production flow | Testing, re-runs, debugging |
| **State Tracking** | ✅ Full audit trail | ❌ Manual tracking |
| **Example** | `/run-sdlc-workflow CJS-2` | `/run-phase CJS-2 01` |

### 1. Full Workflow Mode (Recommended)

**Command:** `/run-sdlc-workflow <USER_STORY_ID>`

**How it works:**
- Commands coordinate all 8 phases sequentially
- Executes one phase at a time
- Enforces human approval gates between phases
- Manages state in `docs/artifacts/<USER_STORY_ID>/status.md`
- Never auto-advances without human approval

**Usage:**
```bash
# Start new User Story
/run-sdlc-workflow CJS-2

# After reviewing Phase 00 output, continue
/run-sdlc-workflow CJS-2   # Re-invocation = approval

# Continue through all 8 phases
/run-sdlc-workflow CJS-2   # Repeat after each phase review
```

**State Management:**
- State persists in `status.md` between Claude Code sessions
- Workflow resumes from last completed phase
- Re-invoking `/run-sdlc-workflow <ID>` = implicit approval of pending phase

### 2. Standalone Phase Mode (Advanced)

**Command:** `/run-phase <USER_STORY_ID> <PHASE_NUMBER>`

**How it works:**
- Executes specific phase agent directly
- Agents validate prerequisites independently
- Agents do NOT update status.md
- User manages workflow state manually

**Usage:**
```bash
# Run specific phase by number
/run-phase CJS-2 00    # Phase 00: Input
/run-phase CJS-2 01    # Phase 01: Requirements
/run-phase CJS-2 05    # Phase 05: Implementation

# Alternative: Direct agent invocation (more verbose)
"Execute Phase 01 for CJS-2"
"Analyze requirements for CJS-2"
```

**When to use:**
- Re-running a single phase after corrections
- Skipping workflow orchestration for specific phase
- Testing phase agents independently
- Quick operations without approval gates

## Key Rules for Claude Code

### MUST DO ✓
1. **Start from CLAUDE.md** - This is the execution entry point
2. **Use workflow commands** - For full SDLC orchestration
3. **Check status.md first** - Before every workflow action
4. **One phase at a time** - Never skip phases or approval gates
5. **Update status.md after each phase** - Only workflow commands do this
6. **Follow all rules in `.claude/rules/`** - Non-negotiable standards
7. **Dynamic User Story IDs** - Never hardcode example IDs
8. **Isolated artifacts** - Each story in `docs/artifacts/<USER_STORY_ID>/`

### MUST NOT DO ✗
1. **Never auto-approve phases** - Human must re-invoke workflow
2. **Never skip approval gates** - Wait for human review
3. **Never hardcode User Story IDs** - Always use runtime values
4. **Never update status.md from phase agents** - Only workflow commands
5. **Never commit secrets** - Follow `.claude/rules/secrets.md`
6. **Never assume prerequisites** - Always validate
7. **Never modify approved artifacts** - Without explicit direction
8. **Never chain multiple phases** - Without approval between them

## Rules & Standards (Mandatory)

All Claude Code operations in this repository MUST follow the rules defined in `.claude/rules/`:

### 📋 Core Rule Files

| Rule File | Purpose | When to Reference |
|-----------|---------|-------------------|
| **[agent-operations.md](.claude/rules/agent-operations.md)** | Agent behavior, artifact templates, phase dependencies | Building agents, creating artifacts |
| **[secrets.md](.claude/rules/secrets.md)** | Security, credential management, token masking | Before ANY commit, handling credentials |
| **[git.md](.claude/rules/git.md)** | Branch strategy, commit standards, PR workflow | Creating branches, commits, PRs |
| **[workflow-state.md](.claude/rules/workflow-state.md)** | status.md management, state transitions | Managing workflow state, recovery |
| **[code-quality.md](.claude/rules/code-quality.md)** | Coding standards, testing, security practices | Writing code, creating tests |

### 🔑 Key Principles

1. **Dynamic User Story IDs** - Never hardcode (SCRUM-123, CJS-2, etc.)
2. **Artifact Isolation** - Each story in `docs/artifacts/<USER_STORY_ID>/`
3. **Traceability** - Link requirements → architecture → implementation → tests
4. **Safe Failure** - Clear errors, halt for human intervention
5. **No Assumptions** - Ask clarification questions when unclear

### 🛡️ Security (CRITICAL)

See **[.claude/rules/secrets.md](.claude/rules/secrets.md)** for complete guidelines.

**Quick Reference:**
- ❌ **NEVER commit:** `mcp.json`, `.env`, `.claude/settings.local.json`
- 🔒 **Token Masking:** Replace with `!@#$$$#@` or `${ENV_VAR}`
- ✅ **Pre-commit Hook:** `.claude/hooks/check-secrets.sh` auto-scans
- 📋 **Protected Files:** Listed in `.gitignore`

**Violation = Security Incident** - See `SECURITY.md` for response procedures.

## Usage Patterns & Examples

### Pattern 1: Complete SDLC Workflow (Full Automation)

**Goal:** Execute all 8 phases for a User Story from Jira to PR

```bash
# Step 1: Start workflow
/run-sdlc-workflow CJS-2

# Output: Phase 00 complete, user-story.md created
# Action: Review docs/artifacts/CJS-2/user-story.md

# Step 2: Approve and continue
/run-sdlc-workflow CJS-2

# Output: Phase 01 complete, requirements.md created
# Action: Review docs/artifacts/CJS-2/requirements.md

# Step 3-8: Repeat approval cycle
/run-sdlc-workflow CJS-2  # After each review

# Final: Phase 08 creates GitHub PR
# Confluence publishing happens automatically via GitHub Actions
```

**Key Points:**
- Re-invoking `/run-sdlc-workflow CJS-2` = implicit approval
- One phase per invocation
- Review artifacts between phases
- Workflow halts after each phase for human approval

### Pattern 2: Resume Interrupted Workflow

**Goal:** Continue workflow after Claude Code restart or interruption

```bash
# Check current state
cat docs/artifacts/CJS-2/status.md

# Resume from current phase
/run-sdlc-workflow CJS-2

# Workflow reads status.md and continues from where it left off
```

**Key Points:**
- State persists in `status.md`
- Workflow automatically resumes from last completed phase
- No data loss across sessions

### Pattern 3: Standalone Phase Execution

**Goal:** Run a single phase without full workflow orchestration

```bash
# Method 1: Use /run-phase command (recommended)
/run-phase CJS-2 01    # Phase 01: Requirements
/run-phase CJS-2 05    # Phase 05: Implementation

# Method 2: Direct agent invocation (more verbose)
"Execute Phase 01 for CJS-2"
"Analyze requirements for CJS-2"
"Create architecture for CJS-2"
```

**Key Points:**
- Agent validates prerequisites independently
- Does NOT update status.md
- User manages state manually
- Useful for re-running specific phases
- Bypasses approval gates

### Pattern 4: Check Workflow Status

**Option A: Read status file directly**
```bash
cat docs/artifacts/CJS-2/status.md
```

**Option B: Use monitoring dashboard**
```bash
npm run dashboard CJS-2
```

The dashboard:
- Reads status.md in real-time
- Updates automatically on changes
- Shows phase progress visually
- Independent of Claude Code (runs separately)

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

## Phase Sequence & Artifacts

The SDLC workflow progresses through 8 distinct phases, each producing specific artifacts:

```
┌─────────────────────────────────────────────────────────────────┐
│ Phase 00: Input                                                 │
│ • Fetches User Story from Jira (Atlassian MCP)                  │
│ • Output: user-story.md, status.md                              │
│ • Approval Required: ✓                                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 01: Requirements Analysis                                 │
│ • Extracts functional/non-functional requirements                │
│ • Output: requirements.md                                       │
│ • Approval Required: ✓                                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 02: Architecture Design                                   │
│ • Designs high-level solution architecture                      │
│ • Output: architecture.md                                       │
│ • Approval Required: ✓                                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 03: Design Review                                         │
│ • Reviews architecture for risks and gaps                       │
│ • Output: design-review.md                                      │
│ • Approval Required: ✓                                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 04: Implementation Planning                               │
│ • Creates detailed, dependency-ordered plan                     │
│ • Output: impl-plan.md                                          │
│ • Approval Required: ✓                                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 05: Implementation                                        │
│ • Builds application code and tests                             │
│ • Output: Source code, unit tests, integration tests            │
│ • Approval Required: ✓                                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 06: Code Review                                           │
│ • Reviews code quality, security, standards                     │
│ • Output: review.md                                             │
│ • Approval Required: ✓                                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 07: Verification                                          │
│ • Verifies requirements met, runs tests                         │
│ • Output: verification.md                                       │
│ • Approval Required: ✓                                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 08: Pull Request Creation                                 │
│ • Creates GitHub PR with all artifacts                          │
│ • Output: GitHub PR URL                                         │
│ • Workflow Status: COMPLETE                                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Confluence Publishing (Automated)                               │
│ • Triggered by GitHub Actions on PR open/sync/reopen            │
│ • Publishes artifacts to Confluence automatically               │
│ • Output: confluence-status.json                                │
└─────────────────────────────────────────────────────────────────┘
```

### Artifact Structure

Each User Story generates isolated artifacts:

```
docs/artifacts/<USER_STORY_ID>/
├── status.md              ← Workflow state (managed by commands)
├── user-story.md          ← Phase 00: Original Jira story
├── requirements.md        ← Phase 01: Requirements analysis
├── architecture.md        ← Phase 02: Architecture design
├── design-review.md       ← Phase 03: Design review findings
├── impl-plan.md           ← Phase 04: Implementation plan
├── review.md              ← Phase 06: Code review findings
├── verification.md        ← Phase 07: Test results
└── confluence-status.json ← GitHub Actions: Publication metadata
```

**Note:** Phase 05 (Implementation) creates source code directly in the repository, not in the artifacts directory.

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

## Recovery & Error Handling

### Scenario 1: Workflow Interrupted Mid-Phase

**Problem:** Claude Code crashed or was stopped during phase execution

**Solution:**
```bash
# Check current state
cat docs/artifacts/<USER_STORY_ID>/status.md

# Resume workflow
/run-sdlc-workflow <USER_STORY_ID>
```

**Result:** Workflow resumes from the last completed phase (state persists in status.md)

---

### Scenario 2: Approval Not Provided

**Problem:** Workflow waiting for human review, but you haven't re-invoked it

**Status in status.md:**
```yaml
Pending Human Approval: Phase 02 - Architecture
```

**Solution:**
1. Review the artifact: `docs/artifacts/<USER_STORY_ID>/architecture.md`
2. Approve by re-invoking: `/run-sdlc-workflow <USER_STORY_ID>`

**Result:** Workflow interprets re-invocation as approval and proceeds to next phase

---

### Scenario 3: Phase Blocked Due to Error

**Problem:** Phase encountered an error and cannot proceed

**Status in status.md:**
```yaml
Blocked Phase: 03 - Design Review - Missing required section
```

**Solution:**
1. Identify the blocker from status.md
2. Fix the issue (e.g., manually update artifact)
3. Clear blocked state in status.md:
   ```yaml
   Blocked Phase: None
   ```
4. Re-invoke workflow: `/run-sdlc-workflow <USER_STORY_ID>`

**Result:** Workflow retries the blocked phase

---

### Scenario 4: Missing or Corrupted Artifact

**Problem:** Expected artifact doesn't exist or is invalid

**Error Message:**
```
ERROR: Cannot proceed with Phase 02.
Missing required artifact: docs/artifacts/CJS-2/requirements.md
Recovery: Complete Phase 01 first, or restore missing artifact.
```

**Solution:**

**Option A: Re-run the phase**
```bash
# Standalone mode - run specific phase
"Execute Phase 01 for CJS-2"
```

**Option B: Restore from git history**
```bash
# Find when it was deleted
git log -- docs/artifacts/CJS-2/requirements.md

# Restore from specific commit
git checkout <commit-hash> -- docs/artifacts/CJS-2/requirements.md
```

**Option C: Restart workflow**
```bash
# Reset status.md to earlier phase
# Manually edit: Current Phase: 01
/run-sdlc-workflow CJS-2
```

---

### Scenario 5: Need to Rollback to Previous Phase

**Problem:** Want to redo a phase after approval

**Solution:**
1. Manually edit `docs/artifacts/<USER_STORY_ID>/status.md`:
   ```yaml
   Current Phase: 02: Architecture
   Completed Phases:
     - [X] 00: Input
     - [X] 01: Requirements
     - [ ] 02: Architecture  # Uncheck this
   Pending Human Approval: None
   ```
2. Optionally delete the phase artifact to regenerate
3. Re-invoke workflow: `/run-sdlc-workflow <USER_STORY_ID>`

**Result:** Workflow re-executes Phase 02

---

### Scenario 6: Emergency - Skip Approval Gate

**⚠️ WARNING: Use only when absolutely necessary**

**Solution:**
1. Manually edit `docs/artifacts/<USER_STORY_ID>/status.md`:
   ```yaml
   Pending Human Approval: None
   Completed Phases:
     - [X] 02: Architecture  # Manually mark complete
   Current Phase: 03: Design Review
   ```
2. Re-invoke workflow: `/run-sdlc-workflow <USER_STORY_ID>`

**Result:** Workflow skips approval and proceeds (not recommended in production)

## Integration Points

### MCP Servers

**Atlassian MCP (Jira)**
- **Configured in:** `.claude/mcp.json` (gitignored)
- **Used in:** Phase 00 (Input) ONLY
- **Purpose:** Fetch User Story from Jira
- **Credentials:** Environment variables (`JIRA_API_TOKEN`, `JIRA_USER_EMAIL`)

**Important:**
- MCP used for read-only Jira access
- No Confluence MCP (publishing via GitHub Actions instead)
- Credentials NEVER committed to git

### GitHub Actions

**Confluence Publishing Workflow**
- **Triggered by:** PR opened, synchronized, or reopened
- **Action:** Automatically publishes SDLC artifacts to Confluence
- **Output:** Updates `confluence-status.json` with publication metadata
- **Configuration:** `.github/workflows/publish-confluence.yml`

**Important:**
- Publishing is automatic (not part of SDLC phases)
- Happens AFTER Phase 08 (PR creation)
- No manual intervention required

### Monitoring Dashboard

**Purpose:** Real-time workflow status monitoring

**Features:**
- Reads `status.md` for current state
- Watches file changes (chokidar)
- Updates browser via SSE (Server-Sent Events)
- Independent of Claude Code (runs separately)

**Usage:**
```bash
npm run dashboard <USER_STORY_ID>
```

**Technology Stack:**
- Node.js + Express
- Server-Sent Events for real-time updates
- File watching with chokidar
- Read-only (never modifies state)

### Git Hooks

**Pre-commit Hook** (`.claude/hooks/check-secrets.sh`)
- **Purpose:** Prevent secrets from being committed
- **Scans for:**
  - Forbidden files (`mcp.json`, `.env`, etc.)
  - Secret patterns (tokens, API keys, passwords)
  - Credential-like strings
- **Action:** Blocks commit if secrets detected
- **Bypass:** `git commit --no-verify` (emergency only)

**See:** `.claude/rules/secrets.md` for complete security guidelines

## Application Development Flow

### Initial State
- **No application code exists** at project start
- Application is designed and built through SDLC phases

### Development Timeline

```
Phase 02: Architecture
├─ Define application structure
├─ Choose technology stack
├─ Design component hierarchy
└─ Output: architecture.md

Phase 03: Design Review
├─ Review architecture for risks
├─ Identify gaps and issues
└─ Output: design-review.md

Phase 04: Planning
├─ Break down into implementation tasks
├─ Define file structure
├─ Plan dependencies
└─ Output: impl-plan.md

Phase 05: Implementation ★
├─ Create application structure
├─ Write source code
├─ Build unit tests
├─ Build integration tests
└─ Output: Working application code

Phase 06: Review
├─ Code quality review
├─ Security audit
├─ Standards compliance
└─ Output: review.md

Phase 07: Verification
├─ Run all tests
├─ Verify requirements met
├─ Check acceptance criteria
└─ Output: verification.md
```

**Phase 05 Agent Responsibilities:**
- Create directory structure per architecture
- Generate source files based on approved design
- Write unit and integration tests
- Follow code quality standards from `.claude/rules/code-quality.md`
- Ensure traceability to requirements and architecture

## Workflow Completion

### Phase 08 Success

When Phase 08 completes successfully:

1. **GitHub PR Created**
   - Pull request opened on GitHub
   - All SDLC artifacts attached
   - Linked to User Story (e.g., "Resolves CJS-2")

2. **Status Updated**
   ```yaml
   Status: COMPLETE
   Current Phase: 08: PR
   Pending Human Approval: None
   PR Information: <GitHub PR URL>
   ```

3. **Workflow Ends**
   - No further automatic phases
   - Human reviews PR
   - Human approves and merges PR

4. **Confluence Publishing (Automatic)**
   - GitHub Actions triggered on PR open/sync/reopen
   - Artifacts published to Confluence
   - `confluence-status.json` updated with metadata

### Post-Completion Actions

**Human responsibilities:**
1. Review GitHub PR thoroughly
2. Run additional manual tests (if needed)
3. Approve PR (required reviewers)
4. Merge PR to main branch
5. Verify Confluence publication (check GitHub Actions logs)
6. Close Jira ticket
7. Clean up feature branch (if not auto-deleted)

## Troubleshooting Guide

### Common Issues & Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| **MCP not connected** | "Cannot fetch from Jira" | Check `.claude/mcp.json`, verify credentials |
| **Secrets detected** | Pre-commit hook blocks commit | Remove secrets, use env vars, see `.claude/rules/secrets.md` |
| **Wrong phase executed** | Phase runs out of order | Check `status.md`, manually correct `Current Phase` |
| **Artifact validation failed** | "Missing required sections" | Review artifact template, regenerate artifact |
| **Agent invocation failed** | "Failed to invoke agent" | Verify agent file exists at `.claude/agents/<agent>.md` |
| **State mismatch** | Workflow confused about phase | Read `status.md`, reconcile with filesystem, correct manually |
| **Dashboard not updating** | Real-time updates not working | Restart dashboard: `npm run dashboard <ID>` |
| **PR creation failed** | Phase 08 errors | Check git status, branch existence, GitHub connectivity |

### Debug Workflow State

```bash
# View current workflow state
cat docs/artifacts/<USER_STORY_ID>/status.md

# List all artifacts
ls -la docs/artifacts/<USER_STORY_ID>/

# Check git status
git status

# View recent workflow activity
git log --oneline docs/artifacts/<USER_STORY_ID>/

# Validate artifact structure
cat docs/artifacts/<USER_STORY_ID>/requirements.md
```

### Contact & Support

For issues not covered in this guide:
1. Check `.claude/rules/` for specific guidance
2. Review agent contracts in `.claude/agents/`
3. Consult `SECURITY.md` for security incidents
4. Check GitHub Issues for known problems

## Quick Reference Card

### Essential Commands

| Command | Purpose |
|---------|---------|
| `/run-sdlc-workflow <USER_STORY_ID>` | Start/continue full SDLC workflow (all 8 phases) |
| `/run-phase <USER_STORY_ID> <PHASE_NUMBER>` | Execute single phase independently (00-08) |
| `cat docs/artifacts/<ID>/status.md` | Check workflow state |
| `npm run dashboard <ID>` | Monitor workflow in real-time |
| `"Execute Phase XX for <ID>"` | Run standalone phase |
| `git status` | Check git state before commits |

### Essential Files

| File | Purpose | Modified By |
|------|---------|-------------|
| `CLAUDE.md` | Execution entry point (this file) | Developers |
| `.claude/commands/*.md` | Workflow commands | Developers |
| `.claude/agents/*.md` | Phase agent definitions | Developers |
| `.claude/rules/*.md` | Mandatory rules | Developers |
| `docs/artifacts/<ID>/status.md` | Workflow state | Commands ONLY |
| `docs/artifacts/<ID>/*.md` | Phase artifacts | Phase agents |

### Phase Checklist

- [ ] Phase 00: User Story fetched from Jira
- [ ] Phase 01: Requirements documented
- [ ] Phase 02: Architecture designed
- [ ] Phase 03: Design reviewed
- [ ] Phase 04: Implementation plan created
- [ ] Phase 05: Code and tests implemented
- [ ] Phase 06: Code reviewed
- [ ] Phase 07: Tests verified
- [ ] Phase 08: PR created
- [ ] Post: PR merged, Confluence published

---

## Summary

**This is the execution entry point for Claude Code in this repository.**

### Two Ways to Run

1. **Full SDLC Workflow (Recommended):**
   ```bash
   /run-sdlc-workflow <USER_STORY_ID>
   ```
   - Executes all 8 phases sequentially
   - Enforces approval gates
   - Updates status.md
   - Production-ready audit trail

2. **Single Phase Execution (Advanced):**
   ```bash
   /run-phase <USER_STORY_ID> <PHASE_NUMBER>
   ```
   - Executes one phase independently
   - Bypasses approval gates
   - Does NOT update status.md
   - For testing and re-runs

### Essential Steps

1. **Start here:** Read CLAUDE.md (this file)
2. **Execute workflow:** `/run-sdlc-workflow <USER_STORY_ID>`
3. **Follow rules:** All rules in `.claude/rules/` are mandatory
4. **Track state:** `docs/artifacts/<USER_STORY_ID>/status.md`
5. **Review artifacts:** After each phase, before approval
6. **Complete SDLC:** 8 phases, human approval between each

**Key takeaway:** CLAUDE.md → commands → agents → artifacts → PR
