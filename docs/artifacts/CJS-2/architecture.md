# Architecture — CJS-2

**Based on:** requirements.md
**Designed:** 2026-09-03T16:35:00+0530

## High-Level Overview

This architecture defines a minimal, frontend-only login page built with React, TypeScript, and Vite. The application consists of a single-page component with mock authentication logic, requiring no backend services or database connectivity.

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (User)                        │
└─────────────────────────────────────────────────────────┘
                           │
                           │ User Interaction
                           ▼
┌─────────────────────────────────────────────────────────┐
│              LoginPage Component (React)                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Email Input (controlled component)             │   │
│  │  Password Input (controlled component)          │   │
│  │  Login Button (event handler)                   │   │
│  │  Success Message (conditional render)           │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                                │
│                         │ State Management               │
│                         ▼                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │  React State (useState)                         │   │
│  │  - email: string                                │   │
│  │  - password: string                             │   │
│  │  - isLoginSuccessful: boolean                   │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                                │
│                         │ Mock Logic                     │
│                         ▼                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │  handleLogin() - Mock Authentication            │   │
│  │  - Validates non-empty inputs (optional)        │   │
│  │  - Sets isLoginSuccessful = true                │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           │ Vite Dev Server / Static Build
                           ▼
┌─────────────────────────────────────────────────────────┐
│           Vite Build Tool + Dev Server                   │
│  - Hot Module Replacement (HMR) for development          │
│  - Optimized production bundle                           │
│  - TypeScript compilation                                │
└─────────────────────────────────────────────────────────┘
```

## Components

### Component 1: LoginPage (Main UI Component)
- **Responsibility:** Renders the login form UI and manages user interaction for email/password input and login submission.
- **Inputs:** 
  - User keyboard input (email and password fields)
  - User click event (Login button)
- **Outputs:** 
  - Rendered HTML form elements (email input, password input, button)
  - Success message display ("Login successful")
- **Technology:** React functional component with TypeScript
- **State Management:** React `useState` hook for email, password, and login success flag
- **Key Behaviors:**
  - Controlled inputs bind to React state
  - Login button triggers `handleLogin` function
  - Conditional rendering shows success message when login succeeds

### Component 2: App (Root Component)
- **Responsibility:** Root application component that mounts LoginPage and provides application structure.
- **Inputs:** None (entry point)
- **Outputs:** Renders LoginPage component
- **Technology:** React functional component with TypeScript
- **Key Behaviors:**
  - Single responsibility: render LoginPage
  - May include minimal styling/layout wrapper

### Component 3: main.tsx (Application Entry Point)
- **Responsibility:** Bootstraps the React application and mounts it to the DOM.
- **Inputs:** None (entry script)
- **Outputs:** Renders App component into root DOM element
- **Technology:** ReactDOM.render with StrictMode
- **Key Behaviors:**
  - Imports App component
  - Selects root DOM element
  - Renders React tree

### Component 4: Mock Authentication Logic (handleLogin function)
- **Responsibility:** Simulates login behavior without backend authentication.
- **Inputs:** Email and password from component state
- **Outputs:** Boolean success status (always true, or conditional on non-empty inputs)
- **Technology:** TypeScript function within LoginPage component
- **Key Behaviors:**
  - Optional: Basic validation (non-empty email/password)
  - Sets `isLoginSuccessful` state to `true`
  - No HTTP requests, no external calls

## Data Flow

### User Login Interaction Flow

1. **Page Load:**
   - Browser loads `index.html`
   - Vite injects `main.tsx` bundle
   - React mounts App → LoginPage
   - Email, password inputs render (empty)
   - Login button renders (enabled)

2. **User Input:**
   - User types in email field → `onChange` event → `setEmail(value)` → state updates → input re-renders with value
   - User types in password field → `onChange` event → `setPassword(value)` → state updates → masked input re-renders

3. **Login Submission:**
   - User clicks "Login" button → `onClick` event → `handleLogin()` function executes
   - `handleLogin()` validates (optional): check email and password are non-empty
   - `handleLogin()` calls `setIsLoginSuccessful(true)`
   - Component re-renders with success flag enabled

4. **Success Display:**
   - Conditional render: `{isLoginSuccessful && <p>Login successful</p>}`
   - Success message appears on screen
   - No further action (no navigation, no API call)

### State Flow Diagram

```
Initial State:
{ email: "", password: "", isLoginSuccessful: false }

