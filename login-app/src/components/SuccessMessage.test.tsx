import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SuccessMessage } from './SuccessMessage';

/**
 * SuccessMessage Component Tests
 *
 * Requirements: NFR-3 (Automated Testing)
 * Design: Task 8 AC3 from impl-plan.md
 *
 * Test Coverage:
 * - Message renders with correct text
 * - Message has role="status" attribute
 * - Message has aria-live="polite" attribute
 * - Custom message prop overrides default text
 */
describe('SuccessMessage', () => {
  it('renders with default message "Logged out successfully"', () => {
    render(<SuccessMessage />);

    const message = screen.getByRole('status');
    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent('Logged out successfully');
  });

  it('has role="status" ARIA attribute', () => {
    render(<SuccessMessage />);

    const message = screen.getByRole('status');
    expect(message).toHaveAttribute('role', 'status');
  });

  it('has aria-live="polite" attribute for screen reader announcement', () => {
    render(<SuccessMessage />);

    const message = screen.getByRole('status');
    expect(message).toHaveAttribute('aria-live', 'polite');
  });

  it('renders custom message when message prop is provided', () => {
    const customMessage = 'Custom success message';
    render(<SuccessMessage message={customMessage} />);

    const message = screen.getByRole('status');
    expect(message).toHaveTextContent(customMessage);
  });

  it('displays exact text without extra whitespace or formatting', () => {
    render(<SuccessMessage />);

    const message = screen.getByRole('status');
    expect(message.textContent).toBe('Logged out successfully');
  });

  it('has proper test id for automated testing', () => {
    render(<SuccessMessage />);

    const message = screen.getByTestId('success-message');
    expect(message).toBeInTheDocument();
  });
});
