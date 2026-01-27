import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminPeliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Modal crear/editar película
  const [showModalPelicula, setShowModalPelicula] = useState(false);
  const [modalType, setModalType] = useState('crear'); // 'crear' o 'editar'
  const [peliculaEditando, setPeliculaEditando] = useState(null);

  // Estado para archivos de imagen
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');

  // Data formulario
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    duracion: '',
    genero: '',
    fecha_estreno: '',
    url_poster: '',
    url_trailer: '',
    clasificacion: '',
    en_cartelera: false,
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const BACKEND_URL = 'http://localhost:8000';

  const cargarPeliculas = async () => {
    const res = await api.get('/peliculas');
    setPeliculas(res.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return (window.location.href = '/login');

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await cargarPeliculas();
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
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Función para manejar la selección de archivo de imagen
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      
      // Crear preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para subir la imagen al backend
  const uploadPoster = async () => {
    if (!posterFile) return null;

    const formData = new FormData();
    formData.append('poster', posterFile);

    try {
      const response = await api.post('/upload-poster', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url; // URL de la imagen subida
    } catch (error) {
      console.error('Error subiendo poster:', error);
      return null;
    }
  };

  const handleCrearPelicula = async (e) => {
    e.preventDefault();
    try {
      // Si hay un archivo seleccionado, subirlo primero
      let posterUrl = form.url_poster;
      if (posterFile) {
        const uploadedUrl = await uploadPoster();
        if (uploadedUrl) {
          posterUrl = uploadedUrl;
        }
      }

      // Preparar datos para enviar
      const datosPelicula = {
        ...form,
        url_poster: posterUrl,
      };

      if (modalType === 'crear') {
        await api.post('/peliculas', datosPelicula);
      } else {
        await api.put(`/peliculas/${peliculaEditando.id}`, datosPelicula);
      }
      
      setShowModalPelicula(false);
      resetForm();
      cargarPeliculas();
    } catch (error) {
      console.error('Error al guardar película:', error);
    }
  };

  const handleEditarPelicula = (pelicula) => {
    setModalType('editar');
    setPeliculaEditando(pelicula);
    setForm({
      titulo: pelicula.titulo,
      descripcion: pelicula.descripcion || '',
      duracion: pelicula.duracion || '',
      genero: pelicula.genero || '',
      fecha_estreno: pelicula.fecha_estreno ? pelicula.fecha_estreno.split('T')[0] : '',
      url_poster: pelicula.url_poster || '',
      url_trailer: pelicula.url_trailer || '',
      clasificacion: pelicula.clasificacion || '',
      en_cartelera: pelicula.en_cartelera || false,
    });
    
    // Si la película ya tiene un poster, mostrar preview
    if (pelicula.url_poster) {
      setPosterPreview(pelicula.url_poster);
    } else {
      setPosterPreview('');
    }
    setPosterFile(null);
    
    setShowModalPelicula(true);
  };

  const handleEliminarPelicula = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta película?')) {
      try {
        await api.delete(`/peliculas/${id}`);
        cargarPeliculas();
      } catch (error) {
        console.error('Error al eliminar película:', error);
      }
    }
  };

  const resetForm = () => {
    setForm({
      titulo: '',
      descripcion: '',
      duracion: '',
      genero: '',
      fecha_estreno: '',
      url_poster: '',
      url_trailer: '',
      clasificacion: '',
      en_cartelera: false,
    });
    setPeliculaEditando(null);
    setModalType('crear');
    setPosterFile(null);
    setPosterPreview('');
  };

  const openCrearModal = () => {
    resetForm();
    setModalType('crear');
    setShowModalPelicula(true);
  };

  // Navegación a otras páginas
  const goToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const goToSalas = () => {
    navigate('/admin/salas');
  };

  // Función para remover la imagen seleccionada
  const removePoster = () => {
    setPosterFile(null);
    setPosterPreview('');
    setForm({ ...form, url_poster: '' });
  };

  if (loading) return <div style={styles.center}>Cargando películas...</div>;
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
              onClick={() => navigate('/admin/peliculas')}
              style={styles.navLinkActive}
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
              <h2 style={styles.title}>Catálogo de Películas</h2>
              <p style={styles.subtitle}>Gestiona el catálogo completo de películas</p>
            </div>

            <button
              onClick={openCrearModal}
              style={styles.blueBtn}
            >
              ➕ Nueva Película
            </button>
          </div>

          <div style={styles.grid}>
            {peliculas.length > 0 ? (
              peliculas.map((pelicula) => (
                <div key={pelicula.id} style={styles.peliculaCard}>
                  <div style={styles.cardHeader}>
                    {pelicula.url_poster ? (
                      <img 
                        src={pelicula.url_poster} 
                        alt={pelicula.titulo} 
                        style={styles.poster}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80x120?text=No+Image';
                        }}
                      />
                    ) : (
                      <div style={styles.posterPlaceholder}>
                        🎬
                      </div>
                    )}
                    <div style={styles.cardHeaderInfo}>
                      <h3 style={styles.peliculaTitulo}>{pelicula.titulo}</h3>
                      <div style={styles.badges}>
                        <span style={styles.badgeGenero}>{pelicula.genero || 'Sin género'}</span>
                        <span style={styles.badgeClasificacion}>{pelicula.clasificacion || 'N/A'}</span>
                        {pelicula.en_cartelera && (
                          <span style={styles.badgeCartelera}>En Cartelera</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.cardBody}>
                    <p style={styles.descripcion}>
                      {pelicula.descripcion || 'Sin descripción'}
                    </p>
                    
                    <div style={styles.detalles}>
                      <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>Duración:</span>
                        <span>{pelicula.duracion} min</span>
                      </div>
                      <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>Estreno:</span>
                        <span>{pelicula.fecha_estreno || 'No especificado'}</span>
                      </div>
                      <div style={styles.detalleItem}>
                        <span style={styles.detalleLabel}>Trailer:</span>
                        <span>{pelicula.url_trailer ? 'Disponible' : 'No disponible'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.cardActions}>
                    <button 
                      onClick={() => handleEditarPelicula(pelicula)}
                      style={styles.btnEditar}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleEliminarPelicula(pelicula.id)}
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
                  No hay películas registradas. ¡Agrega tu primera película!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL CREAR/EDITAR PELÍCULA */}
      {showModalPelicula && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalForm, width: '700px' }}>
            <button 
              style={styles.closeBtn} 
              onClick={() => {
                setShowModalPelicula(false);
                resetForm();
              }}
            >
              ✖
            </button>

            <h2 style={styles.modalTitle}>
              {modalType === 'crear' ? '➕ Crear Nueva Película' : '✏️ Editar Película'}
            </h2>

            <form onSubmit={handleCrearPelicula} style={styles.form}>
              {/* Sección de imagen del poster */}
              <div style={styles.imageSection}>
                <h3 style={styles.sectionTitle}>Poster de la Película</h3>
                
                <div style={styles.imageUploadArea}>
                  {posterPreview ? (
                    <div style={styles.imagePreviewContainer}>
                      <img 
                        src={posterPreview} 
                        alt="Preview del poster" 
                        style={styles.imagePreview}
                      />
                      <div style={styles.imagePreviewActions}>
                        <label style={styles.fileInputLabel}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePosterChange}
                            style={{ display: 'none' }}
                          />
                          <span style={styles.changeImageBtn}>🔄 Cambiar Imagen</span>
                        </label>
                        <button 
                          type="button"
                          onClick={removePoster}
                          style={styles.removeImageBtn}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label style={styles.fileInputLabel}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePosterChange}
                        style={{ display: 'none' }}
                      />
                      <div style={styles.uploadPlaceholder}>
                        <div style={styles.uploadIcon}>📁</div>
                        <div style={styles.uploadText}>
                          <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                            Seleccionar Poster
                          </p>
                          <p style={{ fontSize: '12px', color: '#6b7280' }}>
                            Haga clic para seleccionar una imagen de su computadora
                          </p>
                          <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                            Formatos: JPG, PNG, GIF • Máx: 5MB
                          </p>
                        </div>
                      </div>
                    </label>
                  )}
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={styles.label}>O ingresa una URL del poster:</label>
                  <input 
                    type="url" 
                    name="url_poster" 
                    onChange={handleChange}
                    style={styles.input}
                    value={form.url_poster}
                    placeholder="https://ejemplo.com/poster.jpg"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Título *</label>
                  <input 
                    type="text" 
                    name="titulo" 
                    required 
                    onChange={handleChange}
                    style={styles.input}
                    value={form.titulo}
                    placeholder="Ej: Avengers: Endgame"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Duración (min) *</label>
                  <input 
                    type="number" 
                    name="duracion" 
                    required 
                    onChange={handleChange}
                    style={styles.input}
                    value={form.duracion}
                    placeholder="Ej: 180"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Descripción</label>
                <textarea 
                  name="descripcion" 
                  onChange={handleChange}
                  style={{ ...styles.input, minHeight: '80px' }}
                  value={form.descripcion}
                  placeholder="Sinopsis de la película..."
                  rows="3"
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Género</label>
                  <input 
                    type="text" 
                    name="genero" 
                    onChange={handleChange}
                    style={styles.input}
                    value={form.genero}
                    placeholder="Ej: Acción, Drama, Comedia"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Clasificación</label>
                  <select 
                    name="clasificacion" 
                    onChange={handleChange}
                    style={styles.select}
                    value={form.clasificacion}
                  >
                    <option value="">Seleccionar</option>
                    <option value="ATP">ATP (Apta Todo Público)</option>
                    <option value="+7">+7</option>
                    <option value="+12">+12</option>
                    <option value="+15">+15</option>
                    <option value="+18">+18</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Fecha de Estreno</label>
                  <input 
                    type="date" 
                    name="fecha_estreno" 
                    onChange={handleChange}
                    style={styles.input}
                    value={form.fecha_estreno}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>URL Tráiler (YouTube)</label>
                  <input 
                    type="url" 
                    name="url_trailer" 
                    onChange={handleChange}
                    style={styles.input}
                    value={form.url_trailer}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={{ ...styles.label, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    name="en_cartelera" 
                    onChange={handleChange}
                    checked={form.en_cartelera}
                    style={{ width: '16px', height: '16px' }}
                  />
                  En cartelera actualmente
                </label>
              </div>

              <button
                type="submit"
                style={styles.submitBtn}
              >
                {modalType === 'crear' ? 'Crear Película' : 'Actualizar Película'}
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
  peliculaCard: {
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
  poster: {
    width: '80px',
    height: '120px',
    borderRadius: '8px',
    objectFit: 'cover',
    backgroundColor: '#e5e7eb'
  },
  posterPlaceholder: {
    width: '80px',
    height: '120px',
    borderRadius: '8px',
    backgroundColor: '#d1d5db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px'
  },
  cardHeaderInfo: {
    flex: 1
  },
  peliculaTitulo: {
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
  badgeGenero: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  badgeClasificacion: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  badgeCartelera: {
    backgroundColor: '#dcfce7',
    color: '#166534',
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
  descripcion: {
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
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
  cardActions: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto'
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
  // Nuevos estilos para la sección de imagen
  imageSection: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#374151'
  },
  imageUploadArea: {
    marginBottom: '16px'
  },
  fileInputLabel: {
    cursor: 'pointer',
    display: 'block'
  },
  uploadPlaceholder: {
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    transition: 'all 0.2s'
  },
  uploadIcon: {
    fontSize: '48px',
    marginBottom: '12px',
    color: '#9ca3af'
  },
  uploadText: {
    color: '#374151'
  },
  imagePreviewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  imagePreview: {
    maxWidth: '200px',
    maxHeight: '300px',
    borderRadius: '8px',
    objectFit: 'contain'
  },
  imagePreviewActions: {
    display: 'flex',
    gap: '8px'
  },
  changeImageBtn: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500'
  },
  removeImageBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500'
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