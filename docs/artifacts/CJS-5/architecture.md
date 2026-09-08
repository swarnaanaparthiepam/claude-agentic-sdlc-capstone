# Architecture — CJS-5

**Based on:** requirements.md
**Designed:** 2026-09-07T15:35:00+05:30

## High-Level Overview

This is a minimal UI enhancement to the existing React-based login application. The architecture leverages the existing component structure and adds a simple status indicator without modifying any core functionality.

```
┌─────────────────────────────────────────┐
│          LoginPage Component            │
│  ┌───────────────────────────────────┐  │
│  │  Status Message (NEW)             │  │ ← CJS-5: Added
│  │  "Page loaded successfully"       │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Existing Login Form              │  │ ← Unchanged
│  │  - Email Input                    │  │
│  │  - Password Input                 │  │
│  │  - Login Button                   │  │
│  │  - Success Message                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Components

### Component 1: StatusMessage (NEW)
- **Responsibility:** Display a static status message on page load indicating successful rendering
- **Inputs:** None (static message)
- **Outputs:** Visible status text "Page loaded successfully"
- **Technology:** React functional component with TypeScript
- **Location:** `login-app/src/components/StatusMessage.tsx`
- **Styling:** CSS Module following existing design system patterns
- **State:** Stateless (no useState/useEffect required)

### Component 2: LoginPage (MODIFIED)
- **Responsibility:** Integrate StatusMessage into existing login page layout
- **Inputs:** None (component integration only)
- **Outputs:** Rendered status message above or below existing form
- **Technology:** Existing React component with TypeScript
- **Modification:** Import and render `<StatusMessage />` component
- **Impact:** Minimal - single import and JSX element addition

### Component 3: Automated Test (NEW)
- **Responsibility:** Verify status message displays on page load
- **Inputs:** Rendered LoginPage component
- **Outputs:** Test pass/fail result
- **Technology:** Vitest + React Testing Library
- **Location:** `login-app/src/components/StatusMessage.test.tsx`
- **Test Coverage:** Component render, message text, accessibility attributes

## Data Flow

This change has no data flow - it is a static UI element.

```
Page Load → React Render → StatusMessage Component Renders → Static Text Displayed
```

No state management, no API calls, no user interaction required.

## Technology Stack

**Existing Stack (No Changes):**
- **Frontend Framework:** React 19.2.8
- **Language:** TypeScript 6.0.2
- **Build Tool:** Vite 8.2.2
- **Testing:** Vitest 5.0.0 + React Testing Library 16.3.3
- **Styling:** CSS Modules
- **Infrastructure:** Static hosting (existing deployment unchanged)

**No New Dependencies Required**

## Non-Functional Requirements

### Scalability
- **Not Applicable:** Static message has zero scalability impact
- Message rendered client-side with no server load
- Component size negligible (< 1 KB)

### Performance (NFR-1)
- **Target:** Page load time increase < 10% (< 0.2 seconds additional)
- **Strategy:** 
  - Lightweight functional component (no hooks, no effects)
  - CSS Module compiled at build time (no runtime overhead)
  - No JavaScript execution beyond render
- **Expected Impact:** < 0.01 seconds (unmeasurable)
- **Measurement:** Browser DevTools Performance tab before/after

### Visual Consistency (NFR-2)
- **Design System Adherence:**
  - Reuse existing CSS variables from `LoginPage.module.css`
  - Match font family, size, and weight of existing UI text
  - Use existing color palette (neutral/muted for status messages)
  - Maintain consistent spacing using existing margin/padding patterns
- **Implementation:** CSS Module following established patterns

### Browser Compatibility (NFR-3)
- **Coverage:** Chrome 115+, Firefox 115+, Edge 115+, Safari 16.4+
- **Strategy:**
  - Use standard React JSX (no experimental features)
  - CSS Module outputs standard CSS (no cutting-edge features)
  - Existing build pipeline handles transpilation
- **Verification:** Manual testing in target browsers (part of Phase 07)

### Accessibility (NFR-4)
- **WCAG 2.1 Level AA Compliance:**
  - Use semantic HTML (`<p>` or `<div>` with appropriate role)
  - Add `aria-live="polite"` for screen reader announcement
  - Ensure color contrast ratio ≥ 4.5:1 (text vs background)
  - Text size ≥ 16px (readable without zoom)
- **Testing:** axe DevTools or WAVE browser extension
- **Screen Reader:** Test with NVDA (Windows) or VoiceOver (Mac)

### Security
- **No Security Impact:** Static text has no XSS or injection risk
- No user input, no dynamic content, no third-party scripts

### Reliability
- **High:** Simple component with no failure modes
- No network dependencies, no state mutations, no side effects

### Maintainability
- **High:** Isolated component with single responsibility
- Clear file naming convention (`StatusMessage.tsx`)
- Co-located test file (`StatusMessage.test.tsx`)
- CSS Module prevents style conflicts

## Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Status message breaks existing layout | Medium | Use CSS Grid/Flexbox to insert message without affecting existing elements; test across viewports |
| Message text conflicts with existing success message | Low | Use distinct styling and placement (top vs inline); clear semantic difference |
| Screen reader announces message unexpectedly | Low | Use `aria-live="polite"` (not "assertive"); test with screen readers in Phase 07 |
| Performance regression unnoticed | Low | Measure page load time before/after in Phase 07; automated performance test |
| Inconsistent styling across browsers | Low | Use standard CSS properties; manual cross-browser testing in Phase 07 |

## Assumptions

1. **Placement:** Status message will be displayed at the top of the login form (above the "Login" heading) - to be confirmed during implementation
2. **Message Text:** Static string "Page loaded successfully" - no i18n or configuration needed
3. **Visibility:** Message always visible (not dismissible) - matches requirement for "displayed when the page loads"
4. **Styling:** Neutral/informational appearance (not success/warning/error) - distinct from login success message
5. **No Backend:** Entirely frontend change; no API modifications required

## Architecture Decisions

### ADR-1: Create Separate Component vs Inline Implementation
**Decision:** Create separate `StatusMessage` component
**Rationale:**
- Separation of concerns (single responsibility)
- Easier to test in isolation
- Reusable if needed for other pages in future
- Follows existing component architecture (LoginPage, LogoutButton, SuccessMessage)

**Alternatives Considered:**
- Inline `<p>` tag directly in LoginPage - rejected due to poor maintainability and testability

### ADR-2: Use CSS Module vs Inline Styles
**Decision:** Use CSS Module (StatusMessage.module.css)
**Rationale:**
- Consistent with existing codebase patterns
- Scoped styles prevent conflicts
- Easier to maintain design system consistency

**Alternatives Considered:**
- Inline styles - rejected due to inconsistency with existing code

### ADR-3: Placement Strategy
**Decision:** Render StatusMessage as first child inside LoginPage container
**Rationale:**
- Appears immediately when page loads (top of viewport)
- Does not interfere with form layout
- Easy to test (predictable DOM structure)

**Alternatives Considered:**
- Render below form - rejected because less visible on page load
- Render inside form element - rejected because semantically incorrect (message is not part of form)

## Traceability

| Requirement | Component | Implementation Notes |
|-------------|-----------|---------------------|
| FR-1 | StatusMessage component | Displays "Page loaded successfully" text on render |
| FR-2 | LoginPage modification | Minimal change (import + render) preserves existing functionality |
| FR-3 | StatusMessage.test.tsx | Automated test verifies message presence using React Testing Library |
| NFR-1 | StatusMessage (lightweight) | No hooks/effects; minimal render overhead |
| NFR-2 | StatusMessage.module.css | Reuses existing design tokens (colors, fonts, spacing) |
| NFR-3 | Existing build pipeline | Vite transpilation supports target browsers |
| NFR-4 | StatusMessage JSX | Semantic HTML + aria-live="polite" for screen readers |

## Implementation Approach

### Phase 05 (Implementation) will:
1. Create `StatusMessage.tsx` component with TypeScript types
2. Create `StatusMessage.module.css` with design system-compliant styles
3. Modify `LoginPage.tsx` to import and render StatusMessage
4. Create `StatusMessage.test.tsx` with basic render test
5. Run existing test suite to ensure no regressions (FR-2)

### Files to Create:
- `login-app/src/components/StatusMessage.tsx`
- `login-app/src/components/StatusMessage.module.css`
- `login-app/src/components/StatusMessage.test.tsx`

### Files to Modify:
- `login-app/src/components/LoginPage.tsx` (add import + JSX element)

### No Changes Required:
- App.tsx
- main.tsx
- vite.config.ts
- package.json
- Any other existing files

## Testing Strategy

### Unit Tests (Vitest + React Testing Library):
1. StatusMessage renders without crashing
2. StatusMessage displays correct text content
3. StatusMessage has proper accessibility attributes
4. LoginPage still renders correctly with StatusMessage
5. Existing LoginPage tests still pass (regression check)

### Integration Tests:
- No new integration tests needed (no component interactions)

### Manual Tests (Phase 07):
1. Visual inspection in Chrome, Firefox, Edge, Safari
2. Screen reader test (NVDA or VoiceOver)
3. Page load performance measurement (DevTools)
4. Color contrast check (axe DevTools)

## Success Criteria

1. StatusMessage component created and renders "Page loaded successfully"
2. LoginPage displays status message without layout issues
3. All existing tests pass (no regressions)
4. New automated test passes
5. Page load time increase < 10%
6. WCAG 2.1 Level AA compliance verified
7. Cross-browser compatibility confirmed

---
**Status:** Ready for human review and design approval.
**Next Phase:** 03 - Design Review
