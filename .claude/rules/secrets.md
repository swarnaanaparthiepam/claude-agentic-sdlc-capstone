# Security & Secrets Management Rules

## Critical Rules - NEVER VIOLATE

### 1. Never Commit Credentials
**FORBIDDEN FILES - NEVER COMMIT:**
- `mcp.json` or `.claude/mcp.json` - MCP server credentials
- `.env` or `.env.local` - Environment variables
- Any file containing API keys, tokens, passwords, or secrets

### 2. Token Masking Policy
If you discover any token/credential in code:
1. **STOP** - Do not commit the file
2. **Replace** with `!@#$$$#@` or `${ENVIRONMENT_VARIABLE}`
3. **Alert** immediately
4. **Remove from history** using `git filter-branch` if already committed

### 3. Always Use Environment Variables
- Store credentials in `.env` (gitignored)
- Reference as `process.env.VARIABLE_NAME` in code
- Use `.env.example` templates with placeholders

### 4. Template Pattern
Create `.example` files with placeholders:
```json
{
  "apiKey": "${JIRA_API_TOKEN}",
  "email": "${JIRA_USER_EMAIL}"
}
```

## GitHub Push Protection
- GitHub blocks pushes containing detected secrets
- **DO NOT bypass** without proper review and remediation
- See `SECURITY.md` for incident response procedures

## Credential Storage by Environment

### Local Development
- Use `.env` file (gitignored)
- Load via `dotenv` package
- Never commit to version control

### CI/CD Pipelines
- Use GitHub Secrets
- Access via `${{ secrets.SECRET_NAME }}`
- Rotate regularly

### Production
- Use secure vault services:
  - AWS Secrets Manager
  - Azure Key Vault
  - HashiCorp Vault

## Protected File Patterns

The pre-commit hook (`.claude/hooks/check-secrets.sh`) scans for:
- Forbidden filenames
- Secret patterns (api_key, token, password, etc.)
- Credential-like strings

## Incident Response

If credentials are exposed:
1. **Revoke** the token immediately
2. **Remove** from git history
3. **Force push** to overwrite remote
4. **Document** the incident
5. **Rotate** all related credentials

See `SECURITY.md` for detailed procedures.

## Bypass (Emergency Only)
```bash
git commit --no-verify
```
⚠️ **WARNING:** Only use when absolutely necessary and with explicit approval.
