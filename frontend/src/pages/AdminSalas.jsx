import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminSalas() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Modal crear/editar sala
  const [showModalSala, setShowModalSala] = useState(false);
  const [modalType, setModalType] = useState('crear'); // 'crear' o 'editar'
  const [salaEditando, setSalaEditando] = useState(null);

  // Data formulario sala
  const [form, setForm] = useState({
    nombre: '',
    capacidad: '',
    tipo: '2D', // '2D', '3D', 'IMAX', 'VIP'
  });

  // Estados para gestión de asientos
  const [asientos, setAsientos] = useState([]);
  const [asientosModal, setAsientosModal] = useState(false);
  const [salaAsientos, setSalaAsientos] = useState(null);
  const [showCrearAsiento, setShowCrearAsiento] = useState(false);
  const [formAsiento, setFormAsiento] = useState({
    fila: 'A',
    numero: 1,
    tipo: 'estandar', // 'estandar', 'vip', 'discapacitado'
    estado: 'disponible', // 'disponible', 'ocupado', 'reservado', 'inhabilitado'
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const BACKEND_URL = 'http://localhost:8000';

  const cargarSalas = async () => {
    try {
      const res = await api.get('/salas');
      setSalas(res.data);
    } catch (error) {
      console.error('Error cargando salas:', error);
    }
  };

  const cargarAsientos = async (salaId) => {
    try {
      const res = await api.get(`/asientos?sala_id=${salaId}`);
      setAsientos(res.data);
    } catch (error) {
      console.error('Error cargando asientos:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return (window.location.href = '/login');

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await cargarSalas();
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
    const { name, value } = e.target;
    setForm({ 
      ...form, 
      [name]: value 
    });
  };

  const handleChangeAsiento = (e) => {
    const { name, value } = e.target;
    setFormAsiento({ 
      ...formAsiento, 
      [name]: value 
    });
  };

  const handleCrearSala = async (e) => {
    e.preventDefault();
    try {
      const datosSala = {
        nombre: form.nombre,
        capacidad: parseInt(form.capacidad),
        tipo: form.tipo,
      };

      if (modalType === 'crear') {
        await api.post('/salas', datosSala);
      } else {
        await api.put(`/salas/${salaEditando.id}`, datosSala);
      }
      
      setShowModalSala(false);
      resetForm();
      cargarSalas();
    } catch (error) {
      console.error('Error al guardar sala:', error.response?.data || error);
      alert(`Error al guardar la sala: ${error.response?.data?.message || 'Verifique los datos'}`);
    }
  };

  const handleEditarSala = (sala) => {
    setModalType('editar');
    setSalaEditando(sala);
    setForm({
      nombre: sala.nombre || '',
      capacidad: sala.capacidad || '',
      tipo: sala.tipo || '2D',
    });
    setShowModalSala(true);
  };

  const handleEliminarSala = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta sala? Esta acción no se puede deshacer.')) {
      try {
        await api.delete(`/salas/${id}`);
        cargarSalas();
      } catch (error) {
        console.error('Error al eliminar sala:', error);
        alert('Error al eliminar la sala. Verifique que no tenga funciones asociadas.');
      }
    }
  };

  const handleGestionarAsientos = async (sala) => {
    setSalaAsientos(sala);
    await cargarAsientos(sala.id);
    setAsientosModal(true);
  };

  const handleCrearAsiento = async (e) => {
    e.preventDefault();
    if (!salaAsientos) return;
    
    try {
      const asientoData = {
        sala_id: salaAsientos.id,
        fila: formAsiento.fila,
        numero: parseInt(formAsiento.numero),
        tipo: formAsiento.tipo,
        estado: formAsiento.estado,
      };

      console.log('Creando asiento:', asientoData); // Para debug
      
      await api.post('/asientos', asientoData);
      
      // Resetear formulario
      setFormAsiento({
        fila: 'A',
        numero: 1,
        tipo: 'estandar',
        estado: 'disponible',
      });
      setShowCrearAsiento(false);
      
      // Recargar asientos
      await cargarAsientos(salaAsientos.id);
      alert('Asiento creado exitosamente');
    } catch (error) {
      console.error('Error creando asiento:', error.response?.data || error);
      alert(`Error al crear asiento: ${error.response?.data?.message || 'Verifique los datos'}`);
    }
  };

  const handleEliminarAsiento = async (asientoId) => {
    if (window.confirm('¿Estás seguro de eliminar este asiento?')) {
      try {
        await api.delete(`/asientos/${asientoId}`);
        await cargarAsientos(salaAsientos.id);
        alert('Asiento eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando asiento:', error);
        alert('Error al eliminar el asiento');
      }
    }
  };

  const handleCambiarEstadoAsiento = async (asientoId, nuevoEstado) => {
    try {
      await api.put(`/asientos/${asientoId}`, { estado: nuevoEstado });
      await cargarAsientos(salaAsientos.id);
    } catch (error) {
      console.error('Error actualizando asiento:', error);
    }
  };

  const abrirModalCrearAsiento = () => {
    // Calcular el próximo número disponible
    const asientosExistentes = asientos.filter(a => a.fila === formAsiento.fila);
    const numerosExistentes = asientosExistentes.map(a => a.numero);
    let siguienteNumero = 1;
    
    while (numerosExistentes.includes(siguienteNumero)) {
      siguienteNumero++;
    }
    
    setFormAsiento({
      fila: 'A',
      numero: siguienteNumero,
      tipo: 'estandar',
      estado: 'disponible',
    });
    setShowCrearAsiento(true);
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      capacidad: '',
      tipo: '2D',
    });
    setSalaEditando(null);
    setModalType('crear');
  };

  const resetFormAsiento = () => {
    setFormAsiento({
      fila: 'A',
      numero: 1,
      tipo: 'estandar',
      estado: 'disponible',
    });
  };

  const openCrearModal = () => {
    resetForm();
    setModalType('crear');
    setShowModalSala(true);
  };

  // Navegación a otras páginas
  const goToDashboard = () => {
    navigate('/admin');
  };

  const goToPeliculas = () => {
    navigate('/admin/peliculas');
  };

  // Filas disponibles (A-J)
  const filasDisponibles = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  // Tipos de asiento
  const tiposAsiento = ['estandar', 'vip', 'discapacitado'];
  // Estados de asiento
  const estadosAsiento = ['disponible', 'ocupado', 'reservado', 'inhabilitado'];

  // Función para determinar el color según el estado
  const getColorByEstado = (estado) => {
    switch(estado) {
      case 'disponible': return '#10b981'; // verde
      case 'ocupado': return '#ef4444'; // rojo
      case 'reservado': return '#f59e0b'; // amarillo
      case 'inhabilitado': return '#6b7280'; // gris
      default: return '#d1d5db'; // gris claro
    }
  };

  // Función para determinar el color según el tipo
  const getColorByTipo = (tipo) => {
    switch(tipo) {
      case 'vip': return '#8b5cf6'; // violeta
      case 'discapacitado': return '#3b82f6'; // azul
      default: return '#10b981'; // verde (estandar)
    }
  };

  if (loading) return <div style={styles.center}>Cargando salas...</div>;
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
              onClick={goToDashboard}
              style={styles.navLink}
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
              onClick={() => navigate('/admin/salas')}
              style={styles.navLinkActive}
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
              <h2 style={styles.title}>Gestión de Salas</h2>
              <p style={styles.subtitle}>Administra las salas del cine</p>
            </div>

            <button
              onClick={openCrearModal}
              style={styles.blueBtn}
            >
              ➕ Nueva Sala
            </button>
          </div>

          <div style={styles.grid}>
            {salas.length > 0 ? (
              salas.map((sala) => (
                <div key={sala.id} style={styles.salaCard}>
                  <div style={styles.cardHeader}>
                    <div style={styles.salaIcon}>
                      {sala.tipo === 'VIP' && '⭐'}
                      {sala.tipo === 'IMAX' && '🎥'}
                      {sala.tipo === '3D' && '👓'}
                      {sala.tipo === '2D' && '🎬'}
                    </div>
                    <div style={styles.cardHeaderInfo}>
                      <h3 style={styles.salaNombre}>{sala.nombre}</h3>
                      <div style={styles.badges}>
                        <span style={styles.badgeTipo}>{sala.tipo}</span>
                        <span style={styles.badgeCapacidad}>{sala.capacidad} asientos</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.cardBody}>
                    <div style={styles.detalles}>
                      <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>Tipo de Sala:</span>
                        <span>{sala.tipo}</span>
                      </div>
                      <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>Capacidad:</span>
                        <span>{sala.capacidad} asientos</span>
                      </div>
                      <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>ID:</span>
                        <span style={{ fontFamily: 'monospace' }}>#{sala.id}</span>
                      </div>
                    </div>

                    <div style={styles.funcionesInfo}>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        {asientos.filter(a => a.sala_id === sala.id).length > 0 
                          ? `${asientos.filter(a => a.sala_id === sala.id).length} asiento(s) configurado(s)`
                          : 'Sin asientos configurados'}
                      </p>
                    </div>
                  </div>
                  
                  <div style={styles.cardActions}>
                    <button 
                      onClick={() => handleGestionarAsientos(sala)}
                      style={styles.btnAsientos}
                    >
                      💺 Asientos
                    </button>
                    <button 
                      onClick={() => handleEditarSala(sala)}
                      style={styles.btnEditar}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleEliminarSala(sala.id)}
                      style={styles.btnEliminar}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>
                <p style={{ fontSize: '18px', color: '#6b7280' }}>
                  No hay salas registradas. ¡Agrega tu primera sala!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL CREAR/EDITAR SALA */}
      {showModalSala && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalForm, width: '500px' }}>
            <button 
              style={styles.closeBtn} 
              onClick={() => {
                setShowModalSala(false);
                resetForm();
              }}
            >
              ✖
            </button>

            <h2 style={styles.modalTitle}>
              {modalType === 'crear' ? '➕ Crear Nueva Sala' : '✏️ Editar Sala'}
            </h2>

            <form onSubmit={handleCrearSala} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de la Sala *</label>
                <input 
                  type="text" 
                  name="nombre" 
                  required 
                  onChange={handleChange}
                  style={styles.input}
                  value={form.nombre}
                  placeholder="Ej: Sala 1, Sala Premium, Sala IMAX"
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Capacidad *</label>
                  <input 
                    type="number" 
                    name="capacidad" 
                    required 
                    onChange={handleChange}
                    style={styles.input}
                    value={form.capacidad}
                    placeholder="Ej: 100"
                    min="1"
                    max="500"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tipo de Sala *</label>
                  <select 
                    name="tipo" 
                    required 
                    onChange={handleChange}
                    style={styles.select}
                    value={form.tipo}
                  >
                    <option value="2D">🎬 2D - Sala Estándar</option>
                    <option value="3D">👓 3D - Sala 3D</option>
                    <option value="IMAX">🎥 IMAX - Pantalla Gigante</option>
                    <option value="VIP">⭐ VIP - Sala Premium</option>
                  </select>
                </div>
              </div>

              <div style={styles.infoBox}>
                <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>
                  <strong>Nota:</strong> Después de crear la sala, podrás agregar los asientos uno por uno.
                </p>
              </div>

              <button
                type="submit"
                style={styles.submitBtn}
              >
                {modalType === 'crear' ? 'Crear Sala' : 'Actualizar Sala'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GESTIÓN DE ASIENTOS */}
      {asientosModal && salaAsientos && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalForm, width: '900px' }}>
            <button 
              style={styles.closeBtn} 
              onClick={() => {
                setAsientosModal(false);
                setSalaAsientos(null);
                setAsientos([]);
              }}
            >
              ✖
            </button>

            <h2 style={styles.modalTitle}>
              💺 Gestión de Asientos - {salaAsientos.nombre}
            </h2>

            <div style={styles.asientosHeader}>
              <div>
                <p style={{ marginBottom: '8px' }}>
                  <strong>Tipo:</strong> {salaAsientos.tipo} | 
                  <strong> Capacidad:</strong> {salaAsientos.capacidad} asientos | 
                  <strong> Configurados:</strong> {asientos.length}
                </p>
                <div style={styles.leyendasContainer}>
                  <div style={styles.leyendaAsientos}>
                    <span style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Estados:</span>
                    {estadosAsiento.map(estado => (
                      <div key={estado} style={styles.leyendaItem}>
                        <div style={{ ...styles.asiento, backgroundColor: getColorByEstado(estado) }}></div>
                        <span>{estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={styles.leyendaAsientos}>
                    <span style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Tipos:</span>
                    {tiposAsiento.map(tipo => (
                      <div key={tipo} style={styles.leyendaItem}>
                        <div style={{ ...styles.asiento, backgroundColor: getColorByTipo(tipo) }}></div>
                        <span>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div style={styles.asientosActions}>
                <button
                  onClick={abrirModalCrearAsiento}
                  style={styles.btnCrearAsiento}
                >
                  ➕ Nuevo Asiento
                </button>
              </div>
            </div>

            {asientos.length > 0 ? (
              <div style={styles.contenedorAsientos}>
                <div style={styles.pantalla}>
                  🎬 PANTALLA 🎬
                </div>
                
                <div style={styles.gridAsientos}>
                  {/* Agrupar asientos por fila */}
                  {filasDisponibles.map(fila => {
                    const asientosFila = asientos.filter(a => a.fila === fila);
                    if (asientosFila.length === 0) return null;
                    
                    return (
                      <div key={fila} style={styles.filaAsientos}>
                        <div style={styles.filaLabel}>{fila}</div>
                        <div style={styles.asientosFila}>
                          {asientosFila
                            .sort((a, b) => a.numero - b.numero)
                            .map(asiento => (
                              <div key={asiento.id} style={styles.asientoContainer}>
                                <button
                                  onClick={() => {
                                    // Cambiar estado cíclicamente
                                    const estadoActualIndex = estadosAsiento.indexOf(asiento.estado);
                                    const siguienteEstado = estadosAsiento[(estadoActualIndex + 1) % estadosAsiento.length];
                                    handleCambiarEstadoAsiento(asiento.id, siguienteEstado);
                                  }}
                                  style={{
                                    ...styles.asiento,
                                    backgroundColor: getColorByEstado(asiento.estado),
                                    border: `2px solid ${getColorByTipo(asiento.tipo)}`,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    position: 'relative',
                                  }}
                                  title={`${asiento.fila}${asiento.numero}\nTipo: ${asiento.tipo}\nEstado: ${asiento.estado}`}
                                >
                                  {asiento.numero}
                                  <div style={styles.asientoTipoBadge}>
                                    {asiento.tipo === 'vip' && '⭐'}
                                    {asiento.tipo === 'discapacitado' && '♿'}
                                  </div>
                                </button>
                                <button
                                  onClick={() => handleEliminarAsiento(asiento.id)}
                                  style={styles.btnEliminarAsiento}
                                  title="Eliminar asiento"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div style={styles.infoAsientos}>
                  <p>💡 <strong>Instrucciones:</strong> Haz clic en un asiento para cambiar su estado. Usa la ✕ para eliminar.</p>
                  <p>Total de asientos configurados: {asientos.length} de {salaAsientos.capacidad}</p>
                  <p>Borde del asiento indica el tipo: Estándar (verde), VIP (violeta), Discapacitado (azul)</p>
                </div>
              </div>
            ) : (
              <div style={styles.emptyAsientos}>
                <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '16px' }}>
                  No hay asientos configurados para esta sala.
                </p>
                <button
                  onClick={abrirModalCrearAsiento}
                  style={styles.btnCrearAsiento}
                >
                  ➕ Agregar Primer Asiento
                </button>
                <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '12px' }}>
                  Puedes agregar asientos uno por uno para mayor control.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL CREAR ASIENTO */}
      {showCrearAsiento && salaAsientos && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalForm, width: '400px' }}>
            <button 
              style={styles.closeBtn} 
              onClick={() => {
                setShowCrearAsiento(false);
                resetFormAsiento();
              }}
            >
              ✖
            </button>

            <h2 style={styles.modalTitle}>
              ➕ Crear Nuevo Asiento
            </h2>

            <form onSubmit={handleCrearAsiento} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Fila *</label>
                <select 
                  name="fila" 
                  required 
                  onChange={handleChangeAsiento}
                  style={styles.select}
                  value={formAsiento.fila}
                >
                  {filasDisponibles.map(fila => (
                    <option key={fila} value={fila}>Fila {fila}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Número *</label>
                <input 
                  type="number" 
                  name="numero" 
                  required 
                  onChange={handleChangeAsiento}
                  style={styles.input}
                  value={formAsiento.numero}
                  placeholder="Número del asiento"
                  min="1"
                />
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Sugerencia: {formAsiento.fila}{formAsiento.numero}
                </p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Asiento *</label>
                <select 
                  name="tipo" 
                  required 
                  onChange={handleChangeAsiento}
                  style={styles.select}
                  value={formAsiento.tipo}
                >
                  <option value="estandar">💺 Estándar</option>
                  <option value="vip">⭐ VIP</option>
                  <option value="discapacitado">♿ Accesible</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Estado Inicial *</label>
                <select 
                  name="estado" 
                  required 
                  onChange={handleChangeAsiento}
                  style={styles.select}
                  value={formAsiento.estado}
                >
                  {estadosAsiento.map(estado => (
                    <option key={estado} value={estado}>
                      {estado === 'disponible' && '✅ '}
                      {estado === 'ocupado' && '❌ '}
                      {estado === 'reservado' && '🟡 '}
                      {estado === 'inhabilitado' && '🔧 '}
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.infoBox}>
                <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>
                  <strong>Sala:</strong> {salaAsientos.nombre} ({salaAsientos.tipo})
                </p>
              </div>

              <div style={styles.formActions}>
                <button
                  type="submit"
                  style={styles.submitBtn}
                >
                  Crear Asiento
                </button>
              </div>
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
  salaCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  cardHeader: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start'
  },
  salaIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    backgroundColor: '#dbeafe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },
  cardHeaderInfo: {
    flex: 1
  },
  salaNombre: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#1f2937'
  },
  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  badgeTipo: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  badgeCapacidad: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  detalles: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    fontSize: '13px'
  },
  detalleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
    borderBottom: '1px solid #f3f4f6'
  },
  detalleLabel: {
    fontWeight: '500',
    color: '#6b7280'
  },
  funcionesInfo: {
    backgroundColor: '#f3f4f6',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px'
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto'
  },
  btnAsientos: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px'
  },
  btnEditar: {
    flex: 1,
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px'
  },
  btnEliminar: {
    flex: 1,
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px'
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
  modalForm: { 
    backgroundColor: '#fff', 
    borderRadius: '12px', 
    padding: '32px', 
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto'
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
    display: 'flex',
    flexDirection: 'column',
    gap: '16px' 
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
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
    fontSize: '14px',
    width: '100%'
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '8px'
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
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  },
  // Estilos para la gestión de asientos
  asientosHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb'
  },
  leyendasContainer: {
    display: 'flex',
    gap: '32px',
    marginTop: '16px'
  },
  asientosActions: {
    display: 'flex',
    gap: '8px'
  },
  leyendaAsientos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '13px'
  },
  leyendaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  btnCrearAsiento: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px'
  },
  contenedorAsientos: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px'
  },
  pantalla: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '12px 40px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '18px',
    textAlign: 'center',
    width: '80%',
    marginBottom: '20px'
  },
  gridAsientos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%'
  },
  filaAsientos: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  filaLabel: {
    width: '30px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4b5563'
  },
  asientosFila: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    flex: 1
  },
  asientoContainer: {
    position: 'relative',
    display: 'inline-block'
  },
  asiento: {
    width: '45px',
    height: '45px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  asientoTipoBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    fontSize: '10px'
  },
  btnEliminarAsiento: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    zIndex: 10
  },
  infoAsientos: {
    backgroundColor: '#f3f4f6',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#4b5563',
    textAlign: 'center',
    width: '100%',
    marginTop: '16px'
  },
  emptyAsientos: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    textAlign: 'center'
  }
};