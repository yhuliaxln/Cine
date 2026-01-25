<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Funciones;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Date;

class FuncionController extends Controller
{
    /**
     * Muestra todas las funciones (GET /api/funciones)
     * Opcional: filtro por ?pelicula_id= o ?sala_id= o ?fecha=YYYY-MM-DD
     */
    public function index(Request $request): JsonResponse
    {
        $query = Funciones::with(['pelicula', 'sala']);  // Carga película y sala

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
     * Crea una nueva función (POST /api/funciones)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pelicula_id'         => 'required|exists:peliculas,id',
            'sala_id'             => 'required|exists:salas,id',
            'fecha_hora_inicio'   => 'required|date',
            'precio'              => 'required|numeric|min:0',
            // fecha_hora_fin se puede calcular automáticamente después
        ]);

        // Opcional: validar que la sala no esté ocupada en ese horario
        // (por ahora lo dejamos simple, podemos agregar chequeo después)

        $funcion = Funciones::create($validated);

        // Cargar relaciones al devolver
        $funcion->load(['pelicula', 'sala']);

        return response()->json($funcion, 201);
    }

    /**
     * Muestra una función específica (GET /api/funciones/{funcion})
     */
    public function show(Funciones $funcione): JsonResponse  // Nota: usa $funcione porque el modelo es Funciones
    {
        $funcione->load(['pelicula', 'sala']);

        return response()->json($funcione);
    }

    /**
     * Actualiza una función (PUT/PATCH /api/funciones/{funcion})
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

        // Recargar relaciones
        $funcione->load(['pelicula', 'sala']);

        return response()->json($funcione);
    }

    /**
     * Elimina una función (DELETE /api/funciones/{funcion})
     */
    public function destroy(Funciones $funcione): JsonResponse
    {
        $funcione->delete();
        return response()->json(null, 204);
    }
}