import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

/**
 * ErrorBoundary Component Props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * ErrorBoundary Component State
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 *
 * React Error Boundary to gracefully handle runtime errors and prevent app crashes.
 *
 * Requirements: NFR-4 (Reliability)
 * Design: Task 7 from impl-plan.md
 * Design Review: Minor Issue #1 (Error Boundary Strategy)
 *
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs the error details, and displays a fallback UI instead of crashing the app.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  /**
   * Update state when an error is caught.
   *
   * Task 7 AC2: Derive state from error to trigger fallback UI.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Log error details to console for debugging.
   *
   * Task 7 AC3: Error details logged to console.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error details:', errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Task 7 AC2, AC6: Fallback UI with friendly error message and reload suggestion
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa'
          }}
        >
          <h1 style={{ color: '#dc3545', fontSize: '24px', marginBottom: '16px' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '16px', marginBottom: '24px', color: '#6c757d' }}>
            An unexpected error occurred. Please reload the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
          {this.state.error && (
            <details style={{ marginTop: '24px', fontSize: '14px', color: '#6c757d' }}>
              <summary style={{ cursor: 'pointer' }}>Error Details</summary>
              <pre style={{ textAlign: 'left', marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
