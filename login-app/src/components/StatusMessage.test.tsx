import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatusMessage } from './StatusMessage';

/**
 * StatusMessage Component Tests
 *
 * Requirements: FR-3 (Automated test for status message)
 * User Story: CJS-5
 *
 * Test Coverage:
 * - Component renders without crashing
 * - Component displays correct text content "Page loaded successfully"
 * - Component has aria-live="polite" attribute for screen reader support
 * - Component has role="status" for accessibility
 */
describe('StatusMessage', () => {
  it('renders without crashing', () => {
    const { container } = render(<StatusMessage />);
    expect(container).toBeTruthy();
  });

  it('displays correct text content "Page loaded successfully"', () => {
    render(<StatusMessage />);

    const message = screen.getByRole('status');
    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent('Page loaded successfully');
  });

  it('has aria-live="polite" attribute for screen reader announcement', () => {
    render(<StatusMessage />);

    const message = screen.getByRole('status');
    expect(message).toHaveAttribute('aria-live', 'polite');
  });

  it('has role="status" ARIA attribute for accessibility', () => {
    render(<StatusMessage />);

    const message = screen.getByRole('status');
    expect(message).toHaveAttribute('role', 'status');
  });

  it('displays exact text without extra whitespace or formatting', () => {
    render(<StatusMessage />);

    const message = screen.getByRole('status');
    expect(message.textContent).toBe('Page loaded successfully');
  });

  it('has proper test id for automated testing', () => {
    render(<StatusMessage />);

    const message = screen.getByTestId('status-message');
    expect(message).toBeInTheDocument();
  });
});
