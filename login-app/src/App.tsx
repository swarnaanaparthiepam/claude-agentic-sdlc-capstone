import { LoginPage } from './components/LoginPage';
import './App.css';

/**
 * App Root Component
 *
 * Single responsibility: render LoginPage component.
 * No routing or complex layout needed for this simple application.
 *
 * Architecture: ADR-002 (no state management), ADR-001 (functional component)
 */
export const App: React.FC = () => {
  return <LoginPage />;
};
