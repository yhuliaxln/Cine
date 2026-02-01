@extends('layouts.app')

@section('title', 'Panel Empleado - Cine')

@section('content')
<div style="min-height: 100vh; background-color: #e5e7eb;">

    <!-- HEADER -->
    <header style="background-color: #1e40af; color: #fff; padding: 16px;">
        <div style="max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
            <h1 style="font-size: 24px; margin: 0;">🎬 Cine - Panel Empleado</h1>
            <div style="display: flex; gap: 16px; align-items: center;">
                <span>Bienvenid@, {{ Auth::user()->name ?? Auth::user()->email ?? 'Empleado' }}</span>
                <form action="{{ route('logout') }}" method="POST" style="margin: 0;">
                    @csrf
                    <button type="submit" style="background-color: #dc2626; color: #fff; padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer;">
                        Cerrar sesión
                    </button>
                </form>
            </div>
        </div>
    </header>

    <!-- CONTENIDO PRINCIPAL -->
    <main style="max-width: 1280px; margin: 0 auto; padding: 32px;">
        <div style="background-color: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
            <h2 style="font-size: 30px; font-weight: bold; margin-bottom: 32px;">Películas en Cartelera</h2>

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

    <!-- MODAL PARA VENDER TICKET -->
    <div class="modal fade" id="ventaModal" tabindex="-1" aria-labelledby="ventaModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ventaModalLabel">Vender Ticket</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="ventaModalBody">
                    <div class="text-center py-5">
                        <h4>Formulario de venta</h4>
                        <p>Se cargará aquí el formulario para la función seleccionada...</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
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
    console.log('Dashboard cargado correctamente');

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

                // Si no es array o está vacío
                if (!Array.isArray(response) || response.length === 0) {
                    html = '<div class="text-center py-5 alert alert-info">No hay funciones disponibles en este momento.</div>';
                } else {
                    response.forEach(function(funcion) {
                        // Poster seguro
                        let poster = 'https://via.placeholder.com/300x450?text=Sin+Poster';
                        if (funcion.pelicula && funcion.pelicula.url_poster) {
                            poster = '{{ asset("") }}' + funcion.pelicula.url_poster;
                        }

                        // Título seguro
                        let titulo = funcion.pelicula?.titulo || 'Sin título';

                        // Sala segura
                        let sala = funcion.sala?.nombre || 'Sin sala';
                        let tipoSala = funcion.sala?.tipo ? ' • ' + funcion.sala.tipo : '';

                        // Fecha segura
                        let fechaHora = funcion.fecha_hora_inicio 
                            ? new Date(funcion.fecha_hora_inicio).toLocaleString('es-CO', { 
                                dateStyle: 'medium', timeStyle: 'short' 
                              }) 
                            : 'Sin fecha';

                        // Precio seguro
                        let precio = parseFloat(funcion.precio || 0).toLocaleString('es-CO', {
                            style: 'currency', currency: 'COP'
                        });

                        html += `
                            <div class="card h-100 shadow-sm">
                                <img src="${poster}" class="card-img-top" alt="${titulo}" style="height: 350px; object-fit: cover;">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">${titulo}</h5>
                                    <p class="card-text text-muted small mb-1">${sala}${tipoSala}</p>
                                    <p class="card-text mb-2"><strong>Fecha/Hora:</strong> ${fechaHora}</p>
                                    <p class="card-text mb-3"><strong>Precio:</strong> ${precio}</p>
                                    <div class="mt-auto">
                                        <button class="btn btn-primary w-100 vender-btn" data-funcion-id="${funcion.id}">
                                            Vender Ticket
                                        </button>
                                    </div>
                                </div>
                            </div>`;
                    });
                }

                console.log('HTML generado con éxito. Longitud:', html.length);
                $('#funciones-grid').html(html);
            },
            error: function(xhr, status, error) {
                console.error('Error en AJAX:', status, error);
                console.log('Respuesta del servidor:', xhr.responseText);

                $('#funciones-grid').html(`
                    <div class="alert alert-danger text-center">
                        Error al cargar la cartelera<br>
                        <small>${status} - ${error}</small>
                    </div>
                `);
            }
        });
    }

    // Abrir modal al vender
    $(document).on('click', '.vender-btn', function() {
        const id = $(this).data('funcion-id');
        console.log('Vender ticket para función ID:', id);

        $('#ventaModalBody').html(`
            <div class="text-center py-5">
                <h4>Venta de ticket para función #${id}</h4>
                <p>Formulario completo se cargará aquí...</p>
            </div>
        `);

        $('#ventaModal').modal('show');
    });
});
</script>
@endpush