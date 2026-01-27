import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PeliculaCard from '../components/PeliculaCard';
import VentaTicket from './VentaTicket';

export default function DashboardAdmin() {
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Modal venta
  const [funcionSeleccionada, setFuncionSeleccionada] = useState(null);

  // Modal crear función
  const [showCrearFuncion, setShowCrearFuncion] = useState(false);

  // Data formulario
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [form, setForm] = useState({
    pelicula_id: '',
    sala_id: '',
    fecha_hora_inicio: '',
    precio: '',
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
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

        // SOLO ADMIN
        const pelis = await api.get('/peliculas');
        const salasRes = await api.get('/salas');
        setPeliculas(pelis.data);
        setSalas(salasRes.data);
      } catch (err) {
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await api.post('/logout');
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCrearFuncion = async (e) => {
    e.preventDefault();
    await api.post('/funciones', form);
    setShowCrearFuncion(false);
    setForm({
      pelicula_id: '',
      sala_id: '',
      fecha_hora_inicio: '',
      precio: '',
    });
    cargarFunciones();
  };

  // Navegación a otras páginas
  const goToSalas = () => {
    navigate('/admin/salas');
  };

  const goToPeliculas = () => {
    navigate('/admin/peliculas');
  };

  if (loading) return <div style={styles.center}>Cargando cartelera...</div>;
  if (error) return <div style={{ ...styles.center, color: 'red' }}>{error}</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb' }}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={{ fontSize: '24px' }}>🎬 Cine - Panel Admin</h1>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>Bienvenid@, {user.name || user.email}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* BARRA DE NAVEGACIÓN ADMIN */}
      <div style={styles.navBar}>
        <div style={styles.navContent}>
          <div style={styles.navLinks}>
            <button 
              onClick={() => navigate('/admin/dashboard')}
              style={styles.navLinkActive}
            >
              🏠 Inicio
            </button>
            <button 
              onClick={goToPeliculas}
              style={styles.navLink}
            >
              🎬 Películas
            </button>
            <button 
              onClick={goToSalas}
              style={styles.navLink}
            >
              🎭 Salas
            </button>
            <button 
              onClick={() => navigate('/admin/usuarios')}
              style={styles.navLink}
            >
              👥 Usuarios
            </button>
            <button 
              onClick={() => navigate('/admin/reportes')}
              style={styles.navLink}
            >
              📊 Reportes
            </button>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <main style={styles.main}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.title}>Películas en Cartelera</h2>
              <p style={styles.subtitle}>Administra las funciones activas</p>
            </div>

            <button
              onClick={() => setShowCrearFuncion(true)}
              style={styles.blueBtn}
            >
              ➕ Nueva función
            </button>
          </div>

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
        </div>
      </main>

      {/* MODAL VENTA */}
      {funcionSeleccionada && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button style={styles.closeBtn} onClick={() => setFuncionSeleccionada(null)}>✖</button>
            <VentaTicket funcionId={funcionSeleccionada} />
          </div>
        </div>
      )}

      {/* MODAL CREAR FUNCIÓN */}
      {showCrearFuncion && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalForm}>
            <button style={styles.closeBtn} onClick={() => setShowCrearFuncion(false)}>✖</button>

            <h2 style={styles.modalTitle}>➕ Crear nueva función</h2>

            <form onSubmit={handleCrearFuncion} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Película</label>
                <select 
                  name="pelicula_id" 
                  required 
                  onChange={handleChange}
                  style={styles.select}
                  value={form.pelicula_id}
                >
                  <option value="">Seleccione una película</option>
                  {peliculas.map(p => (
                    <option key={p.id} value={p.id}>{p.titulo}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Sala</label>
                <select 
                  name="sala_id" 
                  required 
                  onChange={handleChange}
                  style={styles.select}
                  value={form.sala_id}
                >
                  <option value="">Seleccione una sala</option>
                  {salas.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Fecha y hora de inicio</label>
                <input 
                  type="datetime-local" 
                  name="fecha_hora_inicio" 
                  required 
                  onChange={handleChange}
                  style={styles.input}
                  value={form.fecha_hora_inicio}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Precio</label>
                <input 
                  type="number" 
                  name="precio" 
                  placeholder="Ingrese el precio" 
                  required 
                  onChange={handleChange}
                  style={styles.input}
                  value={form.precio}
                />
              </div>

              <button
                type="submit"
                style={styles.submitBtn}
              >
                Guardar función
              </button>
            </form>
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
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  header: { 
    backgroundColor: '#1e40af', 
    color: '#fff', 
    padding: '16px' 
  },
  headerContent: { 
    maxWidth: '1280px', 
    margin: '0 auto', 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoutBtn: { 
    backgroundColor: '#dc2626', 
    color: '#fff', 
    padding: '8px 16px', 
    borderRadius: '6px', 
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500'
  },
  // Barra de navegación
  navBar: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  navContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '12px 0'
  },
  navLinks: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  navLink: {
    backgroundColor: 'transparent',
    color: '#4b5563',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  navLinkActive: {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  // Contenido principal
  main: { 
    maxWidth: '1280px', 
    margin: '0 auto', 
    padding: '32px' 
  },
  panel: { 
    backgroundColor: '#fff', 
    borderRadius: '12px', 
    padding: '32px' 
  },
  panelHeader: {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: '32px'
  },
  title: { 
    fontSize: '30px', 
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '400'
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
  modalForm: { 
    backgroundColor: '#fff', 
    width: '500px', 
    borderRadius: '12px', 
    padding: '32px', 
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
  },
  modalTitle: { 
    fontSize: '24px', 
    marginBottom: '24px',
    fontWeight: '600',
    color: '#1e40af'
  },
  form: { 
    display: 'grid', 
    gap: '20px' 
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: { 
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  select: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px'
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px'
  }
};