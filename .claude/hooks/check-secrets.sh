#!/usr/bin/env bash
# Pre-commit hook to prevent committing secrets
# This hook scans files for potential secrets before allowing commits

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Checking for secrets in staged files...${NC}"

# Files that should never be committed
FORBIDDEN_FILES=(
    "mcp.json"
    ".claude/mcp.json"
    ".env"
    ".env.local"
    "confluence-credentials.json"
)

# Patterns that indicate potential secrets
SECRET_PATTERNS=(
    "api[_-]?key"
    "api[_-]?token"
    "auth[_-]?token"
    "password"
    "secret"
    "client[_-]?secret"
    "access[_-]?token"
    "bearer[[:space:]]"
    "private[_-]?key"
    "aws[_-]?access"
    "AKIA[0-9A-Z]{16}"
    "confluence[_-]?token"
)

# Check if any forbidden files are staged
for file in "${FORBIDDEN_FILES[@]}"; do
    if git diff --cached --name-only | grep -q "^${file}$"; then
        echo -e "${RED}❌ BLOCKED: Attempted to commit forbidden file: ${file}${NC}"
        echo -e "${RED}   This file contains secrets and must NOT be committed.${NC}"
        exit 1
    fi
done

# Check staged files for secret patterns
FOUND_SECRETS=false
while IFS= read -r file; do
    # Skip binary files and node_modules
    if [[ "$file" =~ node_modules ]] || [[ "$file" =~ \.png$ ]] || [[ "$file" =~ \.jpg$ ]] || [[ "$file" =~ \.pdf$ ]]; then
        continue
    fi

    # Check if file exists (handles deletions)
    if [[ ! -f "$file" ]]; then
        continue
    fi

    for pattern in "${SECRET_PATTERNS[@]}"; do
        if grep -iE "$pattern" "$file" | grep -v "EXAMPLE\|PLACEHOLDER\|!@#\$\$\$#@\|\${" > /dev/null 2>&1; then
            echo -e "${RED}❌ Potential secret found in: ${file}${NC}"
            echo -e "${RED}   Pattern: ${pattern}${NC}"
            grep -inE "$pattern" "$file" | grep -v "EXAMPLE\|PLACEHOLDER\|!@#\$\$\$#@\|\${" || true
            FOUND_SECRETS=true
        fi
    done
done < <(git diff --cached --name-only)

if [ "$FOUND_SECRETS" = true ]; then
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}⚠️  COMMIT BLOCKED: Potential secrets detected${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}Required actions:${NC}"
    echo "1. Replace secrets with placeholders (e.g., !@#\$\$\$#@ or \${ENV_VAR})"
    echo "2. Move secrets to .env file (which is gitignored)"
    echo "3. Update affected files to use environment variables"
    echo ""
    echo -e "${YELLOW}To bypass this check (NOT RECOMMENDED):${NC}"
    echo "git commit --no-verify"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ No secrets detected. Safe to commit.${NC}"
exit 0
