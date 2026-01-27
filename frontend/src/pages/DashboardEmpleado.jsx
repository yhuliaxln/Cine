// src/pages/DashboardEmpleado.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import PeliculaCard from '../components/PeliculaCard';

export default function DashboardEmpleado() {
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const BACKEND_URL = 'http://localhost:8000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await api.get('/funciones');
        setFunciones(res.data);
      } catch (err) {
        setError('Error al cargar las funciones');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}
      >
        Cargando cartelera...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: 'red',
        }}
      >
        {error}
      </div>
    );

  return (
    // 🔴 FONDO GRIS FORZADO
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#e5e7eb', // GRIS OFICINA
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: '#1e40af',
          color: '#fff',
          padding: '16px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Cine - Panel Empleado
          </h1>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>Bienvenid@, {user.name || user.email || 'Empleado'}</span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#dc2626',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px',
        }}
      >
        {/* PANEL BLANCO */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '30px',
              fontWeight: 'bold',
              marginBottom: '32px',
            }}
          >
            Películas en Cartelera
          </h2>

          {funciones.length === 0 ? (
            <p>No hay funciones programadas.</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
              }}
            >
              {funciones.map((funcion) => (
                <PeliculaCard
                  key={funcion.id}
                  funcion={funcion}
                  BACKEND_URL={BACKEND_URL}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
