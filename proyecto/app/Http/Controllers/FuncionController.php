<?php
// proyecto/app/Http/Controllers/FuncionController.php

namespace App\Http\Controllers;

use App\Models\Funciones;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FuncionController extends Controller
{
    /**
     * Constructor - Solo admin puede crear/editar/eliminar funciones
     */
    public function __construct()
    {
        // Todos pueden ver, solo admin modificar
        $this->middleware('role:admin')->only(['create', 'store', 'edit', 'update', 'destroy']);
    }
    
    // ========== VISTAS BLADE ==========
    
    /**
     * Mostrar vista principal de funciones
     */
    public function index()
    {
        return view('funciones.index');
    }
    
    /**
     * Mostrar formulario para crear nueva función
     */
    public function create()
    {
        return view('funciones.create');
    }
    
    /**
     * Mostrar formulario para editar función
     */
    public function edit(Funciones $funcione)
    {
        return view('funciones.edit', compact('funcione'));
    }
    
    /**
     * Mostrar detalles de función (vista)
     */
    public function show(Funciones $funcione)
    {
        return view('funciones.show', compact('funcione'));
    }
    
    // ========== API PARA AJAX ==========
    
    /**
     * Obtener todas las funciones (AJAX)
     */
    public function ajaxIndex(Request $request): JsonResponse
    {
        $query = Funciones::with(['pelicula', 'sala']);

        if ($request->has('pelicula_id')) {
            $query->where('pelicula_id', $request->pelicula_id);
        }
        if ($request->has('sala_id')) {
            $query->where('sala_id', $request->sala_id);
        }
        if ($request->has('fecha')) {
            $query->whereDate('fecha_hora_inicio', $request->fecha);
        }

        $funciones = $query->get();

        return response()->json($funciones);
    }

    /**
     * Mostrar una función específica (AJAX)
     */
    public function ajaxShow(Funciones $funcione): JsonResponse
    {
        $funcione->load(['pelicula', 'sala']);
        return response()->json($funcione);
    }

    /**
     * Crear nueva función (AJAX)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pelicula_id'         => 'required|exists:peliculas,id',
            'sala_id'             => 'required|exists:salas,id',
            'fecha_hora_inicio'   => 'required|date',
            'precio'              => 'required|numeric|min:0',
        ]);

        $funcion = Funciones::create($validated);
        $funcion->load(['pelicula', 'sala']);

        return response()->json([
            'success' => true,
            'message' => 'Función creada exitosamente',
            'data' => $funcion
        ], 201);
    }

    /**
     * Actualizar función (AJAX)
     */
    public function update(Request $request, Funciones $funcione): JsonResponse
    {
        $validated = $request->validate([
            'pelicula_id'         => 'sometimes|required|exists:peliculas,id',
            'sala_id'             => 'sometimes|required|exists:salas,id',
            'fecha_hora_inicio'   => 'sometimes|required|date',
            'precio'              => 'sometimes|required|numeric|min:0',
        ]);

        $funcione->update($validated);
        $funcione->load(['pelicula', 'sala']);

        return response()->json([
            'success' => true,
            'message' => 'Función actualizada exitosamente',
            'data' => $funcione
        ]);
    }

    /**
     * Eliminar función (AJAX)
     */
    public function destroy(Funciones $funcione): JsonResponse
    {
        $funcione->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Función eliminada exitosamente'
        ]);
    }
}