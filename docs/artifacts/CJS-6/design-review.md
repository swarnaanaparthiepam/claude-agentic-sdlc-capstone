# Design Review — CJS-6

**Reviewed:** 2026-09-09
**Reviewer Role:** Senior Architect

## Review Summary

**Verdict:** Approved with Conditions

**Overall Assessment:** The architecture is a small, well-isolated, additive change that satisfies all four functional requirements and both non-functional requirements without touching CJS-5's approved `StatusMessage` component or its tests. The one substantive design question — the flagged UX redundancy of two "page loaded" messages appearing together — is resolved below as an accepted, scoped trade-off rather than a defect requiring rework, with one lightweight condition attached.

## Requirements Coverage

| Requirement | Addressed | Component | Notes |
|-------------|-----------|-----------|-------|
| FR-1 | ✓ | LoginLoadedMessage | Renders exact text "Login page loaded successfully" unconditionally on mount, no user action required. |
| FR-2 | ✓ | LoginLoadedMessage, LoginPage | Purely additive: verified `LoginPage.tsx` shows only an import + one JSX line added; `StatusMessage.tsx` and `StatusMessage.test.tsx` are untouched. |
| FR-3 | ✓ | LoginLoadedMessage | Pure presentational component; no backend/auth/DB code anywhere in the design. |
| FR-4 | ✓ | LoginLoadedMessage.test.tsx | Follows the same Vitest + RTL pattern as `StatusMessage.test.tsx`; renders component in isolation and asserts text/role. |
| NFR-1 | ✓ | LoginLoadedMessage | No network/async/timers; static synchronous render, same profile as existing `StatusMessage`. |
| NFR-2 | ✓ | New files only | Change confined to 3 new files + a 2-line additive edit to `LoginPage.tsx`; no shared/global module altered. |

**Summary:** 6/6 requirements (4 FR + 2 NFR) fully addressed. No unmapped requirements found.

## Findings

### Critical Issues (Blockers)
None.

### Major Issues
None.

### Minor Issues / Advisories

