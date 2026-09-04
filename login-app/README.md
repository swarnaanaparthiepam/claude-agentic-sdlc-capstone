# Login Page Application

Simple React login page with mock authentication and logout functionality (User Stories CJS-2, CJS-3).

## Overview

Single-page application built with React 19, TypeScript 6, and Vite 8.
Features include:
- Login form with mock authentication
- Logout button with success message
- No backend required (all client-side logic)

## Architecture

- App component manages logged-in/logged-out state
- LoginPage component for authentication (CJS-2)
- LogoutButton and SuccessMessage components for logout flow (CJS-3)
- ErrorBoundary for graceful error handling
- Mock authentication logic (inline, no HTTP requests)
- CSS Modules for component-scoped styling
- Vitest + React Testing Library for automated tests

Full architecture:
- CJS-2: [../docs/artifacts/CJS-2/architecture.md](../docs/artifacts/CJS-2/architecture.md)
- CJS-3: [../docs/artifacts/CJS-3/architecture.md](../docs/artifacts/CJS-3/architecture.md)

## Prerequisites

- Node.js 20.x LTS (required)
- npm 9+ or pnpm 8+

## Setup

```bash
npm install
npm run dev  # Start dev server on http://localhost:5173
```

## Testing

```bash
npm run test          # Run tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report
```

**Test Results:**
- 32 tests passing (CJS-2: 16 tests, CJS-3: 16 tests)
- 100% code coverage (statements, branches, functions, lines)

## Build

```bash
npm run build   # Production build to dist/
npm run preview # Preview production build
```

**Build Output:**
- Bundle size: 194 KB uncompressed (61.34 KB gzipped)
- Well under 200 KB gzipped target
- Optimized for Chrome/Firefox/Edge 115+, Safari 16.4+

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for static hosting options.

**Security Requirements:**
- Deploy with HTTPS (required for production)
- Content-Security-Policy header recommended

## Technology Stack

- React 19.2.8
- TypeScript 6.0.2
- Vite 8.2.2
- Vitest 5.0.0 + React Testing Library 16.3.3
- CSS Modules

## Browser Support

- Chrome/Edge 115+
- Firefox 115+
- Safari 16.4+

## Requirements Traceability

**CJS-2 (Login Page):**
- [Requirements](../docs/artifacts/CJS-2/requirements.md)
- [Architecture](../docs/artifacts/CJS-2/architecture.md)
- [Design Review](../docs/artifacts/CJS-2/design-review.md)
- [Implementation Plan](../docs/artifacts/CJS-2/impl-plan.md)

**CJS-3 (Logout Button):**
- [Requirements](../docs/artifacts/CJS-3/requirements.md)
- [Architecture](../docs/artifacts/CJS-3/architecture.md)
- [Design Review](../docs/artifacts/CJS-3/design-review.md)
- [Implementation Plan](../docs/artifacts/CJS-3/impl-plan.md)

## Features

**Login Features (CJS-2):**
- Email input field with validation
- Password input field (masked)
- Login button with form submission
- Login success message display
- Basic non-empty field validation
- Keyboard navigation support (Tab order, Enter key submission)

**Logout Features (CJS-3):**
- Logout button with click interaction
- "Logged out successfully" success message
- Mock logout logic (client-side state management)
- Button hidden after logout

**Accessibility:**
- Semantic HTML and ARIA attributes
- Screen reader support (aria-live regions)
- Keyboard navigation (Tab, Enter, Space)
- Visible focus indicators

**Quality:**
- Error boundary for graceful error handling
- 100% test coverage
- Fully typed with TypeScript
- Production-ready build optimization

## Project Structure

```
login-app/
├── src/
│   ├── components/
│   │   ├── LoginPage.tsx              # Login component (CJS-2)
│   │   ├── LoginPage.module.css       # Login styles
│   │   ├── LoginPage.test.tsx         # Login tests
│   │   ├── LogoutButton.tsx           # Logout button (CJS-3)
│   │   ├── LogoutButton.module.css    # Logout button styles
│   │   ├── LogoutButton.test.tsx      # Logout button tests
│   │   ├── SuccessMessage.tsx         # Success message (CJS-3)
│   │   ├── SuccessMessage.module.css  # Success message styles
│   │   ├── SuccessMessage.test.tsx    # Success message tests
│   │   └── ErrorBoundary.tsx          # Error boundary
│   ├── test/
│   │   └── setup.ts                    # Test configuration
│   ├── App.tsx                         # Root component with state management
│   ├── App.test.tsx                    # App integration tests
│   ├── App.css                         # App layout styles
│   ├── main.tsx                        # Application entry point
│   └── index.css                       # Minimal CSS reset
├── public/                              # Static assets
├── dist/                                # Production build output
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Development

- TypeScript strict mode enabled
- ESLint configured with TypeScript and React rules
- Prettier configured for consistent formatting
- Hot Module Replacement (HMR) in dev mode

## License

This is a capstone project for demonstrating SDLC workflow.
