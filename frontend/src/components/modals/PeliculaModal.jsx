// src/components/modals/PeliculaModal.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function PeliculaModal({ 
  modalType, 
  peliculaEditando, 
  onClose, 
  onSuccess 
}) {
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Data formulario
  const [form, setForm] = useState({
    titulo: peliculaEditando?.titulo || '',
    descripcion: peliculaEditando?.descripcion || '',
    duracion: peliculaEditando?.duracion || '',
    genero: peliculaEditando?.genero || '',
    fecha_estreno: peliculaEditando?.fecha_estreno ? 
      peliculaEditando.fecha_estreno.split('T')[0] : '',
    url_poster: peliculaEditando?.url_poster || '',
    url_trailer: peliculaEditando?.url_trailer || '',
    clasificacion: peliculaEditando?.clasificacion || '',
    en_cartelera: peliculaEditando?.en_cartelera || false,
  });

  useEffect(() => {
    if (peliculaEditando?.url_poster) {
      setPosterPreview(peliculaEditando.url_poster);
    }
  }, [peliculaEditando]);

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
      
      // Limpiar URL si se sube archivo
      setForm(prev => ({ ...prev, url_poster: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();
      
      // Agregar campos del formulario
      Object.keys(form).forEach(key => {
        if (key === 'en_cartelera') {
          formData.append(key, form[key] ? '1' : '0');
        } else if (form[key] !== undefined && form[key] !== null) {
          formData.append(key, form[key]);
        }
      });
      
      // Si hay archivo, agregarlo con el nombre correcto 'url_poster'
      if (posterFile) {
        formData.append('url_poster', posterFile);
      }
      
      // Configurar headers para FormData
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      
      if (modalType === 'crear') {
        await api.post('/peliculas', formData, config);
      } else {
        await api.put(`/peliculas/${peliculaEditando.id}`, formData, config);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error al guardar película:', error);
      alert(`Error: ${error.response?.data?.message || 'Verifique los datos'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Función para remover la imagen seleccionada
  const removePoster = () => {
    setPosterFile(null);
    setPosterPreview('');
    setForm({ ...form, url_poster: '' });
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalForm, width: '700px' }}>
        <button 
          style={styles.closeBtn} 
          onClick={onClose}
        >
          ✖
        </button>

        <h2 style={styles.modalTitle}>
          {modalType === 'crear' ? '➕ Crear Nueva Película' : '✏️ Editar Película'}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                      e.target.style.display = 'none';
                    }}
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
                        Formatos: JPG, PNG • Máx: 5MB
                      </p>
                    </div>
                  </div>
                </label>
              )}
            </div>

            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
                <strong>O:</strong> Si ya tienes una URL, ingrésala abajo en el campo correspondiente
              </p>
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
                min="1"
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
              <label style={styles.label}>Género *</label>
              <input 
                type="text" 
                name="genero" 
                required 
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
              <label style={styles.label}>URL del Poster (opcional)</label>
              <input 
                type="url" 
                name="url_poster" 
                onChange={handleChange}
                style={styles.input}
                value={form.url_poster}
                placeholder="https://ejemplo.com/poster.jpg"
                disabled={posterFile} // Deshabilitar si hay archivo
              />
              {posterFile && (
                <p style={{ fontSize: '12px', color: '#f59e0b', marginTop: '4px' }}>
                  Tienes un archivo seleccionado. Este campo está deshabilitado.
                </p>
              )}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>URL Tráiler (YouTube) (opcional)</label>
            <input 
              type="url" 
              name="url_trailer" 
              onChange={handleChange}
              style={styles.input}
              value={form.url_trailer}
              placeholder="https://youtube.com/watch?v=..."
            />
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
            disabled={isUploading}
          >
            {isUploading ? '⏳ Guardando...' : (modalType === 'crear' ? 'Crear Película' : 'Actualizar Película')}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
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
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: '#2563eb',
      backgroundColor: '#eff6ff'
    }
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
    objectFit: 'contain',
    border: '1px solid #e5e7eb'
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
    width: '100%',
    '&:disabled': {
      backgroundColor: '#f3f4f6',
      cursor: 'not-allowed'
    }
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
    marginTop: '10px',
    '&:disabled': {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    }
  }
};