User types email → setEmail("user@example.com")
{ email: "user@example.com", password: "", isLoginSuccessful: false }

User types password → setPassword("password123")
{ email: "user@example.com", password: "password123", isLoginSuccessful: false }

User clicks Login → handleLogin() → setIsLoginSuccessful(true)
{ email: "user@example.com", password: "password123", isLoginSuccessful: true }

UI re-renders → Success message displays
```

## Technology Stack

### Frontend Framework
- **React 18.x:** Functional components with Hooks (useState, potentially useCallback)
- **Rationale:** Required by User Story, mature ecosystem, excellent TypeScript support, component-based architecture ideal for testable UI

### Language
- **TypeScript 5.x:** Strict mode enabled for type safety
- **Rationale:** Required by User Story, provides compile-time type checking, better IDE support, reduces runtime errors

### Build Tool
- **Vite 5.x:** Development server with HMR, production bundler
- **Rationale:** Required by User Story, faster than Webpack for dev experience, optimized for React + TypeScript, modern ESM-based architecture

### Testing Framework
- **Vitest 1.x:** Unit test runner (Jest-compatible API, integrated with Vite)
- **React Testing Library 14.x:** Component testing utilities (user-centric testing approach)
- **@testing-library/user-event:** Simulates real user interactions
- **Rationale:** Vitest integrates seamlessly with Vite (no additional config), React Testing Library aligns with accessibility best practices and user-focused testing (required by FR-8)

### Styling
- **CSS Modules OR Basic CSS:** Scoped component styling
- **Rationale:** Simplicity requirement (NFR-4) - no need for complex CSS-in-JS or UI frameworks. CSS Modules provide scoping without overhead.

### Package Manager
- **npm OR pnpm:** Dependency management
- **Rationale:** Standard tooling, npm comes with Node.js, pnpm is faster and more efficient (either acceptable)

### Node.js
- **Version 18.x or 20.x LTS:** Runtime for development tooling
- **Rationale:** Required for Vite and npm, LTS ensures stability

### Browser Targets
- **Modern browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Rationale:** Assumption documented in requirements.md, Vite defaults align with this

## Non-Functional Requirements

### Simplicity (NFR-4)
**Approach:**
- Single LoginPage component (avoid over-engineering with multiple sub-components)
- Minimal state management (React useState only, no Redux/Context unless absolutely needed - not needed here)
- Inline mock logic (no separate authentication service layer for mock behavior)
- No routing (single page application)
- No form validation libraries (native HTML5 validation if needed)

**Validation:** 
- Component file count < 5
- No external state management libraries
- No unnecessary abstractions

### Performance
**Targets:**
- Initial load time: < 1 second (Vite optimized bundle)
- Time to Interactive (TTI): < 1.5 seconds
- Bundle size: < 200 KB (uncompressed, React + minimal logic)

**Strategy:**
- Vite tree-shaking and code splitting
- Lazy loading not required (single component)
- Minification in production build

### Security (NFR-7: Password Security Display)
**Approach:**
- Email input: `<input type="email" />`
- Password input: `<input type="password" />` (masks characters automatically)
- No password strength validation (out of scope)
- No credential storage (mock login, no persistence)

**Validation:**
- Password field uses `type="password"` attribute
- No plain-text password logging or display

### Reliability
**Approach:**
- Client-side only: no network dependencies, no external service failures
- Mock login always succeeds (deterministic behavior)
- No error states required (FR-6 allows basic success-only path)

**Validation:**
- Application runs offline after initial load
- No dependency on backend uptime

### Maintainability
**Approach:**
- TypeScript strict mode: catch errors at compile time
- Component-based: LoginPage is isolated and testable
- Conventional file structure:
  ```
  src/
    components/
      LoginPage.tsx
      LoginPage.module.css
      LoginPage.test.tsx
    App.tsx
    main.tsx
  ```
- Clear separation: UI logic (component) vs. render (JSX) vs. styling (CSS)

**Validation:**
- TypeScript compiler passes with no errors
- ESLint (optional but recommended) passes
- All functions have explicit return types

### Testability (NFR-6)
**Approach:**
- Accessible element selectors: use `<label>` elements with proper `htmlFor` attributes
- ARIA roles: button role, input roles
- Test IDs: `data-testid` attributes for critical elements (email input, password input, login button, success message)
- Testable structure: LoginPage component can be rendered in isolation for unit tests

**Test Coverage Strategy:**
1. Render test: component renders without crashing
2. Input test: email and password fields accept input
3. Button test: login button is clickable
4. Success test: clicking login shows success message
5. Masking test: password field masks input

**Validation:**
- React Testing Library can query all elements by role or label
- Tests simulate user interaction (type, click) successfully
- Test coverage > 80% (lines covered)

### Usability (NFR-5)
**Approach:**
- Semantic HTML: `<form>`, `<label>`, `<input>`, `<button>` elements
- Clear labels: "Email" and "Password" labels visible above or beside inputs
- Logical tab order: email → password → button (native HTML order)
- Visual feedback: success message is prominent (e.g., green text, bold)
- Button state: enabled by default (no disabled logic needed for mock flow)

**Validation:**
- Keyboard navigation works (Tab key cycles through fields)
- Labels are associated with inputs (clicking label focuses input)
- Success message is visually distinct

## Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **TypeScript configuration errors** | Medium | Use `npm create vite@latest` with React-TS template, which provides pre-configured `tsconfig.json`. Validate config with `tsc --noEmit`. |
| **Test framework integration complexity** | Low | Vitest is designed for Vite projects, requires minimal config. Use official Vite + React Testing Library guides. |
| **Scope creep (adding unnecessary features)** | Medium | Strict adherence to requirements.md. Code review must reject features not in FR-1 through FR-8. |
| **Password field not masking** | Low | Use standard `type="password"` attribute. Test in multiple browsers during verification phase. |
| **Success message not displaying** | Low | Conditional rendering with state flag. Unit test verifies this behavior. Manual verification during Phase 07. |
| **Build tool misconfiguration** | Low | Vite React-TS template is production-tested. Follow official Vite documentation for any customization. |
| **Browser compatibility issues** | Low | Target modern browsers (assumption). Vite's default targets are appropriate. No polyfills needed. |
| **Node.js version mismatch** | Low | Document required Node.js version in README (18.x or 20.x LTS). CI/CD should validate version. |

## Assumptions

1. **No Form Submission Prevention:** Since this is a mock login, the form may use a `<button type="button">` instead of `<button type="submit">` to avoid page reload. Alternatively, use `<form onSubmit={handleSubmit}>` with `event.preventDefault()`.

2. **Success Message Persistence:** After displaying "Login successful", the message remains visible. No timeout, no automatic dismissal, no navigation away from page.

3. **No Loading State:** Mock login is instant (no async operation). No spinner, no "logging in..." message needed.

4. **No Error Handling:** Mock login always succeeds (per FR-6). No error messages for invalid credentials (empty fields may optionally show basic validation, but not required).

5. **Single Instance:** Application displays one login form. No multi-step flow, no tabs, no navigation.

6. **CSS Styling Flexibility:** Visual design is not prescribed. Implementation may use any reasonable styling approach (plain CSS, CSS Modules, inline styles). Styling should be clean and functional, not elaborate.

7. **Development Environment:** Developers use modern code editors (VS Code recommended) with TypeScript and ESLint extensions for better DX.

8. **Static Deployment:** Application can be deployed as static files (Vite `npm run build` produces `dist/` folder with static HTML/JS/CSS). No server-side rendering needed.

## Architecture Decision Records

### ADR-001: React Functional Components with Hooks
**Decision:** Use functional components with useState instead of class components.
**Rationale:** Modern React best practice, simpler syntax, better TypeScript inference, easier to test.
**Consequences:** Requires React 16.8+, developers must understand Hooks API.

### ADR-002: No State Management Library
**Decision:** Use local component state (useState) only, no Redux/Zustand/Context.
**Rationale:** Application has minimal state (3 fields), no cross-component state sharing needed. Aligns with NFR-4 (simplicity).
**Consequences:** State is local to LoginPage. If future features require global state, refactoring would be needed (unlikely given scope).

### ADR-003: Mock Logic Inline in Component
**Decision:** Implement mock authentication logic directly in LoginPage component's `handleLogin` function.
**Rationale:** No reusability requirement (single component), simplifies architecture, avoids premature abstraction.
**Consequences:** If real authentication is added later, logic must be extracted. Out-of-scope per requirements, so acceptable.

### ADR-004: Vitest + React Testing Library
**Decision:** Use Vitest for test runner and React Testing Library for component testing.
**Rationale:** Vitest integrates with Vite (same config, faster test execution), RTL encourages accessible, user-focused tests.
**Consequences:** Developers familiar with Jest will find Vitest familiar. RTL requires learning its query patterns (getByRole, getByLabelText).

### ADR-005: CSS Modules for Styling
**Decision:** Use CSS Modules (`.module.css` files) for component-scoped styling.
**Rationale:** Scoped styles prevent global CSS conflicts, no build config needed (Vite supports out-of-box), lightweight.
**Consequences:** Slight syntax change (`className={styles.container}`). Alternative: plain CSS (also acceptable).

### ADR-006: No Form Library
**Decision:** Build form with native HTML input elements, no Formik/React-Hook-Form.
**Rationale:** Two inputs and one button do not justify form library overhead. Simplicity requirement (NFR-4).
**Consequences:** Manual state management (acceptable for 2 fields). If complex validation is added later, form library would help (out-of-scope).

### ADR-007: Optional Basic Validation
**Decision:** Implement optional non-empty validation on email/password fields (not required by FR, but good practice).
**Rationale:** Prevents submitting empty form (better UX), minimal code impact (`if (!email || !password) return;`).
**Consequences:** Adds small complexity, must be tested. Implementation decision, not architectural requirement.

## Component Structure

### File Organization
```
login-app/
├── src/
│   ├── components/
│   │   ├── LoginPage.tsx          # Main login UI component
│   │   ├── LoginPage.module.css   # Component-scoped styles
│   │   └── LoginPage.test.tsx     # Component tests
│   ├── App.tsx                     # Root component (renders LoginPage)
│   ├── App.css                     # Global/app-level styles (minimal)
│   ├── main.tsx                    # React entry point
│   └── vite-env.d.ts               # Vite type declarations
├── public/                          # Static assets (favicon, etc.)
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite configuration (with Vitest)
├── .gitignore                       # Ignore node_modules, dist, etc.
└── README.md                        # Project setup instructions
```

### LoginPage Component Interface (TypeScript)

```typescript
// src/components/LoginPage.tsx

