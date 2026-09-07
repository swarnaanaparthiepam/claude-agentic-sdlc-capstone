# Implementation Plan — CJS-3

**Based on:** architecture.md, design-review.md, requirements.md
**Planned:** 2026-09-04

## Task Breakdown

### Task 1: Project Initialization and Tooling Setup
- **Component:** Development & Build Tools, Linting Configuration
- **Priority:** 1-Critical
- **Effort:** S
- **Dependencies:** None
- **Description:** Initialize Vite + React + TypeScript project with ESLint, Prettier, and all necessary development dependencies
- **Acceptance Criteria:**
  - AC1: Project created using `npm create vite@latest` with react-ts template
  - AC2: ESLint configured with React, TypeScript, and hooks rules
  - AC3: Prettier configured with consistent formatting rules
  - AC4: package.json includes all required dependencies (React 18+, TypeScript 5+, Vite 5+)
  - AC5: tsconfig.json configured with strict mode enabled
  - AC6: Project structure matches architecture file structure
  - AC7: `npm run dev` starts development server successfully
  - AC8: `npm run build` produces optimized production bundle
- **Files to Create/Modify:**
  - `package.json`
  - `tsconfig.json`
  - `vite.config.ts`
  - `.eslintrc.js` or `.eslintrc.json`
  - `.prettierrc`
  - `.gitignore`
  - `index.html`
- **Requirements Addressed:** NFR-1 (React + TypeScript + Vite)
- **Design Review Actions:** Addresses Minor Issue #4 (Linting Configuration)

### Task 2: Test Environment Setup
- **Component:** Testing Infrastructure
- **Priority:** 1-Critical
- **Effort:** S
- **Dependencies:** Task 1
- **Description:** Configure Vitest and React Testing Library with coverage reporting and testing utilities
- **Acceptance Criteria:**
  - AC1: Vitest installed and configured to work with Vite
  - AC2: React Testing Library and @testing-library/jest-dom installed
  - AC3: @testing-library/user-event installed for user interaction simulation
  - AC4: Test coverage configured with minimum thresholds (80% line coverage, 70% branch coverage)
  - AC5: vitest.config.ts or vite.config.ts includes test configuration
  - AC6: `npm run test` executes test suite
  - AC7: `npm run test:coverage` generates coverage report
  - AC8: Sample test file runs successfully
- **Files to Create/Modify:**
  - `vitest.config.ts` or update `vite.config.ts`
  - `package.json` (add test scripts)
  - `tests/setup.ts` (test environment setup)
- **Requirements Addressed:** NFR-3 (Automated Testing)
- **Design Review Actions:** Addresses Minor Issue #2 (Test Coverage Targets)

### Task 3: HTML Template and Entry Point
- **Component:** Main Entry Point (main.tsx), HTML Template (index.html)
- **Priority:** 1-Critical
- **Effort:** S
- **Dependencies:** Task 1
- **Description:** Create HTML shell and React application entry point with proper meta tags and mounting logic
- **Acceptance Criteria:**
  - AC1: index.html includes proper DOCTYPE, charset UTF-8, and viewport meta tags
  - AC2: index.html contains `<div id="root"></div>` mounting point
  - AC3: main.tsx imports React 18 createRoot API
  - AC4: main.tsx bootstraps App component into root element
  - AC5: Basic global styles (index.css) created for CSS reset and defaults
  - AC6: Application renders "Hello World" or placeholder content successfully
- **Files to Create/Modify:**
  - `index.html`
  - `src/main.tsx`
  - `src/index.css`
- **Requirements Addressed:** NFR-1 (React framework setup)

### Task 4: SuccessMessage Component with Accessibility
- **Component:** SuccessMessage Component
- **Priority:** 2-High
- **Effort:** M
- **Dependencies:** Task 3
- **Description:** Create accessible SuccessMessage component with ARIA live region for screen reader announcement
- **Acceptance Criteria:**
  - AC1: Component accepts `message: string` prop with default "Logged out successfully"
  - AC2: Component renders message in a `<div>` with `role="status"` ARIA attribute
  - AC3: Component includes `aria-live="polite"` for screen reader announcement
  - AC4: Component has clear styling (green color, adequate spacing, readable font size)
  - AC5: TypeScript interface defined for component props
  - AC6: Component is a pure functional component
  - AC7: Component displays exact text "Logged out successfully" when used with default props
