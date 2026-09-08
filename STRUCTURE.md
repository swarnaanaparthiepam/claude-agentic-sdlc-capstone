# Repository Structure

## Overview
This repository follows the team-recommended SDLC structure with organized `.claude/` directories and clear separation of concerns.

## Directory Layout

```
claude-agentic-sdlc-capstone/
├── .claude/                    # Claude Code configuration
│   ├── agents/                 # Phase agents (00-08)
│   │   ├── 00-input.md
│   │   ├── 01-requirements.md
│   │   ├── 02-architecture.md
│   │   ├── 03-design-review.md
│   │   ├── 04-planning.md
│   │   ├── 05-implementation.md
│   │   ├── 06-review.md
│   │   ├── 07-verification.md
│   │   └── 08-pr.md
│   │
│   ├── commands/               # Workflow commands
│   │   └── run-sdlc-workflow.md
│   │
│   ├── hooks/                  # Git hooks
│   │   └── check-secrets.sh   # Pre-commit secrets scanner
│   │
│   ├── rules/                  # All workflow rules
│   │   ├── README.md
│   │   ├── agent-operations.md # Agent behavior & templates
│   │   ├── code-quality.md     # Coding standards
│   │   ├── git.md              # Git workflow
│   │   ├── secrets.md          # Security rules
│   │   └── workflow-state.md   # State management
│   │
│   ├── skills/                 # Validation skills
│   │   └── artifact-validation.md
│   │
│   ├── settings.json           # Project settings
│   ├── settings.local.json     # Local overrides (gitignored)
│   └── workflow.md             # SDLC coordinator
│
├── context/                    # Runtime workflow context
│   ├── README.md
│   └── workflow-context.json  # Execution metadata
│
├── docs/                       # Documentation & artifacts
│   └── artifacts/             # Per-story SDLC outputs
│       └── <USER_STORY_ID>/
│           ├── status.md
│           ├── user-story.md
│           ├── requirements.md
│           ├── architecture.md
│           ├── design-review.md
│           ├── impl-plan.md
│           ├── review.md
│           └── verification.md
│
├── login-app/                  # Application code (created in Phase 05)
│   ├── src/
│   ├── tests/
│   └── package.json
│
├── tools/                      # Build & monitoring tools
│   └── dashboard/             # Workflow monitoring dashboard
│
├── node_modules/               # Dependencies (gitignored)
│
├── .github/                    # GitHub workflows
│   └── workflows/
│       └── confluence-publish.yml
│
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment template
├── CLAUDE.md                   # Project instructions
├── STRUCTURE.md                # This file
├── README.md                   # Project overview
└── package.json                # Node dependencies
```

## Key Files

### Configuration
| File | Purpose | Committed |
|------|---------|-----------|
| `.claude/settings.json` | Project-wide settings | ✅ Yes |
| `.claude/settings.local.json` | User overrides | ❌ No (gitignored) |
| `.env` | Environment variables | ❌ No (gitignored) |
| `.env.example` | Environment template | ✅ Yes |
| `mcp.json` | MCP credentials | ❌ No (gitignored) |

### Documentation
| File | Purpose |
|------|---------|
| `CLAUDE.md` | Main project instructions |
| `STRUCTURE.md` | Repository structure (this file) |
| `README.md` | Project overview & setup |
| `SECURITY.md` | Security policies & incident response |

### Agents
| Agent | Phase | Artifact |
|-------|-------|----------|
| `00-input.md` | Input | `user-story.md` |
| `01-requirements.md` | Requirements | `requirements.md` |
| `02-architecture.md` | Architecture | `architecture.md` |
| `03-design-review.md` | Design Review | `design-review.md` |
| `04-planning.md` | Planning | `impl-plan.md` |
| `05-implementation.md` | Implementation | Code + tests |
| `06-review.md` | Review | `review.md` |
| `07-verification.md` | Verification | `verification.md` |
| `08-pr.md` | PR Creation | GitHub PR |

### Rules
| Rule | Governs |
|------|---------|
| `agent-operations.md` | Agent behavior, artifacts, templates |
| `secrets.md` | Security & credential management |
| `git.md` | Branch strategy, commits, PRs |
| `workflow-state.md` | State management via `status.md` |
| `code-quality.md` | Coding standards, testing, reviews |

## Invocation Patterns

