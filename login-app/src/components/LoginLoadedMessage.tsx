import React from 'react';
import styles from './LoginLoadedMessage.module.css';

/**
 * LoginLoadedMessage Component
 *
 * Displays a static status message on page load indicating the login page
 * has loaded successfully. Stateless and rendered unconditionally alongside
 * the existing StatusMessage (CJS-5), which uses different wording.
 *
 * Requirements: FR-1 (Display success message on login page load)
 * Architecture: Stateless functional component (no hooks required)
 *
 * User Story: CJS-6
 */
export const LoginLoadedMessage: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={styles.loginLoadedMessage}
      data-testid="login-loaded-message"
    >
      Login page loaded successfully
    </div>
  );
};
