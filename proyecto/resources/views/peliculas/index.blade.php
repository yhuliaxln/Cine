@extends('layouts.app')

@section('title', 'Catálogo de Películas')

@section('content')
<div style="min-height: 100vh; background-color: #e5e7eb;">

    <!-- HEADER -->
    <header style="background-color: #1e40af; color: #fff; padding: 16px;">
        <div style="max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
            <h1 style="font-size: 24px; margin: 0;">🎬 Cine - Panel Administrador</h1>
            <div style="display: flex; gap: 16px; align-items: center;">
                <span>Bienvenid@, {{ Auth::user()->name ?? Auth::user()->email ?? 'Administrador' }}</span>
                <form action="{{ route('logout') }}" method="POST" style="margin: 0;">
                    @csrf
                    <button type="submit" style="background-color: #dc2626; color: #fff; padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer;">
                        Cerrar sesión
                    </button>
                </form>
            </div>
        </div>
    </header>

    <!-- NAVBAR -->
    <nav style="background-color: #ffffff; border-bottom: 1px solid #e5e7eb; padding: 12px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="max-width: 1280px; margin: 0 auto; display: flex; gap: 8px; padding: 0 32px;">
            <a href="{{ url('/dashboard') }}" 
               style="padding: 10px 16px; border-radius: 8px; text-decoration: none; color: #4b5563; font-weight: 500; {{ request()->is('dashboard') ? 'background-color: #eff6ff; color: #1e40af; font-weight: 600;' : '' }}">
                🏠 Inicio
            </a>
            <a href="{{ url('/peliculas') }}" 
               style="padding: 10px 16px; border-radius: 8px; text-decoration: none; color: #4b5563; font-weight: 500; {{ request()->is('peliculas*') ? 'background-color: #eff6ff; color: #1e40af; font-weight: 600;' : '' }}">
                🎬 Películas
            </a>
            <a href="{{ route('salas.index') }}" 
               style="padding: 10px 16px; border-radius: 8px; text-decoration: none; color: #4b5563; font-weight: 500; {{ request()->is('salas*') ? 'background-color: #eff6ff; color: #1e40af; font-weight: 600;' : '' }}">
                🎭 Salas
            </a>
            <a href="#" 
               style="padding: 10px 16px; border-radius: 8px; text-decoration: none; color: #4b5563; font-weight: 500;">
                👥 Usuarios
            </a>
            <a href="#" 
               style="padding: 10px 16px; border-radius: 8px; text-decoration: none; color: #4b5563; font-weight: 500;">
                📊 Reportes
            </a>
        </div>
    </nav>

    <!-- CONTENIDO PRINCIPAL -->
    <main style="max-width: 1280px; margin: 0 auto; padding: 32px;">
        <div style="background-color: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                <h2 style="font-size: 30px; font-weight: bold; margin: 0;">Catálogo de Películas</h2>
                <button id="nuevaPeliculaBtn" class="btn btn-primary" style="padding: 10px 20px; font-weight: 600;">
                    ➕ Nueva Película
                </button>
            </div>

            <!-- Contenedor de tarjetas -->
            <div id="peliculas-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px;">
                <div class="text-center py-5" style="grid-column: 1 / -1;">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-3">Cargando películas...</p>
                </div>
            </div>

            <!-- Mensaje si no hay películas -->
            <div id="empty-state" style="display: none; grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <p style="font-size: 18px; color: #6b7280;">
                    No hay películas registradas. ¡Agrega tu primera película!
                </p>
            </div>
        </div>
    </main>
</div>
@endsection

