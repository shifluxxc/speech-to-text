import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

type User = {
  _id: string;
  username: string;
  email: string;
  transcriptions: string[];
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (username: string, email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to set JWT in localStorage and axios
  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      axios.get('/api/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return { error: null };
    } catch (err: any) {
      setUser(null);
      setToken(null);
      return { error: err.response?.data?.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', { username, email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return { error: null };
    } catch (err: any) {
      setUser(null);
      setToken(null);
      return { error: err.response?.data?.message || 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};