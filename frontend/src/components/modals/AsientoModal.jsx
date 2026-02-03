  // src/components/modals/AsientoModal.jsx
  import { useState } from 'react';
  import api from '../../services/api';

  // Constantes que se usan en varios lugares
  const FILAS_DISPONIBLES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const TIPOS_ASIENTO = ['estandar', 'vip', 'discapacitado'];
  const ESTADOS_ASIENTO = ['disponible', 'ocupado', 'reservado', 'inhabilitado'];

  export default function AsientoModal({ 
    salaAsientos, 
    asientosExistentes = [], 
    onClose, 
    onSuccess 
  }) {
    // Calcular el próximo número disponible
    const calcularSiguienteNumero = () => {
      const asientosFila = asientosExistentes.filter(a => a.fila === 'A');
      const numerosExistentes = asientosFila.map(a => a.numero);
      let siguienteNumero = 1;
      
      while (numerosExistentes.includes(siguienteNumero)) {
        siguienteNumero++;
      }
      
      return siguienteNumero;
    };

    const [form, setForm] = useState({
      fila: 'A',
      numero: calcularSiguienteNumero(),
      tipo: 'estandar',
      estado: 'disponible',
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
      if (!salaAsientos) return;
      
      try {
        const asientoData = {
          sala_id: salaAsientos.id,
          fila: form.fila,
          numero: parseInt(form.numero),
          tipo: form.tipo,
          estado: form.estado,
        };

        console.log('Creando asiento:', asientoData);
        
        await api.post('/asientos', asientoData);
        onSuccess();
      } catch (error) {
        console.error('Error creando asiento:', error.response?.data || error);
        alert(`Error al crear asiento: ${error.response?.data?.message || 'Verifique los datos'}`);
      }
    };

    return (
      <div style={styles.modalOverlay}>
        <div style={{ ...styles.modalForm, width: '400px' }}>
          <button 
            style={styles.closeBtn} 
            onClick={onClose}
          >
            ✖
          </button>

          <h2 style={styles.modalTitle}>
            ➕ Crear Nuevo Asiento
          </h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Fila *</label>
              <select 
                name="fila" 
                required 
                onChange={handleChange}
                style={styles.select}
                value={form.fila}
              >
                {FILAS_DISPONIBLES.map(fila => (
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
                onChange={handleChange}
                style={styles.input}
                value={form.numero}
                placeholder="Número del asiento"
                min="1"
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Sugerencia: {form.fila}{form.numero}
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Tipo de Asiento *</label>
              <select 
                name="tipo" 
                required 
                onChange={handleChange}
                style={styles.select}
                value={form.tipo}
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
                onChange={handleChange}
                style={styles.select}
                value={form.estado}
              >
                {ESTADOS_ASIENTO.map(estado => (
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
    }
  };