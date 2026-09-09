# Architecture — CJS-6

**Based on:** requirements.md
**Designed:** 2026-09-09

## Important Discovery — Existing Codebase Found

`requirements.md` (Phase 01) stated that "no existing codebase/tech stack has been confirmed" for this repository. During Phase 02 investigation, an existing application **was found** at `login-app/` (React 19 + TypeScript + Vite + Vitest), built by prior User Stories:

- **CJS-3** — Login form (email/password), mock auth, logout flow (`LoginPage.tsx`, `LogoutButton.tsx`, `SuccessMessage.tsx`, `App.tsx`).
- **CJS-5** — A `StatusMessage` component already added to `LoginPage.tsx` that displays the text **"Page loaded successfully"** automatically on page load, with its own approved test suite (`StatusMessage.test.tsx`).

This changes the architecture task from "design a login page from scratch" to "add a second, distinctly-worded status message to an existing login page without disturbing the CJS-5 message or any other existing behavior." This is addressed explicitly below (see "Key Decision: Do Not Reuse/Modify StatusMessage").

## High-Level Overview

`login-app` is a single-page React application built with Vite. The `App` component conditionally renders `LoginPage` (logged-in state) which contains a form plus two independent, stateless status-message components rendered unconditionally on mount:

```
App
 └─ LoginPage
     ├─ StatusMessage          (existing, CJS-5: "Page loaded successfully")
     ├─ LoginLoadedMessage     (NEW, CJS-6: "Login page loaded successfully")
     ├─ <form> (email, password, submit)
     └─ inline success message (post-submit, CJS-3)
```

No routing, no backend, no network calls, no state management library — consistent with the existing architecture (ADR-001/ADR-002 referenced in `LoginPage.tsx`).

## Components

### Component 1: LoginLoadedMessage (NEW)
- **Responsibility:** Render the static text "Login page loaded successfully" automatically whenever `LoginPage` mounts, with no user interaction. Satisfies FR-1 and FR-4.
- **Inputs:** None (no props, no state).
- **Outputs:** A DOM node with `role="status"`, `aria-live="polite"`, `data-testid="login-loaded-message"`, containing the exact text "Login page loaded successfully".
- **Technology:** React 19 functional component, TypeScript, CSS Module for styling.
- **Files:**
  - `login-app/src/components/LoginLoadedMessage.tsx`
  - `login-app/src/components/LoginLoadedMessage.module.css`
  - `login-app/src/components/LoginLoadedMessage.test.tsx`

### Component 2: LoginPage (MODIFIED — additive only)
- **Responsibility:** Unchanged existing responsibility (render login form, handle mock auth). One additive change: render `<LoginLoadedMessage />` inside the existing JSX, alongside the existing `<StatusMessage />`.
- **Inputs/Outputs:** Unchanged.
- **Technology:** Existing React/TypeScript component, no structural refactor.
- **File:** `login-app/src/components/LoginPage.tsx` (one-line addition + one import line).

### Component 3: StatusMessage (EXISTING — untouched)
- **Responsibility:** Continues to render "Page loaded successfully" exactly as implemented for CJS-5.
- **Change:** None. Not modified, not removed, not reused for CJS-6's different message text.

## Key Decision: Do Not Reuse/Modify StatusMessage

**Decision:** Build a new, separate component (`LoginLoadedMessage`) rather than changing `StatusMessage`'s text or reusing it with a prop.

**Rationale:**
- FR-2 requires that adding the CJS-6 message "must not change, remove, or interfere with any existing login page behavior" and that "any existing automated tests for the login page continue to pass unmodified."
- `StatusMessage.test.tsx` (approved for CJS-5) asserts the exact text "Page loaded successfully". Changing `StatusMessage`'s text to "Login page loaded successfully" would satisfy CJS-6's FR-1 but break CJS-5's approved test and requirement — a direct FR-2 violation.
- Making `StatusMessage` accept a `message` prop (like `SuccessMessage` already does) and passing different text per call site was considered, but it still requires modifying a component and test suite outside this story's declared scope (NFR-2: "confined to the login page UI component/template; no shared/global modules altered beyond what's required"), and blurs traceability between CJS-5's and CJS-6's independently-approved requirements.
- A small, new, additive component is the option most consistent with NFR-2 (minimal footprint, easy to remove/modify later in isolation) and FR-3 (UI-only, isolated change).

**Note for Phase 03 (Design Review):** Having two near-duplicate "page loaded" status messages visible simultaneously on the login page is a UX redundancy worth flagging for human review; it is called out under Risks below. This architecture does not resolve that UX question — it only ensures the two features do not technically conflict.

## Data Flow

1. Browser loads `login-app` → `main.tsx` renders `App`.
2. `App` renders `LoginPage` (default `isLoggedIn = true`).
3. On `LoginPage` mount (no user action), React renders `<StatusMessage />` and `<LoginLoadedMessage />` synchronously as part of the initial render — no `useEffect`, no timers, no network calls. Both messages appear in the same render pass as the form.
4. No further data flow for this feature: `LoginLoadedMessage` has no state, no props, no lifecycle hooks, and never re-renders due to CJS-6 logic. It persists for the entire lifetime of the `LoginPage` mount (Clarification 2).
5. All other data flow (email/password state, submit handling, logout) is entirely unchanged.

## Technology Stack

(Existing stack, confirmed during Phase 02 investigation — not newly chosen, since an application already exists.)

