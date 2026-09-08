# Integration Checklist

This checklist helps verify the new structure is properly integrated and working.

## ✅ Structure Verification

### Directories Created
- [ ] `.claude/hooks/` exists
- [ ] `.claude/rules/` exists with 5 files
- [ ] `context/` exists with README and JSON

### Files Created
- [ ] `.claude/hooks/check-secrets.sh` (executable)
- [ ] `.claude/rules/secrets.md`
- [ ] `.claude/rules/git.md`
- [ ] `.claude/rules/workflow-state.md`
- [ ] `.claude/rules/code-quality.md`
- [ ] `.claude/rules/README.md`
- [ ] `.claude/settings.json`
- [ ] `.claude/settings.local.json`
- [ ] `context/workflow-context.json`
- [ ] `context/README.md`
- [ ] `STRUCTURE.md`

### Files Updated
- [ ] `.claude/instructions/shared.md` (references rules)
- [ ] `CLAUDE.md` (updated architecture section)
- [ ] `.gitignore` (added settings.local.json)

### Preserved
- [ ] All 9 phase agents (00-08) unchanged
- [ ] `workflow.md` unchanged
- [ ] `docs/` structure intact
- [ ] `node_modules/` present
- [ ] `tools/` present
- [ ] `login-app/` present

## 🔒 Security Integration

### Pre-commit Hook
```bash
# Test the hook
bash .claude/hooks/check-secrets.sh
```
Expected: "✅ No secrets detected. Safe to commit."

### Git Hook Installation (Optional)
To make the hook run automatically on every commit:
```bash
# Option 1: Symbolic link
ln -s ../../.claude/hooks/check-secrets.sh .git/hooks/pre-commit

# Option 2: Copy
cp .claude/hooks/check-secrets.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Protected Files
Verify these are in `.gitignore`:
- [ ] `mcp.json`
- [ ] `.claude/mcp.json`
- [ ] `.env`
- [ ] `.env.local`
- [ ] `.claude/settings.local.json`

## ⚙️ Settings Verification

### Project Settings
```bash
# Verify settings.json is valid JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('.claude/settings.json', 'utf8')).description)"
```
Expected: "Project-level Claude Code settings for SDLC workflow"

### Local Settings
```bash
# Verify settings.local.json is valid JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('.claude/settings.local.json', 'utf8')).description)"
```
Expected: "User-specific local settings (gitignored, not committed)"

## 📋 Context Verification

### Workflow Context
```bash
# Verify workflow-context.json is valid JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('context/workflow-context.json', 'utf8')).description)"
```
Expected: "Runtime context for SDLC workflow execution"

## 📚 Documentation Verification

### Rule Files
Check each rule file is complete:
- [ ] `secrets.md` has token masking policy
- [ ] `git.md` has branch naming conventions
- [ ] `workflow-state.md` has state schema
- [ ] `code-quality.md` has testing standards

### Structure Documentation
- [ ] `STRUCTURE.md` describes complete layout
- [ ] `context/README.md` explains context vs state
- [ ] `.claude/rules/README.md` has quick reference

## 🧪 Functional Testing

### Test 1: Secrets Detection
```bash
# Create test file with fake secret
echo "api_key=test123" > test-secret.txt
git add test-secret.txt

# Run hook (should block)
bash .claude/hooks/check-secrets.sh
# Expected: ❌ Potential secret found

# Clean up
rm test-secret.txt
git reset HEAD test-secret.txt
```

### Test 2: Workflow Still Works
```bash
# Test workflow invocation (don't actually run)
# Just verify the command is recognized
claude "help run-sdlc-workflow"
```

### Test 3: Agent Access to Rules
```bash
# Verify agents can read rules
cat .claude/rules/secrets.md | head -5
```

### Test 4: Context Read/Write
```bash
# Read context
node -e "console.log(require('./context/workflow-context.json').environment.platform)"
# Expected: win32 (or your platform)

# Write context (test)
node -e "
const fs = require('fs');
const ctx = JSON.parse(fs.readFileSync('context/workflow-context.json', 'utf8'));
ctx.metrics.totalWorkflows = 1;
fs.writeFileSync('context/workflow-context.json', JSON.stringify(ctx, null, 2));
console.log('Context updated');
"
# Expected: Context updated
```

## 🔍 Integration Points

### Phase Agents
- [ ] Agents can reference `.claude/rules/secrets.md`
- [ ] Agents can reference `.claude/rules/git.md`
- [ ] Agents follow `.claude/instructions/shared.md`
- [ ] Shared instructions reference rules

### Workflow Coordinator
- [ ] `workflow.md` can access settings
- [ ] `workflow.md` can update context
- [ ] `workflow.md` manages state per rules

### Dashboard
- [ ] Dashboard can read `context/workflow-context.json`
- [ ] Dashboard can read `status.md` files
- [ ] Dashboard displays integration status

## 🚀 Next Steps

After completing checklist:

1. **Commit Changes**
   ```bash
   git add .claude/hooks .claude/rules .claude/settings.json context STRUCTURE.md
   git add .claude/instructions/shared.md CLAUDE.md .gitignore
   git commit -m "feat: integrate team-recommended SDLC structure

   - Add .claude/hooks/ with pre-commit secrets scanner
   - Add .claude/rules/ with organized workflow rules
   - Add context/ for runtime metadata
   - Add settings.json and settings.local.json
   - Update documentation and references
   
   Preserves existing agents, workflow, and useful directories"
   ```

2. **Test End-to-End**
   ```bash
   # Run a workflow
   /workflow <TEST_USER_STORY_ID>
   ```

3. **Review with Team**
   - Show new structure (`STRUCTURE.md`)
   - Demonstrate security hook
   - Walk through rules
   - Validate against team requirements

4. **Optional: Install Git Hook**
   ```bash
   ln -s ../../.claude/hooks/check-secrets.sh .git/hooks/pre-commit
   ```

5. **Configure Local Settings**
   - Edit `.claude/settings.local.json` for your preferences
   - Add personal overrides (won't be committed)

## ❓ Troubleshooting

### Hook Not Executable
```bash
chmod +x .claude/hooks/check-secrets.sh
```

### Invalid JSON in Settings
```bash
# Validate with jq (if installed)
jq . .claude/settings.json

# Or with Node
node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json', 'utf8'))"
```

### Context File Missing
```bash
# Regenerate from template
cat > context/workflow-context.json << 'EOF'
{
  "description": "Runtime context for SDLC workflow execution",
  "currentWorkflow": null,
  "environment": {
    "platform": "win32",
    "workingDirectory": "C:\\Users\\SwarnaAnaparthi\\claude-agentic-sdlc-capstone"
  },
  "integrations": {
    "jira": {"connected": false},
    "github": {"connected": true}
  },
  "metrics": {
    "totalWorkflows": 0
  }
}
EOF
```

### Rules Not Loading
Verify path in `shared.md`:
```bash
grep -r "\.claude/rules" .claude/instructions/shared.md
```

## ✨ Success Criteria

You've successfully integrated when:
- ✅ All checklist items marked complete
- ✅ Secrets hook blocks test commit
- ✅ All JSON files validate
- ✅ Documentation accurate and accessible
- ✅ Existing workflow still functions
- ✅ Structure matches team recommendation
- ✅ Security measures active
- ✅ Rules organized and referenced
