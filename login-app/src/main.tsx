import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

/**
 * Application Entry Point
 *
 * Bootstraps React application with:
 * - ErrorBoundary for graceful error handling (Task 7)
 * - StrictMode for development checks
 *
 * Requirements: NFR-4 (Reliability)
 * Design: Task 7 AC4 (Wrap App with ErrorBoundary)
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
