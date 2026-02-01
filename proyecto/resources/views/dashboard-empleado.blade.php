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
                <!-- Las tarjetas se cargarán aquí con AJAX -->
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
                    <!-- Aquí se cargará el contenido de VentaTicket vía AJAX o iframe o componente Blade -->
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
<script>
$(document).ready(function() {

    // Cargar funciones al iniciar
    cargarFunciones();

    // Función para cargar cartelera vía AJAX
    function cargarFunciones() {
        $.ajax({
            url: '{{ route("funciones.ajax.index") }}',
            method: 'GET',
            success: function(response) {
                let html = '';

                if (response.length === 0) {
                    html = '<div class="text-center py-5">No hay funciones disponibles en este momento.</div>';
                } else {
                    response.forEach(funcion => {
                        html += `
                            <div class="card h-100 shadow-sm">
                                <img src="${funcion.pelicula.url_poster ? '{{ asset("") }}' + funcion.pelicula.url_poster : 'https://via.placeholder.com/300x450?text=Sin+Poster'}" 
                                     class="card-img-top" alt="${funcion.pelicula.titulo}" 
                                     style="height: 350px; object-fit: cover;">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">${funcion.pelicula.titulo}</h5>
                                    <p class="card-text text-muted small mb-1">
                                        ${funcion.sala.nombre} • ${funcion.sala.tipo}
                                    </p>
                                    <p class="card-text mb-2">
                                        <strong>Fecha/Hora:</strong> ${new Date(funcion.fecha_hora_inicio).toLocaleString('es-CO')}
                                    </p>
                                    <p class="card-text mb-3">
                                        <strong>Precio:</strong> $${parseFloat(funcion.precio).toFixed(2)}
                                    </p>
                                    <div class="mt-auto">
                                        <button class="btn btn-primary w-100 vender-btn" 
                                                data-funcion-id="${funcion.id}">
                                            Vender Ticket
                                        </button>
                                    </div>
                                </div>
                            </div>`;
                    });
                }

                $('#funciones-grid').html(html);
            },
            error: function() {
                $('#funciones-grid').html('<div class="alert alert-danger text-center">Error al cargar la cartelera</div>');
            }
        });
    }

    // Abrir modal al hacer clic en "Vender Ticket"
    $(document).on('click', '.vender-btn', function() {
        const funcionId = $(this).data('funcion-id');

        $('#ventaModalBody').html(`
            <div class="text-center py-5">
                <h4>Venta de ticket para función #${funcionId}</h4>
                <p>Formulario de venta se cargará aquí...</p>
                <div class="spinner-border text-primary" role="status"></div>
            </div>
        `);

        $('#ventaModal').modal('show');
    });

});
</script>
@endpush