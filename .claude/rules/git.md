# Git Workflow Rules

## Branch Strategy

### Branch Naming Convention
```
feature/<USER_STORY_ID>-<short-description>
bugfix/<USER_STORY_ID>-<short-description>
hotfix/<issue-description>
```

Examples:
- `feature/CJS-2-login-page`
- `bugfix/CJS-3-validation-fix`

### Main Branch Protection
- `main` is the primary branch
- All work goes through Pull Requests
- Direct commits to `main` are forbidden
- Require approval before merge

## Commit Message Standards

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature (Phase 05)
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples
```
feat(login): implement authentication form

- Add email/password inputs
- Implement validation logic
- Connect to auth API

Resolves: CJS-2
```

```
docs(requirements): add functional requirements for CJS-2

Created requirements.md artifact with:
- 8 functional requirements
- 5 non-functional requirements

Phase: 01-Requirements
```

## Commit Guidelines

### Atomic Commits
- One logical change per commit
- Should be revertable independently
- Clear commit messages

### What NOT to Commit
- Generated files (build artifacts)
- `node_modules/` (use .gitignore)
- IDE-specific files (use .gitignore)
- Secrets or credentials (CRITICAL)
- Large binary files

### Pre-commit Checks
Run before every commit:
1. Secrets scan (automated via hook)
2. Linting (if configured)
3. Tests pass (for code commits)

## Pull Request Workflow

### PR Creation (Phase 08)
1. Push feature branch to origin
2. Create PR with template
3. Link to User Story (e.g., "Resolves CJS-2")
4. Attach SDLC artifacts

### PR Review
- At least 1 approval required
- All CI checks must pass
- No merge conflicts
- Secrets scan passed

### PR Description Template
```markdown
## User Story
[CJS-2] Login Page Implementation

## Changes
- Implemented login form component
- Added validation logic
- Created unit and integration tests

## SDLC Artifacts
- Requirements: docs/artifacts/CJS-2/requirements.md
- Architecture: docs/artifacts/CJS-2/architecture.md
- Verification: docs/artifacts/CJS-2/verification.md

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing completed

## Screenshots
[If applicable]
```

## Git Commands Reference

### Starting Work
```bash
# Create feature branch
git checkout -b feature/CJS-2-login-page

# Start workflow
/workflow CJS-2
```

### During Development
```bash
# Check status
git status

# Stage changes
git add <files>

# Commit with message
git commit -m "feat(login): implement form validation"

# Push to remote
git push origin feature/CJS-2-login-page
```

### After PR Merge
```bash
# Switch back to main
git checkout main

# Pull latest changes
git pull origin main

# Delete local branch
git branch -d feature/CJS-2-login-page

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/CJS-2-login-page
```

## Recovery Scenarios

### Undo Last Commit (Not Pushed)
```bash
git reset --soft HEAD~1
```

### Undo Changes in Working Directory
```bash
git checkout -- <file>
```

### Fix Commit Message
```bash
git commit --amend -m "new message"
```

### Revert a Merged PR
```bash
git revert <commit-hash>
```

## Branch Cleanup

### List Merged Branches
```bash
git branch --merged
```

### Delete Merged Branches
```bash
git branch -d <branch-name>
```

### Prune Deleted Remote Branches
```bash
git fetch --prune
```