interface LoginPageState {
  email: string;
  password: string;
  isLoginSuccessful: boolean;
}

export const LoginPage: React.FC = () => {
  // Component implementation
};
```

### App Component Interface

```typescript
// src/App.tsx

export const App: React.FC = () => {
  return <LoginPage />;
};
```

## Traceability

| Requirement | Component | Implementation Notes |
|-------------|-----------|----------------------|
| FR-1 (Email Input Field) | LoginPage | `<input type="email" />` with label, bound to `email` state via `value` and `onChange` |
| FR-2 (Password Input Field) | LoginPage | `<input type="password" />` with label, bound to `password` state, masks characters |
| FR-3 (Login Button) | LoginPage | `<button onClick={handleLogin}>Login</button>` or `<button type="submit">` with form |
| FR-4 (Enter Email and Password) | LoginPage | Controlled inputs allow typing, state updates on `onChange` |
| FR-5 (Login Success Message) | LoginPage | Conditional render: `{isLoginSuccessful && <p>Login successful</p>}` |
| FR-6 (Mock Login Logic) | handleLogin function | Sets `isLoginSuccessful = true`, no HTTP/database calls |
| FR-7 (No Backend) | Architecture | No backend components in design, client-side only, static deployment |
| FR-8 (Automated Tests) | LoginPage.test.tsx | Vitest + RTL tests for render, input, click, success message |
| NFR-1 (React) | LoginPage, App | React functional components with JSX/TSX |
| NFR-2 (TypeScript) | All `.tsx` files | TypeScript strict mode, typed props and state |
| NFR-3 (Vite) | Build system | Vite config, dev server, build scripts in `package.json` |
| NFR-4 (Simplicity) | Architecture | Single component, no over-engineering, minimal dependencies |
| NFR-5 (Usability) | LoginPage UI | Semantic HTML, clear labels, logical tab order |
| NFR-6 (Testability) | LoginPage | `data-testid` attributes, accessible queries, isolated component |
| NFR-7 (Password Security) | LoginPage | `type="password"` attribute on password input |

## Implementation Phases (High-Level)

This architecture supports a phased implementation approach (detailed plan in Phase 04):

1. **Phase 1: Project Setup**
   - Initialize Vite + React + TypeScript project
   - Install dependencies (React, ReactDOM, TypeScript, Vite, Vitest, React Testing Library)
   - Configure `tsconfig.json`, `vite.config.ts`
   - Verify dev server runs

2. **Phase 2: LoginPage Component Structure**
   - Create LoginPage component file
   - Implement state variables (email, password, isLoginSuccessful)
   - Render email input with label
   - Render password input with label
   - Render login button

3. **Phase 3: Input Handling**
   - Add `onChange` handlers to inputs
   - Bind inputs to state (controlled components)
   - Test typing in fields (manual verification)

4. **Phase 4: Login Logic**
   - Implement `handleLogin` function
   - Optional: add basic validation (non-empty check)
   - Set `isLoginSuccessful` to true on button click

5. **Phase 5: Success Message**
   - Add conditional rendering for success message
   - Style message for visibility

6. **Phase 6: Styling**
   - Create CSS Module for component
   - Apply clean, functional styles (layout, spacing, colors)
   - Ensure password masking works visually

7. **Phase 7: Automated Tests**
   - Write test for component rendering
   - Write test for input interaction
   - Write test for login button click
   - Write test for success message display
   - Run tests, ensure 100% pass

8. **Phase 8: Integration and Verification**
   - Build production bundle (`npm run build`)
   - Verify static files work (serve `dist/` folder)
   - Manual testing in browser
   - Cross-browser verification (Chrome, Firefox, Safari)

## Deployment Considerations

### Development
- Command: `npm run dev` (Vite dev server)
- Hot Module Replacement (HMR) for rapid iteration
- URL: `http://localhost:5173` (default Vite port)

