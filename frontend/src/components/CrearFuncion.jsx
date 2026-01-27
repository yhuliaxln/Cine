import { useEffect, useState } from 'react';
import api from '../services/api';

export default function CrearFuncion({ onClose, onCreated }) {
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);

  const [form, setForm] = useState({
    pelicula_id: '',
    sala_id: '',
    fecha_hora_inicio: '',
    fecha_hora_fin: '',
    precio: '',
  });

  useEffect(() => {
    api.get('/peliculas').then(res => setPeliculas(res.data));
    api.get('/salas').then(res => setSalas(res.data));
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
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
        ➕ Crear nueva función
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <select name="pelicula_id" required onChange={handleChange}>
          <option value="">Seleccione película</option>
          {peliculas.map(p => (
            <option key={p.id} value={p.id}>{p.titulo}</option>
          ))}
        </select>

        <select name="sala_id" required onChange={handleChange}>
          <option value="">Seleccione sala</option>
          {salas.map(s => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>

        <input
          type="datetime-local"
          name="fecha_hora_inicio"
          required
          onChange={handleChange}
        />

        <input
          type="datetime-local"
          name="fecha_hora_fin"
          required
          onChange={handleChange}
        />

        <input
          type="number"
          name="precio"
          placeholder="Precio"
          required
          onChange={handleChange}
        />

        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Guardar función
        </button>
      </form>
    </div>
  );
}
