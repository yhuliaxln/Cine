// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error en autenticación:', error);
        localStorage.clear();
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    logout,
    updateUser: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  };
}