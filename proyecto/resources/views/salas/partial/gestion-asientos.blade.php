<!-- resources/views/salas/partial/gestion-asientos.blade.php -->

<style>
    .gestion-asientos-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1050;
    }
    .gestion-asientos-content {
        background: white;
        border-radius: 12px;
        width: 900px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        padding: 24px;
    }
    .gestion-close-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        z-index: 1;
    }
    .gestion-modal-title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 24px;
        color: #1e40af;
    }
    .gestion-header-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e5e7eb;
    }
    .leyendas-container {
        display: flex;
        gap: 32px;
        margin-top: 16px;
    }
    .leyenda {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 13px;
    }
    .leyenda-item {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .asiento-leyenda {
        width: 20px;
        height: 20px;
        border-radius: 4px;
    }
    .gestion-btn-nuevo-asiento {
        background: #10b981;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        font-size: 13px;
        transition: background 0.2s;
    }
    .gestion-btn-nuevo-asiento:hover {
        background: #0da271;
    }
    .pantalla {
        background: #1f2937;
        color: white;
        padding: 12px 40px;
        border-radius: 4px;
        font-weight: bold;
        font-size: 18px;
        text-align: center;
        width: 80%;
        margin: 0 auto 20px;
    }
    .grid-asientos {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
    }
    .fila {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .fila-label {
        width: 30px;
        font-weight: bold;
        text-align: center;
        color: #4b5563;
    }
    .asientos-fila {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        flex: 1;
    }
    .asiento-container {
        position: relative;
    }
    .asiento {
        width: 45px;
        height: 45px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.2s;
    }
    .asiento-tipo-badge {
        position: absolute;
        top: 2px;
        right: 2px;
        font-size: 10px;
    }
    .btn-eliminar-asiento {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        transition: background 0.2s;
    }
    .btn-eliminar-asiento:hover {
        background: #dc2626;
    }
    .info-asientos {
        background: #f3f4f6;
        padding: 12px;
        border-radius: 8px;
        font-size: 13px;
        color: #4b5563;
        text-align: center;
        margin-top: 16px;
    }
    .empty-asientos {
        text-align: center;
        padding: 40px 20px;
        color: #6b7280;
    }
</style>

<div class="gestion-asientos-overlay" id="gestionAsientosModal">
    <div class="gestion-asientos-content">
        <button type="button" class="gestion-close-btn" id="closeGestionBtn">✖</button>

        <h2 class="gestion-modal-title">💺 Gestión de Asientos - {{ $sala->nombre }}</h2>

        <div class="gestion-header-info">
            <div>
                <p style="margin-bottom: 8px;">
                    <strong>Tipo:</strong> {{ $sala->tipo }} | 
                    <strong>Capacidad:</strong> {{ $sala->capacidad }} asientos | 
                    <strong>Configurados:</strong> <span id="count-asientos">{{ count($asientos) }}</span>
                </p>

                <div class="leyendas-container">
                    <div class="leyenda">
                        <span style="font-weight: 600; margin-bottom: 8px; display: block;">Estados:</span>
                        <div class="leyenda-item"><div class="asiento-leyenda" style="background:#10b981;"></div>Disponible</div>
                        <div class="leyenda-item"><div class="asiento-leyenda" style="background:#ef4444;"></div>Ocupado</div>
                        <div class="leyenda-item"><div class="asiento-leyenda" style="background:#f59e0b;"></div>Reservado</div>
                        <div class="leyenda-item"><div class="asiento-leyenda" style="background:#6b7280;"></div>Inhabilitado</div>
                    </div>
                    <div class="leyenda">
                        <span style="font-weight: 600; margin-bottom: 8px; display: block;">Tipos:</span>
                        <div class="leyenda-item"><div class="asiento-leyenda" style="background:#10b981;"></div>Estándar</div>
                        <div class="leyenda-item"><div class="asiento-leyenda" style="background:#8b5cf6;"></div>VIP</div>
                        <div class="leyenda-item"><div class="asiento-leyenda" style="background:#3b82f6;"></div>Discapacitado</div>
                    </div>
                </div>
            </div>

            <button type="button" class="gestion-btn-nuevo-asiento btn-abrir-form-asiento">
                ➕ Nuevo Asiento
            </button>
        </div>

        @if(count($asientos) > 0)
            <div style="display: flex; flex-direction: column; align-items: center; gap: 24px;">
                <div class="pantalla">🎬 PANTALLA 🎬</div>

                <div class="grid-asientos">
                    @foreach(['A','B','C','D','E','F','G','H','I','J'] as $fila)
                        @php
                            $asientosFila = $asientos->where('fila', $fila)->sortBy('numero');
                        @endphp
                        @if($asientosFila->count() > 0)
                            <div class="fila">
                                <div class="fila-label">{{ $fila }}</div>
                                <div class="asientos-fila">
                                    @foreach($asientosFila as $asiento)
                                        @php
                                            $colorEstado = match($asiento->estado) {
                                                'disponible'  => '#10b981',
                                                'ocupado'     => '#ef4444',
                                                'reservado'   => '#f59e0b',
                                                default       => '#6b7280',
                                            };

                                            $colorTipo = match($asiento->tipo) {
                                                'vip'           => '#8b5cf6',
                                                'discapacitado' => '#3b82f6',
                                                default         => '#10b981',
                                            };
                                        @endphp

                                        <div class="asiento-container">
                                            <button type="button" class="asiento cambiar-estado-btn"
                                                data-id="{{ $asiento->id }}"
                                                data-estado="{{ $asiento->estado }}"
                                                style="background: {{ $colorEstado }}; border: 2px solid {{ $colorTipo }};"
                                                title="{{ $asiento->fila }}{{ $asiento->numero }} - {{ $asiento->tipo }} - {{ $asiento->estado }}">
                                                {{ $asiento->numero }}
                                                <div class="asiento-tipo-badge">
                                                    {{ $asiento->tipo === 'vip' ? '⭐' : ($asiento->tipo === 'discapacitado' ? '♿' : '') }}
                                                </div>
                                            </button>
                                            <button type="button" class="btn-eliminar-asiento eliminar-btn" 
                                                data-id="{{ $asiento->id }}">✕</button>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        @endif
                    @endforeach
                </div>

                <div class="info-asientos">
                    <p>💡 <strong>Instrucciones:</strong> Haz clic en un asiento para cambiar su estado cíclicamente. Usa la ✕ para eliminar.</p>
                    <p>Total de asientos configurados: <span id="total-asientos">{{ count($asientos) }}</span> de {{ $sala->capacidad }}</p>
                    <p>Borde del asiento indica el tipo: Estándar (verde), VIP (violeta), Discapacitado (azul)</p>
                </div>
            </div>
        @else
            <div class="empty-asientos">
                <p style="font-size: 16px; margin-bottom: 16px;">
                    No hay asientos configurados para esta sala.
                </p>
                <button type="button" class="gestion-btn-nuevo-asiento btn-abrir-form-asiento">
                    ➕ Agregar Primer Asiento
                </button>
                <p style="font-size: 13px; color: #9ca3af; margin-top: 12px;">
                    Puedes agregar asientos uno por uno para mayor control.
                </p>
            </div>
        @endif
    </div>
</div>

<script>
window.GestionAsientosModal = {
    init: function() {
        this.salaId = {{ $sala->id }};
        this.setupEventListeners();
        console.log('Modal de gestión inicializado para sala:', this.salaId);
    },

    setupEventListeners: function() {
        // Cerrar modal
        document.getElementById('closeGestionBtn')?.addEventListener('click', this.closeModal.bind(this));

        // Clic fuera del modal
        document.getElementById('gestionAsientosModal')?.addEventListener('click', e => {
            if (e.target.id === 'gestionAsientosModal') {
                this.closeModal();
            }
        });

        // Cambiar estado de asiento
        document.querySelectorAll('.cambiar-estado-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const estado = btn.dataset.estado;
                this.cambiarEstadoAsiento(id, estado);
            });
        });

        // Eliminar asiento
        document.querySelectorAll('.eliminar-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const id = btn.dataset.id;
                this.eliminarAsiento(id);
            });
        });

        // Abrir formulario para crear asiento
        document.querySelectorAll('.btn-abrir-form-asiento').forEach(btn => {
            btn.addEventListener('click', () => {
                this.abrirModalAsiento();
            });
        });
    },

    closeModal: function() {
        const modal = document.getElementById('gestionAsientosModal');
        if (modal) {
            modal.remove();
        }
    },

    cambiarEstadoAsiento: function(id, estadoActual) {
        const estados = ['disponible', 'ocupado', 'reservado', 'inhabilitado'];
        const currentIndex = estados.indexOf(estadoActual);
        const nextEstado = estados[(currentIndex + 1) % estados.length];

        if (confirm(`¿Cambiar estado a "${nextEstado}"?`)) {
            fetch(`/ajax/asientos/${id}`, {
                method: 'PUT',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ estado: nextEstado })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success !== false) {
                    this.recargarModal();
                } else {
                    alert(data.message || 'Error al actualizar estado');
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error de conexión al cambiar estado');
            });
        }
    },

    eliminarAsiento: function(id) {
        if (confirm('¿Seguro que deseas eliminar este asiento?')) {
            fetch(`/ajax/asientos/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    this.recargarModal();
                } else {
                    return response.json().then(err => { throw err; });
                }
            })
            .catch(err => {
                alert(err.message || 'Error al eliminar el asiento');
            });
        }
    },

    recargarModal: function() {
        console.log('Recargando modal de gestión de asientos...');
        
        // Cerrar primero cualquier modal de formulario abierto
        const formModal = document.getElementById('asientoFormModal');
        if (formModal) formModal.remove();
        
        fetch(`/salas/${this.salaId}/gestion-asientos`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al recargar');
            return response.text();
        })
        .then(html => {
            const container = document.getElementById('modals-container');
            if (container) {
                container.innerHTML = '';
                container.insertAdjacentHTML('beforeend', html);
                
                // Volver a inicializar el nuevo modal
                if (window.GestionAsientosModal && window.GestionAsientosModal.init) {
                    setTimeout(() => {
                        window.GestionAsientosModal.init();
                    }, 100);
                }
            }
        })
        .catch(err => {
            console.error('Error al recargar gestión de asientos:', err);
            alert('No se pudo recargar la lista de asientos');
        });
    },

    abrirModalAsiento: function() {
        const url = `/salas/${this.salaId}/asiento/create`;
        console.log('Abriendo formulario de asiento en:', url);
        
        // Cerrar cualquier formulario anterior abierto
        const existingForm = document.getElementById('asientoFormModal');
        if (existingForm) existingForm.remove();
        
        fetch(url, {
            headers: { 
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'text/html'
            }
        })
        .then(r => {
            if (!r.ok) throw new Error('Error cargando formulario');
            return r.text();
        })
        .then(html => {
            // Añadimos el modal pequeño
            const container = document.getElementById('modals-container');
            if (container) {
                container.insertAdjacentHTML('beforeend', html);
                console.log('Formulario cargado exitosamente');
            }
        })
        .catch(err => {
            console.error('Error cargando formulario de asiento:', err);
            alert('No se pudo abrir el formulario para agregar asiento');
        });
    }
};

// Inicializar automáticamente si el modal ya está en el DOM
if (document.getElementById('gestionAsientosModal')) {
    window.GestionAsientosModal.init();
}
</script>