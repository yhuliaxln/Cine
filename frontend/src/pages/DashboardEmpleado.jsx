// src/pages/DashboardEmpleado.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import PeliculaCard from '../components/PeliculaCard';
import VentaTicket from './VentaTicket';

export default function DashboardEmpleado() {
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 👉 controla el modal
  const [funcionSeleccionada, setFuncionSeleccionada] = useState(null);

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
      <div style={styles.center}>Cargando cartelera...</div>
    );

  if (error)
    return (
      <div style={{ ...styles.center, color: 'red' }}>{error}</div>
    );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb' }}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={{ fontSize: '24px' }}>🎬 Cine - Panel Empleado</h1>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>Bienvenid@, {user.name || user.email || 'Empleado'}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main style={styles.main}>
        <div style={styles.panel}>
          <h2 style={styles.title}>Películas en Cartelera</h2>

          <div style={styles.grid}>
            {funciones.map((funcion) => (
              <PeliculaCard
                key={funcion.id}
                funcion={funcion}
                BACKEND_URL={BACKEND_URL}
                onVender={() => setFuncionSeleccionada(funcion.id)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* MODAL VENTA */}
      {funcionSeleccionada && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button
              style={styles.closeBtn}
              onClick={() => setFuncionSeleccionada(null)}
            >
              ✖
            </button>

            <VentaTicket funcionId={funcionSeleccionada} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== ESTILOS ===== */
const styles = {
  center: {
    minHeight: '100vh',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  header: {
    backgroundColor: '#1e40af',
    color: '#fff',
    padding: '16px',
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutBtn: {
    backgroundColor: '#dc2626',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
  main: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '32px',
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '32px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  modal: {
    backgroundColor: '#fff',
    width: '900px',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: '12px',
    padding: '24px',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    border: 'none',
    background: 'transparent',
    fontSize: '20px',
    cursor: 'pointer',
  },
};
