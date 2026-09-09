# Implementation Plan — CJS-6

**Based on:** architecture.md, design-review.md, requirements.md
**Planned:** 2026-09-09

## Task Breakdown

### Task 1: Create LoginLoadedMessage component
- **Component:** LoginLoadedMessage (NEW)
- **Priority:** 1-Critical
- **Effort:** S
- **Dependencies:** None
- **Description:** Create a stateless functional component that renders the exact text "Login page loaded successfully" unconditionally on mount, following the same pattern as `StatusMessage.tsx` (role="status", aria-live="polite", data-testid="login-loaded-message"). No props, no hooks, no async logic.
- **Acceptance Criteria:**
  - AC1: Component renders a DOM node with `role="status"`, `aria-live="polite"`, `data-testid="login-loaded-message"`.
  - AC2: Rendered text content is exactly "Login page loaded successfully" (no extra whitespace/formatting).
  - AC3: Component takes no props and requires no user interaction to display the text.
- **Files to Create/Modify:**
  - `login-app/src/components/LoginLoadedMessage.tsx`
- **Requirements Addressed:** FR-1, FR-3, NFR-1, NFR-2

### Task 2: Create LoginLoadedMessage CSS module
- **Component:** LoginLoadedMessage (NEW)
- **Priority:** 2-High
- **Effort:** S
- **Dependencies:** Task 1
- **Description:** Add a CSS module styling the message consistently with `StatusMessage.module.css` (same font size, padding, neutral background) so it looks visually consistent rather than introducing a new visual language, per architecture.md Clarification 1 resolution.
- **Acceptance Criteria:**
  - AC1: Visual style (font size, padding, background) matches the established `StatusMessage.module.css` pattern.
  - AC2: No global/shared CSS files modified; styling is scoped to this new module only.
- **Files to Create/Modify:**
  - `login-app/src/components/LoginLoadedMessage.module.css`
- **Requirements Addressed:** NFR-2

