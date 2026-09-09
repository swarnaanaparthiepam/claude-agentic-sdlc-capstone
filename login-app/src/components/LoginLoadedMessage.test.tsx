import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginLoadedMessage } from './LoginLoadedMessage';

/**
 * LoginLoadedMessage Component Tests
 *
 * Requirements: FR-4 (Automated test for message display)
 * User Story: CJS-6
 *
 * Test Coverage:
 * - Component renders without crashing
 * - Component displays correct text content "Login page loaded successfully"
 * - Component has aria-live="polite" attribute for screen reader support
 * - Component has role="status" for accessibility
 * - Component renders automatically on mount with no user interaction
 */
describe('LoginLoadedMessage', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoginLoadedMessage />);
    expect(container).toBeTruthy();
  });

  it('displays correct text content "Login page loaded successfully" on mount', () => {
    render(<LoginLoadedMessage />);

    const message = screen.getByRole('status');
    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent('Login page loaded successfully');
  });

  it('has aria-live="polite" attribute for screen reader announcement', () => {
    render(<LoginLoadedMessage />);

    const message = screen.getByRole('status');
    expect(message).toHaveAttribute('aria-live', 'polite');
  });

  it('has role="status" ARIA attribute for accessibility', () => {
    render(<LoginLoadedMessage />);

    const message = screen.getByRole('status');
    expect(message).toHaveAttribute('role', 'status');
  });

  it('displays exact text without extra whitespace or formatting', () => {
    render(<LoginLoadedMessage />);

    const message = screen.getByRole('status');
    expect(message.textContent).toBe('Login page loaded successfully');
  });

  it('has proper test id for automated testing', () => {
    render(<LoginLoadedMessage />);

    const message = screen.getByTestId('login-loaded-message');
    expect(message).toBeInTheDocument();
  });
});
