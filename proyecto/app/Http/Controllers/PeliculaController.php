<?php

namespace App\Http\Controllers; // Cambia el namespace

use App\Models\Pelicula;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class PeliculaController extends Controller
{
    /**
     * Constructor - Aplicar middleware de admin para escritura
     */
    
    // ========== VISTAS BLADE ==========
    
    /**
     * Mostrar vista principal de películas
     */
    public function index()
    {
        return view('peliculas.index');
    }
    
    /**
     * Mostrar formulario para crear nueva película
     */
    public function create()
    {
        return view('peliculas.create');
    }
    
    /**
     * Mostrar formulario para editar película
     */
    public function edit(Pelicula $pelicula)
{
    return view('peliculas.partials.pelicula-modal', [
    'modalType' => 'editar',
    'peliculaEditando' => $pelicula,
]);
}

    
    /**
     * Mostrar detalles de película (vista)
     */
    public function show(Pelicula $pelicula)
    {
        return view('peliculas.show', compact('pelicula'));
    }
    
    // ========== API PARA AJAX ==========
    
    /**
     * Obtener todas las películas (AJAX)
     */
    public function ajaxIndex(): JsonResponse
    {
        $peliculas = Pelicula::all()->map(function ($pelicula) {
            if ($pelicula->url_poster && !str_starts_with($pelicula->url_poster, 'http')) {
                $pelicula->url_poster = asset($pelicula->url_poster);
            }
            return $pelicula;
        });

        return response()->json($peliculas);
    }

    /**
     * Crear nueva película (AJAX)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'titulo'        => 'required|string|max:255',
            'descripcion'   => 'nullable|string',
            'duracion'      => 'required|integer|min:1',
            'genero'        => 'required|string|max:100',
            'fecha_estreno' => 'nullable|date',
            'clasificacion' => 'nullable|string|max:10',
            'url_poster'    => 'nullable',
        ]);

        // Manejo de url_poster
        if ($request->hasFile('url_poster') && $request->file('url_poster')->isValid()) {
            $path = $request->file('url_poster')->store('posters', 'public');
            $validated['url_poster'] = Storage::url($path);
        } elseif ($request->filled('url_poster')) {
            $validated['url_poster'] = $request->input('url_poster');
        }

        $pelicula = Pelicula::create($validated);

        // Convertir a URL completa
        if ($pelicula->url_poster && !str_starts_with($pelicula->url_poster, 'http')) {
            $pelicula->url_poster = asset($pelicula->url_poster);
        }

        return response()->json([
            'success' => true,
            'message' => 'Película creada exitosamente',
            'data' => $pelicula
        ], 201);
    }

    /**
     * Mostrar una película específica (AJAX)
     */
    public function ajaxShow(Pelicula $pelicula): JsonResponse
    {
        if ($pelicula->url_poster && !str_starts_with($pelicula->url_poster, 'http')) {
            $pelicula->url_poster = asset($pelicula->url_poster);
        }

        return response()->json($pelicula);
    }

    /**
     * Actualizar película (AJAX)
     */
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

        // Manejo de url_poster
        if ($request->hasFile('url_poster') && $request->file('url_poster')->isValid()) {
            $path = $request->file('url_poster')->store('posters', 'public');
            $validated['url_poster'] = Storage::url($path);
        } elseif ($request->filled('url_poster')) {
            $validated['url_poster'] = $request->input('url_poster');
        }

        $pelicula->update($validated);

        if ($pelicula->url_poster && !str_starts_with($pelicula->url_poster, 'http')) {
            $pelicula->url_poster = asset($pelicula->url_poster);
        }

        return response()->json([
            'success' => true,
            'message' => 'Película actualizada exitosamente',
            'data' => $pelicula
        ]);
    }

    /**
     * Eliminar película (AJAX)
     */
    public function destroy(Pelicula $pelicula): JsonResponse
    {
        $pelicula->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Película eliminada exitosamente'
        ]);
    }
}