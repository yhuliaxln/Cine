// src/components/modals/GestionAsientosModal.jsx
import { useState } from 'react';
import api from '../../services/api';

// Constantes
const FILAS_DISPONIBLES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const TIPOS_ASIENTO = ['estandar', 'vip', 'discapacitado'];
const ESTADOS_ASIENTO = ['disponible', 'ocupado', 'reservado', 'inhabilitado'];

// Funciones helper
const getColorByEstado = (estado) => {
  switch(estado) {
    case 'disponible': return '#10b981';
    case 'ocupado': return '#ef4444';
    case 'reservado': return '#f59e0b';
    case 'inhabilitado': return '#6b7280';
    default: return '#d1d5db';
  }
};

const getColorByTipo = (tipo) => {
  switch(tipo) {
    case 'vip': return '#8b5cf6';
    case 'discapacitado': return '#3b82f6';
    default: return '#10b981';
  }
};

export default function GestionAsientosModal({ 
  salaAsientos, 
  asientos = [], 
  onClose, 
  onOpenCrearAsiento,
  onEliminarAsiento,
  onCambiarEstadoAsiento
}) {
  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalForm, width: '900px' }}>
        <button 
          style={styles.closeBtn} 
          onClick={onClose}
        >
          ✖
        </button>

        <h2 style={styles.modalTitle}>
          💺 Gestión de Asientos - {salaAsientos.nombre}
        </h2>

        <div style={styles.asientosHeader}>
          <div>
            <p style={{ marginBottom: '8px' }}>
              <strong>Tipo:</strong> {salaAsientos.tipo} | 
              <strong> Capacidad:</strong> {salaAsientos.capacidad} asientos | 
              <strong> Configurados:</strong> {asientos.length}
            </p>
            <div style={styles.leyendasContainer}>
              <div style={styles.leyendaAsientos}>
                <span style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Estados:</span>
                {ESTADOS_ASIENTO.map(estado => (
                  <div key={estado} style={styles.leyendaItem}>
                    <div style={{ ...styles.asiento, backgroundColor: getColorByEstado(estado) }}></div>
                    <span>{estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
                  </div>
                ))}
              </div>
              <div style={styles.leyendaAsientos}>
                <span style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Tipos:</span>
                {TIPOS_ASIENTO.map(tipo => (
                  <div key={tipo} style={styles.leyendaItem}>
                    <div style={{ ...styles.asiento, backgroundColor: getColorByTipo(tipo) }}></div>
                    <span>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={styles.asientosActions}>
            <button
              onClick={onOpenCrearAsiento}
              style={styles.btnCrearAsiento}
            >
              ➕ Nuevo Asiento
            </button>
          </div>
        </div>

        {asientos.length > 0 ? (
          <div style={styles.contenedorAsientos}>
            <div style={styles.pantalla}>
              🎬 PANTALLA 🎬
            </div>
            
            <div style={styles.gridAsientos}>
              {FILAS_DISPONIBLES.map(fila => {
                const asientosFila = asientos.filter(a => a.fila === fila);
                if (asientosFila.length === 0) return null;
                
                return (
                  <div key={fila} style={styles.filaAsientos}>
                    <div style={styles.filaLabel}>{fila}</div>
                    <div style={styles.asientosFila}>
                      {asientosFila
                        .sort((a, b) => a.numero - b.numero)
                        .map(asiento => (
                          <div key={asiento.id} style={styles.asientoContainer}>
                            <button
                              onClick={() => {
                                const estadoActualIndex = ESTADOS_ASIENTO.indexOf(asiento.estado);
                                const siguienteEstado = ESTADOS_ASIENTO[(estadoActualIndex + 1) % ESTADOS_ASIENTO.length];
                                onCambiarEstadoAsiento(asiento.id, siguienteEstado);
                              }}
                              style={{
                                ...styles.asiento,
                                backgroundColor: getColorByEstado(asiento.estado),
                                border: `2px solid ${getColorByTipo(asiento.tipo)}`,
                                color: 'white',
                                fontWeight: 'bold',
                                position: 'relative',
                              }}
                              title={`${asiento.fila}${asiento.numero}\nTipo: ${asiento.tipo}\nEstado: ${asiento.estado}`}
                            >
                              {asiento.numero}
                              <div style={styles.asientoTipoBadge}>
                                {asiento.tipo === 'vip' && '⭐'}
                                {asiento.tipo === 'discapacitado' && '♿'}
                              </div>
                            </button>
                            <button
                              onClick={() => onEliminarAsiento(asiento.id)}
                              style={styles.btnEliminarAsiento}
                              title="Eliminar asiento"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={styles.infoAsientos}>
              <p>💡 <strong>Instrucciones:</strong> Haz clic en un asiento para cambiar su estado. Usa la ✕ para eliminar.</p>
              <p>Total de asientos configurados: {asientos.length} de {salaAsientos.capacidad}</p>
              <p>Borde del asiento indica el tipo: Estándar (verde), VIP (violeta), Discapacitado (azul)</p>
            </div>
          </div>
        ) : (
          <div style={styles.emptyAsientos}>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '16px' }}>
              No hay asientos configurados para esta sala.
            </p>
            <button
              onClick={onOpenCrearAsiento}
              style={styles.btnCrearAsiento}
            >
              ➕ Agregar Primer Asiento
            </button>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '12px' }}>
              Puedes agregar asientos uno por uno para mayor control.
            </p>
          </div>
        )}
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
  asientosHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb'
  },
  leyendasContainer: {
    display: 'flex',
    gap: '32px',
    marginTop: '16px'
  },
  asientosActions: {
    display: 'flex',
    gap: '8px'
  },
  leyendaAsientos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '13px'
  },
  leyendaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  btnCrearAsiento: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px'
  },
  contenedorAsientos: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px'
  },
  pantalla: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '12px 40px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '18px',
    textAlign: 'center',
    width: '80%',
    marginBottom: '20px'
  },
  gridAsientos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%'
  },
  filaAsientos: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  filaLabel: {
    width: '30px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4b5563'
  },
  asientosFila: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    flex: 1
  },
  asientoContainer: {
    position: 'relative',
    display: 'inline-block'
  },
  asiento: {
    width: '45px',
    height: '45px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  asientoTipoBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    fontSize: '10px'
  },
  btnEliminarAsiento: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    zIndex: 10
  },
  infoAsientos: {
    backgroundColor: '#f3f4f6',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#4b5563',
    textAlign: 'center',
    width: '100%',
    marginTop: '16px'
  },
  emptyAsientos: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    textAlign: 'center'
  }
};