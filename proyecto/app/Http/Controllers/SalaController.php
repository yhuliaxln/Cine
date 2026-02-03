<?php

namespace App\Http\Controllers;

use App\Models\Sala;
use App\Models\Asiento; // AÑADE ESTA LÍNEA
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SalaController extends Controller
{
    /**
     * Constructor - Solo admin puede modificar salas
     */
    // ========== VISTAS BLADE ==========
    
    /**
     * Mostrar vista principal de salas
     */
    public function index()
    {
        return view('salas.index');
    }
    
    /**
     * Mostrar formulario para crear nueva sala (modal partial)
     */
    public function create()
    {
        return view('salas.partial.sala-form', [
            'modalType' => 'crear',
            'sala' => null
        ]);
    }
    
    /**
     * Mostrar formulario para editar sala (modal partial)
     */
    public function edit(Sala $sala)
    {
        return view('salas.partial.sala-form', [
            'modalType' => 'editar',
            'sala' => $sala
        ]);
    }
    
    /**
     * Mostrar detalles de sala (vista) - se mantiene aunque no lo uses ahora
     */
    public function show(Sala $sala)
    {
        return view('salas.show', compact('sala'));
    }

    /**
     * Mostrar el modal / vista parcial de gestión de asientos
     */
    public function gestionAsientos(Sala $sala)
    {
        try {
            $asientos = $sala->asientos()
                            ->orderBy('fila')
                            ->orderBy('numero')
                            ->get();

            return view('salas.partial.gestion-asientos', compact('sala', 'asientos'));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function crearAsientoForm(Sala $sala)
    {
        return view('salas.partial.asiento-form', [
            'sala'    => $sala,
            'modo'    => 'crear',
            'asiento' => null,
        ]);
    }

    public function editAsientoModal(Sala $sala, Asiento $asiento)
    {
        if ($asiento->sala_id !== $sala->id) {
            abort(403, 'El asiento no pertenece a esta sala');
        }

        return view('salas.partial.asiento-form', [
            'sala'    => $sala,
            'modo'    => 'editar',
            'asiento' => $asiento,
        ]);
    }
    
    // ========== API PARA AJAX ==========
    
    /**
     * Obtener todas las salas (AJAX)
     */
    public function ajaxIndex(): JsonResponse
    {
        $salas = Sala::all();
        return response()->json($salas);
    }

    /**
     * Crear nueva sala (AJAX)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre'    => 'required|string|max:100',
            'capacidad' => 'required|integer|min:1',
            'tipo'      => 'required|string|in:2D,3D,4D,IMAX,VIP',
        ]);

        $sala = Sala::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Sala creada exitosamente',
            'data' => $sala
        ], 201);
    }

    /**
     * Mostrar una sala específica (AJAX)
     */
    public function ajaxShow(Sala $sala): JsonResponse
    {
        return response()->json($sala);
    }

    /**
     * Actualizar sala (AJAX)
     */
    public function update(Request $request, Sala $sala): JsonResponse
    {
        $validated = $request->validate([
            'nombre'    => 'sometimes|required|string|max:100',
            'capacidad' => 'sometimes|required|integer|min:1',
            'tipo'      => 'sometimes|required|string|in:2D,3D,4D,IMAX,VIP',
        ]);

        $sala->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Sala actualizada exitosamente',
            'data' => $sala
        ]);
    }

    /**
     * Eliminar sala (AJAX)
     */
    public function destroy(Sala $sala): JsonResponse
    {
        $sala->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Sala eliminada exitosamente'
        ]);
    }
}