- **Files to Create/Modify:**
  - `src/components/SuccessMessage.tsx`
  - `src/components/SuccessMessage.css` (optional, or inline styles)
- **Requirements Addressed:** FR-3 (Display success message), NFR-2 (UI Usability)
- **Design Review Actions:** Addresses Major Issue #1 (Accessibility - screen reader support)

### Task 5: LogoutButton Component with Accessibility
- **Component:** LogoutButton Component
- **Priority:** 2-High
- **Effort:** M
- **Dependencies:** Task 3
- **Description:** Create accessible LogoutButton component with proper ARIA attributes, keyboard navigation, and focus management
- **Acceptance Criteria:**
  - AC1: Component accepts `onClick: () => void` prop
  - AC2: Component renders `<button>` element with text "Logout"
  - AC3: Button includes `aria-label="Logout"` for screen readers
  - AC4: Button is keyboard accessible (can be focused with Tab key)
  - AC5: Button has clear visual styling (border, padding, hover state, pointer cursor)
  - AC6: Button is not disabled by default
  - AC7: TypeScript interface defined for component props
  - AC8: Component is a pure functional component
  - AC9: Focus visible on keyboard navigation (outline or focus ring)
- **Files to Create/Modify:**
  - `src/components/LogoutButton.tsx`
  - `src/components/LogoutButton.css` (optional, or inline styles)
- **Requirements Addressed:** FR-1 (Display Logout button), FR-2 (Enable click interaction), NFR-2 (UI Usability)
- **Design Review Actions:** Addresses Major Issue #1 (Accessibility - ARIA attributes and keyboard navigation)

### Task 6: App Component with State Management
- **Component:** App Component
- **Priority:** 1-Critical
- **Effort:** M
- **Dependencies:** Task 4, Task 5
- **Description:** Create root App component with state management, conditional rendering logic, and integration of LogoutButton and SuccessMessage components
- **Acceptance Criteria:**
  - AC1: Component manages `isLoggedIn: boolean` state using useState hook
  - AC2: State initializes to `true` (user starts logged in)
  - AC3: `handleLogout` function updates state to `false` when called
  - AC4: LogoutButton rendered when `isLoggedIn === true`
  - AC5: LogoutButton hidden when `isLoggedIn === false` (post-logout)
  - AC6: SuccessMessage rendered when `isLoggedIn === false`
  - AC7: SuccessMessage hidden when `isLoggedIn === true`
  - AC8: handleLogout callback passed to LogoutButton via onClick prop
  - AC9: Component has basic layout styling (centered content, padding)
  - AC10: TypeScript types used for all state and functions
- **Files to Create/Modify:**
  - `src/components/App.tsx`
  - `src/App.css`
- **Requirements Addressed:** FR-1, FR-2, FR-3, FR-4 (Mock logout logic), FR-5 (No backend), NFR-4 (Performance), NFR-5 (Simplicity)
- **Design Review Actions:** Addresses Minor Issue #3 (Post-logout button visibility - decided to hide button)

### Task 7: Error Boundary Wrapper
- **Component:** Error Boundary (Optional Enhancement)
- **Priority:** 3-Medium
- **Effort:** S
- **Dependencies:** Task 6
- **Description:** Create React Error Boundary component to gracefully handle runtime errors and prevent app crashes
- **Acceptance Criteria:**
  - AC1: ErrorBoundary class component created with componentDidCatch and getDerivedStateFromError
  - AC2: Fallback UI displays friendly error message when error occurs
  - AC3: Error details logged to console for debugging
  - AC4: ErrorBoundary wraps App component in main.tsx
  - AC5: TypeScript types defined for Error and ErrorInfo
  - AC6: Fallback UI includes suggestion to reload page
- **Files to Create/Modify:**
  - `src/components/ErrorBoundary.tsx`
  - `src/main.tsx` (wrap App with ErrorBoundary)
- **Requirements Addressed:** NFR-4 (Reliability)
- **Design Review Actions:** Addresses Minor Issue #1 (Error Boundary Strategy)

