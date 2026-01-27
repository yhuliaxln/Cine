// src/pages/DashboardAdmin.jsx (VERSIÓN REFACTORIZADA)
import { useState, useEffect } from 'react';
import api from '../services/api';
import PeliculaCard from '../components/PeliculaCard';
import VentaTicket from './VentaTicket';
import AdminLayout from '../components/admin/AdminLayout';

// Crear un componente separado para el modal de crear función
import CrearFuncionModal from '../components/modals/CrearFuncionModal'; // Lo crearemos después

export default function DashboardAdmin() {
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal venta
  const [funcionSeleccionada, setFuncionSeleccionada] = useState(null);
  
  // Modal crear función
  const [showCrearFuncion, setShowCrearFuncion] = useState(false);

  const BACKEND_URL = 'http://localhost:8000';

  const cargarFunciones = async () => {
    const res = await api.get('/funciones');
    setFunciones(res.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return (window.location.href = '/login');

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await cargarFunciones();
      } catch (err) {
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={styles.center}>Cargando cartelera...</div>;
  if (error) return <div style={{ ...styles.center, color: 'red' }}>{error}</div>;

  return (
    <AdminLayout
      title="Películas en Cartelera"
      subtitle="Administra las funciones activas"
      actionButton={
        <button
          onClick={() => setShowCrearFuncion(true)}
          style={styles.blueBtn}
        >
          ➕ Nueva función
        </button>
      }
    >
      {/* CONTENIDO ESPECÍFICO DE ESTA PÁGINA */}
      <div style={styles.grid}>
        {funciones.length > 0 ? (
          funciones.map((funcion) => (
            <PeliculaCard
              key={funcion.id}
              funcion={funcion}
              BACKEND_URL={BACKEND_URL}
              onVender={() => setFuncionSeleccionada(funcion.id)}
            />
          ))
        ) : (
          <div style={styles.emptyState}>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>
              No hay funciones programadas. ¡Crea tu primera función!
            </p>
          </div>
        )}
      </div>

      {/* MODAL VENTA (específico de esta página) */}
      {funcionSeleccionada && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button style={styles.closeBtn} onClick={() => setFuncionSeleccionada(null)}>✖</button>
            <VentaTicket funcionId={funcionSeleccionada} />
          </div>
        </div>
      )}

      {/* MODAL CREAR FUNCIÓN (podríamos extraerlo también) */}
      {showCrearFuncion && (
        <CrearFuncionModal
          onClose={() => setShowCrearFuncion(false)}
          onCreated={() => {
            setShowCrearFuncion(false);
            cargarFunciones();
          }}
        />
      )}
    </AdminLayout>
  );
}

/* ===== ESTILOS ESPECÍFICOS DE ESTA PÁGINA ===== */
const styles = {
  center: { 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  blueBtn: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '24px' 
  },
  emptyState: {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 20px',
    textAlign: 'center'
  },
  modalOverlay: { 
    position: 'fixed', 
    inset: 0, 
    backgroundColor: 'rgba(0,0,0,.6)', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 1000
  },
  modal: { 
    backgroundColor: '#fff', 
    width: '500px', 
    borderRadius: '12px', 
    padding: '24px', 
    position: 'relative' 
  },
  closeBtn: { 
    position: 'absolute', 
    top: '16px', 
    right: '16px', 
    background: 'none', 
    border: 'none', 
    fontSize: '20px',
    cursor: 'pointer',
    color: '#666'
  }
};