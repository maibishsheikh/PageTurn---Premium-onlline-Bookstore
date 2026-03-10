import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('pageturn_token');
    const savedUser = localStorage.getItem('pageturn_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('pageturn_token', data.token);
    localStorage.setItem('pageturn_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await authService.register({ name, email, password });
    localStorage.setItem('pageturn_token', data.token);
    localStorage.setItem('pageturn_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('pageturn_token');
    localStorage.removeItem('pageturn_user');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('pageturn_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
