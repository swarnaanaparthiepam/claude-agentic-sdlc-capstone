# SDLC Documentation

## Artifact Structure

Each User Story gets an isolated directory under `docs/artifacts/<USER_STORY_ID>/` containing all SDLC phase outputs.

### Artifact Directory Layout

```
docs/artifacts/<USER_STORY_ID>/
├── status.md               # Phase state and approval tracking
├── user-story.md           # Original Jira story (Phase 00)
├── requirements.md         # Functional/non-functional requirements (Phase 01)
├── architecture.md         # High-level design (Phase 02)
├── design-review.md        # Design review findings (Phase 03)
├── impl-plan.md            # Implementation plan (Phase 04)
├── review.md               # Code review (Phase 06)
├── verification.md         # Test results (Phase 07)
└── confluence-status.json  # Confluence publication metadata
```

**Note:** Phase 05 (Implementation) creates application code in the repository root or designated app directory, not in docs/artifacts/.

## SDLC Flow

### Phase Sequence

```
00: Input          → Fetch from Jira → user-story.md
   ↓ APPROVAL
01: Requirements   → Analyze → requirements.md
   ↓ APPROVAL
02: Architecture   → Design → architecture.md
   ↓ APPROVAL
03: Design Review  → Review → design-review.md
   ↓ APPROVAL
04: Planning       → Plan → impl-plan.md
   ↓ APPROVAL
05: Implementation → Build → code + tests
   ↓ APPROVAL
06: Review         → Review code → review.md
   ↓ APPROVAL
07: Verification   → Verify → verification.md
   ↓ APPROVAL
08: PR             → Create PR → GitHub PR
   ↓ COMPLETE
```

### Human Approval Gates

**Critical:** Human approval required after EVERY phase.

- Workflow executes one phase
- Creates artifact
- Updates status.md with "Pending Human Approval"
- Halts and waits
- Human reviews artifact
- Human re-invokes workflow → implicit approval
- Workflow continues to next phase

## Artifact Templates

### status.md

Persistent state tracker for the SDLC.

**Fields:**
- User Story ID
- Title
- Current Phase (00-08)
- Completed Phases (checklist)
- Pending Human Approval (phase waiting for approval)
- Blocked Phase (if blocked)
- Status (IN_PROGRESS / COMPLETE)
- Last Updated
- Notes (chronological log)
- PR Information (URL when Phase 08 complete)
- Confluence Status (URL when published)

### Phase Artifacts

Each phase artifact follows a standard format:
- Header with User Story ID
- Source/input references
- Phase-specific content sections
- Traceability to previous phases
- Status indicator
- Next phase reference

## Traceability

Full traceability maintained throughout SDLC:

```
User Story (Jira)
  ↓
Requirements (FR, NFR, AC)
  ↓
Architecture (Components, Design)
  ↓
Design Review (Findings, Risks)
  ↓
Implementation Plan (Tasks)
  ↓
Code Implementation
  ↓
Code Review (Quality)
  ↓
Verification (Tests, Evidence)
  ↓
Pull Request
```

Each artifact references its inputs and traces decisions back to source.

## Workflow Coordination

**Entry Point:** `/workflow <USER_STORY_ID>`

**Coordinator:** `.claude/workflow.md`

**State:** `status.md` is single source of truth

**Phases:** 9 independent agents (00-08) invoked by workflow

**Approval:** Re-invoking workflow = implicit approval

## Dashboard Monitoring

Real-time SDLC monitoring:

```bash
npm run dashboard <USER_STORY_ID>
# Opens http://localhost:3000
```

Dashboard displays:
- Current phase
- Completed phases (green checkmarks)
- Pending approval (yellow warning)
- Blocked status (red error)
- Recent notes
- PR link
- Confluence publication status

Dashboard is read-only and works independently of Claude Code.

## Confluence Publishing

After PR merge, artifacts automatically published to Confluence:

**GitHub Action:** `.github/workflows/confluence-publish.yml`

**Publisher:** `tools/confluence/publisher.mjs`

**Page Structure:**
```
Agentic SDLC Capstone (parent)
└── <USER_STORY_ID>: <Title> (child)
    ├── Requirements
    ├── Architecture
    ├── Design Review
    ├── Implementation Plan
    ├── Code Review
    ├── Verification
    └── PR Summary
```

## Recovery Scenarios

### Resume Interrupted Workflow
1. Check status.md for current phase
2. Re-invoke: `/workflow <USER_STORY_ID>`
3. Workflow resumes from current phase

### Retry Failed Phase
1. Fix blocker (e.g., missing artifact, test failure)
2. Clear "Blocked Phase" in status.md if set
3. Re-invoke workflow

### Rollback to Previous Phase
1. Manually edit status.md:
   - Set current phase to desired phase
   - Mark later phases incomplete
   - Clear pending approval
2. Optionally delete artifacts for rolled-back phases
3. Re-invoke workflow

## Quality Standards

All artifacts must:
- Be complete (no TBD or TODO)
- Be traceable to source
- Use clear, unambiguous language
- Include concrete acceptance criteria
- Follow templates from `.claude/instructions/shared.md`

## Best Practices

### For New User Stories
1. Ensure Jira story has clear acceptance criteria
2. Start fresh: `/workflow <NEW_USER_STORY_ID>`
3. Review each phase artifact thoroughly before approving
4. Don't skip phases or approval gates

### During Implementation
1. Follow approved plan strictly
2. Write tests alongside features
3. Commit frequently with clear messages
4. Reference task IDs in commits

### After Completion
1. Merge PR after human review
2. Wait for Confluence publishing
3. Verify artifacts published correctly
4. Close Jira ticket
5. Archive or keep artifacts for reference

## Artifact Retention

Artifacts are permanent records:
- Stored in git
- Published to Confluence
- Provide audit trail
- Enable future analysis
- Support retrospectives

Do NOT delete artifacts after PR merge.
