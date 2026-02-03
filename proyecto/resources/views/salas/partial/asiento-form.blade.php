<!-- resources/views/salas/partial/asiento-form.blade.php -->
<style>
    .asiento-form-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.65);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1100;
    }
    .asiento-form-content {
        background: white;
        border-radius: 12px;
        width: 420px;
        max-height: 92vh;
        overflow-y: auto;
        padding: 28px 32px;
        position: relative;
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);
    }
    .asiento-close-btn {
        position: absolute;
        top: 16px;
        right: 20px;
        background: none;
        border: none;
        font-size: 26px;
        color: #666;
        cursor: pointer;
    }
    .asiento-form-title {
        font-size: 22px;
        font-weight: 600;
        color: #1e40af;
        margin: 0 0 24px 0;
    }
    .form-group {
        margin-bottom: 20px;
    }
    .form-label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 6px;
    }
    .form-control, .form-select {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        background: white;
    }
    .form-select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='currentColor' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 12px;
    }
    .help-text {
        font-size: 12px;
        color: #6b7280;
        margin-top: 4px;
    }
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 28px;
    }
    .btn-cancel {
        background: #e5e7eb;
        color: #374151;
        border: none;
        padding: 10px 18px;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
    }
    .btn-submit {
        background: #2563eb;
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
    }
    .info-sala {
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 8px;
        padding: 12px;
        font-size: 13px;
        margin-top: 16px;
    }
</style>

<div class="asiento-form-overlay" id="asientoFormModal">
    <div class="asiento-form-content">
        <button type="button" class="asiento-close-btn" id="closeAsientoForm">×</button>

        <h2 class="asiento-form-title">
            {{ $modo === 'crear' ? '➕ Crear Nuevo Asiento' : '✏️ Editar Asiento' }}
        </h2>

        <form id="formAsiento" data-modo="{{ $modo }}" data-asiento-id="{{ $asiento->id ?? '' }}">
            @csrf
            
            <!-- CAMPO OCULTO PARA SALA_ID -->
            <input type="hidden" name="sala_id" value="{{ $sala->id }}">
            
            <div class="form-group">
                <label class="form-label">Sala</label>
                <div class="info-sala">
                    <strong>{{ $sala->nombre }}</strong> • {{ $sala->tipo }} • Capacidad: {{ $sala->capacidad }}
                </div>
            </div>

            <div class="form-group">
                <label class="form-label" for="fila">Fila *</label>
                <select name="fila" id="fila" class="form-select" required>
                    @foreach(['A','B','C','D','E','F','G','H','I','J'] as $f)
                        <option value="{{ $f }}" {{ (isset($asiento) && $asiento->fila === $f) || (!isset($asiento) && $f === 'A') ? 'selected' : '' }}>
                            Fila {{ $f }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label class="form-label" for="numero">Número *</label>
                <input 
                    type="number" 
                    name="numero" 
                    id="numero" 
                    class="form-control" 
                    min="1" 
                    required 
                    value="{{ $asiento->numero ?? '' }}"
                    placeholder="Ej: 12"
                >
                <div class="help-text" id="sugerencia-asiento"></div>
            </div>

            <div class="form-group">
                <label class="form-label" for="tipo">Tipo de asiento *</label>
                <select name="tipo" id="tipo" class="form-select" required>
                    <option value="estandar"    {{ (isset($asiento) && $asiento->tipo === 'estandar') || !isset($asiento) ? 'selected' : '' }}>💺 Estándar</option>
                    <option value="vip"         {{ isset($asiento) && $asiento->tipo === 'vip' ? 'selected' : '' }}>⭐ VIP</option>
                    <option value="discapacitado" {{ isset($asiento) && $asiento->tipo === 'discapacitado' ? 'selected' : '' }}>♿ Accesible</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label" for="estado">Estado inicial *</label>
                <select name="estado" id="estado" class="form-select" required>
                    <option value="disponible"  {{ (isset($asiento) && $asiento->estado === 'disponible') || !isset($asiento) ? 'selected' : '' }}>✅ Disponible</option>
                    <option value="ocupado"     {{ isset($asiento) && $asiento->estado === 'ocupado' ? 'selected' : '' }}>❌ Ocupado</option>
                    <option value="reservado"   {{ isset($asiento) && $asiento->estado === 'reservado' ? 'selected' : '' }}>🟡 Reservado</option>
                    <option value="inhabilitado"{{ isset($asiento) && $asiento->estado === 'inhabilitado' ? 'selected' : '' }}>🔧 Inhabilitado</option>
                </select>
            </div>

            <div class="form-actions">
                <button type="button" class="btn-cancel" id="cancelAsientoForm">Cancelar</button>
                <button type="submit" class="btn-submit">
                    {{ $modo === 'crear' ? 'Crear Asiento' : 'Guardar Cambios' }}
                </button>
            </div>
        </form>
    </div>
</div>

<script>
// Asegúrate de que el DOM está completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
} else {
    initForm();
}