1. **UX redundancy of two "page loaded" messages — RESOLVED (accepted, not a blocker)**
   - **Severity:** Minor / Advisory (downgraded from the "Medium" risk flagged in architecture.md)
   - **Location:** architecture.md — "Key Decision: Do Not Reuse/Modify StatusMessage", Risks table
   - **Analysis:** CJS-5 and CJS-6 are independently approved stories, each mandating an *exact* message string ("Page loaded successfully" vs. "Login page loaded successfully"). CJS-6's FR-1 requires the specific wording verbatim, and CJS-6's FR-2 explicitly forbids altering CJS-5's existing behavior/tests. Given both constraints simultaneously, there is no way to "merge" the two messages inside CJS-6's own scope without violating FR-2 (which would require editing `StatusMessage`'s approved text/tests) or FR-1 (which would require dropping the mandated new text). requirements.md itself already anticipates this: "No requirement exists to reconcile or merge the two status messages into one; that would be a scope change requiring a new/updated User Story." Consolidation is therefore out of scope for CJS-6 by design, not an oversight.
   - **Recommendation (clear, not just restated):** **Approve keeping both components separate and visible, as designed.** Do not attempt any merge/consolidation inside CJS-6. As a condition of approval, log a lightweight follow-up backlog note ("consider consolidating CJS-5/CJS-6 status messages into a single page-load banner") for a future UX-focused story — this review is the appropriate place to capture that recommendation so it isn't lost, but it must not block or expand CJS-6's implementation.
   - **Condition attached to approval:** Phase 04 (Planning) or the PR description (Phase 08) should include a one-line note referencing this deferred UX consolidation recommendation, so it is visible to whoever picks up the next login-app story.

2. **Multiple `role="status"` elements on the page — accessibility/test-query interaction**
   - **Severity:** Minor
   - **Location:** LoginLoadedMessage (new), StatusMessage (existing) — both use `role="status"` + `aria-live="polite"`.
   - **Impact:** Verified in code: `LoginPage.test.tsx` does not currently use `getByRole('status')`, and `StatusMessage.test.tsx` / the planned `LoginLoadedMessage.test.tsx` render each component in isolation, not through `LoginPage`. So there is **no actual test collision today**. The only residual risk is a *future* `LoginPage`-level test naively calling `screen.getByRole('status')`, which would now throw (multiple matches) instead of failing at CJS-5 time.
   - **Recommendation:** Accept as-is; no change needed for CJS-6. The mitigation already documented in architecture.md (use `data-testid="status-message"` / `data-testid="login-loaded-message"` to disambiguate in any future integration test) is sufficient and should simply be honored by whoever writes such a test later. From an accessibility standpoint, two `aria-live="polite"` regions announced back-to-back on page load is mildly redundant for screen-reader users but not a violation of WCAG 2.1 AA (each region announces distinct, accurate content); acceptable given both messages are short and non-blocking.

3. **`LoginPage.tsx` component doc comment will become stale**
   - **Severity:** Minor (cosmetic)
   - **Location:** `login-app/src/components/LoginPage.tsx`, header comment ("Requirements: FR-1 through FR-7") and inline comment "Status Message - CJS-5: FR-1".
   - **Impact:** None functionally; purely documentation hygiene. When `<LoginLoadedMessage />` is added, the existing comments referencing only CJS-5/CJS-3 requirement IDs will no longer reflect the full set of requirements rendered in that file.
   - **Recommendation:** When implementing, add a corresponding one-line comment above `<LoginLoadedMessage />` (e.g., `{/* Login Loaded Message - CJS-6: FR-1 */}`), mirroring the existing style. Not a gate for approval.

## Design Quality Assessment

### Scalability: ✓
Not a concern at this scale — a single static, stateless component with no data flow. No scalability risk introduced.

### Security: ✓
No new inputs, endpoints, or data handling. Confirmed no auth/DB/network code in the design.

### Maintainability: ✓
Change is fully isolated to 3 new files plus a 2-line additive edit; verified against the actual `LoginPage.tsx` that CJS-5's structure is simple enough that the additive edit is low-risk. Easy to remove independently later.

### Performance: ✓
Static synchronous render, no async work, no timers, no network calls, matching NFR-1.

### Testability: ✓
Test approach mirrors the proven `StatusMessage.test.tsx` pattern (render in isolation, assert via `getByRole('status')` and `getByTestId`); verified this pattern currently avoids all query collisions in the existing test suite.

## Risks Identified

| Risk | Severity | Likelihood | Mitigation Adequate? |
|------|----------|------------|---------------------|
| Two similar "page loaded" messages visible simultaneously (UX redundancy) | Low (downgraded from Medium) | High (will definitely occur) | Yes — accepted as an in-scope trade-off required by each story's own FRs; deferred consolidation logged as a follow-up recommendation, not a blocker |
| Future `LoginPage`-level test using ambiguous `getByRole('status')` | Low | Low (no such test exists today) | Yes — documented `data-testid` disambiguation mitigation; verified no current test triggers this |
| Stale/incomplete doc comments in `LoginPage.tsx` after edit | Low | Medium | Yes — trivial fix at implementation time, called out above |
| Continued accumulation of near-duplicate status components on `LoginPage` over future stories | Low | Medium | Yes — already noted in architecture.md for Phase 04/06 attention |

## Recommendations

1. Proceed to Phase 04 (Implementation Planning) with the architecture as designed — no structural changes required.
2. Carry forward a backlog note recommending a future UX story to consolidate/redesign the CJS-5 and CJS-6 status messages into a single page-load banner, so the redundancy is addressed deliberately rather than left to accumulate.
3. During implementation, update the `LoginPage.tsx` header/inline comments to reference CJS-6/FR-1 alongside the existing CJS-5/CJS-3 references, for documentation accuracy.
4. When writing `LoginLoadedMessage.test.tsx`, follow the existing `StatusMessage.test.tsx` pattern exactly (render in isolation; assert via `getByRole('status')` scoped to the rendered component, plus `getByTestId('login-loaded-message')`) to avoid any future query ambiguity.

## Decisions Required

- Confirm (human sign-off) that keeping both status messages visible together is acceptable for this release, with consolidation deferred to a future story (per Recommendation 2 above). No other open decisions.

---
**Status:** Approved with Conditions
**Next Phase:** 04 - Implementation Planning
**Blockers:** None. Condition: log the deferred UX-consolidation recommendation (see Recommendations #2) so it is visible to Phase 04/08; no change to CJS-6's scope or architecture required.
