// src/hooks/useCRUD.js
import { useState, useCallback, useRef } from 'react';
import api from '../services/api';

export default function useCRUD(endpoint, initialData = []) {
  const [items, setItems] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const lastFetchTime = useRef(0);
  const DEBOUNCE_TIME = 1000; // 1 segundo entre peticiones

  // Función para hacer delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Obtener todos
  const fetchAll = useCallback(async (params = {}, force = false) => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime.current;
    
    // Si la última petición fue hace menos de DEBOUNCE_TIME y no es forzada, esperar
    if (timeSinceLastFetch < DEBOUNCE_TIME && !force) {
      await delay(DEBOUNCE_TIME - timeSinceLastFetch);
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(endpoint, { params });
      setItems(response.data);
      lastFetchTime.current = Date.now();
      return response.data;
    } catch (err) {
      // Manejar error 429 específicamente
      if (err.response?.status === 429) {
        setError('Demasiadas peticiones. Por favor espera un momento...');
        // Esperar 2 segundos y reintentar
        await delay(2000);
        return fetchAll(params, true); // Reintentar con force=true
      }
      
      const errorMsg = err.response?.data?.message || 'Error al cargar datos';
      setError(errorMsg);
      console.error(`Error fetching ${endpoint}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Crear
  const create = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(endpoint, data);
      setItems(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      // Manejar error 429 específicamente
      if (err.response?.status === 429) {
        setError('Demasiadas peticiones. Por favor espera un momento...');
        await delay(2000);
        return create(data); // Reintentar
      }
      
      const errorMsg = err.response?.data?.message || 'Error al crear';
      setError(errorMsg);
      console.error(`Error creating in ${endpoint}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar
  const update = async (id, data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put(`${endpoint}/${id}`, data);
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...response.data } : item
      ));
      return response.data;
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Demasiadas peticiones. Por favor espera un momento...');
        await delay(2000);
        return update(id, data);
      }
      
      const errorMsg = err.response?.data?.message || 'Error al actualizar';
      setError(errorMsg);
      console.error(`Error updating ${endpoint}/${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar
  const remove = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`${endpoint}/${id}`);
      setItems(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Demasiadas peticiones. Por favor espera un momento...');
        await delay(2000);
        return remove(id);
      }
      
      const errorMsg = err.response?.data?.message || 'Error al eliminar';
      setError(errorMsg);
      console.error(`Error deleting ${endpoint}/${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
    setItems
  };
}