### Task 3: Wire LoginLoadedMessage into LoginPage
- **Component:** LoginPage (MODIFIED — additive only)
- **Priority:** 1-Critical
- **Effort:** S
- **Dependencies:** Task 1, Task 2
- **Description:** Add one import (`import { LoginLoadedMessage } from './LoginLoadedMessage';`) and render `<LoginLoadedMessage />` directly below the existing `<StatusMessage />` inside `LoginPage.tsx`, per architecture.md placement decision. No other lines in `LoginPage.tsx` are touched (form fields, submit handler, success message logic remain untouched).
- **Acceptance Criteria:**
  - AC1: `<LoginLoadedMessage />` appears immediately after `<StatusMessage />` in the rendered JSX, above the email field group.
  - AC2: Diff to `LoginPage.tsx` is limited to one import line + one JSX line (+ Task 5's comment updates); no existing logic, state, or markup changed.
  - AC3: Both `<StatusMessage />` ("Page loaded successfully") and `<LoginLoadedMessage />` ("Login page loaded successfully") render simultaneously without error.
- **Files to Create/Modify:**
  - `login-app/src/components/LoginPage.tsx`
- **Requirements Addressed:** FR-1, FR-2

### Task 4: Write automated test for LoginLoadedMessage
- **Component:** LoginLoadedMessage.test.tsx (NEW)
- **Priority:** 1-Critical
- **Effort:** S
- **Dependencies:** Task 1
- **Description:** Write a Vitest + React Testing Library test suite mirroring `StatusMessage.test.tsx`'s structure: render `LoginLoadedMessage` in isolation (not via full `LoginPage`, to avoid `getByRole('status')` ambiguity per design-review.md Finding #2) and assert exact text, `role="status"`, `aria-live="polite"`, and `data-testid`.
- **Acceptance Criteria:**
  - AC1: Test renders `<LoginLoadedMessage />` standalone and passes.
  - AC2: Test asserts text content is exactly "Login page loaded successfully" via `getByRole('status')` scoped to this render.
  - AC3: Test asserts `aria-live="polite"` and `data-testid="login-loaded-message"` are present.
  - AC4: `npm test` in `login-app/` passes including this new file.
- **Files to Create/Modify:**
  - `login-app/src/components/LoginLoadedMessage.test.tsx`
- **Requirements Addressed:** FR-4

### Task 5: Update LoginPage.tsx doc comments to reference CJS-6 (Design Review Condition #2)
- **Component:** LoginPage (MODIFIED — documentation only)
- **Priority:** 3-Medium
- **Effort:** S
- **Dependencies:** Task 3
- **Description:** Update the `LoginPage.tsx` header comment and add an inline comment above `<LoginLoadedMessage />` (e.g., `{/* Login Loaded Message - CJS-6: FR-1 */}`) so documentation reflects the full set of requirements/user stories rendered in the file, per design-review.md Minor Issue #3 and Recommendation #3.
- **Acceptance Criteria:**
  - AC1: Header comment in `LoginPage.tsx` references CJS-6 alongside existing CJS-3/CJS-5 references.
  - AC2: Inline comment above `<LoginLoadedMessage />` follows the existing comment style (mirrors `{/* Status Message - CJS-5: FR-1 */}`).
  - AC3: No functional code changed by this task — comments only.
- **Files to Create/Modify:**
  - `login-app/src/components/LoginPage.tsx`
- **Requirements Addressed:** Design Review Condition #2 (documentation hygiene; not tied to an FR/NFR)

### Task 6: Regression check — existing test suites unaffected
- **Component:** StatusMessage.test.tsx, LoginPage.test.tsx (EXISTING — verification only)
- **Priority:** 1-Critical
- **Effort:** S
- **Dependencies:** Task 3, Task 4, Task 5
- **Description:** Run the full `login-app` test suite (`npm test`) after all changes and confirm `StatusMessage.test.tsx` and `LoginPage.test.tsx` (and any other existing tests) pass unmodified, with no query collisions introduced by having two `role="status"` elements on the page.
- **Acceptance Criteria:**
  - AC1: `StatusMessage.test.tsx` passes with zero modifications to that file.
  - AC2: `LoginPage.test.tsx` passes with zero modifications to that file (unless it independently required the doc-comment change, which it does not).
  - AC3: Full `login-app` test suite (`npm test`) passes with no new failures or ambiguous-query errors.
- **Files to Create/Modify:**
  - None (verification task; no files created or modified)
- **Requirements Addressed:** FR-2, NFR-2

### Task 7: Log backlog note — consolidate CJS-5/CJS-6 status messages (Design Review Condition #1)
- **Component:** N/A (process/documentation task)
- **Priority:** 3-Medium
- **Effort:** S
- **Dependencies:** None (can be done any time before Phase 08)
- **Description:** Record a backlog note recommending a future UX-focused story to consolidate the CJS-5 `StatusMessage` ("Page loaded successfully") and CJS-6 `LoginLoadedMessage` ("Login page loaded successfully") into a single page-load banner, per design-review.md Minor Issue #1 / Recommendation #2. This note must be carried forward into the Phase 08 PR description so it is visible to whoever picks up the next login-app story. It does not block or change CJS-6's implementation scope.
- **Acceptance Criteria:**
  - AC1: Backlog note text is captured in this impl-plan.md (see below) as the canonical wording to reuse.
  - AC2: The same note is included in the Phase 08 PR description.
- **Files to Create/Modify:**
  - None (this document; referenced again in Phase 08 PR description)
- **Requirements Addressed:** Design Review Condition #1 (accepted UX trade-off, not an FR/NFR)

**Backlog note (canonical wording for Task 7 / PR description):**
> Follow-up UX recommendation (from CJS-6 design review): Consider consolidating the CJS-5 `StatusMessage` ("Page loaded successfully") and CJS-6 `LoginLoadedMessage` ("Login page loaded successfully") into a single, unified page-load status banner in a future UX-focused story. Both messages are currently kept separate and visible by design, since each story mandates its own exact wording and neither may alter the other's approved behavior/tests. No action required for CJS-6 itself.

## Dependency Graph

```
Task 1 → Task 2 → Task 3 → Task 5 → Task 6
Task 1 → Task 4 ─────────────────→ Task 6
Task 7 (independent, no dependency on other tasks; complete any time before Phase 08)
```

## Critical Path

1. Task 1 (Create LoginLoadedMessage component)
2. Task 2 (Create CSS module)
3. Task 3 (Wire into LoginPage)
4. Task 4 (Automated test) — can run in parallel with Task 5, both gate Task 6
5. Task 5 (Doc comment update)
6. Task 6 (Regression check)

## Task Summary

| ID | Task | Priority | Effort | Dependencies | Requirements |
|----|------|----------|--------|---------------|---------------|
| 1 | Create LoginLoadedMessage component | 1 | S | None | FR-1, FR-3, NFR-1, NFR-2 |
| 2 | Create LoginLoadedMessage CSS module | 2 | S | 1 | NFR-2 |
| 3 | Wire into LoginPage.tsx | 1 | S | 1, 2 | FR-1, FR-2 |
| 4 | Write automated test | 1 | S | 1 | FR-4 |
| 5 | Update LoginPage.tsx doc comments (Condition #2) | 3 | S | 3 | Design Review Condition #2 |
| 6 | Regression check (existing test suites) | 1 | S | 3, 4, 5 | FR-2, NFR-2 |
| 7 | Log backlog note (Condition #1) | 3 | S | None | Design Review Condition #1 |

## Phases

### Phase A: Component Build (Tasks 1-2)
Create the new `LoginLoadedMessage` component and its CSS module in isolation, with no dependency on `LoginPage.tsx`.

### Phase B: Integration & Test (Tasks 3-5)
Wire the component into `LoginPage.tsx`, write the automated test, and apply the doc-comment condition from design review.

### Phase C: Verification & Process (Tasks 6-7)
Confirm no regressions in existing test suites and capture the backlog note condition for carry-forward into the PR.

## Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Accidentally editing `StatusMessage.tsx`/`StatusMessage.test.tsx` while wiring in the new component | High (violates FR-2) | Task 3 explicitly scopes the diff to import + one JSX line; Task 6 verifies `StatusMessage.test.tsx` passes unmodified |
| New `role="status"` element causes ambiguous query in a future `LoginPage`-level test | Low | Task 4 renders `LoginLoadedMessage` in isolation, not via `LoginPage`; `data-testid` disambiguation documented for any future integration test (per design-review.md) |
| Doc-comment update (Task 5) accidentally touches functional code | Low | Task 5 scoped explicitly to comments only; Task 6 regression check would catch any unintended functional change |
| Backlog note (Task 7) forgotten before PR creation | Low | Canonical wording captured in this plan for direct reuse in Phase 08 PR description |

## Out-of-Scope Tasks
- Consolidating/merging the CJS-5 and CJS-6 status messages into one component (deferred per backlog note, Task 7; requires a new/updated User Story).
- Any backend, authentication, or database work (excluded by FR-3).
- Auto-dismiss or user-dismiss controls for the message (excluded per Clarification 2 resolution).
- Internationalization/localization of the message text.

---
**Status:** Ready for approval.
**Next Phase:** 05 - Implementation
