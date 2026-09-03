import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
