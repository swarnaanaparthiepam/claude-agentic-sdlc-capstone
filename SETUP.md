# Project Setup Guide

## Prerequisites

- Node.js 20.x LTS
- Git
- GitHub account
- Atlassian (Jira/Confluence) account with API access

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/swarnaanaparthiepam/claude-agentic-sdlc-capstone.git
cd claude-agentic-sdlc-capstone
```

### 2. Configure MCP Credentials

⚠️ **IMPORTANT:** Never commit `mcp.json` with real credentials!

**Step 1:** Copy the template
```bash
cp mcp.json.example mcp.json
```

**Step 2:** Edit `mcp.json` with your credentials
```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": ["-y", "@aashari/mcp-server-atlassian-jira"],
      "env": {
        "ATLASSIAN_INSTANCE_URL": "https://your-domain.atlassian.net",
        "ATLASSIAN_EMAIL": "your-email@example.com",
        "ATLASSIAN_API_TOKEN": "your-actual-token-here"
      }
    },
    "confluence": {
      "command": "npx",
      "args": ["-y", "@soos/mcp-server-confluence"],
      "env": {
        "CONFLUENCE_URL": "https://your-domain.atlassian.net/wiki",
        "CONFLUENCE_USERNAME": "your-email@example.com",
        "CONFLUENCE_API_TOKEN": "your-actual-token-here"
      }
    }
  }
}
```

**Step 3:** Verify `mcp.json` is gitignored
```bash
git check-ignore mcp.json
# Should output: mcp.json
```

### 3. Get Atlassian API Token

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "SDLC Capstone MCP")
4. Copy the token immediately (you won't see it again)
5. Paste into `mcp.json` file

### 4. Install Dependencies

For the login application:
```bash
cd login-app
npm install
```

For the dashboard (optional):
```bash
cd dashboard
npm install
```

### 5. Verify Setup

Test the login application:
```bash
cd login-app
npm run dev
# Open http://localhost:5173
```

Run tests:
```bash
npm test
```

Build for production:
```bash
npm run build
```

## Using the SDLC Workflow

### Run Complete Workflow

```bash
/workflow <JIRA_ISSUE_ID>
# Example: /workflow CJS-2
```

### Run Individual Phases

```bash
# Phase 00: Fetch User Story from Jira
"Execute Phase 00 for User Story CJS-3"

# Phase 01: Requirements Analysis
"Analyze requirements for CJS-3"

# Phase 02: Architecture Design
"Design architecture for CJS-3"

# Phase 03: Design Review
"Execute Phase 03 for CJS-3"

# Phase 04: Implementation Planning
"Create implementation plan for CJS-3"

# Phase 05: Implementation
"Implement application for CJS-3"

# Phase 06: Code Review
"Review code for CJS-3"

# Phase 07: Verification
"Execute Phase 07 for CJS-3"

# Phase 08: Pull Request
"Execute Phase 08 for CJS-3"
```

## Dashboard Setup (Optional)

Real-time monitoring dashboard for SDLC workflow:

```bash
cd dashboard
npm install
npm start <USER_STORY_ID>
# Example: npm start CJS-2
# Open http://localhost:3000
```

## Security Checklist

Before committing:
- [ ] No hardcoded credentials in any files
- [ ] `mcp.json` is gitignored and not staged
- [ ] All tokens replaced with `${VARIABLE}` in example files
- [ ] Reviewed `git diff` for sensitive data
- [ ] `.env` file not committed

## Troubleshooting

### MCP Connection Issues

If Jira/Confluence MCP fails:
1. Verify token is valid: https://id.atlassian.com/manage-profile/security/api-tokens
2. Check instance URL has no trailing slash
3. Confirm email matches Atlassian account
4. Test token with curl:
   ```bash
   curl -u your-email@example.com:YOUR_TOKEN \
     https://your-domain.atlassian.net/rest/api/3/myself
   ```

### Git Push Blocked by Secret Scanning

If GitHub blocks your push:
1. Check what was detected: Read error message
2. Remove from current commit: `git reset HEAD~1`
3. Fix the file (use placeholders)
4. Commit again
5. If already in history: Use `git filter-branch` (see SECURITY.md)

### Login App Build Fails

If TypeScript compilation fails:
```bash
cd login-app
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Next Steps

1. ✅ Repository cloned
2. ✅ MCP credentials configured
3. ✅ Dependencies installed
4. ✅ Tests passing
5. ▶️  Run your first workflow: `/workflow CJS-<YOUR-ISSUE>`

## Resources

- [CLAUDE.md](./CLAUDE.md) - Project instructions
- [SECURITY.md](./SECURITY.md) - Security guidelines
- [login-app/README.md](./login-app/README.md) - Login app documentation
- [.claude/workflow.md](./.claude/workflow.md) - SDLC workflow details

---

**Questions?** Check existing artifacts in `docs/artifacts/CJS-2/` for examples.
