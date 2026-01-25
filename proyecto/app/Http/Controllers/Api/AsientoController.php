<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asientos;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AsientoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Asientos::with('sala');  // ← Carga la sala relacionada

        if ($request->has('sala_id')) {
            $query->where('sala_id', $request->sala_id);
        }

        $asientos = $query->get();

        return response()->json($asientos);
    }

    public function show(Asientos $asiento): JsonResponse
    {
        $asiento->load('sala');  // ← Carga la sala para este asiento específico

        return response()->json($asiento);
    }

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
            return response()->json(['message' => 'Este asiento ya existe en la sala'], 422);
        }

        $asiento = Asientos::create($validated);

        // Opcional: cargar la sala al devolver el nuevo asiento
        $asiento->load('sala');

        return response()->json($asiento, 201);
    }

    public function update(Request $request, Asientos $asiento): JsonResponse
    {
        $validated = $request->validate([
            'sala_id' => 'sometimes|required|exists:salas,id',
            'fila'    => 'sometimes|required|string|max:5',
            'numero'  => 'sometimes|required|integer|min:1',
            'tipo'    => 'sometimes|required|string|in:estandar,vip,discapacitado',
            'estado'  => 'sometimes|in:disponible,ocupado,reservado,mantenimiento',
        ]);

        // Chequeo de duplicado si cambia fila/numero/sala
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
                return response()->json(['message' => 'Ya existe un asiento con esa fila y número'], 422);
            }
        }

        $asiento->update($validated);

        // Recargar la sala después de actualizar
        $asiento->load('sala');

        return response()->json($asiento);
    }

    public function destroy(Asientos $asiento): JsonResponse
    {
        $asiento->delete();
        return response()->json(null, 204);
    }
}