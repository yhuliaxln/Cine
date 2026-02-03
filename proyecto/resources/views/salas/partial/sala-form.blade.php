<!-- resources/views/salas/modals/sala-form.blade.php -->

<style>
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1050;
    }
    .modal-content {
        background: white;
        border-radius: 12px;
        width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    }
    .close-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }
    .modal-title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 24px;
        color: #1e40af;
        text-align: center;
        padding-top: 24px;
    }
    .form-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 0 24px 32px;
    }
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .form-group label {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
    }
    .form-control, .form-select {
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        font-size: 14px;
        width: 100%;
        box-sizing: border-box;
    }
    .info-box {
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 8px;
        padding: 12px;
        font-size: 13px;
        color: #4b5563;
        margin-top: 8px;
    }
    .submit-btn {
        background: #2563eb;
        color: white;
        padding: 12px;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        margin-top: 10px;
        transition: background 0.2s;
    }
    .submit-btn:hover:not(:disabled) {
        background: #1d4ed8;
    }
</style>

<div class="modal-overlay" id="salaModalOverlay">
    <div class="modal-content">
        <button class="close-btn" onclick="closeSalaModal()">✖</button>

        <h2 class="modal-title">
            @if($modalType === 'crear')
                ➕ Crear Nueva Sala
            @else
                ✏️ Editar Sala
            @endif
        </h2>

        <form id="salaForm" class="form-container" 
              onsubmit="handleSalaSubmit(event)">
            
            @csrf
            @if($modalType === 'editar')
                <input type="hidden" name="id" value="{{ $sala->id ?? '' }}">
            @endif

            <div class="form-group">
                <label>Nombre de la Sala *</label>
                <input type="text" name="nombre" class="form-control" required
                       value="{{ old('nombre', $sala->nombre ?? '') }}"
                       placeholder="Ej: Sala 1, Sala Premium, Sala IMAX">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Capacidad *</label>
                    <input type="number" name="capacidad" class="form-control" required min="1" max="500"
                           value="{{ old('capacidad', $sala->capacidad ?? '') }}"
                           placeholder="Ej: 120">
                </div>

                <div class="form-group">
                    <label>Tipo de Sala *</label>
                    <select name="tipo" class="form-select" required>
                        <option value="2D"   {{ old('tipo', $sala->tipo ?? '') === '2D' ? 'selected' : '' }}>🎬 2D - Sala Estándar</option>
                        <option value="3D"   {{ old('tipo', $sala->tipo ?? '') === '3D' ? 'selected' : '' }}>👓 3D - Sala 3D</option>
                        <option value="IMAX" {{ old('tipo', $sala->tipo ?? '') === 'IMAX' ? 'selected' : '' }}>🎥 IMAX - Pantalla Gigante</option>
                        <option value="VIP"  {{ old('tipo', $sala->tipo ?? '') === 'VIP' ? 'selected' : '' }}>⭐ VIP - Sala Premium</option>
                    </select>
                </div>
            </div>

            <div class="info-box">
                <p style="margin:0;">
                    <strong>Nota:</strong> Después de crear la sala, podrás agregar y configurar los asientos uno por uno.
                </p>
            </div>

            <button type="submit" class="submit-btn" id="submitSalaBtn">
                @if($modalType === 'crear')
                    Crear Sala
                @else
                    Actualizar Sala
                @endif
            </button>
        </form>
    </div>
</div>

<script>
function closeSalaModal() {
    const overlay = document.getElementById('salaModalOverlay');
    if (overlay) overlay.remove();
}

async function handleSalaSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('salaForm');
    const submitBtn = document.getElementById('submitSalaBtn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Guardando...';

    try {
        const formData = new FormData(form);
        const isEdit = '{{ $modalType }}' === 'editar';
        const url = isEdit 
            ? '/ajax/salas/' + formData.get('id') 
            : '/ajax/salas';
        
        const method = isEdit ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json'
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al guardar la sala');
        }

        alert(isEdit ? 'Sala actualizada exitosamente' : 'Sala creada exitosamente');
        closeSalaModal();
        
        // Refrescar la lista principal
        if (typeof window.actualizarListaSalas === 'function') {
            window.actualizarListaSalas();
        }

    } catch (error) {
        console.error(error);
        alert('Error: ' + (error.message || 'Verifique los datos e intente nuevamente'));
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}
</script>