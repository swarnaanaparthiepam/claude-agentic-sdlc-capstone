# Login Page Application

Simple React login page with mock authentication (User Story CJS-2).

## Overview

Single-page login form built with React 19, TypeScript 6, and Vite 8.
Uses mock authentication (no backend required).

## Architecture

- Single LoginPage component with local state (useState)
- Mock authentication logic (inline, no HTTP requests)
- CSS Modules for component-scoped styling
- Vitest + React Testing Library for automated tests

Full architecture: [../docs/artifacts/CJS-2/architecture.md](../docs/artifacts/CJS-2/architecture.md)

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
- 16 tests passing
- 100% code coverage (statements, branches, functions, lines)

## Build

```bash
npm run build   # Production build to dist/
npm run preview # Preview production build
```

**Build Output:**
- Bundle size: 192 KB uncompressed (60.61 KB gzipped)
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

- [Requirements](../docs/artifacts/CJS-2/requirements.md)
- [Architecture](../docs/artifacts/CJS-2/architecture.md)
- [Design Review](../docs/artifacts/CJS-2/design-review.md)
- [Implementation Plan](../docs/artifacts/CJS-2/impl-plan.md)

## Features

- Email input field with validation
- Password input field (masked)
- Login button with form submission
- Success message display
- Basic non-empty field validation
- Keyboard navigation support (Tab order, Enter key submission)
- Accessible form with semantic HTML and ARIA attributes

## Project Structure

```
login-app/
├── src/
│   ├── components/
│   │   ├── LoginPage.tsx          # Main login component
│   │   ├── LoginPage.module.css   # Component styles
│   │   └── LoginPage.test.tsx     # Component tests
│   ├── test/
│   │   └── setup.ts                # Test configuration
│   ├── App.tsx                     # Root component
│   ├── App.css                     # Global styles
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Minimal CSS reset
├── public/                          # Static assets
├── dist/                            # Production build output
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