### Production Build
- Command: `npm run build`
- Output: `dist/` folder with optimized static files
- Deployment options:
  - Static hosting: Netlify, Vercel, GitHub Pages, AWS S3 + CloudFront
  - Any web server: nginx, Apache (serve `dist/` as static files)
  - CDN: Direct upload to CDN for global distribution

### Testing
- Command: `npm run test` (Vitest)
- Command: `npm run test:ui` (Vitest UI mode, optional)
- CI/CD: Tests run in GitHub Actions or similar (Phase 08 will configure)

## Success Criteria

This architecture is considered successful if:

1. **Functional Completeness:**
   - All FR-1 through FR-8 are implementable with this design
   - No architectural changes needed during implementation

2. **Non-Functional Compliance:**
   - Simplicity: Single component, minimal dependencies
   - Testability: All elements are testable with RTL
   - Usability: Semantic HTML, clear labels, logical flow
   - Security: Password masking implemented

3. **Technology Stack Alignment:**
   - React 18.x + TypeScript 5.x + Vite 5.x confirmed working
   - Vitest + React Testing Library configured and operational

4. **Risk Mitigation:**
   - All identified risks have documented mitigations
   - No high-severity unmitigated risks remain

5. **Traceability:**
   - Every requirement maps to a specific component or implementation strategy
   - Traceability matrix is complete and verifiable

