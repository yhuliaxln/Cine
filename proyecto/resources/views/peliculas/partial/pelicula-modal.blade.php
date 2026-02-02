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
    .image-section {
        background: #f9fafb;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        margin: 0 24px;
    }
    .section-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #374151;
    }
    .upload-placeholder {
        border: 2px dashed #d1d5db;
        border-radius: 8px;
        padding: 32px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
        display: block;
    }
    .upload-placeholder:hover {
        border-color: #2563eb;
        background: #eff6ff;
    }
    .upload-icon { font-size: 48px; color: #9ca3af; margin-bottom: 12px; }
    .upload-text strong { font-weight: 600; }
    .image-preview-container {
        position: relative;
        display: inline-block;
        width: 100%;
        text-align: center;
    }
    .image-preview {
        max-width: 200px;
        max-height: 300px;
        border-radius: 8px;
        object-fit: contain;
        border: 1px solid #e5e7eb;
    }
    .image-actions {
        margin-top: 12px;
        display: flex;
        gap: 8px;
        justify-content: center;
    }
    .btn.blue {
        background: #3b82f6;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
    }
    .btn.red {
        background: #ef4444;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
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
    .form-control:disabled {
        background: #f3f4f6;
        cursor: not-allowed;
        color: #6b7280;
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
    .hint {
        font-size: 13px;
        color: #6b7280;
        text-align: center;
        margin-top: 12px;
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
    .url-trailer-group {
        margin-top: 8px;
    }
</style>

<div id="peliculaModalOverlay" class="custom-modal-overlay">
    <div class="custom-modal">
        <button class="close-btn" onclick="closeModal()">✖</button>

        <h2 class="modal-title">
            @if($modalType === 'crear')
                ➕ Crear Nueva Película
            @else
                ✏️ Editar Película
            @endif
        </h2>

        <form id="peliculaForm" enctype="multipart/form-data" class="form" onsubmit="handleSubmit(event)">
            <!-- Sección de imagen del poster -->
            <div class="image-section">
                <h3 class="section-title">Poster de la Película</h3>
                
                <div id="posterArea">
                    @if(isset($peliculaEditando) && $peliculaEditando->url_poster)
                        <div class="image-preview-container">
                            <img src="{{ $peliculaEditando->url_poster }}" id="posterPreview" class="image-preview" 
                                onerror="this.onerror=null; this.style.display='none';">
                            <div class="image-actions">
                                <label class="btn blue">
                                    🔄 Cambiar
                                    <input type="file" name="url_poster" hidden accept="image/*" onchange="handlePosterChange(this)">
                                </label>
                                <button type="button" class="btn red" onclick="removePoster()">
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    @else
                        <label class="upload-placeholder" id="uploadLabel">
                            <input type="file" id="posterFile" name="url_poster" hidden accept="image/*" onchange="handlePosterChange(this)">
                            <div class="upload-icon">📁</div>
                            <div style="margin-top: 8px;">
                                <p style="font-weight: 600; margin-bottom: 4px;">Seleccionar Poster</p>
                                <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
                                    Haga clic para seleccionar una imagen de su computadora
                                </p>
                                <p style="font-size: 11px; color: #9ca3af;">
                                    Formatos: JPG, PNG • Máx: 5MB
                                </p>
                            </div>
                        </label>
                    @endif
                </div>

                <p class="hint">
                    <strong>Nota:</strong> Solo puedes subir un archivo de imagen. Si ya tienes una URL, deberás descargar la imagen primero.
                </p>
            </div>

            <!-- Campos del formulario -->
            <div class="form-row">
                <div class="form-group">
                    <label>Título *</label>
                    <input type="text" name="titulo" class="form-control" required 
                        value="{{ $peliculaEditando->titulo ?? '' }}" 
                        placeholder="Ej: Avengers: Endgame">
                </div>
                
                <div class="form-group">
                    <label>Duración (min) *</label>
                    <input type="number" name="duracion" class="form-control" required min="1"
                        value="{{ $peliculaEditando->duracion ?? '' }}" 
                        placeholder="Ej: 180">
                </div>
            </div>

            <div class="form-group">
                <label>Descripción</label>
                <textarea name="descripcion" class="form-control" 
                    placeholder="Sinopsis de la película..."
                    rows="3">{{ $peliculaEditando->descripcion ?? '' }}</textarea>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Género *</label>
                    <input type="text" name="genero" class="form-control" required
                        value="{{ $peliculaEditando->genero ?? '' }}" 
                        placeholder="Ej: Acción, Drama, Comedia">
                </div>
                
                <div class="form-group">
                    <label>Clasificación</label>
                    <select name="clasificacion" class="form-select">
                        <option value="">Seleccionar</option>
                        <option value="ATP" {{ (isset($peliculaEditando) && $peliculaEditando->clasificacion == 'ATP') ? 'selected' : '' }}>ATP (Apta Todo Público)</option>
                        <option value="+7" {{ (isset($peliculaEditando) && $peliculaEditando->clasificacion == '+7') ? 'selected' : '' }}>+7</option>
                        <option value="+12" {{ (isset($peliculaEditando) && $peliculaEditando->clasificacion == '+12') ? 'selected' : '' }}>+12</option>
                        <option value="+15" {{ (isset($peliculaEditando) && $peliculaEditando->clasificacion == '+15') ? 'selected' : '' }}>+15</option>
                        <option value="+18" {{ (isset($peliculaEditando) && $peliculaEditando->clasificacion == '+18') ? 'selected' : '' }}>+18</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Fecha de Estreno</label>
                    @php
                        $fechaEstreno = '';
                        if (isset($peliculaEditando) && $peliculaEditando->fecha_estreno) {
                            $fechaEstreno = date('Y-m-d', strtotime($peliculaEditando->fecha_estreno));
                        }
                    @endphp
                    <input type="date" name="fecha_estreno" class="form-control" 
                        value="{{ $fechaEstreno }}">
                </div>
                
                <div class="form-group url-trailer-group">
                    <label>URL Tráiler (YouTube) (opcional)</label>
                    <input type="url" name="url_trailer" class="form-control" 
                        value="{{ $peliculaEditando->url_trailer ?? '' }}" 
                        placeholder="https://youtube.com/watch?v=...">
                </div>
            </div>

            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" name="en_cartelera" 
                        {{ (isset($peliculaEditando) && $peliculaEditando->en_cartelera) ? 'checked' : '' }}>
                    En cartelera actualmente
                </label>
            </div>

            <input type="hidden" name="id" value="{{ $peliculaEditando->id ?? '' }}">
            <input type="hidden" name="modalType" value="{{ $modalType }}">

            <button type="submit" class="submit-btn" id="submitPeliculaBtn">
                @if($modalType === 'crear')
                    Crear Película
                @else
                    Actualizar Película
                @endif
            </button>
        </form>
    </div>
</div>

<script>
// Estado para controlar si hay archivo seleccionado
let hasFileSelected = false;
let posterFile = null;

function closeModal() {
    document.getElementById('peliculaModalOverlay').remove();
}

function handlePosterChange(input) {
    const file = input.files[0];
    if (file) {
        posterFile = file;
        hasFileSelected = true;
        
        // Crear preview local
        const reader = new FileReader();
        reader.onloadend = function(e) {
            document.getElementById('posterArea').innerHTML = `
                <div class="image-preview-container">
                    <img src="${e.target.result}" id="posterPreview" class="image-preview">
                    <div class="image-actions">
                        <label class="btn blue">
                            🔄 Cambiar
                            <input type="file" name="url_poster" hidden accept="image/*" onchange="handlePosterChange(this)">
                        </label>
                        <button type="button" class="btn red" onclick="removePoster()">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }
}

function removePoster() {
    posterFile = null;
    hasFileSelected = false;
    
    document.getElementById('posterArea').innerHTML = `
        <label class="upload-placeholder" id="uploadLabel">
            <input type="file" id="posterFile" name="url_poster" hidden accept="image/*" onchange="handlePosterChange(this)">
            <div class="upload-icon">📁</div>
            <div style="margin-top: 8px;">
                <p style="font-weight: 600; margin-bottom: 4px;">Seleccionar Poster</p>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
                    Haga clic para seleccionar una imagen de su computadora
                </p>
                <p style="font-size: 11px; color: #9ca3af;">
                    Formatos: JPG, PNG • Máx: 5MB
                </p>
            </div>
        </label>
    `;
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
        
        // Si hay un archivo seleccionado, asegurarse de que se envíe
        if (hasFileSelected && posterFile) {
            formData.append('url_poster', posterFile);
        } else if (form.querySelector('input[name="id"]').value && !hasFileSelected) {
            // Si estamos editando y no se seleccionó nuevo archivo, mantener la URL existente
            const existingPoster = document.getElementById('posterPreview');
            if (existingPoster && existingPoster.src) {
                // Enviamos un indicador de que se mantiene la imagen actual
                formData.append('mantener_poster_actual', '1');
            }
        }
        
        // Manejar el checkbox
        const enCartelera = form.en_cartelera.checked;
        formData.set('en_cartelera', enCartelera ? '1' : '0');
        
        // Determinar la URL y método según el tipo de modal
        const modalType = form.modalType.value;
        const peliculaId = form.id.value;
        
        // ========== RUTAS AJAX CORRECTAS ==========
        let url = '/ajax/peliculas';  // Para crear - usa la ruta AJAX
        let method = 'POST';
        
        if (modalType === 'editar' && peliculaId) {
            url = `/ajax/peliculas/${peliculaId}`;  // Para editar - usa la ruta AJAX
            method = 'PUT';
        }
        // =========================================
        
        // Enviar la solicitud
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
            throw new Error(data.message || 'Error al guardar la película');
        }
        
        // Éxito: cerrar modal y mostrar mensaje
        alert('Película guardada exitosamente');
        closeModal();
        
        // EN LUGAR DE window.location.reload(), usamos una función global
        // para actualizar solo la lista de películas
        if (typeof window.actualizarListaPeliculas === 'function') {
            window.actualizarListaPeliculas();
        } else {
            // Si no existe la función, recargar suavemente manteniendo la posición
            const scrollPosition = window.scrollY || window.pageYOffset;
            window.location.reload();
            window.onload = function() {
                window.scrollTo(0, scrollPosition);
            };
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

// Inicialización: verificar si hay preview inicial
document.addEventListener('DOMContentLoaded', function() {
    const posterPreview = document.getElementById('posterPreview');
    if (posterPreview && posterPreview.src) {
        hasFileSelected = true;
    }
});
</script>