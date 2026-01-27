import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminLayout from '../components/admin/AdminLayout';
import PeliculaModal from '../components/modals/PeliculaModal';
import useCRUD from '../Hooks/useCRUD';

export default function AdminPeliculas() {
  const { 
    items: peliculas, 
    loading: peliculasLoading, 
    error: peliculasError, 
    fetchAll: cargarPeliculas,
    remove: eliminarPelicula
  } = useCRUD('/peliculas');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Modal crear/editar película
  const [showModalPelicula, setShowModalPelicula] = useState(false);
  const [modalType, setModalType] = useState('crear');
  const [peliculaEditando, setPeliculaEditando] = useState(null);

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

  const handleEditarPelicula = (pelicula) => {
    setModalType('editar');
    setPeliculaEditando(pelicula);
    setShowModalPelicula(true);
  };

  const handleEliminarPelicula = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta película?')) {
      try {
        await eliminarPelicula(id);
      } catch (error) {
        console.error('Error al eliminar película:', error);
      }
    }
  };

  const openCrearModal = () => {
    setModalType('crear');
    setPeliculaEditando(null);
    setShowModalPelicula(true);
  };

  const handleModalSuccess = () => {
    setShowModalPelicula(false);
    cargarPeliculas();
  };

  if (loading || peliculasLoading) return <div style={styles.center}>Cargando películas...</div>;
  if (error || peliculasError) return <div style={{ ...styles.center, color: 'red' }}>{error || peliculasError}</div>;

  return (
    <AdminLayout
      title="Catálogo de Películas"
      subtitle="Gestiona el catálogo completo de películas"
      actionButton={
        <button
          onClick={openCrearModal}
          style={styles.blueBtn}
        >
          ➕ Nueva Película
        </button>
      }
    >
      <div style={styles.grid}>
        {peliculas.length > 0 ? (
          peliculas.map((pelicula) => (
            <div key={pelicula.id} style={styles.peliculaCard}>
              <div style={styles.cardHeader}>
                <div style={styles.posterContainer}>
                  {pelicula.url_poster ? (
                    <>
                      <img 
                        src={pelicula.url_poster} 
                        alt={pelicula.titulo} 
                        style={styles.poster}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                      {/* Placeholder que se muestra si la imagen falla */}
                      <div 
                        style={{
                          ...styles.posterPlaceholder,
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          display: 'none'
                        }}
                        ref={(el) => {
                          if (el) {
                            const img = el.previousSibling;
                            if (img && img.style.display === 'none') {
                              el.style.display = 'flex';
                            }
                          }
                        }}
                      >
                        🎬
                      </div>
                    </>
                  ) : (
                    <div style={styles.posterPlaceholder}>
                      🎬
                    </div>
                  )}
                </div>
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

      {/* MODAL CREAR/EDITAR PELÍCULA */}
      {showModalPelicula && (
        <PeliculaModal
          modalType={modalType}
          peliculaEditando={peliculaEditando}
          onClose={() => setShowModalPelicula(false)}
          onSuccess={handleModalSuccess}
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
  posterContainer: {
    position: 'relative',
    width: '80px',
    height: '120px'
  },
  poster: {
    width: '80px',
    height: '120px',
    borderRadius: '8px',
    objectFit: 'cover',
    backgroundColor: '#e5e7eb',
    position: 'relative',
    zIndex: 1
  },
  posterPlaceholder: {
    width: '80px',
    height: '120px',
    borderRadius: '8px',
    backgroundColor: '#d1d5db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    position: 'relative',
    zIndex: 0
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
  }
};