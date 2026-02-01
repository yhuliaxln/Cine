<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Asientos;
use App\Models\Funciones;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    /**
     * Todos los autenticados (admin y empleado)
     */

    // ========== VISTAS BLADE ==========

    public function index()
    {
        return view('tickets.index');
    }

    public function create()
    {
        return view('tickets.create');
    }

    public function edit(Ticket $ticket)
    {
        return view('tickets.edit', compact('ticket'));
    }

    public function show(Ticket $ticket)
    {
        return view('tickets.show', compact('ticket'));
    }

    // ========== API AJAX ==========

    /**
     * Listar tickets
     */
    public function ajaxIndex(Request $request): JsonResponse
    {
        $query = Ticket::with([
            'funcion.pelicula',
            'funcion.sala',
            'asiento',
            'usuario'
        ]);

        if ($request->filled('funcion_id')) {
            $query->where('funcion_id', $request->funcion_id);
        }

        if ($request->filled('usuario_id')) {
            $query->where('usuario_id', $request->usuario_id);
        }

        return response()->json($query->get());
    }

    /**
     * Ver un ticket
     */
    public function ajaxShow(Ticket $ticket): JsonResponse
    {
        $ticket->load([
            'funcion.pelicula',
            'funcion.sala',
            'asiento',
            'usuario'
        ]);

        return response()->json($ticket);
    }

    /**
     * CREAR TICKET (EMPLEADO O ADMIN)
     * POST /ajax/tickets
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'funcion_id'  => 'required|exists:funciones,id',
            'asiento_id'  => 'required|exists:asientos,id',
            'precio'      => 'required|numeric|min:0',
            'estado'      => 'sometimes|in:vendido,reservado,reembolsado',
            'metodo_pago' => 'nullable|in:efectivo,tarjeta,transferencia',
        ]);

        $asiento = Asientos::findOrFail($validated['asiento_id']);
        $funcion = Funciones::findOrFail($validated['funcion_id']);

        // Validar que el asiento sea de la sala correcta
        if ($asiento->sala_id !== $funcion->sala_id) {
            return response()->json([
                'success' => false,
                'message' => 'El asiento no pertenece a la sala de esta función'
            ], 422);
        }

        // Validar disponibilidad
        if ($asiento->estado !== 'disponible') {
            return response()->json([
                'success' => false,
                'message' => 'El asiento no está disponible'
            ], 422);
        }

        try {
            $ticket = Ticket::create([
                'funcion_id'  => $validated['funcion_id'],
                'asiento_id'  => $validated['asiento_id'],
                'precio'      => $validated['precio'],
                'estado'      => $validated['estado'] ?? 'vendido',
                'metodo_pago' => $validated['metodo_pago'] ?? null,
                'usuario_id'     => Auth::id(), // 🔥 EMPLEADO AUTENTICADO
            ]);

            // Ocupar asiento
            $asiento->update([
                'estado' => 'ocupado'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al crear ticket: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error interno al crear ticket',
                'error' => $e->getMessage()
            ], 500);
            
        }

        $ticket->load([
            'funcion.pelicula',
            'funcion.sala',
            'asiento',
            'usuario'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ticket creado exitosamente',
            'data' => $ticket
        ], 201);
    }

    /**
     * ACTUALIZAR TICKET
     */
    public function update(Request $request, Ticket $ticket): JsonResponse
    {
        $validated = $request->validate([
            'estado'      => 'sometimes|in:vendido,reservado,reembolsado',
            'metodo_pago' => 'sometimes|nullable|in:efectivo,tarjeta,transferencia',
            'precio'      => 'sometimes|numeric|min:0',
        ]);

        // Si se reembolsa, liberar asiento
        if (
            isset($validated['estado']) &&
            $validated['estado'] === 'reembolsado'
        ) {
            $ticket->asiento->update([
                'estado' => 'disponible'
            ]);
        }

        $ticket->update($validated);

        $ticket->load([
            'funcion.pelicula',
            'funcion.sala',
            'asiento',
            'usuario'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ticket actualizado exitosamente',
            'data' => $ticket
        ]);
    }

    /**
     * ELIMINAR TICKET
     */
    public function destroy(Ticket $ticket): JsonResponse
    {
        if ($ticket->estado !== 'reembolsado') {
            $ticket->asiento->update([
                'estado' => 'disponible'
            ]);
        }

        $ticket->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ticket eliminado exitosamente'
        ]);
    }
}
