// src/pages/VentaTicket.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // para obtener :id de la URL
import api from '../services/api';

export default function VentaTicket() {
  const { id } = useParams(); // id = funcion_id desde la URL (/venta/:id)
  const [funcion, setFuncion] = useState(null);
  const [asientos, setAsientos] = useState([]);
  const [selectedAsiento, setSelectedAsiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar datos de la función y sus asientos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener detalles de la función
        const funcionRes = await api.get(`/funciones/${id}`);
        setFuncion(funcionRes.data);

        // 2. Obtener asientos de la sala de esa función
        const salaId = funcionRes.data.sala_id;
        const asientosRes = await api.get(`/asientos?sala_id=${salaId}`);
        setAsientos(asientosRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar datos de la función');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSeleccionarAsiento = (asiento) => {
    if (asiento.estado !== 'disponible') {
      alert('Este asiento no está disponible');
      return;
    }
    setSelectedAsiento(asiento);
  };

  const handleVender = async () => {
    if (!selectedAsiento) {
      alert('Selecciona un asiento primero');
      return;
    }

    try {
      const response = await api.post('/tickets', {
        funcion_id: id,
        asiento_id: selectedAsiento.id,
        precio: funcion.precio,
        estado: 'vendido',
        metodo_pago: 'efectivo', // puedes hacer un select después
      });

      setSuccess('¡Ticket vendido con éxito!');
      setSelectedAsiento(null);

      // Actualizar lista de asientos (marcar el vendido como ocupado)
      setAsientos((prev) =>
        prev.map((a) =>
          a.id === selectedAsiento.id ? { ...a, estado: 'ocupado' } : a
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Error al vender el ticket');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!funcion) return <div className="min-h-screen flex items-center justify-center">Función no encontrada</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Venta de Ticket</h1>

      {/* Detalles de la función */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">{funcion.pelicula?.titulo || 'Sin título'}</h2>
        <p><strong>Sala:</strong> {funcion.sala?.nombre || 'N/A'} ({funcion.sala?.tipo || 'N/A'})</p>
        <p><strong>Hora:</strong> {new Date(funcion.fecha_hora_inicio).toLocaleString()}</p>
        <p><strong>Precio por ticket:</strong> ${funcion.precio}</p>
      </div>

      {/* Selección de asiento */}
      <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">Selecciona un asiento disponible</h3>

        {success && <p className="text-green-600 mb-4 text-center">{success}</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <div className="grid grid-cols-5 gap-3">
          {asientos.map((asiento) => (
            <button
              key={asiento.id}
              onClick={() => handleSeleccionarAsiento(asiento)}
              disabled={asiento.estado !== 'disponible'}
              className={`p-4 rounded-lg text-center font-medium transition
                ${asiento.estado === 'disponible'
                  ? selectedAsiento?.id === asiento.id
                    ? 'bg-green-600 text-white'
                    : 'bg-green-200 hover:bg-green-300'
                  : 'bg-gray-300 cursor-not-allowed text-gray-600'
                }`}
            >
              {asiento.fila}-{asiento.numero}
              <br />
              <span className="text-xs">
                {asiento.tipo}
              </span>
            </button>
          ))}
        </div>

        {selectedAsiento && (
          <div className="mt-6 text-center">
            <p className="text-lg font-medium mb-4">
              Asiento seleccionado: {selectedAsiento.fila}-{selectedAsiento.numero} ({selectedAsiento.tipo})
            </p>
            <button
              onClick={handleVender}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition"
            >
              Confirmar Venta - ${funcion.precio}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}