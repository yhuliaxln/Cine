// src/pages/DashboardEmpleado.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';  // ← CAMBIA ESTO si tu services está en otro lugar

export default function DashboardEmpleadoPage() {
  const [funcionesHoy, setFuncionesHoy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCarteleraHoy = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const response = await api.get(`/funciones?fecha=${today}`);
        setFuncionesHoy(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar la cartelera del día');
      } finally {
        setLoading(false);
      }
    };

    fetchCarteleraHoy();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Cargando cartelera...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard Empleado - Cartelera del Día</h1>

      {funcionesHoy.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 text-lg">No hay funciones programadas para hoy.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {funcionesHoy.map((funcion) => (
            <div key={funcion.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {funcion.pelicula?.titulo || 'Película sin título'}
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium">Sala:</span> {funcion.sala?.nombre || 'N/A'} ({funcion.sala?.tipo || 'N/A'})</p>
                  <p><span className="font-medium">Hora:</span> {new Date(funcion.fecha_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p><span className="font-medium">Precio:</span> ${funcion.precio}</p>
                </div>

                <button
                  onClick={() => window.location.href = `/venta/${funcion.id}`}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Vender Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}