### Task 8: Component Unit Tests
- **Component:** Testing Suite
- **Priority:** 1-Critical
- **Effort:** L
- **Dependencies:** Task 6, Task 2
- **Description:** Write comprehensive unit tests for all components using React Testing Library and Vitest
- **Acceptance Criteria:**
  - AC1: Test suite for App component includes:
    - Initial render shows LogoutButton, does not show SuccessMessage
    - Clicking Logout button triggers state change
    - After logout, SuccessMessage is visible with text "Logged out successfully"
    - After logout, LogoutButton is hidden
  - AC2: Test suite for LogoutButton includes:
    - Button renders with text "Logout"
    - Button is keyboard accessible (can receive focus)
    - onClick callback is called when button clicked
    - Button has proper ARIA attributes
  - AC3: Test suite for SuccessMessage includes:
    - Message renders with correct text
    - Message has role="status" attribute
    - Message has aria-live="polite" attribute
    - Custom message prop overrides default text
  - AC4: All tests use React Testing Library queries (screen.getByRole, screen.getByText)
  - AC5: User interactions simulated with @testing-library/user-event
  - AC6: Test coverage meets minimum thresholds (80% line, 70% branch)
  - AC7: All tests pass successfully
- **Files to Create/Modify:**
  - `tests/App.test.tsx`
  - `tests/LogoutButton.test.tsx`
  - `tests/SuccessMessage.test.tsx`
- **Requirements Addressed:** NFR-3 (Automated Testing), all FRs (FR-1 through FR-5 validated by tests)

### Task 9: Styling and Visual Polish
- **Component:** CSS Styling Layer
- **Priority:** 3-Medium
- **Effort:** M
- **Dependencies:** Task 6
- **Description:** Implement CSS styling for all components to ensure clear visual affordance, usability, and professional appearance
- **Acceptance Criteria:**
  - AC1: LogoutButton has clear button styling (border, background color, padding, border-radius)
  - AC2: LogoutButton has hover state (background color change or opacity)
  - AC3: LogoutButton has focus state with visible outline (keyboard accessibility)
  - AC4: LogoutButton has pointer cursor on hover
  - AC5: SuccessMessage has distinct success styling (green background or text, icon optional)
  - AC6: SuccessMessage has adequate spacing (margin, padding) and readable font size
  - AC7: App component has centered layout with adequate whitespace
  - AC8: Global styles include basic CSS reset and responsive meta viewport
  - AC9: Styles are mobile-friendly (tested at 320px viewport width)
  - AC10: No external CSS libraries used (plain CSS or CSS Modules only)
- **Files to Create/Modify:**
  - `src/App.css`
  - `src/components/LogoutButton.css`
  - `src/components/SuccessMessage.css`
  - `src/index.css`
- **Requirements Addressed:** NFR-2 (UI Usability)

### Task 10: Documentation and README
- **Component:** Project Documentation
- **Priority:** 3-Medium
- **Effort:** S
- **Dependencies:** Task 8
- **Description:** Create comprehensive README with setup instructions, usage guide, testing commands, and deployment notes
- **Acceptance Criteria:**
  - AC1: README.md includes project description and purpose (logout interaction demo)
  - AC2: Prerequisites documented (Node.js 18+, npm 9+)
  - AC3: Installation instructions (`npm install`)
  - AC4: Development server instructions (`npm run dev`)
  - AC5: Build instructions (`npm run build`)
  - AC6: Test execution instructions (`npm run test`, `npm run test:coverage`)
  - AC7: Linting instructions (`npm run lint`)
  - AC8: Project structure overview
  - AC9: Technology stack listed (React 18+, TypeScript 5+, Vite 5+, Vitest)
  - AC10: Link to architecture.md for detailed design documentation
  - AC11: Deployment instructions for static hosting (build output in `dist/` directory)
- **Files to Create/Modify:**
  - `README.md`
- **Requirements Addressed:** NFR-5 (Maintainability)
- **Design Review Actions:** Addresses Minor Issue #5 (Deployment Instructions)

### Task 11: Build Optimization and Production Readiness
- **Component:** Build Configuration
- **Priority:** 2-High
- **Effort:** S
- **Dependencies:** Task 9
- **Description:** Optimize Vite build configuration for production bundle size and performance
- **Acceptance Criteria:**
  - AC1: Production build completes without errors
  - AC2: Bundle size is under 200 KB (gzipped) including React, ReactDOM, and app code
  - AC3: Vite build outputs to `dist/` directory
  - AC4: index.html in dist/ correctly references hashed JS/CSS assets
  - AC5: Source maps generated for debugging (optional, but recommended)
  - AC6: Build includes proper minification and tree-shaking
  - AC7: Build time is under 10 seconds
  - AC8: Lighthouse performance score > 90 (tested on built production bundle)
