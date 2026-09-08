# SDLC Workflow Rules

This directory contains the core rules that govern the SDLC workflow execution.

## Rule Files

### 📁 agent-operations.md
**Agent Operational Rules**
- Dynamic User Story ID handling
- Artifact isolation and templates
- Dual-mode operation (workflow vs standalone)
- Phase dependencies
- Error handling patterns

**When to reference:** Building/modifying phase agents, creating artifacts, or handling agent invocations.

### 📁 secrets.md
**Security & Secrets Management**
- Credential protection policies
- Token masking standards
- GitHub push protection
- Incident response procedures
- Environment-specific credential storage

**When to reference:** Before committing code, handling credentials, or configuring integrations.

### 📁 git.md
**Git Workflow Standards**
- Branch naming conventions
- Commit message standards
- Pull request workflow
- Code review checklist
- Branch cleanup procedures

**When to reference:** Creating branches, committing code, creating PRs, or reviewing code.

### 📁 workflow-state.md
**Workflow State Management**
- `status.md` schema and rules
- State transitions and validations
- Update responsibilities (workflow vs agents)
- Recovery procedures
- Persistence and concurrency

**When to reference:** Managing workflow state, handling interruptions, or recovering from errors.

### 📁 code-quality.md
**Code Quality Standards**
- Coding conventions
- Naming standards
- Testing requirements
- Security practices (OWASP Top 10)
- Performance guidelines

**When to reference:** Writing code, creating tests, reviewing implementations, or ensuring quality.

## Rule Hierarchy

```
CLAUDE.md (project overview)
    ↓
.claude/rules/* (all rules)
    ↓
Individual agent files (.claude/agents/*)
```

## Usage

### For Phase Agents
- Read relevant rules during execution
- Validate actions against rules
- Report violations clearly

### For Workflow Coordinator
- Enforce rules across all phases
- Validate state transitions
- Check prerequisites

### For Developers
- Reference before making changes
- Follow standards consistently
- Update rules when patterns emerge

## Integration Points

### Git Hooks
- `.claude/hooks/check-secrets.sh` enforces `secrets.md`
- Runs on pre-commit
- Blocks commits with detected secrets

### Settings
- `.claude/settings.json` references these rules
- Permissions configured per rules
- Hooks enabled based on rules

### Artifacts
- Artifacts follow rules in `code-quality.md`
- State managed per `workflow-state.md`
- Git workflow per `git.md`

## Maintenance

### Adding New Rules
1. Create rule file: `.claude/rules/new-rule.md`
2. Document clearly with examples
3. Update this README
4. Reference from `shared.md`
5. Update `CLAUDE.md` overview

### Updating Rules
1. Edit rule file directly
2. Note breaking changes
3. Update affected agents
4. Test workflow end-to-end

### Deprecating Rules
1. Mark as deprecated in file
2. Add migration guide
3. Update dependent files
4. Remove after migration period

## Quick Reference Card

| Scenario | Rule File | Key Section |
|----------|-----------|-------------|
| Building agents | `agent-operations.md` | Agent Rules, Templates |
| Creating artifacts | `agent-operations.md` | Artifact Templates |
| Committing code | `secrets.md`, `git.md` | Commit Guidelines, Protected Files |
| Creating PR | `git.md` | PR Workflow, PR Template |
| Writing tests | `code-quality.md` | Testing Standards, Coverage |
| Managing state | `workflow-state.md` | State Transitions, Update Rules |
| Adding credentials | `secrets.md` | Credential Storage, Template Pattern |
| Code review | `code-quality.md`, `git.md` | Code Review Checklist |
| Handling errors | `agent-operations.md`, `workflow-state.md` | Error Handling, Recovery |
| Security check | `secrets.md`, `code-quality.md` | OWASP Top 10, Input Validation |

## Support

For questions or clarifications:
1. Check rule file directly
2. Review `CLAUDE.md` overview
3. Consult team lead
4. Update rule if ambiguous