@push('scripts')
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
$(document).ready(function() {
    console.log('Página de películas cargada');

    cargarPeliculas();

    function cargarPeliculas() {
        $.ajax({
            url: '{{ route("peliculas.ajax.index") }}',
            method: 'GET',
            dataType: 'json',
            success: function(peliculas) {
                let html = '';

                if (peliculas.length === 0) {
                    $('#peliculas-grid').hide();
                    $('#empty-state').show();
                    return;
                }

                $('#peliculas-grid').show();
                $('#empty-state').hide();

                peliculas.forEach(function(pelicula) {
                    let poster = pelicula.url_poster 
                        ? pelicula.url_poster 
                        : 'https://placehold.co/80x120?text=🎬';

                    let enCartelera = pelicula.en_cartelera 
                        ? '<span style="background:#dcfce7; color:#166534; padding:4px 8px; border-radius:4px; font-size:12px;">En Cartelera</span>' 
                        : '';

                    html += `
                        <div style="background:#f9fafb; border-radius:12px; padding:20px; border:1px solid #e5e7eb; transition:all 0.2s;">
                            <div style="display:flex; gap:16px; align-items:flex-start;">
                                <div style="position:relative; width:80px; height:120px;">
                                    <img src="${poster}" alt="${pelicula.titulo}" 
                                         style="width:80px; height:120px; border-radius:8px; object-fit:cover; background:#e5e7eb;">
                                </div>
                                <div style="flex:1;">
                                    <h3 style="font-size:18px; font-weight:bold; margin-bottom:8px; color:#1f2937;">
                                        ${pelicula.titulo}
                                    </h3>
                                    <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;">
                                        <span style="background:#dbeafe; color:#1e40af; padding:4px 8px; border-radius:4px; font-size:12px;">
                                            ${pelicula.genero || 'Sin género'}
                                        </span>
                                        <span style="background:#fef3c7; color:#92400e; padding:4px 8px; border-radius:4px; font-size:12px;">
                                            ${pelicula.clasificacion || 'N/A'}
                                        </span>
                                        ${enCartelera}
                                    </div>
                                    <p style="font-size:14px; color:#4b5563; line-height:1.5; margin-bottom:12px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">
                                        ${pelicula.descripcion || 'Sin descripción'}
                                    </p>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:13px;">
                                        <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #f3f4f6;">
                                            <span style="font-weight:500; color:#6b7280;">Duración:</span>
                                            <span>${pelicula.duracion} min</span>
                                        </div>
                                        <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #f3f4f6;">
                                            <span style="font-weight:500; color:#6b7280;">Estreno:</span>
                                            <span>${pelicula.fecha_estreno || 'No especificado'}</span>
                                        </div>
                                        <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #f3f4f6;">
                                            <span style="font-weight:500; color:#6b7280;">Trailer:</span>
                                            <span>${pelicula.url_trailer ? 'Disponible' : 'No disponible'}</span>
                                        </div>
                                    </div>
                                    <div style="display:flex; gap:8px; margin-top:16px;">
                                        <button class="btnEditar btn btn-sm" 
                                                data-id="${pelicula.id}"
                                                style="flex:1; background:#3b82f6; color:white; border:none; border-radius:6px; padding:8px 12px; font-size:13px;">
                                            ✏️ Editar
                                        </button>
                                        <button class="btnEliminar btn btn-sm" 
                                                data-id="${pelicula.id}"
                                                style="flex:1; background:#ef4444; color:white; border:none; border-radius:6px; padding:8px 12px; font-size:13px;">
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                });

                $('#peliculas-grid').html(html);
            },
            error: function() {
                $('#peliculas-grid').html('<div class="alert alert-danger text-center">Error al cargar películas</div>');
            }
        });
    }

    // Botón Nueva Película - SOLUCIÓN: Usar evento click correcto
    $(document).on('click', '#nuevaPeliculaBtn', function() {
        console.log('Botón Nueva Película clickeado');
        
        $.ajax({
            url: '{{ route("peliculas.create") }}',
            method: 'GET',
            success: function(html) {
                console.log('Modal cargado exitosamente');
                // Insertar el modal en el body
                $('body').append(html);
            },
            error: function(xhr, status, error) {
                console.error('Error al cargar modal:', error);
                alert('Error al cargar el formulario de creación: ' + error);
            }
        });
    });

    // Botón Editar - Delegación de eventos
    $(document).on('click', '.btnEditar', function() {
        const id = $(this).data('id');
        console.log('Editando película ID:', id);
        
        $.ajax({
            url: `/peliculas/${id}/edit`,
            method: 'GET',
            success: function(html) {
                // Insertar el modal en el body
                $('body').append(html);
            },
            error: function(xhr, status, error) {
                console.error('Error al cargar edición:', error);
                alert('Error al cargar la película para editar');
            }
        });
    });

    // Botón Eliminar
    $(document).on('click', '.btnEliminar', function() {
        const id = $(this).data('id');
        
        if (confirm('¿Estás seguro de eliminar esta película?')) {
            $.ajax({
                url: `/ajax/peliculas/${id}`,
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function() {
                    alert('Película eliminada exitosamente');
                    cargarPeliculas(); // Recargar la lista
                },
                error: function() {
                    alert('Error al eliminar la película');
                }
            });
        }
    });
    
    // ========== FUNCIÓN GLOBAL PARA ACTUALIZAR LISTA ==========
    window.actualizarListaPeliculas = function() {
        console.log('Actualizando lista de películas...');
        cargarPeliculas();
    };
    
});
</script>
@endpush