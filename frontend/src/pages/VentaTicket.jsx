// src/pages/VentaTicket.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';

function VentaTicket({ funcionId }) {
  const [funcion, setFuncion] = useState(null);
  const [asientos, setAsientos] = useState([]);
  const [selectedAsiento, setSelectedAsiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!funcionId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const funcionRes = await api.get(`/funciones/${funcionId}`);
        setFuncion(funcionRes.data);

        const salaId = funcionRes.data.sala_id;
        const asientosRes = await api.get(`/asientos?sala_id=${salaId}`);
        setAsientos(asientosRes.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Error al cargar datos de la función'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [funcionId]);

  const handleSeleccionarAsiento = (asiento) => {
    if (asiento.estado !== 'disponible') return;
    setSelectedAsiento(asiento);
  };

  const handleVender = async () => {
    if (!selectedAsiento) return;

    try {
      await api.post('/tickets', {
        funcion_id: funcionId,
        asiento_id: selectedAsiento.id,
        precio: funcion.precio,
        estado: 'vendido',
        metodo_pago: 'efectivo',
      });

      setSuccess('¡Ticket vendido con éxito!');
      setSelectedAsiento(null);

      setAsientos((prev) =>
        prev.map((a) =>
          a.id === selectedAsiento.id
            ? { ...a, estado: 'ocupado' }
            : a
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Error al vender el ticket');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!funcion) return null;

  return (
    <div>
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '12px' }}>
        🎟️ Venta de Ticket
      </h1>

      {/* 🔹 INFO DE LA FUNCIÓN */}
      <div
        style={{
          background: '#f9fafb',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>
          {funcion.pelicula?.titulo}
        </h2>

        <p><strong>Sala:</strong> {funcion.sala?.nombre}</p>
        <p>
          <strong>Hora:</strong>{' '}
          {new Date(funcion.fecha_hora_inicio).toLocaleString('es-CO')}
        </p>
        <p><strong>Precio:</strong> ${funcion.precio}</p>
      </div>

      {/* 🎬 PANTALLA DEL CINE */}
      <div
        style={{
          width: '100%',
          height: '40px',
          background: '#d1d5db',
          borderRadius: '0 0 80% 80%',
          textAlign: 'center',
          fontWeight: '600',
          lineHeight: '40px',
          marginBottom: '24px',
        }}
      >
        PANTALLA
      </div>

      {/* 🪑 ASIENTOS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
        }}
      >
        {asientos.map((asiento) => (
          <button
            key={asiento.id}
            onClick={() => handleSeleccionarAsiento(asiento)}
            disabled={asiento.estado !== 'disponible'}
            style={{
              padding: '12px',
              borderRadius: '6px',
              fontWeight: '600',
              background:
                asiento.estado !== 'disponible'
                  ? '#d1d5db'
                  : selectedAsiento?.id === asiento.id
                  ? '#16a34a'
                  : '#bbf7d0',
              cursor:
                asiento.estado !== 'disponible'
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            {asiento.fila}-{asiento.numero}
          </button>
        ))}
      </div>

      {/* ✅ CONFIRMAR */}
      {selectedAsiento && (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={handleVender}
            style={{
              background: '#2563eb',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
              border: 'none',
            }}
          >
            Confirmar Venta – ${funcion.precio}
          </button>
        </div>
      )}

      {success && (
        <p style={{ color: 'green', marginTop: '16px', textAlign: 'center' }}>
          {success}
        </p>
      )}
    </div>
  );
}

export default VentaTicket;