- **Files to Create/Modify:**
  - `vite.config.ts` (add build optimization if needed)
- **Requirements Addressed:** NFR-4 (Performance - bundle size < 200 KB)

### Task 12: End-to-End Verification
- **Component:** Integration Testing
- **Priority:** 1-Critical
- **Effort:** M
- **Dependencies:** Task 11
- **Description:** Manual and automated verification that all requirements and acceptance criteria are met
- **Acceptance Criteria:**
  - AC1: All unit tests pass (`npm run test`)
  - AC2: Test coverage meets targets (80% line, 70% branch)
  - AC3: Linting passes with no errors (`npm run lint`)
  - AC4: Build succeeds (`npm run build`)
  - AC5: Manual testing in development server:
    - Logout button is visible and clickable
    - Clicking Logout displays "Logged out successfully" message
    - Logout button is hidden after logout
    - Success message remains visible after logout
  - AC6: Manual accessibility testing:
    - Logout button is keyboard accessible (Tab to focus, Enter to activate)
    - Screen reader announces success message after logout (test with NVDA or VoiceOver)
    - Focus visible on keyboard navigation
  - AC7: Cross-browser testing (Chrome, Firefox, Safari, Edge) - at least 2 browsers
  - AC8: Mobile responsive testing (320px viewport minimum)
  - AC9: All functional requirements (FR-1 through FR-5) verified
  - AC10: All non-functional requirements (NFR-1 through NFR-5) verified
- **Files to Create/Modify:**
  - None (verification task)
- **Requirements Addressed:** All requirements (FR-1 through FR-5, NFR-1 through NFR-5)

## Dependency Graph

```
Task 1 (Project Init) → Task 2 (Test Setup)
                      → Task 3 (HTML + Entry Point) → Task 4 (SuccessMessage)
                                                    → Task 5 (LogoutButton)
                                                    
Task 4 + Task 5 → Task 6 (App Component) → Task 7 (Error Boundary)
                                          → Task 9 (Styling)

Task 2 + Task 6 → Task 8 (Unit Tests)

Task 9 → Task 11 (Build Optimization)

Task 8 + Task 11 → Task 10 (Documentation)
                 → Task 12 (E2E Verification)
```

## Critical Path

Tasks on critical path (no slack):
1. Task 1 - Project Initialization (blocks all other tasks)
2. Task 3 - HTML Template and Entry Point (foundation for components)
3. Task 6 - App Component (integrates all components, core functionality)
4. Task 8 - Component Unit Tests (critical for verification)
5. Task 12 - End-to-End Verification (final gate before PR)

**Critical Path Duration Estimate:** 1 Small + 1 Small + 1 Medium + 1 Large + 1 Medium = ~2-3 days (assuming sequential work)

## Parallel Work Opportunities

- **Phase A (Post Task 3):** Tasks 4 (SuccessMessage) and 5 (LogoutButton) can be developed in parallel
- **Phase B (Post Task 6):** Tasks 7 (Error Boundary) and 9 (Styling) can be done in parallel
- **Phase C (Post Tasks 8 + 11):** Tasks 10 (Documentation) and 12 (Verification) can overlap partially

## Task Summary

| ID | Task | Priority | Effort | Dependencies | Requirements |
|----|------|----------|--------|--------------|--------------|
| 1 | Project Init & Tooling | 1 | S | None | NFR-1 |
| 2 | Test Environment Setup | 1 | S | 1 | NFR-3 |
| 3 | HTML & Entry Point | 1 | S | 1 | NFR-1 |
| 4 | SuccessMessage Component | 2 | M | 3 | FR-3, NFR-2 |
| 5 | LogoutButton Component | 2 | M | 3 | FR-1, FR-2, NFR-2 |
| 6 | App Component | 1 | M | 4, 5 | FR-1, FR-2, FR-3, FR-4, FR-5, NFR-4, NFR-5 |
| 7 | Error Boundary | 3 | S | 6 | NFR-4 |
| 8 | Component Unit Tests | 1 | L | 2, 6 | NFR-3, All FRs |
| 9 | Styling & Polish | 3 | M | 6 | NFR-2 |
| 10 | Documentation | 3 | S | 8 | NFR-5 |
| 11 | Build Optimization | 2 | S | 9 | NFR-4 |
| 12 | E2E Verification | 1 | M | 8, 11 | All Requirements |

**Total Effort Estimate:**
- Small (S): 5 tasks
- Medium (M): 5 tasks
- Large (L): 1 task
- Extra Large (XL): 0 tasks

