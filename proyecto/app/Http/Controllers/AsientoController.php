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
            'fila' => 'required|string|max:1|in:A,B,C,D,E,F,G,H,I,J',
            'numero' => 'required|integer|min:1|max:30',
            'estado' => 'required|string|in:disponible,ocupado,reservado,inhabilitado',
            'tipo' => 'required|string|in:estandar,vip,discapacitado',
        ]);

        // Verificar si el asiento ya existe en la misma sala
        $asientoExistente = Asientos::where('sala_id', $validated['sala_id'])
            ->where('fila', $validated['fila'])
            ->where('numero', $validated['numero'])
            ->first();

        if ($asientoExistente) {
            return response()->json([
                'message' => 'Ya existe un asiento con la misma fila y número en esta sala',
                'errors' => [
                    'numero' => ['Este asiento ya existe en la sala']
                ]
            ], 422);
        }

        $asiento = Asientos::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Asiento creado exitosamente',
            'data' => $asiento
        ], 201);
    }

    /**
     * ✅ Actualizar asiento (admin)
     */
    public function update(Request $request, Asientos $asiento): JsonResponse
    {
        $validated = $request->validate([
            'fila' => 'sometimes|string|max:1|in:A,B,C,D,E,F,G,H,I,J',
            'numero' => 'sometimes|integer|min:1|max:30',
            'estado' => 'sometimes|string|in:disponible,ocupado,reservado,inhabilitado',
            'tipo' => 'sometimes|string|in:estandar,vip,discapacitado',
        ]);

        // Si se actualiza fila o número, verificar que no exista duplicado
        if (isset($validated['fila']) || isset($validated['numero'])) {
            $fila = $validated['fila'] ?? $asiento->fila;
            $numero = $validated['numero'] ?? $asiento->numero;

            $asientoExistente = Asientos::where('sala_id', $asiento->sala_id)
                ->where('fila', $fila)
                ->where('numero', $numero)
                ->where('id', '!=', $asiento->id)
                ->first();

            if ($asientoExistente) {
                return response()->json([
                    'message' => 'Ya existe otro asiento con la misma fila y número en esta sala',
                    'errors' => [
                        'numero' => ['Este asiento ya existe en la sala']
                    ]
                ], 422);
            }
        }

        $asiento->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Asiento actualizado exitosamente',
            'data' => $asiento
        ]);
    }

    /**
     * ✅ Eliminar asiento (admin)
     */
    public function destroy(Asientos $asiento): JsonResponse
    {
        $asiento->delete();

        return response()->json([
            'success' => true,
            'message' => 'Asiento eliminado correctamente'
        ]);
    }
}