6. **Implementation Readiness:**
   - Architecture provides sufficient detail for Phase 04 (Planning)
   - No ambiguities or open architectural questions remain

---
**Status:** Ready for human review and design approval.
**Next Phase:** 03 - Design Review

## Appendix: Technology Versions

| Technology | Version | Release Date | End of Life | Notes |
|------------|---------|--------------|-------------|-------|
| React | 18.3.1 | March 2024 | TBD | Latest stable, React 19 in beta |
| TypeScript | 5.7.2 | December 2024 | TBD | Latest stable |
| Vite | 5.4.x | 2024 | TBD | Latest stable 5.x |
| Vitest | 1.x | 2024 | TBD | Stable, Jest-compatible |
| React Testing Library | 14.x | 2024 | TBD | Latest stable |
| Node.js | 20.x LTS | 2023 | April 2026 | Recommended LTS version |

## Appendix: Alternative Architectures Considered

### Alternative 1: Class Components
**Rejected Reason:** Functional components with Hooks are modern React best practice, better TypeScript support, simpler syntax.

### Alternative 2: Redux for State Management
**Rejected Reason:** Massive overkill for 3 state variables. Violates NFR-4 (simplicity).

### Alternative 3: Separate Authentication Service Module
**Rejected Reason:** Premature abstraction for mock logic. Simplicity requirement favors inline logic.

### Alternative 4: Jest Instead of Vitest
**Rejected Reason:** Vitest integrates better with Vite (same config, faster). Jest would require additional transform config.

### Alternative 5: Tailwind CSS
**Rejected Reason:** Acceptable alternative, but CSS Modules are lighter and require no additional setup. Either is valid.

### Alternative 6: Next.js Instead of Vite
**Rejected Reason:** Next.js is over-engineered for a single-page static app. Vite is lighter and matches requirements.