**Estimated Timeline:** 3-5 days (depending on parallelization and developer experience)

## Phases

### Phase A: Foundation (Tasks 1-3)
**Goal:** Set up project infrastructure, tooling, and basic React application structure
**Duration:** ~0.5 days
**Deliverables:**
- Vite + React + TypeScript project initialized
- ESLint and Prettier configured
- Vitest and React Testing Library set up
- HTML template and React entry point created
- Project runs with `npm run dev`

**Key Validations:**
- Development server starts without errors
- Sample test runs successfully
- TypeScript compilation works

### Phase B: Component Development (Tasks 4-7)
**Goal:** Build all React components with accessibility and state management
**Duration:** ~1-1.5 days
**Deliverables:**
- SuccessMessage component with ARIA live region
- LogoutButton component with keyboard accessibility
- App component with state management and conditional rendering
- Error Boundary wrapper for graceful error handling

**Key Validations:**
- Components render without errors
- State updates trigger re-renders correctly
- Accessibility attributes present (role, aria-label, aria-live)
- Manual testing confirms button click → message display flow

### Phase C: Testing & Quality Assurance (Tasks 8-9)
**Goal:** Comprehensive test coverage and visual styling
**Duration:** ~1-1.5 days
**Deliverables:**
- Unit tests for all components (App, LogoutButton, SuccessMessage)
- Test coverage meets thresholds (80% line, 70% branch)
- CSS styling for buttons, messages, and layout
- All tests passing

**Key Validations:**
- `npm run test` passes all tests
- `npm run test:coverage` shows adequate coverage
- Manual UI review confirms styling quality
- Accessibility manual testing (keyboard, screen reader)

### Phase D: Production Readiness (Tasks 10-12)
**Goal:** Optimize, document, and verify for production deployment
**Duration:** ~1 day
**Deliverables:**
- README.md with complete setup and usage instructions
- Optimized production build (< 200 KB gzipped)
- End-to-end verification of all requirements
- Cross-browser and mobile testing completed

**Key Validations:**
- `npm run build` succeeds with bundle size under target
- Lighthouse performance score > 90
- All functional and non-functional requirements verified
- Documentation is clear and complete

## Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Vite React-TS template configuration differs from expectations | Medium | Use latest official template (`npm create vite@latest -- --template react-ts`). Test immediately after Task 1. |
| React Testing Library async rendering causes test flakiness | Medium | Use `waitFor`, `findBy` queries, and avoid `getBy` for async content. Follow RTL best practices guide. |
| Accessibility testing requires screen reader expertise | Medium | Use automated tools (axe DevTools, Lighthouse Accessibility) first. Manual screen reader testing can be basic (confirm announcement happens). Document limitations if expert review unavailable. |
| TypeScript strict mode causes excessive type errors | Low | Start with strict mode enabled (best practice). Incrementally add `@ts-expect-error` comments only where necessary and document reasons. |
| Bundle size exceeds 200 KB target | Low | Vite's tree-shaking and minification should keep bundle small. Monitor with `npm run build` and Vite Rollup plugin analyzer. React + ReactDOM alone are ~130 KB gzipped. |
| Test coverage thresholds too aggressive for simple components | Low | Thresholds are reasonable (80% line, 70% branch). Adjust if justified (e.g., Error Boundary edge cases). Document exceptions. |
| Cross-browser testing reveals layout issues | Medium | Test in Chrome and Firefox during Phase C (Task 9). Use modern CSS (flexbox/grid) for reliable cross-browser support. Avoid vendor-specific prefixes. |
| Manual accessibility testing incomplete without assistive tech | Medium | Use keyboard-only navigation (Tab, Enter, Space) to verify basics. Use browser DevTools to inspect ARIA attributes. Document screen reader testing as "recommended" not "required." |
| Deployment instructions too vague for Phase 08 | Low | Task 10 includes deployment section in README. Document `npm run build` → `dist/` → upload to static host. Specific platform (Netlify, Vercel) can be decided in Phase 08. |
| State persistence confusion (logout resets on refresh) | Low | Clearly document in README that logout state does NOT persist across page refreshes (out of scope per requirements). Add note about localStorage as future enhancement. |

## Out-of-Scope Tasks

The following tasks are explicitly excluded from this implementation plan (per requirements and architecture):

