import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { LogoutButton } from './components/LogoutButton';
import { SuccessMessage } from './components/SuccessMessage';
import './App.css';

/**
 * App Root Component
 *
 * Manages application-level state for login/logout flow.
 * Renders LoginPage when logged in, and LogoutButton + SuccessMessage when logged out.
 *
 * State Management:
 * - isLoggedIn: boolean - Tracks whether user is logged in (starts as true)
 *
 * Requirements: FR-1, FR-2, FR-3, FR-4, FR-5 (CJS-3)
 * Architecture: ADR-001 (functional component), ADR-002 (useState for state management)
 * Design: Task 6 from impl-plan.md
 */
export const App: React.FC = () => {
  // State initialization: user starts logged in (Task 6 AC2)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  /**
   * Handles logout action by updating state to false.
   *
   * Requirements: FR-4 (Mock logout logic)
   * Design: Task 6 AC3, AC8
   */
  const handleLogout = (): void => {
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      {/* Render LoginPage when logged in (Task 6 AC4) */}
      {isLoggedIn && <LoginPage />}

      {/* Render LogoutButton when logged in (Task 6 AC4) */}
      {isLoggedIn && <LogoutButton onClick={handleLogout} />}

      {/* Render SuccessMessage when logged out (Task 6 AC6, AC7) */}
      {!isLoggedIn && <SuccessMessage />}
    </div>
  );
};
