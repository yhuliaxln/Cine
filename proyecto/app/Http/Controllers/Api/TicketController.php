<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\Asientos;
use App\Models\Funciones;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TicketController extends Controller
{
    /**
     * Muestra todos los tickets (GET /api/tickets)
     * Opcional: filtro por ?funcion_id= o ?usuario_id=
     */
    public function index(Request $request): JsonResponse
    {
        $query = Ticket::with(['funcion.pelicula', 'funcion.sala', 'asiento', 'usuario']);

        if ($request->has('funcion_id')) {
            $query->where('funcion_id', $request->funcion_id);
        }
        if ($request->has('usuario_id')) {
            $query->where('usuario_id', $request->usuario_id);
        }

        $tickets = $query->get();

        return response()->json($tickets);
    }

    /**
     * Crea un nuevo ticket (POST /api/tickets) → Venta de boleto
     */
public function store(Request $request): JsonResponse
{
    $validated = $request->validate([
        'funcion_id'    => 'required|exists:funciones,id',
        'asiento_id'    => 'required|exists:asientos,id',
        'precio'        => 'required|numeric|min:0',
        'estado'        => 'sometimes|in:vendido,reservado,reembolsado',
        'metodo_pago'   => 'nullable|string|in:efectivo,tarjeta,transferencia',
        'user_id'       => 'nullable|exists:users,id',
    ]);

    // Debug: ver qué llega validado
    \Log::info('Datos validados para ticket:', $validated);

    $asiento = Asientos::findOrFail($validated['asiento_id']);
    $funcion = Funciones::findOrFail($validated['funcion_id']);

    if ($asiento->sala_id !== $funcion->sala_id) {
        return response()->json(['message' => 'El asiento no pertenece a la sala de esta función'], 422);
    }

    if ($asiento->estado !== 'disponible') {
        return response()->json(['message' => 'El asiento no está disponible'], 422);
    }

    try {
        $ticket = Ticket::create($validated);
        \Log::info('Ticket creado:', $ticket->toArray());
    } catch (\Exception $e) {
        \Log::error('Error al crear ticket: ' . $e->getMessage());
        return response()->json(['message' => 'Error interno al crear ticket', 'error' => $e->getMessage()], 500);
    }

    $ticket->load(['funcion.pelicula', 'funcion.sala', 'asiento', 'usuario']);

    return response()->json($ticket, 201);
}

    /**
     * Actualiza un ticket (PUT/PATCH /api/tickets/{ticket})
     * Ej: para reembolsar o cambiar método de pago
     */
    public function update(Request $request, Ticket $ticket): JsonResponse
    {
        $validated = $request->validate([
            'estado'      => 'sometimes|required|in:vendido,reservado,reembolsado',
            'metodo_pago' => 'sometimes|nullable|string|in:efectivo,tarjeta,transferencia',
            'precio'      => 'sometimes|numeric|min:0',
        ]);

        // Si se reembolsa, opcional: liberar el asiento
        if (isset($validated['estado']) && $validated['estado'] === 'reembolsado') {
            $ticket->asiento->update(['estado' => 'disponible']);
        }

        $ticket->update($validated);

        $ticket->load(['funcion.pelicula', 'funcion.sala', 'asiento', 'usuario']);

        return response()->json($ticket);
    }

    /**
     * Elimina un ticket (DELETE /api/tickets/{ticket})
     */
    public function destroy(Ticket $ticket): JsonResponse
    {
        // Opcional: liberar asiento si se elimina
        if ($ticket->estado !== 'reembolsado') {
            $ticket->asiento->update(['estado' => 'disponible']);
        }

        $ticket->delete();
        return response()->json(null, 204);
    }
}