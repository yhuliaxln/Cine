<?php

namespace App\Http\Controllers;

use App\Models\Funciones;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FuncionController extends Controller
{
    // ← Eliminamos TODO el __construct() para evitar el error

    // ========== VISTAS BLADE ==========
    
    public function index()
    {
        return view('funciones.index');
    }
    
    public function create()
    {
        return view('funciones.create');
    }
    
    public function edit(Funciones $funcione)
    {
        return view('funciones.edit', compact('funcione'));
    }
    
    public function show(Funciones $funcione)
    {
        return view('funciones.show', compact('funcione'));
    }
    
    // ========== API PARA AJAX ==========
    
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

    public function ajaxShow(Funciones $funcione): JsonResponse
    {
        $funcione->load(['pelicula', 'sala']);
        return response()->json($funcione);
    }

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

    public function destroy(Funciones $funcione): JsonResponse
    {
        $funcione->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Función eliminada exitosamente'
        ]);
    }
}