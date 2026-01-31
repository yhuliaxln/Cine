<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Asientos;
use App\Models\Funciones;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TicketController extends Controller
{
    /**
     * Constructor - Todos los autenticados pueden manejar tickets
     */
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    // ========== VISTAS BLADE ==========
    
    /**
     * Mostrar vista principal de tickets
     */
    public function index()
    {
        return view('tickets.index');
    }
    
    /**
     * Mostrar formulario para crear nuevo ticket
     */
    public function create()
    {
        return view('tickets.create');
    }
    
    /**
     * Mostrar formulario para editar ticket
     */
    public function edit(Ticket $ticket)
    {
        return view('tickets.edit', compact('ticket'));
    }
    
    /**
     * Mostrar detalles de ticket (vista)
     */
    public function show(Ticket $ticket)
    {
        return view('tickets.show', compact('ticket'));
    }
    
    // ========== API PARA AJAX ==========
    
    /**
     * Obtener todos los tickets (AJAX)
     */
    public function ajaxIndex(Request $request): JsonResponse
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
     * Mostrar un ticket específico (AJAX)
     */
    public function ajaxShow(Ticket $ticket): JsonResponse
    {
        $ticket->load(['funcion.pelicula', 'funcion.sala', 'asiento', 'usuario']);
        return response()->json($ticket);
    }

    /**
     * Crear nuevo ticket (AJAX)
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

        $asiento = Asientos::findOrFail($validated['asiento_id']);
        $funcion = Funciones::findOrFail($validated['funcion_id']);

        if ($asiento->sala_id !== $funcion->sala_id) {
            return response()->json([
                'success' => false,
                'message' => 'El asiento no pertenece a la sala de esta función'
            ], 422);
        }

        if ($asiento->estado !== 'disponible') {
            return response()->json([
                'success' => false,
                'message' => 'El asiento no está disponible'
            ], 422);
        }

        try {
            $ticket = Ticket::create($validated);
            // Cambiar estado del asiento
            $asiento->update(['estado' => 'ocupado']);
        } catch (\Exception $e) {
            \Log::error('Error al crear ticket: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error interno al crear ticket',
                'error' => $e->getMessage()
            ], 500);
        }

        $ticket->load(['funcion.pelicula', 'funcion.sala', 'asiento', 'usuario']);

        return response()->json([
            'success' => true,
            'message' => 'Ticket creado exitosamente',
            'data' => $ticket
        ], 201);
    }

    /**
     * Actualizar ticket (AJAX)
     */
    public function update(Request $request, Ticket $ticket): JsonResponse
    {
        $validated = $request->validate([
            'estado'      => 'sometimes|required|in:vendido,reservado,reembolsado',
            'metodo_pago' => 'sometimes|nullable|string|in:efectivo,tarjeta,transferencia',
            'precio'      => 'sometimes|numeric|min:0',
        ]);

        // Si se reembolsa, liberar el asiento
        if (isset($validated['estado']) && $validated['estado'] === 'reembolsado') {
            $ticket->asiento->update(['estado' => 'disponible']);
        }

        $ticket->update($validated);
        $ticket->load(['funcion.pelicula', 'funcion.sala', 'asiento', 'usuario']);

        return response()->json([
            'success' => true,
            'message' => 'Ticket actualizado exitosamente',
            'data' => $ticket
        ]);
    }

    /**
     * Eliminar ticket (AJAX)
     */
    public function destroy(Ticket $ticket): JsonResponse
    {
        // Liberar asiento si se elimina
        if ($ticket->estado !== 'reembolsado') {
            $ticket->asiento->update(['estado' => 'disponible']);
        }

        $ticket->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Ticket eliminado exitosamente'
        ]);
    }
}