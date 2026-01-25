<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PeliculaController;
use App\Http\Controllers\Api\SalaController;
use App\Http\Controllers\Api\AsientoController;
use App\Http\Controllers\Api\FuncionController;
use App\Http\Controllers\Api\TicketController;


// Rutas protegidas por prefijo 'api' automáticamente
Route::apiResource('peliculas', PeliculaController::class);
Route::apiResource('salas', SalaController::class);
Route::apiResource('asientos', AsientoController::class);
Route::apiResource('funciones', FuncionController::class);
Route::apiResource('tickets', TicketController::class);

// Opcional: ruta de prueba rápida para saber si el archivo se carga
Route::get('/test', function () {
    return response()->json(['mensaje' => 'API funcionando!']);
});