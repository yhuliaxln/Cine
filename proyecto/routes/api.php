<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PeliculaController;
use App\Http\Controllers\Api\SalaController;
use App\Http\Controllers\Api\AsientoController;
use App\Http\Controllers\Api\FuncionController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\AuthController;  // ← este controlador lo crearemos en el próximo paso

// Rutas públicas (no requieren login ni token)
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas: requieren token Sanctum (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {

    // Logout (revoca el token actual)
    Route::post('/logout', [AuthController::class, 'logout']);

    // Solo usuarios con role = 'admin' pueden manejar películas, salas, asientos, funciones
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('peliculas', PeliculaController::class);
        Route::apiResource('salas', SalaController::class);
        Route::apiResource('asientos', AsientoController::class);
        Route::apiResource('funciones', FuncionController::class);
    });

    // Tickets: accesible para empleados (role = 'employee') y también admin
    // (si quieres que solo empleados, cambia a 'role:employee')
    Route::apiResource('tickets', TicketController::class);
});

// Ruta de prueba que ya tenías (la dejamos pública para que funcione sin login)
Route::get('/test', function () {
    return response()->json(['mensaje' => 'API funcionando!']);
});