- **Real Authentication Logic:** No JWT tokens, OAuth, or session cookies
- **Backend API Integration:** No API calls, no server endpoints, no database queries
- **Persistent Logout State:** No localStorage or sessionStorage for state persistence across page refreshes
- **Multi-Page Navigation:** No React Router, no navigation to separate login/logout pages
- **User Registration or Login:** Only logout interaction, no sign-up or sign-in forms
- **Advanced State Management:** No Redux, Zustand, or Context API (useState is sufficient)
- **External UI Libraries:** No Material-UI, Ant Design, or Tailwind CSS (plain CSS only)
- **Advanced Testing:** No Playwright, Cypress, or visual regression tests (unit tests only)
- **Internationalization:** No i18n support (English text only)
- **Server-Side Rendering:** No SSR or SSG (client-side only SPA)
- **Progressive Web App Features:** No service workers, offline support, or PWA manifest
- **Analytics or Monitoring:** No Google Analytics, Sentry, or error tracking
- **Advanced Accessibility:** No full WCAG 2.1 AA audit (basic accessibility only)

## Design Review Action Items

This implementation plan addresses all findings from design-review.md:

### Major Issues Addressed:
1. **Accessibility (Major Issue #1):**
   - Task 4: SuccessMessage with `role="status"` and `aria-live="polite"`
   - Task 5: LogoutButton with `aria-label` and keyboard accessibility
   - Task 12: Manual accessibility testing with keyboard and screen reader

2. **Component Reusability (Major Issue #2):**
   - **Decision:** Components are intentionally specific to logout use case (LogoutButton, SuccessMessage)
   - **Rationale:** For MVP scope, specific components are simpler and avoid over-engineering
   - **Future Enhancement:** Can be refactored to generic Button/Message components if reuse needed

### Minor Issues Addressed:
1. **Error Boundary (Minor Issue #1):** Task 7 elevates Error Boundary from "optional" to "recommended"
2. **Test Coverage Targets (Minor Issue #2):** Task 2 defines explicit thresholds (80% line, 70% branch)
3. **Post-Logout Button Visibility (Minor Issue #3):** Task 6 AC5 hides button after logout
4. **Linting Configuration (Minor Issue #4):** Task 1 includes ESLint + Prettier as required setup
5. **Deployment Instructions (Minor Issue #5):** Task 10 includes deployment section in README
6. **State Persistence Clarification (Minor Issue #6):** Task 10 documents logout state does not persist across refreshes

## Notes for Implementation Phase

### Component Naming Decision (Design Review Major Issue #2):
After review of the design review feedback, the implementation plan adopts **specific component names** (LogoutButton, SuccessMessage) rather than generic names (Button, Message) for the following reasons:
- **Scope Alignment:** The user story is focused specifically on logout interaction, not a reusable component library
- **Simplicity:** Specific components avoid the complexity of generic prop interfaces (variant, type, etc.)
- **YAGNI Principle:** No current requirement for button/message reuse in other contexts
- **Refactoring Path:** Components can be generalized later if new requirements emerge

This decision is documented to prevent confusion during implementation and future reviews.

### Accessibility Testing Approach:
Task 12 includes both automated and manual accessibility testing:
- **Automated:** Lighthouse Accessibility audit, axe DevTools browser extension
- **Manual:** Keyboard-only navigation (Tab, Enter, Space), basic screen reader testing (NVDA on Windows or VoiceOver on Mac)
- **Scope:** Basic WCAG 2.1 A/AA compliance for visible elements (not full audit)

If screen reader testing is unavailable, document the limitation and recommend it as a follow-up task.

### Test Coverage Philosophy:
The 80% line coverage and 70% branch coverage targets are chosen to balance thoroughness with pragmatism:
- **High Coverage:** Critical path (button click → state change → message display) must be 100% covered
- **Reasonable Exceptions:** Error Boundary edge cases, TypeScript type guards, and trivial getters may be excluded
- **Quality over Quantity:** Focus on meaningful tests (user interactions) rather than testing implementation details

### Styling Approach:
Task 9 uses plain CSS files (not CSS Modules) for simplicity. If scope grows, CSS Modules can be adopted for better scoping:
- **Current:** `LogoutButton.css` imported in `LogoutButton.tsx`
- **Future:** `LogoutButton.module.css` with scoped class names

This is an implementation detail that can be adjusted during Task 9 without affecting the plan.

---
**Status:** Ready for approval.
**Next Phase:** 05 - Implementation
