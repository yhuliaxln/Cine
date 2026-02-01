<div>
    <h1 style="font-size: 26px; font-weight: 700; margin-bottom: 12px;">
        🎟️ Venta de Ticket
    </h1>

    <!-- INFO DE LA FUNCIÓN -->
    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="font-size: 22px; margin-bottom: 8px;">
            {{ $funcion->pelicula->titulo ?? 'Sin título' }}
        </h2>

        <p><strong>Sala:</strong> {{ $funcion->sala->nombre ?? 'No disponible' }} ({{ $funcion->sala->tipo ?? '' }})</p>
        <p>
            <strong>Hora:</strong> 
            {{ $funcion->fecha_hora_inicio ? $funcion->fecha_hora_inicio->format('d/m/Y H:i') : 'No disponible' }}
        </p>
        <p><strong>Precio:</strong> ${{ number_format($funcion->precio, 0) }}</p>
    </div>

    <!-- PANTALLA DEL CINE -->
    <div style="width: 100%; height: 40px; background: #d1d5db; border-radius: 0 0 80% 80%; text-align: center; font-weight: 600; line-height: 40px; margin-bottom: 24px;">
        PANTALLA
    </div>

    <!-- ASIENTOS -->
    <div id="asientos-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;">
        <div class="text-center py-4 col-span-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Cargando asientos...</p>
        </div>
    </div>

    <!-- CONFIRMAR VENTA -->
    <div id="confirmacion-venta" style="margin-top: 24px; text-align: center; display: none;">
        <button id="confirmarVentaBtn" class="btn btn-primary" style="padding: 14px 32px; font-size: 18px; font-weight: 600;">
            Confirmar Venta – ${{ number_format($funcion->precio, 0) }}
        </button>
    </div>

    <!-- MENSAJES -->
    <div id="mensaje-venta" class="mt-4 text-center" style="min-height: 40px;"></div>
</div>

<script>
$(document).ready(function() {
    const funcionId = {{ $funcion->id }};
    let selectedAsientoId = null;

    // Cargar asientos de la sala
    $.ajax({
        url: '{{ route("asientos.ajax.index") }}',
        method: 'GET',
        data: { sala_id: {{ $funcion->sala_id }} },
        success: function(asientos) {
            let html = '';

            asientos.forEach(function(asiento) {
                const disponible = asiento.estado === 'disponible';
                const color = disponible ? '#bbf7d0' : '#d1d5db';
                const cursor = disponible ? 'pointer' : 'not-allowed';

                html += `
                    <button class="asiento-btn" 
                            data-asiento-id="${asiento.id}"
                            ${disponible ? '' : 'disabled'}
                            style="padding: 12px; border-radius: 6px; font-weight: 600; background: ${color}; border: none; cursor: ${cursor};">
                        ${asiento.fila}-${asiento.numero}
                    </button>`;
            });

            $('#asientos-grid').html(html);
        },
        error: function(xhr) {
            console.error('Error cargando asientos:', xhr);
            $('#asientos-grid').html('<div class="alert alert-danger">Error al cargar asientos</div>');
        }
    });

    // Seleccionar asiento
    $(document).on('click', '.asiento-btn:not(:disabled)', function() {
        $('.asiento-btn').css('background', '#bbf7d0');
        $(this).css('background', '#16a34a');
        selectedAsientoId = $(this).data('asiento-id');
        $('#confirmacion-venta').show();
    });

    // Confirmar venta
    $(document).on('click', '#confirmarVentaBtn', function() {
        if (!selectedAsientoId) return;

        $.ajax({
            url: '{{ route("tickets.ajax.store") }}',
            method: 'POST',
            data: {
                _token: '{{ csrf_token() }}',
                funcion_id: funcionId,
                asiento_id: selectedAsientoId,
                precio: {{ $funcion->precio }},
                estado: 'vendido',
                metodo_pago: 'efectivo'
            },
            success: function(res) {
                $('#mensaje-venta').html('<p style="color: green; font-weight: bold;">¡Ticket vendido con éxito!</p>');
                $('#confirmacion-venta').hide();

                // Actualizar asiento a gris (ocupado)
                $(`.asiento-btn[data-asiento-id="${selectedAsientoId}"]`)
                    .css('background', '#d1d5db')
                    .prop('disabled', true);

                setTimeout(() => $('#ventaModal').modal('hide'), 2000);
            },
            error: function(xhr) {
                console.log(xhr.responseJSON);
                const msg = xhr.responseJSON?.message || 'Error al vender el ticket';
                $('#mensaje-venta').html(`<p style="color: red; font-weight: bold;">${msg}</p>`);
            }
        });
    });
});
</script>