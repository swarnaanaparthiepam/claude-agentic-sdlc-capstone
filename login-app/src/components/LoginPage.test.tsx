import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';

describe('LoginPage - Rendering and Structure', () => {
  it('renders without crashing', () => {
    render(<LoginPage />);
    // Test passes if no error thrown
  });

  it('displays email input field with label (FR-1)', () => {
    render(<LoginPage />);
    const emailLabel = screen.getByText(/email/i);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailLabel).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('displays password input field with label (FR-2)', () => {
    render(<LoginPage />);
    const passwordLabel = screen.getByText(/password/i);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordLabel).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('displays login button (FR-3)', () => {
    render(<LoginPage />);
    const button = screen.getByRole('button', { name: /login/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('password input masks characters (NFR-7)', () => {
    render(<LoginPage />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

describe('LoginPage - User Interactions', () => {
  it('allows user to type in email field (FR-4)', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

    await user.type(emailInput, 'test@example.com');

    expect(emailInput.value).toBe('test@example.com');
  });

  it('allows user to type in password field (FR-4)', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

    await user.type(passwordInput, 'password123');

    expect(passwordInput.value).toBe('password123');
  });

  it('displays success message after login with valid input (FR-5, FR-6)', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'securepass');
    await user.click(loginButton);

    const successMessage = screen.getByText('Login successful');
    expect(successMessage).toBeInTheDocument();
  });

  it('success message has correct data-testid', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'securepass');
    await user.click(loginButton);

    const successMessage = screen.getByTestId('success-message');
    expect(successMessage).toHaveTextContent('Login successful');
  });

  it('does not show success message on empty form submission (validation)', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.click(loginButton);

    const successMessage = screen.queryByText('Login successful');
    expect(successMessage).not.toBeInTheDocument();
  });

  it('validation fails if only email is filled', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'user@example.com');
    await user.click(loginButton);

    const successMessage = screen.queryByText('Login successful');
    expect(successMessage).not.toBeInTheDocument();
  });
});

describe('LoginPage - Accessibility and Keyboard Navigation', () => {
  it('submits form on Enter key press in password field', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password{Enter}');

    const successMessage = screen.getByText('Login successful');
    expect(successMessage).toBeInTheDocument();
  });

  it('has correct tab order (email → password → button)', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.tab();
    expect(emailInput).toHaveFocus();

    await user.tab();
    expect(passwordInput).toHaveFocus();

    await user.tab();
    expect(loginButton).toHaveFocus();
  });

  it('labels are properly associated with inputs (htmlFor)', () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toHaveAttribute('id', 'email');
    expect(passwordInput).toHaveAttribute('id', 'password');
  });
});
