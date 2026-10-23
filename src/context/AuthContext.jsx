import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem('split_access_token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res?.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('split_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          localStorage.removeItem('split_access_token');
          localStorage.removeItem('split_refresh_token');
          localStorage.removeItem('split_user');
          setUser(null);
        }
      }
      setLoading(false);
    }

    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      const { user: loggedInUser, accessToken, refreshToken } = res.data;
      if (accessToken) localStorage.setItem('split_access_token', accessToken);
      if (refreshToken) localStorage.setItem('split_refresh_token', refreshToken);
      localStorage.setItem('split_user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return { success: true };
    } catch (error) {
      const detailsMsg = error.response?.data?.error?.details?.map(d => d.message).join('. ');
      const message = detailsMsg || error.response?.data?.error?.message || error.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      const { user: registeredUser, accessToken, refreshToken } = res.data;
      if (accessToken) localStorage.setItem('split_access_token', accessToken);
      if (refreshToken) localStorage.setItem('split_refresh_token', refreshToken);
      localStorage.setItem('split_user', JSON.stringify(registeredUser));
      setUser(registeredUser);
      return { success: true };
    } catch (error) {
      const detailsMsg = error.response?.data?.error?.details?.map(d => d.message).join('. ');
      const message = detailsMsg || error.response?.data?.error?.message || error.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('split_access_token');
      localStorage.removeItem('split_refresh_token');
      localStorage.removeItem('split_user');
      setUser(null);
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const res = await authService.updateMe(updateData);
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('split_user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message || 'Update failed';
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
