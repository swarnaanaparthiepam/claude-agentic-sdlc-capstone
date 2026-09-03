---
name: 09-confluence
description: Publish SDLC summary and artifacts to Confluence after PR merge
type: phase-agent
---

# Phase 09: Confluence Publishing Agent

## Purpose

Publish a high-level SDLC summary page to Confluence documenting the complete workflow execution, artifacts, and outcomes for a User Story.

**This phase should ONLY run AFTER Phase 08 (PR) is complete and the PR has been merged.**

## Prerequisites

Before executing this phase, verify:

1. **Phase 08 Complete:** PR has been created on GitHub
2. **PR Merged:** The feature branch has been merged to main/master
3. **All Artifacts Exist:**
   - `docs/artifacts/<USER_STORY_ID>/user-story.md`
   - `docs/artifacts/<USER_STORY_ID>/requirements.md`
   - `docs/artifacts/<USER_STORY_ID>/architecture.md`
   - `docs/artifacts/<USER_STORY_ID>/design-review.md`
   - `docs/artifacts/<USER_STORY_ID>/impl-plan.md`
   - `docs/artifacts/<USER_STORY_ID>/review.md`
   - `docs/artifacts/<USER_STORY_ID>/verification.md`
   - `docs/artifacts/<USER_STORY_ID>/status.md`
4. **Confluence Credentials:** MCP server configured with valid Confluence API token

## Invocation Modes

### Workflow Mode (Invoked BY workflow.md)

**Input:** `workflow_context.user_story_id` provided by workflow orchestrator

**Behavior:**
- Read User Story ID from workflow context
- Validate Phase 08 completed and PR merged
- Generate Confluence page content from artifacts
- Publish to Confluence via MCP
- Update status.md with Confluence URL
- Return brief completion message to workflow

### Standalone Mode (Invoked DIRECTLY by user)

**Triggers:**
- User prompt: "Execute Phase 09 for User Story CJS-2"
- User prompt: "Publish to Confluence for CJS-2"
- User prompt: "Execute Confluence publishing for CJS-2"

**Behavior:**
- Extract User Story ID from prompt
- Validate prerequisites (Phase 08 complete, PR merged)
- Generate Confluence page
- Publish to Confluence
- Update status.md
- Report detailed completion with Confluence URL

## Inputs

- **User Story ID** (e.g., "CJS-2")
- **Confluence Space Key** (from MCP config or user)
- **Parent Page ID** (optional - where to create the page)

## Outputs

### Primary Artifact

**`docs/artifacts/<USER_STORY_ID>/confluence-status.json`**

```json
{
  "published": true,
  "confluenceUrl": "https://your-domain.atlassian.net/wiki/spaces/SPACE/pages/123456/CJS-2+Summary",
  "pageId": "123456",
  "spaceKey": "SDLC",
  "publishedAt": "2026-09-03T23:50:00+0530",
  "publishedBy": "claude-code-agent-09"
}
```

### Status.md Update

Append to `status.md`:

```markdown
**Confluence Publication:**
- Published: Yes
- URL: https://your-domain.atlassian.net/wiki/spaces/SPACE/pages/123456
- Published: 2026-09-03T23:50:00+0530
- Status: SUCCESS
```

## Confluence Page Structure

### High-Level SDLC Summary Page

The published Confluence page includes:

#### 1. **Page Header**
```
Title: [USER_STORY_ID]: [User Story Title] - SDLC Summary
Labels: sdlc, automated, [user-story-id]
```

#### 2. **Overview Panel** (Confluence info macro)
- User Story ID and link to Jira
- Status: COMPLETE
- GitHub PR link
- Completion date
- All 8 phases completed checkmarks

#### 3. **Quick Stats Table**
| Metric | Value |
|--------|-------|
| Functional Requirements | X/X met |
| Non-Functional Requirements | X/X met |
| Test Coverage | 100% |
| Tests Passing | 14/14 |
| Code Review Status | Approved |
| Verification Status | PASS |

#### 4. **Phase Execution Timeline** (Confluence expand macro)
```
Phase 00: Input - ✅ COMPLETE
Phase 01: Requirements - ✅ COMPLETE
Phase 02: Architecture - ✅ COMPLETE
Phase 03: Design Review - ✅ COMPLETE
Phase 04: Planning - ✅ COMPLETE
Phase 05: Implementation - ✅ COMPLETE
Phase 06: Code Review - ✅ COMPLETE
Phase 07: Verification - ✅ COMPLETE
Phase 08: PR & Publishing - ✅ COMPLETE
```

#### 5. **Artifacts Section**
Links to GitHub artifacts:
- 📄 User Story (Jira link)
- 📄 Requirements Document (GitHub link)
- 📄 Architecture Design (GitHub link)
- 📄 Design Review (GitHub link)
- 📄 Implementation Plan (GitHub link)
- 📄 Code Review Report (GitHub link)
- 📄 Verification Report (GitHub link)
- 🔗 GitHub Pull Request

#### 6. **Implementation Summary**
- Technology stack used
- Key features delivered
- Test results
- Quality metrics

