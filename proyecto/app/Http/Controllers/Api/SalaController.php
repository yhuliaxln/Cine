<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sala;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SalaController extends Controller
{
    /**
     * Muestra todas las salas (GET /api/salas)
     */
    public function index(): JsonResponse
    {
        $salas = Sala::all();
        return response()->json($salas);
    }

    /**
     * Crea una nueva sala (POST /api/salas)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre'    => 'required|string|max:100',
            'capacidad' => 'required|integer|min:1',
            'tipo'      => 'required|string|in:2D,3D,4D,IMAX,VIP', // o quita 'in:' si quieres más flexibilidad
        ]);

        $sala = Sala::create($validated);

        return response()->json($sala, 201);
    }

    /**
     * Muestra una sala específica (GET /api/salas/{sala})
     */
    public function show(Sala $sala): JsonResponse
    {
        return response()->json($sala);
    }

    /**
     * Actualiza una sala (PUT/PATCH /api/salas/{sala})
     */
    public function update(Request $request, Sala $sala): JsonResponse
    {
        $validated = $request->validate([
            'nombre'    => 'sometimes|required|string|max:100',
            'capacidad' => 'sometimes|required|integer|min:1',
            'tipo'      => 'sometimes|required|string|in:2D,3D,4D,IMAX,VIP',
        ]);

        $sala->update($validated);

        return response()->json($sala);
    }

    /**
     * Elimina una sala (DELETE /api/salas/{sala})
     */
    public function destroy(Sala $sala): JsonResponse
    {
        $sala->delete();
        return response()->json(null, 204);
    }
}