<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pelicula;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class PeliculaController extends Controller
{
    public function index(): JsonResponse
    {
        $peliculas = Pelicula::all();
        return response()->json($peliculas);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'titulo'        => 'required|string|max:255',
            'descripcion'   => 'nullable|string',
            'duracion'      => 'required|integer|min:1',
            'genero'        => 'required|string|max:100',
            'fecha_estreno' => 'nullable|date',
            'clasificacion' => 'nullable|string|max:10',
            // Acepta archivo O URL string
            'url_poster'    => 'nullable', // quitamos reglas estrictas aquí
        ]);

        // Manejo de url_poster (archivo o string)
        if ($request->hasFile('url_poster') && $request->file('url_poster')->isValid()) {
            $path = $request->file('url_poster')->store('posters', 'public');
            $validated['url_poster'] = Storage::url($path);
        } elseif ($request->filled('url_poster')) {
            // Si viene como string (URL externa), lo dejamos pasar
            $validated['url_poster'] = $request->input('url_poster');
        }

        // Si no viene nada, queda null (como permite la migración)
        $pelicula = Pelicula::create($validated);

        return response()->json($pelicula, 201);
    }

    public function show(Pelicula $pelicula): JsonResponse
    {
        return response()->json($pelicula);
    }

    public function update(Request $request, Pelicula $pelicula): JsonResponse
    {
        $validated = $request->validate([
            'titulo'        => 'sometimes|required|string|max:255',
            'descripcion'   => 'nullable|string',
            'duracion'      => 'sometimes|required|integer|min:1',
            'genero'        => 'sometimes|required|string|max:100',
            'fecha_estreno' => 'nullable|date',
            'clasificacion' => 'nullable|string|max:10',
            'url_poster'    => 'nullable',
        ]);

        // Mismo manejo que en store
        if ($request->hasFile('url_poster') && $request->file('url_poster')->isValid()) {
            $path = $request->file('url_poster')->store('posters', 'public');
            $validated['url_poster'] = Storage::url($path);
        } elseif ($request->filled('url_poster')) {
            $validated['url_poster'] = $request->input('url_poster');
        }

        $pelicula->update($validated);

        return response()->json($pelicula);
    }

    public function destroy(Pelicula $pelicula): JsonResponse
    {
        $pelicula->delete();
        return response()->json(null, 204);
    }
}