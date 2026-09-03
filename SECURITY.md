# Security Guidelines

## Critical Security Rules

### 🚨 NEVER Commit Sensitive Files

The following files must **NEVER** be committed to git:

1. **mcp.json** - Contains MCP server credentials
2. **.env** - Contains environment variables
3. **.claude/mcp.json** - Contains Claude-specific credentials
4. Any file with API tokens, passwords, or secrets

These files are explicitly listed in `.gitignore` to prevent accidental commits.

### ✅ How to Handle Credentials

**DO:**
- Use environment variables for all credentials
- Use `${VARIABLE_NAME}` placeholders in config files
- Create `.example` template files (e.g., `mcp.json.example`)
- Store actual credentials in `.env` file (gitignored)
- Mask tokens when logging/debugging as `!@#$$$#@` or `***REDACTED***`

**DON'T:**
- Hardcode credentials in any file
- Commit config files with real tokens
- Share credentials in chat/issues/PRs
- Include credentials in screenshots

### 📝 Configuration Template Pattern

For any config file requiring credentials:

1. Create `filename.example` with placeholders:
   ```json
   {
     "token": "${API_TOKEN}",
     "password": "!@#$$$#@"
   }
   ```

2. Add actual `filename` to `.gitignore`

3. Document required variables in `.env.example`

### 🔒 Token Discovery Policy

**If you discover tokens in the codebase:**

1. **STOP** - Do not commit the file
2. **MASK** - Replace token with `!@#$$$#@` or `${ENV_VAR}`
3. **NOTIFY** - Alert the team
4. **REVOKE** - Invalidate the exposed token immediately
5. **REWRITE** - Use `git filter-branch` to remove from history if already committed

### 🛡️ .gitignore Entries

Current protected files:
```
# Credentials and secrets
.env
.env.local
mcp.json
.claude/mcp.json

# Template files (DO commit these)
!.env.example
!mcp.json.example
```

### 🔍 Pre-Commit Checklist

Before every commit:
- [ ] No hardcoded credentials
- [ ] All secrets use environment variables
- [ ] Config files only have `${PLACEHOLDER}` or `!@#$$$#@`
- [ ] `.gitignore` is up to date
- [ ] Reviewed `git diff` for sensitive data

### ⚠️ GitHub Push Protection

GitHub automatically scans for secrets and will **block pushes** containing:
- API tokens
- Private keys
- Passwords
- Access tokens

**If blocked:**
1. Do NOT bypass without review
2. Remove the secret from all commits
3. Rewrite git history: `git filter-branch --index-filter 'git rm --cached --ignore-unmatch <file>'`
4. Force push: `git push --force`
5. Revoke the exposed credential

### 🔐 Credential Storage

**Local Development:**
- Use `.env` file (gitignored)
- Use system keychain/credential manager
- Use Claude Code secure storage

**CI/CD:**
- Use GitHub Secrets
- Use environment variables in GitHub Actions
- Never log secrets in CI output

### 📋 MCP Configuration Security

**Correct (using environment variables):**
```json
{
  "mcpServers": {
    "atlassian": {
      "env": {
        "ATLASSIAN_API_TOKEN": "${ATLASSIAN_API_TOKEN}"
      }
    }
  }
}
```

**WRONG (hardcoded token):**
```json
{
  "mcpServers": {
    "atlassian": {
      "env": {
        "ATLASSIAN_API_TOKEN": "ATATT3xFfGF0XHcw..."  ❌ NEVER DO THIS
      }
    }
  }
}
```

### 🚀 Deployment Security

**Production deployments must:**
- Use HTTPS only
- Set Content-Security-Policy headers
- Configure security headers (X-Frame-Options, X-Content-Type-Options)
- Store credentials in secure vault (AWS Secrets Manager, Azure Key Vault)
- Enable audit logging
- Use principle of least privilege for API tokens

### 📞 Incident Response

**If credentials are exposed:**

1. **Immediate Actions (< 5 minutes):**
   - Revoke the exposed token/credential immediately
   - Document what was exposed and where

2. **Short-term Actions (< 1 hour):**
   - Remove from git history using `git filter-branch`
   - Force push to overwrite remote history
   - Generate new credentials
   - Update all systems using the old credentials

3. **Follow-up Actions (< 24 hours):**
   - Review access logs for unauthorized use
   - Update security documentation
   - Notify security team if required
   - Post-mortem: How did it happen? How to prevent?

### 📚 Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Git Filter-Branch](https://git-scm.com/docs/git-filter-branch)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Last Updated:** 2026-09-03  
**Status:** Active - All team members must follow these guidelines
