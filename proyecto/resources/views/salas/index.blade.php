<!-- resources/views/salas/index.blade.php -->
@extends('layouts.app')

@section('title', 'Gestión de Salas')

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
                    <button type="submit" style="background-color: #dc2626; color: #fff; padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-weight: 500;">
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
            <a href="{{ route('peliculas.index') }}" 
               style="padding: 10px 16px; border-radius: 8px; text-decoration: none; color: #4b5563; font-weight: 500; {{ request()->is('peliculas*') ? 'background-color: #eff6ff; color: #1e40af; font-weight: 600;' : '' }}">
                🎬 Películas
            </a>
            <a href="{{ route('salas.index') }}" 
               style="padding: 10px 16px; border-radius: 8px; text-decoration: none; color: #4b5563; font-weight: 500; {{ request()->is('salas*') ? 'background-color: #eff6ff; color: #1e40af; font-weight: 600;' : '' }}">
                🎭 Salas
            </a>
            <a href="#" style="padding: 10px 16px; border-radius: 8px; text-decoration: none; color: #4b5563; font-weight: 500;">
                👥 Usuarios
            </a>
            <a href="#" style="padding: 10px 16px; border-radius: 8px; text-decoration: none; color: #4b5563; font-weight: 500;">
                📊 Reportes
            </a>
        </div>
    </nav>

    <!-- CONTENIDO -->
    <main style="max-width: 1280px; margin: 0 auto; padding: 32px;">
        <div style="background-color: #fff; border-radius: 12px; padding: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                <div>
                    <h2 style="font-size: 30px; font-weight: bold; margin: 0;">Gestión de Salas</h2>
                    <p style="font-size: 14px; color: #6b7280; margin: 4px 0 0;">Administra las salas del cine</p>
                </div>
                <button id="btnNuevaSala" style="background-color: #2563eb; color: white; padding: 10px 18px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                    ➕ Nueva Sala
                </button>
            </div>

            <div id="salas-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 24px;">
                <div class="text-center py-5" style="grid-column: 1 / -1;">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-3">Cargando salas...</p>
                </div>
            </div>

            <div id="empty-state" style="display: none; grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <p style="font-size: 18px; color: #6b7280;">
                    No hay salas registradas. ¡Agrega tu primera sala!
                </p>
            </div>
        </div>
    </main>

</div>

<!-- Contenedor donde se insertarán los modales -->
<div id="modals-container"></div>
@endsection

@push('scripts')
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<script>
// Variables globales
let currentSalaId = null;

$(document).ready(function() {
    cargarSalas();

    // Botón Nueva Sala
    $(document).on('click', '#btnNuevaSala', function() {
        cargarModalSala('crear', null);
    });

    // Delegación de eventos para botones dinámicos
    $(document).on('click', '.btn-editar-sala', function() {
        const sala = $(this).data('sala');
        cargarModalSala('editar', sala);
    });

    $(document).on('click', '.btn-asientos-sala', function() {
        const sala = $(this).data('sala');
        cargarModalGestionAsientos(sala);
    });

    $(document).on('click', '.btn-eliminar-sala', function() {
        const id = $(this).data('id');
        if (confirm('¿Estás seguro de eliminar esta sala? Esta acción no se puede deshacer.')) {
            eliminarSala(id);
        }
    });
});

function cargarSalas() {
    $.ajax({
        url: '{{ route("salas.ajax.index") }}',
        method: 'GET',
        success: function(salas) {
            let html = '';

            if (salas.length === 0) {
                $('#salas-grid').hide();
                $('#empty-state').show();
                return;
            }

            $('#salas-grid').show();
            $('#empty-state').hide();

            salas.forEach(sala => {
                const icono = sala.tipo === 'VIP' ? '⭐' :
                              sala.tipo === 'IMAX' ? '🎥' :
                              sala.tipo === '3D' ? '👓' : '🎬';

                html += `
                <div style="background:#f9fafb; border-radius:12px; padding:20px; border:1px solid #e5e7eb;">
                    <div style="display:flex; gap:16px; align-items:flex-start;">
                        <div style="width:60px; height:60px; border-radius:8px; background:#dbeafe; display:flex; align-items:center; justify-content:center; font-size:24px;">
                            ${icono}
                        </div>
                        <div style="flex:1;">
                            <h3 style="font-size:18px; font-weight:bold; margin:0 0 8px;">${sala.nombre}</h3>
                            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px;">
                                <span style="background:#fef3c7; color:#92400e; padding:4px 8px; border-radius:4px; font-size:12px;">${sala.tipo}</span>
                                <span style="background:#d1fae5; color:#065f46; padding:4px 8px; border-radius:4px; font-size:12px;">${sala.capacidad} asientos</span>
                            </div>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:13px; margin-bottom:12px;">
                                <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #f3f4f6;">
                                    <span style="color:#6b7280;">Tipo:</span><span>${sala.tipo}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #f3f4f6;">
                                    <span style="color:#6b7280;">Capacidad:</span><span>${sala.capacidad} asientos</span>
                                </div>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <button class="btn-asientos-sala" data-sala='${JSON.stringify(sala)}'
                                    style="flex:1; background:#8b5cf6; color:white; padding:8px; border:none; border-radius:6px; font-size:13px;">
                                    💺 Asientos
                                </button>
                                <button class="btn-editar-sala" data-sala='${JSON.stringify(sala)}'
                                    style="flex:1; background:#3b82f6; color:white; padding:8px; border:none; border-radius:6px; font-size:13px;">
                                    ✏️ Editar
                                </button>
                                <button class="btn-eliminar-sala" data-id="${sala.id}"
                                    style="flex:1; background:#ef4444; color:white; padding:8px; border:none; border-radius:6px; font-size:13px;">
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
            });

            $('#salas-grid').html(html);
        },
        error: function() {
            $('#salas-grid').html('<div class="alert alert-danger">Error al cargar las salas</div>');
        }
    });
}

function cargarModalSala(tipo, sala = null) {
    $.ajax({
        url: tipo === 'crear' ? '{{ route("salas.create") }}' : '{{ url("/salas") }}/' + (sala ? sala.id : '') + '/edit',
        method: 'GET',
        success: function(html) {
            $('#modals-container').html(html);
        },
        error: function() {
            alert('Error al cargar el formulario de sala');
        }
    });
}

function cargarModalGestionAsientos(sala) {
    $.ajax({
        url: '/salas/' + sala.id + '/gestion-asientos',
        method: 'GET',
        success: function(html) {
            $('#modals-container').html(html);
        },
        error: function(xhr) {
            console.log(xhr);
            alert('Error al cargar gestión de asientos');
        }
    });
}

function eliminarSala(id) {
    $.ajax({
        url: '{{ url("/ajax/salas") }}/' + id,
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function() {
            alert('Sala eliminada correctamente');
            cargarSalas();
        },
        error: function(xhr) {
            alert('Error al eliminar: ' + (xhr.responseJSON?.message || 'Intenta nuevamente'));
        }
    });
}

// Función global para que los modales puedan refrescar la lista
window.actualizarListaSalas = function() {
    cargarSalas();
};
</script>
@endpush