- **Frontend:** React 19.2 + TypeScript, built with Vite 8.
- **Styling:** CSS Modules (`*.module.css`), consistent with `StatusMessage.module.css` / `SuccessMessage.module.css` conventions already in use.
- **Backend:** None (out of scope per FR-3; none exists in `login-app`).
- **Database:** None.
- **Testing:** Vitest 5 + React Testing Library 16 + `@testing-library/jest-dom`, run via `npm test` inside `login-app/`. This is the project's existing, already-configured test tooling (see `login-app/package.json` scripts and `src/test/setup.ts`).
- **Infrastructure:** Local dev via `vite`/`vite preview`; no deployment change required for this story (see `login-app/DEPLOYMENT.md` for existing deployment process, unaffected).
- **Security:** N/A — no auth, network, or data-handling changes (FR-3).

## Resolution of Open Clarifications

### Clarification 1 — Message placement/styling
**Resolved:** `LoginLoadedMessage` is rendered inside `LoginPage.tsx`, near the top of the page, immediately after the existing `<StatusMessage />` and before the `<h1>`/form fields region is not disturbed — concretely: placed directly below `<StatusMessage />` and above the email field group, inside the same `<form>` container `LoginPage` already uses. Styling: a simple text block with `role="status"`, minimal/neutral styling via a dedicated CSS module (`LoginLoadedMessage.module.css`), following the same visual pattern (font size, padding, neutral background) already established by `StatusMessage.module.css`, so it looks visually consistent with the existing message rather than introducing a new visual language.

### Clarification 2 — Message persistence/dismissal
**Resolved:** The message has no dismiss control and no auto-hide timer. It is rendered unconditionally for the entire time `LoginPage` is mounted (i.e., matches the existing `StatusMessage` behavior exactly). No component state is needed.

### Clarification 3 — Test framework/tooling
**Resolved:** Use the project's existing test tooling — **Vitest + React Testing Library**, already configured and used by every other component in `login-app` (including `StatusMessage.test.tsx`, which is the closest analog to this feature). `LoginLoadedMessage.test.tsx` will follow the same test structure as `StatusMessage.test.tsx`: render the component, assert exact text content via `getByRole('status')` / `getByTestId`, and confirm `aria-live="polite"`. This satisfies FR-4 without introducing new tooling (consistent with NFR-2).

## Non-Functional Requirements

### Performance (NFR-1)
No network calls, no async work, no timers. `LoginLoadedMessage` is a pure, static functional component rendered in the same synchronous pass as the rest of `LoginPage`. No measurable render-time impact.

### Maintainability (NFR-2)
Change is fully isolated to three new files (`LoginLoadedMessage.tsx`/`.module.css`/`.test.tsx`) plus a two-line additive change to `LoginPage.tsx` (one import, one JSX element). No shared/global modules, no existing files' logic altered. The component can be deleted or edited independently without affecting `StatusMessage`, `SuccessMessage`, or form logic.

### Security
Not applicable — no new inputs, no new endpoints, no new data handling (FR-3).

### Reliability
Stateless static component; no failure modes beyond a standard React render, identical risk profile to the existing `StatusMessage`.

### Accessibility (carried over from existing pattern, not a stated requirement but consistent with codebase convention)
Uses `role="status"` and `aria-live="polite"`, matching `StatusMessage` and `SuccessMessage`, so screen readers announce it the same way existing messages are announced.

## Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Two similar "page loaded" messages ("Page loaded successfully" and "Login page loaded successfully") visible at once may be confusing/redundant UX | Medium | Flag explicitly for human review in Phase 03 (Design Review); implementation proceeds per FR-1 exact wording since the story text requires this specific message and FR-2 forbids altering the existing CJS-5 message |
| Future stories may keep adding more near-duplicate status components to `LoginPage`, causing clutter | Low | Note in Phase 04 planning/Phase 06 review to watch for this pattern; no action needed for CJS-6 itself |
| Test id collision or ambiguous `getByRole('status')` queries in `LoginPage`-level tests (multiple `role="status"` elements now present) | Low | New component's test file renders `LoginLoadedMessage` in isolation (not via full `LoginPage`), avoiding query ambiguity; any future `LoginPage`-level integration test must use `data-testid="login-loaded-message"` / `"status-message"` to disambiguate |

## Assumptions

- The exact visible text must be "Login page loaded successfully" (FR-1), distinct from the existing "Page loaded successfully" (CJS-5) — both are intentionally different strings.
- Placement below the existing `StatusMessage` and above the form fields is acceptable; exact pixel ordering is not specified by the story and can be adjusted by a human reviewer without architectural impact.
- No requirement exists to reconcile or merge the two status messages into one; that would be a scope change requiring a new/updated User Story.

## Traceability

| Requirement | Component | Notes |
|-------------|-----------|-------|
| FR-1 | LoginLoadedMessage | Renders exact required text automatically on mount, no user action |
| FR-2 | LoginLoadedMessage, LoginPage | Purely additive change; existing `StatusMessage`, form, and their tests are untouched |
| FR-3 | LoginLoadedMessage | Pure UI component, no backend/auth/DB code involved |
| FR-4 | LoginLoadedMessage.test.tsx | Vitest + RTL test asserts message text is rendered |
| NFR-1 | LoginLoadedMessage | No network/async work; static render |
| NFR-2 | LoginLoadedMessage (new files only) | Isolated to 3 new files + 2-line additive edit to LoginPage.tsx |

---
**Status:** Ready for human review and design approval.
**Next Phase:** 03 - Design Review
