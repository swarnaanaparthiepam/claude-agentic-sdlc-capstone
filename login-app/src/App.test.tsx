import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { App } from './App';

/**
 * App Component Tests
 *
 * Requirements: NFR-3 (Automated Testing), All FRs (FR-1 through FR-5)
 * Design: Task 8 AC1 from impl-plan.md
 *
 * Test Coverage:
 * - Initial render shows LoginPage and LogoutButton, does not show SuccessMessage
 * - Clicking Logout button triggers state change
 * - After logout, SuccessMessage is visible with text "Logged out successfully"
 * - After logout, LogoutButton is hidden
 * - After logout, LoginPage is hidden
 */
describe('App', () => {
  it('initially renders LoginPage and LogoutButton, but not SuccessMessage', () => {
    render(<App />);

    // LoginPage should be visible (contains "Login" heading)
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();

    // LogoutButton should be visible
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();

    // SuccessMessage should NOT be visible
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('displays SuccessMessage after clicking Logout button', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Initially, success message is not visible
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Click the Logout button
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    // Success message should now be visible with exact text
    const successMessage = screen.getByRole('status');
    expect(successMessage).toBeInTheDocument();
    expect(successMessage).toHaveTextContent('Logged out successfully');
  });

  it('hides LogoutButton after logout', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Initially, LogoutButton is visible
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();

    // Click the Logout button
    await user.click(logoutButton);

    // LogoutButton should now be hidden
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  it('hides LoginPage after logout', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Initially, LoginPage is visible (contains "Login" heading)
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();

    // Click the Logout button
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    // LoginPage should now be hidden
    expect(screen.queryByRole('heading', { name: /login/i })).not.toBeInTheDocument();
  });

  it('complete logout flow: LoginPage -> Logout click -> SuccessMessage', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Step 1: Initial state - LoginPage and LogoutButton visible
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Step 2: User clicks Logout
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    // Step 3: Final state - Only SuccessMessage visible
    expect(screen.queryByRole('heading', { name: /login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Logged out successfully');
  });

  it('state management works correctly (isLoggedIn toggles)', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Initial state: isLoggedIn = true
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();

    // Trigger state change: isLoggedIn = false
    await user.click(screen.getByRole('button', { name: /logout/i }));

    // Verify state change reflected in UI
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
