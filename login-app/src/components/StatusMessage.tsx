import React from 'react';
import styles from './StatusMessage.module.css';

/**
 * StatusMessage Component
 *
 * Displays a static status message on page load indicating successful rendering.
 * This is a simple informational message that appears when the login page loads.
 *
 * Requirements: FR-1 (Display status message on page load)
 * Accessibility: NFR-4 (WCAG 2.1 Level AA compliance)
 * Architecture: Stateless functional component (no hooks required)
 *
 * User Story: CJS-5
 */
export const StatusMessage: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={styles.statusMessage}
      data-testid="status-message"
    >
      Page loaded successfully
    </div>
  );
};
