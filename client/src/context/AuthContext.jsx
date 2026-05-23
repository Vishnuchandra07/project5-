import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authService from '../services/authService';
import {
  getToken,
  getStoredUser,
  setStoredUser,
  persistAuth,
  clearAuthStorage,
} from '../utils/authStorage';
import { setUnauthorizedHandler } from '../utils/authSession';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getToken);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
  }, []);

  const establishSession = useCallback(({ token: jwt, user: userData }) => {
    persistAuth({ token: jwt, user: userData });
    setToken(jwt);
    setUser(userData);
  }, []);

  const loadUser = useCallback(async () => {
    const storedToken = getToken();
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      const userData = response.data;
      setUser(userData);
      setStoredUser(userData);
      setToken(storedToken);
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { token: jwt, ...userData } = response.data;
    establishSession({ token: jwt, user: userData });
    return userData;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    const { token: jwt, ...newUser } = response.data;
    establishSession({ token: jwt, user: newUser });
    return newUser;
  };

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
