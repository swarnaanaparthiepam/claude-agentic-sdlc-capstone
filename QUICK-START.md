# Quick Start Guide

## New Structure at a Glance

### 🎯 What Changed
Your repository now has the team-recommended structure with organized rules, security hooks, and proper configuration management.

### 📁 Key Directories

```
.claude/
├── hooks/     → Security pre-commit scanner
├── rules/     → Workflow rules (security, git, state, quality)
└── settings.* → Configuration (project + local)

context/       → Runtime workflow metadata
```

### 🚀 Common Tasks

#### Run Security Check
```bash
bash .claude/hooks/check-secrets.sh
```

#### Check Repository Structure
```bash
cat STRUCTURE.md
```

#### Review Rules
```bash
# All rules
ls .claude/rules/

# Specific rule
cat .claude/rules/secrets.md
cat .claude/rules/git.md
```

#### Configure Locally
```bash
# Edit local settings (gitignored)
code .claude/settings.local.json
```

#### Run Workflow (Unchanged)
```bash
/workflow CJS-2
```

### 📖 Documentation

| Document | Purpose |
|----------|---------|
| `STRUCTURE.md` | Complete structure guide |
| `MIGRATION-SUMMARY.md` | What changed and why |
| `INTEGRATION-CHECKLIST.md` | Verification steps |
| `QUICK-START.md` | This file |

### 🔒 Security

**Protected Files (Never Commit):**
- `mcp.json`
- `.env`
- `.claude/settings.local.json`

**Pre-commit Hook:**
- Automatically scans for secrets
- Blocks unsafe commits
- Provides remediation guidance

### ⚙️ Configuration

**Project Settings:** `.claude/settings.json` (committed)
- Permissions
- Hook configuration
- Integration settings

**Local Overrides:** `.claude/settings.local.json` (gitignored)
- Personal preferences
- Local paths
- Development flags

### 📋 Rules Reference

| Rule File | Quick Access |
|-----------|--------------|
| Security | `.claude/rules/secrets.md` |
| Git Workflow | `.claude/rules/git.md` |
| State Management | `.claude/rules/workflow-state.md` |
| Code Quality | `.claude/rules/code-quality.md` |

### ✅ Quick Validation

```bash
# All-in-one test
bash .claude/hooks/check-secrets.sh && \
node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8'))" && \
echo "✅ All checks passed"
```

### 🎓 Next Steps

1. **Review** `STRUCTURE.md` for complete layout
2. **Read** `.claude/rules/README.md` for governance
3. **Test** the security hook
4. **Configure** local settings if needed
5. **Continue** using your workflow as before

### ❓ Questions?

- **Structure:** See `STRUCTURE.md`
- **Rules:** See `.claude/rules/README.md`
- **Migration:** See `MIGRATION-SUMMARY.md`
- **Checklist:** See `INTEGRATION-CHECKLIST.md`

---

**Everything else works exactly as before!** ✨
