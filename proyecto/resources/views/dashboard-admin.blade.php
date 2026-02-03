@extends('layouts.app')

@section('title', 'Panel Administrador - Cine')

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

    <!-- NAVBAR (debajo del header, como barra horizontal) -->
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
            <a href="{{ url('/salas') }}" 
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
                <h2 style="font-size: 30px; font-weight: bold; margin: 0;">Películas en Cartelera</h2>
                <button id="nuevaFuncionBtn" class="btn btn-primary" style="padding: 10px 20px; font-weight: 600;">
                    ➕ Nueva función
                </button>
            </div>

            <!-- Contenedor de tarjetas -->
            <div id="funciones-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando cartelera...</span>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- MODAL VENTA DE TICKET (igual que en empleado) -->
    <div class="modal fade" id="ventaModal" tabindex="-1" aria-labelledby="ventaModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ventaModalLabel">Vender Ticket</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="ventaModalBody">
                    <div class="text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-2">Cargando formulario...</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL CREAR NUEVA FUNCIÓN -->
    <div class="modal fade" id="crearFuncionModal" tabindex="-1" aria-labelledby="crearFuncionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="crearFuncionModalLabel">➕ Crear Nueva Función</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="crearFuncionBody">
                    <div class="text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-2">Cargando formulario...</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                </div>
            </div>
        </div>
    </div>

</div>
@endsection

@push('scripts')
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
$(document).ready(function() {
    console.log('Dashboard Administrador cargado correctamente');

    cargarFunciones();

    function cargarFunciones() {
        console.log('Iniciando petición AJAX...');

        $.ajax({
            url: '{{ route("funciones.ajax.index") }}',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log('Respuesta recibida:', response);

                let html = '';

                if (!Array.isArray(response) || response.length === 0) {
                    html = '<div class="text-center py-5 alert alert-info">No hay funciones programadas. ¡Crea tu primera función!</div>';
                } else {
                    response.forEach(function(funcion) {
                        let poster = 'https://placehold.co/160x210?text=Sin+Poster';
                        if (funcion.pelicula && funcion.pelicula.url_poster) {
                            poster = '{{ asset("storage") }}' + funcion.pelicula.url_poster.replace(/^\/storage/, '');
                        }

                        let titulo = funcion.pelicula?.titulo || 'Sin título';
                        let sala = funcion.sala?.nombre || 'Sin sala';
                        let tipoSala = funcion.sala?.tipo ? ' • ' + funcion.sala.tipo : '';
                        let fechaHora = funcion.fecha_hora_inicio 
                            ? new Date(funcion.fecha_hora_inicio).toLocaleString('es-CO', { 
                                dateStyle: 'medium', timeStyle: 'short' 
                              }) 
                            : 'Sin fecha';
                        let precio = parseFloat(funcion.precio || 0).toLocaleString('es-CO', {
                            style: 'currency', currency: 'COP'
                        });

                        html += `
                            <div style="border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; background-color: #fff; margin-bottom: 24px;">
                                <div style="display: flex; gap: 32px; align-items: flex-start;">
                                    <img src="${poster}" 
                                         alt="${titulo}" 
                                         style="width: 160px; height: 210px; object-fit: cover; border-radius: 6px;">
                                    <div style="flex: 1;">
                                        <h2 style="margin: 0 0 12px 0; font-size: 35px; font-weight: 700;">
                                            ${titulo}
                                        </h2>
                                        <p style="margin: 0 0 6px 0; font-size: 20px;">
                                            <strong>Sala:</strong> ${sala}${tipoSala}
                                        </p>
                                        <p style="margin: 0 0 6px 0; font-size: 20px;">
                                            <strong>Hora:</strong> ${fechaHora}
                                        </p>
                                        <p style="margin: 0 0 6px 0; font-size: 20px;">
                                            <strong>Precio:</strong> ${precio}
                                        </p>
                                        <button class="vender-btn btn btn-primary" 
                                                data-funcion-id="${funcion.id}"
                                                style="margin-top: 8px; padding: 12px 24px; font-size: 18px; font-weight: 600;">
                                            🎟️ Vender ticket
                                        </button>
                                    </div>
                                </div>
                            </div>`;
                    });
                }

                console.log('HTML generado. Funciones renderizadas:', response.length);
                $('#funciones-grid').html(html);
            },
            error: function(xhr, status, error) {
                console.error('Error AJAX:', status, error);
                $('#funciones-grid').html('<div class="alert alert-danger text-center">Error al cargar la cartelera</div>');
            }
        });
    }

    // Botón Nueva Función (abre modal)
    $('#nuevaFuncionBtn').on('click', function() {
        console.log('Abriendo modal para crear nueva función');

        $('#crearFuncionBody').html(`
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2">Cargando formulario...</p>
            </div>
        `);

        // Cargar películas y salas en paralelo
        Promise.all([
            $.get('{{ route("peliculas.ajax.index") }}'),
            $.get('{{ route("salas.ajax.index") }}')
        ]).then(([peliculas, salas]) => {
            let peliOptions = '<option value="">Selecciona película</option>';
            peliculas.forEach(p => {
                peliOptions += `<option value="${p.id}">${p.titulo}</option>`;
            });

            let salaOptions = '<option value="">Selecciona sala</option>';
            salas.forEach(s => {
                salaOptions += `<option value="${s.id}">${s.nombre} (${s.tipo})</option>`;
            });

            $('#crearFuncionBody').html(`
                <form id="crearFuncionForm">
                    <div class="mb-3">
                        <label class="form-label">Película</label>
                        <select class="form-select" name="pelicula_id" required>
                            ${peliOptions}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Sala</label>
                        <select class="form-select" name="sala_id" required>
                            ${salaOptions}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Fecha y Hora de inicio</label>
                        <input type="datetime-local" class="form-control" name="fecha_hora_inicio" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Precio</label>
                        <input type="number" class="form-control" name="precio" step="0.01" min="0" required>
                    </div>
                    <button type="submit" class="btn btn-success w-100">Crear Función</button>
                </form>
            `);
        }).catch(err => {
            console.error('Error cargando datos:', err);
            $('#crearFuncionBody').html('<div class="alert alert-danger">Error al cargar películas/salas</div>');
        });

        $('#crearFuncionModal').modal('show');
    });

    // Vender ticket (igual que en empleado)
    $(document).on('click', '.vender-btn', function() {
        const funcionId = $(this).data('funcion-id');
        console.log('Cargando formulario de venta para función:', funcionId);

        $('#ventaModalBody').html(`
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2">Cargando formulario...</p>
            </div>
        `);

        $.ajax({
            url: '{{ url("/ventas/ticket") }}/' + funcionId,
            method: 'GET',
            success: function(html) {
                $('#ventaModalBody').html(html);
            },
            error: function() {
                $('#ventaModalBody').html('<div class="alert alert-danger">Error al cargar el formulario de venta</div>');
            }
        });

        $('#ventaModal').modal('show');
    });
});
</script>
@endpush