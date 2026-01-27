export default function PeliculaCard({ funcion, BACKEND_URL }) {
  const poster =
    funcion.pelicula?.url_poster
      ? `${BACKEND_URL}${funcion.pelicula.url_poster}`
      : 'https://placehold.co/300x450?text=Sin+Poster';

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        marginBottom: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'flex-start',
        }}
      >
        {/* IMAGEN */}
        <img
          src={poster}
          alt={funcion.pelicula?.titulo || 'Película'}
          style={{
            width: '160px',
            height: '210px',
            objectFit: 'cover',
            flexShrink: 0,
            borderRadius: '6px',
          }}
        />

        {/* INFO + BOTÓN (MISMO CONTENEDOR) */}
        <div style={{ width: '320px' }}>
          <h2
            style={{
              margin: '0 0 12px 0',
              fontSize: '35px',
              fontWeight: '700',
            }}
          >
            {funcion.pelicula?.titulo || 'Sin título'}
          </h2>

          <p style={{ margin: '0 0 6px 0', fontSize: '20px' }}>
            <strong>Sala:</strong> {funcion.sala?.nombre || 'No disponible'}
          </p>

          <p style={{ margin: '0 0 6px 0', fontSize: '20px' }}>
            <strong>Hora:</strong>{' '}
            {funcion.fecha_hora_inicio
              ? new Date(funcion.fecha_hora_inicio).toLocaleTimeString('es-CO', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'No disponible'}
          </p>

          <p style={{ margin: '0 0 6px 0', fontSize: '20px' }}>
            <strong>Duración:</strong>{' '}
            {funcion.pelicula?.duracion || '?'} min
          </p>

          <p style={{ margin: '0 0 12px 0', fontSize: '20px' }}>
            <strong>Clasificación:</strong>{' '}
            {funcion.pelicula?.clasificacion || 'Sin clasificación'}
          </p>

          {/* BOTÓN PEGADO A LA INFO */}
          <button
            style={{
              marginTop: '8px',
              padding: '12px 24px',
              width: '200px',
              fontSize: '18px',
              fontWeight: '600',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            onClick={() => {
              alert(`Vender ticket para función ${funcion.id}`);
            }}
          >
            🎟️ Vender ticket
          </button>
        </div>
      </div>
    </div>
  );
}
