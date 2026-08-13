import { useEffect, useRef, useState } from 'react';
import { AuthContext } from './auth-context.js';
import {
  login as loginRequest,
  register as registerRequest,
  getMe,
  updateProfile as updateProfileRequest,
} from '../services/auth.service.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => !!localStorage.getItem('access_token'));
  const restoreRef = useRef(false);

  useEffect(() => {
    if (restoreRef.current) return;
    restoreRef.current = true;

    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    const restoreSession = (retriesLeft = 1) => {
      getMe()
        .then((freshUser) => {
          setUser(freshUser);
          setLoading(false);
        })
        .catch((err) => {
          const status = err?.response?.status;

          // Only a genuine "this token is invalid/expired" response should
          // log the person out. Anything else (a transient 500 from a DB
          // hiccup, a dropped connection, etc.) shouldn't wipe a perfectly
          // good saved session — retry once, and if that still fails,
          // leave the token in place so the next reload can try again.
          if (status === 401) {
            localStorage.removeItem('access_token');
            setLoading(false);
            return;
          }

          if (retriesLeft > 0) {
            setTimeout(() => restoreSession(retriesLeft - 1), 800);
            return;
          }

          setLoading(false);
        });
    };

    restoreSession();
  }, []);

  const persistSession = ({ user: nextUser, token }) => {
    localStorage.setItem('access_token', token);
    setUser(nextUser);
  };

  const login = async (credentials) => {
    const data = await loginRequest(credentials);
    persistSession(data);
    return data.user;
  };

  const register = async (payload) => {
    const data = await registerRequest(payload);
    persistSession(data);
    return data.user;
  };

  const updateProfile = async (payload) => {
    const updatedUser = await updateProfileRequest(payload);
    const nextUser = { ...(user || {}), ...updatedUser };

    setUser(nextUser);

    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}