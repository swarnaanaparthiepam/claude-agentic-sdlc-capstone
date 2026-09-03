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

  // TODO: Task 5 - implement handleSubmit
  // TODO: Task 6 - implement JSX structure

  return <div>LoginPage Scaffold</div>;
};
