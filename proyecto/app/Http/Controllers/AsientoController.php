<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Asientos;

class AsientoController extends Controller
{
    /**
     * ✅ AJAX: listar asientos por sala
     * GET /ajax/asientos?sala_id=1
     */
    public function ajaxIndex(Request $request): JsonResponse
    {
        $query = Asientos::with('sala');

        if ($request->filled('sala_id')) {
            $query->where('sala_id', $request->sala_id);
        }

        return response()->json($query->get());
    }

    /**
     * ✅ Crear asiento (admin)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sala_id' => 'required|exists:salas,id',
            'fila' => 'required|string|max:5',
            'numero' => 'required|integer',
            'estado' => 'required|string',
            'tipo' => 'required|string',
        ]);

        $asiento = Asientos::create($validated);

        return response()->json($asiento, 201);
    }

    /**
     * ✅ Actualizar asiento (admin)
     */
    public function update(Request $request, Asientos $asiento): JsonResponse
    {
        $validated = $request->validate([
            'fila' => 'sometimes|string|max:5',
            'numero' => 'sometimes|integer',
            'estado' => 'sometimes|string',
            'tipo' => 'sometimes|string',
        ]);

        $asiento->update($validated);

        return response()->json($asiento);
    }

    /**
     * ✅ Eliminar asiento (admin)
     */
    public function destroy(Asientos $asiento): JsonResponse
    {
        $asiento->delete();

        return response()->json([
            'message' => 'Asiento eliminado correctamente'
        ]);
    }
}
