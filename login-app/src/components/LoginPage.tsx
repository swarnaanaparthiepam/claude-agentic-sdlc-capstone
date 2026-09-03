import React, { useState } from 'react';

/**
 * LoginPage Component
 *
 * Simple login form with email and password fields that uses mock authentication.
 * Displays success message after form submission.
 *
 * Requirements: FR-1 through FR-7
 * Architecture: ADR-001 (Functional components), ADR-002 (No state management library),
 *               ADR-003 (Mock logic inline)
 */

interface LoginFormState {
  email: string;
  password: string;
  isLoginSuccessful: boolean;
}

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoginSuccessful, setIsLoginSuccessful] = useState<boolean>(false);

  /**
   * Handles form submission with mock authentication logic.
   *
   * Implements basic non-empty validation (Design Review Decision #1).
   * Uses <form onSubmit> pattern for accessibility (Design Review Issue #1).
   * Mock logic always succeeds if validation passes (FR-6).
   *
   * Architecture: ADR-003 (inline mock logic), ADR-007 (basic validation)
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    // Basic non-empty validation (Design Review Decision #1)
    if (!email.trim() || !password.trim()) {
      // Validation fails - do nothing (could add error message in future)
      return;
    }

    // Mock authentication logic (FR-6) - always succeeds
    // No HTTP request, no database call (FR-7)
    setIsLoginSuccessful(true);
  };

  // TODO: Task 6 - implement JSX structure

  return <div>LoginPage Scaffold</div>;
};