#### 7. **Traceability Matrix** (Confluence table)
User Story AC → Requirements → Implementation → Tests

## Execution Steps

### Step 1: Extract User Story ID

```plaintext
If workflow mode:
  user_story_id = workflow_context.user_story_id
Else (standalone mode):
  Extract from prompt (e.g., "CJS-2" from "Execute Phase 09 for CJS-2")
```

### Step 2: Validate Prerequisites

```bash
# Check Phase 08 complete
grep -q "Phase 08: PR" docs/artifacts/$USER_STORY_ID/status.md

# Check all artifacts exist
test -f docs/artifacts/$USER_STORY_ID/user-story.md
test -f docs/artifacts/$USER_STORY_ID/requirements.md
test -f docs/artifacts/$USER_STORY_ID/architecture.md
test -f docs/artifacts/$USER_STORY_ID/design-review.md
test -f docs/artifacts/$USER_STORY_ID/impl-plan.md
test -f docs/artifacts/$USER_STORY_ID/review.md
test -f docs/artifacts/$USER_STORY_ID/verification.md
test -f docs/artifacts/$USER_STORY_ID/status.md
```

If any prerequisite fails:
- **Workflow Mode:** Return error to workflow, halt
- **Standalone Mode:** Display clear error with missing prerequisites, suggest running previous phases

### Step 3: Read All Artifacts

Read and parse:
- `user-story.md` - Extract title, acceptance criteria count
- `requirements.md` - Extract FR/NFR counts
- `verification.md` - Extract test results, coverage metrics
- `review.md` - Extract code review status
- `status.md` - Extract PR URL, completion dates
- `impl-plan.md` - Extract task count
- `architecture.md` - Extract technology stack

### Step 4: Generate Confluence Page Content

Create Confluence Storage Format (XHTML) content with:
- Info panel with overview
- Status macros (success/warning/info)
- Tables for metrics and traceability
- Expand macros for detailed sections
- Links to GitHub artifacts and Jira

### Step 5: Publish to Confluence via MCP

Use Confluence MCP to:
1. **Create Page:**
   ```
   confluence_create_page(
     space: "SDLC",
     title: "[CJS-2] Simple Login Page - SDLC Summary",
     content: generated_content,
     parent_page_id: optional
   )
   ```

2. **Add Labels:**
   ```
   confluence_add_labels(
     page_id: created_page_id,
     labels: ["sdlc", "automated", "cjs-2", "complete"]
   )
   ```

3. **Attach Summary File (Optional):**
   Upload `verification.md` as attachment if needed

### Step 6: Save Publication Metadata

Create `confluence-status.json`:

```json
{
  "published": true,
  "confluenceUrl": "https://testingwithelitea.atlassian.net/wiki/spaces/SDLC/pages/123456",
  "pageId": "123456",
  "spaceKey": "SDLC",
  "parentPageId": "789012",
  "publishedAt": "2026-09-03T23:50:00+0530",
  "publishedBy": "claude-code-agent-09",
  "userStoryId": "CJS-2",
  "artifactsSummary": {
    "totalArtifacts": 8,
    "phases": 8,
    "requirementsMet": "15/15",
    "testsPassed": "14/14",
    "coverage": "100%"
  }
}
```

### Step 7: Update status.md

Append to `docs/artifacts/<USER_STORY_ID>/status.md`:

```markdown
**Confluence Publication:**
- Published: Yes
- URL: https://testingwithelitea.atlassian.net/wiki/spaces/SDLC/pages/123456
- Page ID: 123456
- Published: 2026-09-03T23:50:00+0530
- Status: SUCCESS
```

Update phase status:
```markdown
- [x] 08: PR
- [x] 09: Confluence Publishing

**Status:** COMPLETE (All 9 phases)
```

### Step 8: Return Completion Report

**Workflow Mode (Brief):**
```
Phase 09 (Confluence Publishing) COMPLETE
- Confluence URL: https://...
- Page ID: 123456
```

**Standalone Mode (Detailed):**
```markdown
# Phase 09: Confluence Publishing - COMPLETE

## Summary
Successfully published SDLC summary for User Story CJS-2 to Confluence.

## Publication Details
- **Confluence URL:** https://testingwithelitea.atlassian.net/wiki/spaces/SDLC/pages/123456
- **Page ID:** 123456
- **Space:** SDLC
- **Published:** 2026-09-03T23:50:00+0530

## Page Content Includes
✅ Overview panel with User Story summary
✅ Quick stats (15/15 requirements, 14/14 tests, 100% coverage)
✅ Phase execution timeline (all 8 phases complete)
✅ Artifact links (8 documents + GitHub PR)
✅ Implementation summary with technology stack
✅ Traceability matrix (User Story → Requirements → Implementation → Tests)

## Metadata Saved
- `confluence-status.json` created
- `status.md` updated with publication info

## Next Steps
✅ All SDLC phases complete
✅ Jira ticket CJS-2 can be closed
✅ Documentation published and accessible to team

**SDLC Workflow Status:** COMPLETE
```

## Error Handling

### Prerequisites Not Met

