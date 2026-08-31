import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, getMeApi, changePasswordApi } from '../api/authApi.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('cbam_token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cbam_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('cbam_token');
      if (storedToken) {
        try {
          const userData = await getMeApi();
          setUser(userData);
          localStorage.setItem('cbam_user', JSON.stringify(userData));
        } catch (error) {
          console.error('Session validation failed:', error);
          localStorage.removeItem('cbam_token');
          localStorage.removeItem('cbam_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginApi({ email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('cbam_token', data.token);
    localStorage.setItem('cbam_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('cbam_token');
    localStorage.removeItem('cbam_user');
    setToken(null);
    setUser(null);
  };

  const changePassword = async (currentPassword, newPassword) => {
    return await changePasswordApi({ currentPassword, newPassword });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        isSuperAdmin: user?.role === 'SUPER_ADMIN',
        isCustomer: user?.role === 'CUSTOMER',
        isLoading,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
