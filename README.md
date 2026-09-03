# Claude Code Agentic SDLC Capstone

Demonstrates an 8-phase Software Development Life Cycle (SDLC) workflow using Claude Code, with human approval gates between each phase.

## Overview

This project showcases a complete Agentic SDLC pipeline:

1. **Phase 00: Input** - Retrieve User Story from Jira
2. **Phase 01: Requirements** - Analyze and document requirements
3. **Phase 02: Architecture** - Design high-level architecture
4. **Phase 03: Design Review** - Review architecture for risks and gaps
5. **Phase 04: Planning** - Create detailed implementation plan
6. **Phase 05: Implementation** - Build the application and tests
7. **Phase 06: Review** - Code review for quality and security
8. **Phase 07: Verification** - Verify requirements and run tests
9. **Phase 08: PR** - Create GitHub pull request

**Key Features:**
- Human approval required after every phase
- Persistent state tracking via `status.md`
- Live dashboard for monitoring progress
- Automated Confluence documentation publishing
- Atlassian MCP integration for Jira access

## Prerequisites

- [Claude Code](https://claude.ai/code) installed
- Node.js 18+ (for dashboard and Confluence publishing)
- Atlassian account (Jira and Confluence)
- GitHub account (for PR creation)

## Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd claude-agentic-sdlc-capstone
npm install
```

### 2. Configure Atlassian MCP

Copy `.env.example` to `.env` and fill in your Atlassian credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
ATLASSIAN_INSTANCE_URL=https://your-domain.atlassian.net
ATLASSIAN_EMAIL=your-email@example.com
ATLASSIAN_API_TOKEN=your-api-token
CONFLUENCE_URL=https://your-domain.atlassian.net
CONFLUENCE_EMAIL=your-email@example.com
CONFLUENCE_API_TOKEN=your-api-token
```

**Generate API token:** https://id.atlassian.com/manage-profile/security/api-tokens

### 3. Configure GitHub Secrets (for Confluence publishing)

Add these secrets to your GitHub repository:
- `CONFLUENCE_URL`
- `CONFLUENCE_EMAIL`
- `CONFLUENCE_API_TOKEN`

## Usage

### Run the SDLC Workflow

```bash
# Start the workflow with a Jira User Story ID
/workflow SCRUM-123
```

The workflow will:
1. Execute the current phase
2. Create the phase artifact
3. Update status.md
4. Stop and wait for your approval

To continue after reviewing the artifact:
```bash
# Re-invoke the workflow (implicit approval)
/workflow SCRUM-123
```

### Monitor Progress with Dashboard

```bash
# Start the dashboard
npm run dashboard SCRUM-123

# Open in browser
http://localhost:3000
```

The dashboard shows:
- Current phase
- Completed phases
- Pending approval status
- Blocked phases (if any)
- Recent notes
- PR link (when available)
- Confluence publication status

### Publish to Confluence

After PR merge, publish documentation to Confluence:

**Automatic:** GitHub Actions workflow triggers on PR merge

**Manual:** Run workflow manually from GitHub Actions UI

## Project Structure

```
.claude/
  agents/         - 9 phase agents (00-input through 08-pr)
  skills/         - Artifact validation skill
  instructions/   - Shared SDLC rules
  workflow.md     - SDLC coordinator
  mcp.json        - Atlassian MCP configuration

docs/
  artifacts/      - User Story artifacts (created dynamically)
  README.md       - SDLC documentation

tools/
  dashboard/      - Live status dashboard
  confluence/     - Confluence publishing script

.github/
  workflows/      - CI and Confluence publishing automation
```

## Artifacts Created

For each User Story, artifacts are stored in `docs/artifacts/<USER_STORY_ID>/`:

- `status.md` - Current phase and approval state
- `user-story.md` - Jira User Story
- `requirements.md` - Functional and non-functional requirements
- `architecture.md` - High-level design
- `design-review.md` - Design review findings
- `impl-plan.md` - Implementation plan
- `review.md` - Code review findings
- `verification.md` - Test results and verification
- `confluence-status.json` - Confluence publication metadata

## Human-in-the-Loop

**Critical:** This workflow requires explicit human approval between every phase.

- Workflow executes one phase at a time
- After each phase, human must review the artifact
- Re-invoking `/workflow <ID>` = approval
- Workflow never auto-advances through phases

## Security

- Never commit `.env` file (in `.gitignore`)
- Use GitHub Secrets for CI/CD credentials
- API tokens stored securely
- No credentials in logs or artifacts

## Troubleshooting

### Workflow stuck waiting for approval
- Check `docs/artifacts/<USER_STORY_ID>/status.md`
- Look for `Pending Human Approval` field
- Re-invoke workflow to approve and continue

### Dashboard not updating
- Ensure status.md file exists
- Check dashboard is watching correct User Story ID
- Restart dashboard: `npm run dashboard <USER_STORY_ID>`

### MCP connection failed
- Verify `.env` has correct credentials
- Check API token is valid
- Ensure `.claude/mcp.json` references correct env vars

## License

MIT