If Phase 08 not complete:
```
❌ Error: Phase 08 (PR Creation) not complete
   
   Phase 09 requires Phase 08 to be complete and PR merged.
   
   Current status: Phase 08 pending
   
   Next steps:
   1. Complete Phase 08: Execute Phase 08 for CJS-2
   2. Merge the GitHub PR
   3. Re-run Phase 09
```

### PR Not Merged

If PR exists but not merged:
```
⚠️  Warning: PR exists but not yet merged
   
   PR #2: https://github.com/.../pull/2
   Status: OPEN
   
   Phase 09 should run AFTER the PR is merged to publish final results.
   
   Options:
   1. Wait for PR merge, then re-run Phase 09
   2. Continue anyway (publish "pending merge" status)
   
   Proceed? (requires explicit confirmation)
```

### Confluence MCP Not Available

```
❌ Error: Confluence MCP server not available
   
   Cannot publish to Confluence without MCP connection.
   
   Troubleshooting:
   1. Check mcp.json has "confluence" server configured
   2. Verify CONFLUENCE_URL, CONFLUENCE_USERNAME, CONFLUENCE_API_TOKEN in mcp.json
   3. Test connection: Use Confluence MCP to list pages
   
   See: SETUP.md for Confluence MCP configuration
```

### Confluence Authentication Failed

```
❌ Error: Confluence authentication failed
   
   MCP server returned 401 Unauthorized
   
   Resolution:
   1. Verify API token is valid: https://id.atlassian.com/manage-profile/security/api-tokens
   2. Check email matches Atlassian account in mcp.json
   3. Ensure token has write permissions to Confluence space
   
   Security Note: Never commit real tokens to git. Use mcp.json (gitignored).
```

### Space Not Found

```
❌ Error: Confluence space "SDLC" not found
   
   Available options:
   1. Create space "SDLC" in Confluence
   2. Use existing space (provide space key)
   
   To use different space, update configuration or provide via prompt.
```

## Configuration

### Default Confluence Settings

```json
{
  "spaceKey": "SDLC",
  "parentPageTitle": "Automated SDLC Summaries",
  "pageLabels": ["sdlc", "automated", "claude-code"],
  "publishFormat": "storage",
  "includeAttachments": false
}
```

### Customization

Users can override via:
1. **Environment variables:**
   - `CONFLUENCE_SPACE_KEY`
   - `CONFLUENCE_PARENT_PAGE_ID`

2. **Direct specification in prompt:**
   - "Publish CJS-2 to Confluence space DEV"
   - "Publish CJS-2 under parent page 'Sprint 42'"

## Confluence Page Template

The agent uses this Confluence Storage Format template:

```xml
<ac:structured-macro ac:name="info">
  <ac:rich-text-body>
    <p><strong>User Story:</strong> <a href="JIRA_URL">CJS-2</a></p>
    <p><strong>Status:</strong> <ac:structured-macro ac:name="status">
      <ac:parameter ac:name="colour">Green</ac:parameter>
      <ac:parameter ac:name="title">COMPLETE</ac:parameter>
    </ac:structured-macro></p>
    <p><strong>GitHub PR:</strong> <a href="PR_URL">#2</a></p>
    <p><strong>Completed:</strong> 2026-09-03</p>
  </ac:rich-text-body>
</ac:structured-macro>

<h2>Quick Stats</h2>
<table>
  <tr><th>Metric</th><th>Value</th></tr>
  <tr><td>Functional Requirements</td><td>8/8 met ✅</td></tr>
  <tr><td>Non-Functional Requirements</td><td>7/7 met ✅</td></tr>
  <tr><td>Test Coverage</td><td>100%</td></tr>
  <tr><td>Tests Passing</td><td>14/14</td></tr>
  <tr><td>Code Review</td><td>Approved</td></tr>
  <tr><td>Verification</td><td>PASS</td></tr>
</table>

... (rest of content)
```

## Testing

Before publishing to production Confluence:

1. **Dry Run Mode:**
   - Generate content without publishing
   - Save to local file: `confluence-preview.html`
   - User reviews before actual publish

2. **Sandbox Space:**
   - Publish to test space first
   - Verify formatting and links
   - Then publish to production space

## Success Criteria

Phase 09 is complete when:

- [x] Confluence page created successfully
- [x] Page contains all SDLC summary sections
- [x] All artifact links working (GitHub + Jira)
- [x] Page labels applied
- [x] `confluence-status.json` created
- [x] `status.md` updated with Confluence URL
- [x] Phase marked complete in status.md

## Notes

- This phase is **OPTIONAL** - projects without Confluence can stop at Phase 08
- Page content is **high-level summary** - full artifacts remain in GitHub
- Publishing can be **re-run** to update Confluence if artifacts change
- **Security:** Never include credentials or secrets in published content

---

**Agent Type:** Phase Agent (09-confluence)  
**Dependencies:** Phase 08 complete, PR merged, Confluence MCP configured  
**Outputs:** `confluence-status.json`, updated `status.md`, Confluence page  
**Duration:** ~1-2 minutes (depends on MCP response time)
