<?php

namespace App\Http\Controllers;

use App\Models\Asientos;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AsientoController extends Controller
{
    /**
     * Constructor - Solo admin puede crear/editar/eliminar asientos
     */
    public function __construct()
    {
        // Todos pueden ver, solo admin modificar
        $this->middleware('role:admin')->only(['create', 'store', 'edit', 'update', 'destroy']);
    }
    
    // ========== VISTAS BLADE ==========
    
    /**
     * Mostrar vista principal de asientos
     */
    public function index()
    {
        return view('asientos.index');
    }
    
    /**
     * Mostrar formulario para crear nuevo asiento
     */
    public function create()
    {
        return view('asientos.create');
    }
    
    /**
     * Mostrar formulario para editar asiento
     */
    public function edit(Asientos $asiento)
    {
        return view('asientos.edit', compact('asiento'));
    }
    
    /**
     * Mostrar detalles de asiento (vista)
     */
    public function show(Asientos $asiento)
    {
        return view('asientos.show', compact('asiento'));
    }
    
    // ========== API PARA AJAX ==========
    
    /**
     * Obtener todos los asientos (AJAX)
     */
    public function ajaxIndex(Request $request): JsonResponse
    {
        $query = Asientos::with('sala');

        if ($request->has('sala_id')) {
            $query->where('sala_id', $request->sala_id);
        }

        $asientos = $query->get();

        return response()->json($asientos);
    }

    /**
     * Mostrar un asiento específico (AJAX)
     */
    public function ajaxShow(Asientos $asiento): JsonResponse
    {
        $asiento->load('sala');
        return response()->json($asiento);
    }

    /**
     * Crear nuevo asiento (AJAX)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sala_id' => 'required|exists:salas,id',
            'fila'    => 'required|string|max:5',
            'numero'  => 'required|integer|min:1',
            'tipo'    => 'required|string|in:estandar,vip,discapacitado',
            'estado'  => 'sometimes|in:disponible,ocupado,reservado,mantenimiento',
        ]);

        $existe = Asientos::where('sala_id', $validated['sala_id'])
                          ->where('fila', $validated['fila'])
                          ->where('numero', $validated['numero'])
                          ->exists();

        if ($existe) {
            return response()->json([
                'success' => false,
                'message' => 'Este asiento ya existe en la sala'
            ], 422);
        }

        $asiento = Asientos::create($validated);
        $asiento->load('sala');

        return response()->json([
            'success' => true,
            'message' => 'Asiento creado exitosamente',
            'data' => $asiento
        ], 201);
    }

    /**
     * Actualizar asiento (AJAX)
     */
    public function update(Request $request, Asientos $asiento): JsonResponse
    {
        $validated = $request->validate([
            'sala_id' => 'sometimes|required|exists:salas,id',
            'fila'    => 'sometimes|required|string|max:5',
            'numero'  => 'sometimes|required|integer|min:1',
            'tipo'    => 'sometimes|required|string|in:estandar,vip,discapacitado',
            'estado'  => 'sometimes|in:disponible,ocupado,reservado,mantenimiento',
        ]);

        // Chequeo de duplicado
        if (isset($validated['fila']) || isset($validated['numero']) || isset($validated['sala_id'])) {
            $salaId = $validated['sala_id'] ?? $asiento->sala_id;
            $fila   = $validated['fila']   ?? $asiento->fila;
            $numero = $validated['numero'] ?? $asiento->numero;

            $duplicado = Asientos::where('sala_id', $salaId)
                                 ->where('fila', $fila)
                                 ->where('numero', $numero)
                                 ->where('id', '!=', $asiento->id)
                                 ->exists();

            if ($duplicado) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ya existe un asiento con esa fila y número'
                ], 422);
            }
        }

        $asiento->update($validated);
        $asiento->load('sala');

        return response()->json([
            'success' => true,
            'message' => 'Asiento actualizado exitosamente',
            'data' => $asiento
        ]);
    }

    /**
     * Eliminar asiento (AJAX)
     */
    public function destroy(Asientos $asiento): JsonResponse
    {
        $asiento->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Asiento eliminado exitosamente'
        ]);
    }
}