<?php
// proyecto/app/Http/Middleware/CheckRole.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Si no hay usuario autenticado o el rol no coincide exactamente
        if (!$request->user() || $request->user()->role !== $role) {
            return response()->json(['message' => 'Acceso denegado - Rol requerido: ' . $role], 403);
        }

        return $next($request);
    }
}