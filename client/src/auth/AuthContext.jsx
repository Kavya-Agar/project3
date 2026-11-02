import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { http } from '../api/http';
import { SESSION_STORAGE_KEY } from '../config/constants';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const readStored = () => {
  try {
    const stored = sessionStorage.getItem(`${SESSION_STORAGE_KEY}.user`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [user, setUser] = useState(readStored);

  useEffect(() => {
    http('/api/auth/config').then(setConfig).catch(() => setConfig({ enabled: false }));
  }, []);

  const signIn = useCallback(async (credential) => {
    const { token, user: profile } = await http('/api/auth/google', {
      method: 'POST',
      body: { credential },
    });
    sessionStorage.setItem(SESSION_STORAGE_KEY, token);
    sessionStorage.setItem(`${SESSION_STORAGE_KEY}.user`, JSON.stringify(profile));
    setUser(profile);
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(`${SESSION_STORAGE_KEY}.user`);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ config, user, signIn, signOut }), [config, user, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
