@extends('layouts.app')

@section('title', 'Crear Nueva Película')

@section('content')
<style>
    .custom-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1050;
    }
    .custom-modal {
        background: white;
        border-radius: 12px;
        width: 700px;
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
        z-index: 10;
    }
    .modal-title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 24px;
        color: #1e40af;
        text-align: center;
        padding-top: 24px;
    }
    .form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 0 24px 24px;
    }
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }
    .form-group label {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 6px;
        display: block;
    }
    .form-control, .form-select, textarea {
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        font-size: 14px;
        width: 100%;
        box-sizing: border-box;
    }
    textarea {
        resize: vertical;
        min-height: 80px;
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
    .submit-btn:disabled {
        background: #9ca3af;
        cursor: not-allowed;
    }
    .checkbox-label {
        display: flex;
        align-items: center;
        font-weight: 600;
        color: #374151;
        cursor: pointer;
    }
    .form-group input[type="checkbox"] {
        width: 16px;
        height: 16px;
        margin-right: 8px;
    }
</style>

<div id="peliculaModalOverlay" class="custom-modal-overlay">
    <div class="custom-modal">
        <button class="close-btn" onclick="closeModal()">✖</button>

        <h2 class="modal-title">
            ➕ Crear Nueva Película
        </h2>

        <form id="peliculaForm" action="{{ route('peliculas.store') }}" method="POST" enctype="multipart/form-data" class="form" onsubmit="handleSubmit(event)">
            @csrf

            <div class="form-row">
                <div class="form-group">
                    <label>Título *</label>
                    <input type="text" name="titulo" class="form-control" required 
                        placeholder="Ej: Avengers: Endgame">
                </div>
                
                <div class="form-group">
                    <label>Duración (min) *</label>
                    <input type="number" name="duracion" class="form-control" required min="1"
                        placeholder="Ej: 180">
                </div>
            </div>

            <div class="form-group">
                <label>Descripción</label>
                <textarea name="descripcion" class="form-control" 
                    placeholder="Sinopsis de la película..."
                    rows="3"></textarea>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Género *</label>
                    <input type="text" name="genero" class="form-control" required
                        placeholder="Ej: Acción, Drama, Comedia">
                </div>
                
                <div class="form-group">
                    <label>Clasificación</label>
                    <select name="clasificacion" class="form-select">
                        <option value="">Seleccionar</option>
                        <option value="ATP">ATP (Apta Todo Público)</option>
                        <option value="+7">+7</option>
                        <option value="+12">+12</option>
                        <option value="+15">+15</option>
                        <option value="+18">+18</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Fecha de Estreno</label>
                    <input type="date" name="fecha_estreno" class="form-control">
                </div>
                
                <div class="form-group">
                    <label>URL Tráiler (YouTube) (opcional)</label>
                    <input type="url" name="url_trailer" class="form-control" 
                        placeholder="https://youtube.com/watch?v=...">
                </div>
            </div>

            <div class="form-group">
                <label>Póster (archivo)</label>
                <input type="file" name="url_poster" accept="image/*" class="form-control">
            </div>

            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" name="en_cartelera">
                    En cartelera actualmente
                </label>
            </div>

            <button type="submit" class="submit-btn" id="submitPeliculaBtn">
                Crear Película
            </button>
        </form>
    </div>
</div>

<script>
function closeModal() {
    document.getElementById('peliculaModalOverlay').remove();
}

async function handleSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('peliculaForm');
    const submitBtn = document.getElementById('submitPeliculaBtn');
    const originalText = submitBtn.innerHTML;
    
    // Deshabilitar botón y mostrar estado de carga
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Guardando...';
    
    try {
        const formData = new FormData(form);
        
        // Enviar la solicitud - USAR LA RUTA CORRECTA
        const response = await fetch('{{ route("peliculas.ajax.store") }}', {  // CAMBIA ESTO
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json'
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al guardar la película');
        }
        
        // Éxito: cerrar modal y mostrar mensaje
        alert('Película creada exitosamente');
        closeModal();
        
        // Actualizar la lista de películas
        if (typeof window.actualizarListaPeliculas === 'function') {
            window.actualizarListaPeliculas();
        } else {
            // Recargar la página si no existe la función
            window.location.reload();
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message || 'Verifique los datos e intente nuevamente'}`);
    } finally {
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}
</script>
@endsection