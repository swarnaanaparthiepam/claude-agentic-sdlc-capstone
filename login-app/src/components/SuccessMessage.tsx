import React from 'react';
import styles from './SuccessMessage.module.css';

/**
 * SuccessMessage Component Props
 *
 * Requirements: FR-3 (Display success message)
 * Design: Task 4 from impl-plan.md
 */
export interface SuccessMessageProps {
  message?: string;
}

/**
 * SuccessMessage Component
 *
 * Displays a success message with ARIA live region for screen reader announcement.
 *
 * Accessibility Features:
 * - role="status" for ARIA landmark
 * - aria-live="polite" for screen reader announcement
 *
 * Requirements: FR-3 (Display success message)
 * Accessibility: Design Review Major Issue #1
 * Architecture: ADR-001 (Functional components)
 *
 * @param message - The success message text (default: "Logged out successfully")
 */
export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message = 'Logged out successfully'
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={styles.successMessage}
      data-testid="success-message"
    >
      {message}
    </div>
  );
};
