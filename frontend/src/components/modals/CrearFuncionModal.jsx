// src/components/modals/CrearFuncionModal.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function CrearFuncionModal({ onClose, onCreated }) {
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [form, setForm] = useState({
    pelicula_id: '',
    sala_id: '',
    fecha_hora_inicio: '',
    precio: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const pelis = await api.get('/peliculas');
      const salasRes = await api.get('/salas');
      setPeliculas(pelis.data);
      setSalas(salasRes.data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/funciones', form);
    onCreated();
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalForm}>
        <button style={styles.closeBtn} onClick={onClose}>✖</button>

        <h2 style={styles.modalTitle}>➕ Crear nueva función</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
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