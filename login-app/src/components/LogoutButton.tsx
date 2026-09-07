import React from 'react';
import styles from './LogoutButton.module.css';

/**
 * LogoutButton Component Props
 *
 * Requirements: FR-1 (Display Logout button), FR-2 (Enable click interaction)
 * Design: Task 5 from impl-plan.md
 */
export interface LogoutButtonProps {
  onClick: () => void;
}

/**
 * LogoutButton Component
 *
 * Displays a clickable Logout button with full accessibility support.
 *
 * Accessibility Features:
 * - aria-label for screen readers
 * - Keyboard accessible (Tab to focus, Enter/Space to activate)
 * - Visible focus indicator
 *
 * Requirements: FR-1 (Display Logout button), FR-2 (Enable click interaction)
 * Accessibility: Design Review Major Issue #1
 * Architecture: ADR-001 (Functional components)
 *
 * @param onClick - Callback function to handle logout action
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Logout"
      className={styles.logoutButton}
      data-testid="logout-button"
    >
      Logout
    </button>
  );
};
