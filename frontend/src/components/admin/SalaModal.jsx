// src/components/modals/SalaModal.jsx
import { useState } from 'react';
import api from '../../services/api';

export default function SalaModal({ 
  modalType, 
  salaEditando, 
  onClose, 
  onSuccess 
}) {
  const [form, setForm] = useState({
    nombre: salaEditando?.nombre || '',
    capacidad: salaEditando?.capacidad || '',
    tipo: salaEditando?.tipo || '2D',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ 
      ...form, 
      [name]: value 
    });
  };

  const handleSubmit = async (e) => {
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
      
      onSuccess();
    } catch (error) {
      console.error('Error al guardar sala:', error.response?.data || error);
      alert(`Error al guardar la sala: ${error.response?.data?.message || 'Verifique los datos'}`);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalForm, width: '500px' }}>
        <button 
          style={styles.closeBtn} 
          onClick={onClose}
        >
          ✖
        </button>

        <h2 style={styles.modalTitle}>
          {modalType === 'crear' ? '➕ Crear Nueva Sala' : '✏️ Editar Sala'}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
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
  }
};