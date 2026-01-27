// src/hooks/useFetch.js
import { useState, useCallback } from 'react';
import api from '../services/api';

export default function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(endpoint, { params });
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al cargar datos';
      setError(errorMsg);
      console.error(`Error fetching ${endpoint}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const refresh = useCallback(() => fetchData(), [fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    refresh,
    setData // Para actualizaciones manuales
  };
}