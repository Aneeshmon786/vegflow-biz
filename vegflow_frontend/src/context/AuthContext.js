import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vegflow_access');
    if (!token) {
      setLoading(false);
      return;
    }
    auth.me()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('vegflow_access');
        localStorage.removeItem('vegflow_refresh');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await auth.login(username, password);
    const { access, refresh } = res.data;
    localStorage.setItem('vegflow_access', access);
    localStorage.setItem('vegflow_refresh', refresh);
    const me = await auth.me();
    setUser(me.data);
    return me.data;
  };

  const logout = () => {
    localStorage.removeItem('vegflow_access');
    localStorage.removeItem('vegflow_refresh');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
