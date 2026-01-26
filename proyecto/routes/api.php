<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PeliculaController;
use App\Http\Controllers\Api\SalaController;
use App\Http\Controllers\Api\AsientoController;
use App\Http\Controllers\Api\FuncionController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\AuthController;

// Rutas públicas (no requieren login ni token)
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas: requieren token Sanctum (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {

    // Logout (revoca el token actual)
    Route::post('/logout', [AuthController::class, 'logout']);

    // Funciones: GET visible para empleados y admin (cartelera), POST/PUT/DELETE solo admin
    Route::get('/funciones', [FuncionController::class, 'index']);
    Route::get('/funciones/{funcione}', [FuncionController::class, 'show']);

    // Crear, actualizar y eliminar funciones solo admin
    Route::middleware('role:admin')->group(function () {
        Route::post('/funciones', [FuncionController::class, 'store']);
        Route::put('/funciones/{funcione}', [FuncionController::class, 'update']);
        Route::delete('/funciones/{funcione}', [FuncionController::class, 'destroy']);

        // Películas, salas y asientos solo admin
        Route::apiResource('peliculas', PeliculaController::class);
        Route::apiResource('salas', SalaController::class);
        Route::apiResource('asientos', AsientoController::class);
    });

    // Tickets: accesible para empleados y admin
    Route::apiResource('tickets', TicketController::class);
});

// Ruta de prueba (pública)
Route::get('/test', function () {
    return response()->json(['mensaje' => 'API funcionando!']);
});