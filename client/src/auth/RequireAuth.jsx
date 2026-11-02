import { Loading } from '../components/StatusMessage';
import { useAuth } from './AuthContext';
import GoogleSignIn from './GoogleSignIn';

// Renders children only for signed-in managers (or when auth is not configured).
export function RequireAuth({ children }) {
  const { config, user } = useAuth();
  if (!config) return <Loading />;
  if (!config.enabled || user) return children;
  return <GoogleSignIn />;
}
