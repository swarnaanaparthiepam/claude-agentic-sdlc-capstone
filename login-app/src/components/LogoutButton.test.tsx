import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LogoutButton } from './LogoutButton';

/**
 * LogoutButton Component Tests
 *
 * Requirements: NFR-3 (Automated Testing)
 * Design: Task 8 AC2 from impl-plan.md
 *
 * Test Coverage:
 * - Button renders with text "Logout"
 * - Button is keyboard accessible (can receive focus)
 * - onClick callback is called when button clicked
 * - Button has proper ARIA attributes
 */
describe('LogoutButton', () => {
  it('renders button with text "Logout"', () => {
    const mockOnClick = vi.fn();
    render(<LogoutButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Logout');
  });

  it('is keyboard accessible (can receive focus)', () => {
    const mockOnClick = vi.fn();
    render(<LogoutButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /logout/i });

    // Verify button can be focused with Tab key
    button.focus();
    expect(button).toHaveFocus();
  });

  it('calls onClick callback when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    render(<LogoutButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /logout/i });

    // Simulate user click
    await user.click(button);

    // Verify onClick was called exactly once
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('has proper ARIA attributes', () => {
    const mockOnClick = vi.fn();
    render(<LogoutButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /logout/i });

    // Verify aria-label is present
    expect(button).toHaveAttribute('aria-label', 'Logout');
  });

  it('can be activated with keyboard (Enter key)', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    render(<LogoutButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /logout/i });

    // Focus the button and press Enter
    button.focus();
    await user.keyboard('{Enter}');

    // Verify onClick was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('can be activated with keyboard (Space key)', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    render(<LogoutButton onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /logout/i });

    // Focus the button and press Space
    button.focus();
    await user.keyboard(' ');

    // Verify onClick was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