function initForm() {
    const form = document.getElementById('formAsiento');
    if (!form) {
        console.error('No se encontró el formulario con id formAsiento');
        return;
    }

    console.log('Formulario encontrado, inicializando...');

    const numeroInput = document.getElementById('numero');
    const filaSelect  = document.getElementById('fila');
    const sugerencia  = document.getElementById('sugerencia-asiento');

    function actualizarSugerencia() {
        if (filaSelect && numeroInput && sugerencia) {
            if (filaSelect.value && numeroInput.value) {
                sugerencia.textContent = `Se creará el asiento: ${filaSelect.value}${numeroInput.value}`;
            } else {
                sugerencia.textContent = '';
            }
        }
    }

    if (filaSelect) filaSelect.addEventListener('change', actualizarSugerencia);
    if (numeroInput) numeroInput.addEventListener('input', actualizarSugerencia);
    actualizarSugerencia();

    // Prevenir comportamiento por defecto del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // ¡ESTO ES CRÍTICO!
        e.stopPropagation();
        
        console.log('Enviando formulario...');
        
        const data = new FormData(form);
        const modo = form.dataset.modo;
        const asientoId = form.dataset.asientoId;
        const url = modo === 'crear' 
            ? '/ajax/asientos' 
            : `/ajax/asientos/${asientoId}`;
        const method = modo === 'crear' ? 'POST' : 'PUT';

        // Mostrar loading
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Guardando...';
        submitBtn.disabled = true;

        try {
            console.log('Enviando a:', url, 'método:', method);
            
            const response = await fetch(url, {
                method,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                    'Accept': 'application/json'
                },
                body: data
            });

            const result = await response.json();
            console.log('Respuesta recibida:', result);

            if (response.ok) {
                alert('✅ Asiento guardado correctamente');
                
                // Cerrar este modal
                const modal = document.getElementById('asientoFormModal');
                if (modal) {
                    modal.remove();
                }
                
                // Recargar el modal grande de gestión
                if (window.GestionAsientosModal && window.GestionAsientosModal.recargarModal) {
                    console.log('Recargando modal principal...');
                    window.GestionAsientosModal.recargarModal();
                }
            } else {
                // Si hay errores de validación
                let errorMessage = '❌ Error al guardar el asiento';
                
                if (result.message) {
                    errorMessage = result.message;
                }
                
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat().join('\n');
                    errorMessage = 'Errores de validación:\n' + errorMessages;
                }
                
                alert(errorMessage);
            }
        } catch (err) {
            console.error('Error en la petición:', err);
            alert('❌ Error de conexión con el servidor');
        } finally {
            // Restaurar botón
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Cerrar modal
    const closeBtn = document.getElementById('closeAsientoForm');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const modal = document.getElementById('asientoFormModal');
            if (modal) modal.remove();
        });
    }

    const cancelBtn = document.getElementById('cancelAsientoForm');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            const modal = document.getElementById('asientoFormModal');
            if (modal) modal.remove();
        });
    }

    // Cerrar al clic fuera
    const modalOverlay = document.getElementById('asientoFormModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', e => {
            if (e.target.id === 'asientoFormModal') {
                e.target.remove();
            }
        });
    }
}
</script>