### Full Workflow
```bash
/workflow CJS-2
```
Executes all 8 phases with approval gates.

### Individual Phase
```bash
"Execute Phase 01 for CJS-2"
```
Runs a single phase in standalone mode.

### Check Status
```bash
cat docs/artifacts/CJS-2/status.md
```

### Run Dashboard
```bash
npm run dashboard CJS-2
```

## State Management

### Source of Truth
**File:** `docs/artifacts/<USER_STORY_ID>/status.md`
- Managed by: `workflow.md` ONLY
- Contains: Phase state, approvals, blockers
- Persists: Forever (git-tracked)

### Runtime Context
**File:** `context/workflow-context.json`
- Managed by: Any component
- Contains: Execution metadata, environment
- Persists: Session-only

## Security

### Protected Files (NEVER commit)
- `mcp.json` - MCP server credentials
- `.claude/mcp.json` - Claude MCP config
- `.env`, `.env.local` - Environment variables
- `.claude/settings.local.json` - Local settings

### Pre-commit Hook
`.claude/hooks/check-secrets.sh` automatically scans for:
- Forbidden files
- Secret patterns (api_key, token, password)
- Credential-like strings

Blocks commit if secrets detected.

## Application Code

### Initial State
**No application code exists initially.**

### Creation in Phase 05
The `05-implementation.md` agent creates:
- Application structure
- Source code
- Unit & integration tests
- Build configuration

Based on:
- Approved requirements (`requirements.md`)
- Approved architecture (`architecture.md`)
- Approved plan (`impl-plan.md`)

### Location
```
login-app/
├── src/
│   ├── components/
│   ├── styles/
│   └── index.html
├── tests/
│   ├── unit/
│   └── integration/
└── package.json
```

## Useful Directories Preserved

### node_modules/
- Contains project dependencies
- Required for building applications
- Gitignored but essential for development

### tools/
- Dashboard monitoring tool
- Build utilities
- Helper scripts

### .github/
- CI/CD workflows
- Confluence publishing automation
- GitHub Actions

## Integration Points

### Jira (via Atlassian MCP)
- **Used in:** Phase 00 (Input)
- **Purpose:** Fetch User Story
- **Config:** `mcp.json` (gitignored)

### GitHub
- **Used in:** Phase 08 (PR)
- **Purpose:** Create pull requests
- **Auth:** Git credentials

### Confluence (via GitHub Actions)
- **Used in:** Post-merge
- **Purpose:** Publish documentation
- **Triggered:** After PR merge

## Comparison to Team Structure

### Adopted from Team
✅ `.claude/hooks/` - Git hooks  
✅ `.claude/rules/` - Organized rules  
✅ `.claude/settings.json` - Project settings  
✅ `.claude/settings.local.json` - Local overrides  
✅ `context/` - Runtime context  

### Kept from Existing
✅ Existing agent names (00-08)  
✅ `docs/` structure  
✅ `node_modules/` (useful for builds)  
✅ `tools/` (dashboard & utilities)  
✅ `login-app/` (application code)  

### Not Adopted (Intentionally)
❌ Fancy agent names (kept phase-based)  
❌ Removing useful directories  
❌ Changing working artifacts structure  

## Quick Reference

| Task | Command/File |
|------|--------------|
| Start workflow | `/workflow <ID>` |
| Check status | `cat docs/artifacts/<ID>/status.md` |
| View rules | `.claude/rules/*.md` |
| Run dashboard | `npm run dashboard <ID>` |
| Test secrets hook | `.claude/hooks/check-secrets.sh` |
| Configure project | `.claude/settings.json` |
| Override locally | `.claude/settings.local.json` |

## Maintenance

### Adding New Agents
1. Create `.claude/agents/XX-name.md`
2. Follow existing agent template
3. Update `CLAUDE.md` phase sequence
4. Test standalone & workflow modes

### Adding New Rules
1. Create `.claude/rules/new-rule.md`
2. Document with examples
3. Update `.claude/rules/README.md`
4. Reference from `shared.md`

### Updating Structure
1. Update this file (`STRUCTURE.md`)
2. Update `CLAUDE.md` architecture section
3. Test affected workflows
4. Commit changes

## Support

For questions:
1. Check `CLAUDE.md` for project overview
2. Check `.claude/rules/` for specific guidelines
3. Check this file for structure
4. Consult team lead
