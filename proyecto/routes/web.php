<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PeliculaController;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\AsientoController;
use App\Http\Controllers\FuncionController;
use App\Http\Controllers\TicketController;
use App\Models\Funciones;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// ==================== RUTAS PÚBLICAS ====================
Route::get('/', function () {
    return view('welcome');
})->name('home');

// Ruta de prueba (pública)
Route::get('/test-web', function () {
    return response()->json(['mensaje' => 'Web funcionando! Usando sesiones web.']);
});

// ==================== AUTENTICACIÓN ====================
Route::middleware('guest')->group(function () {
    // Login
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    
    // Registro (opcional - puedes quitarlo si no quieres registro público)
    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

// ==================== RUTAS PROTEGIDAS ====================
Route::middleware('auth')->group(function () {
    
    // ========== DASHBOARD Y LOGOUT ==========
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // RUTA NUEVA PARA EL FORMULARIO DE VENTA (esto soluciona el 404)
    Route::get('/ventas/ticket/{funcion}', function (Funciones $funcion) {
    $funcion->load(['pelicula', 'sala']);
    return view('ventas.venta-ticket', compact('funcion'));
})->name('ventas.ticket');
    
    // ========== RUTAS PARA VISTAS BLADE ==========
    
    // ----- PELÍCULAS (Solo admin) -----
    Route::middleware('role:admin')->prefix('peliculas')->group(function () {
        Route::get('/', [PeliculaController::class, 'index'])->name('peliculas.index');
        Route::get('/create', [PeliculaController::class, 'create'])->name('peliculas.create');
        Route::get('/{pelicula}/edit', [PeliculaController::class, 'edit'])->name('peliculas.edit');
    });
    
    // ----- SALAS (Solo admin) -----
    Route::middleware('role:admin')->prefix('salas')->group(function () {
        Route::get('/', [SalaController::class, 'index'])->name('salas.index');
        Route::get('/create', [SalaController::class, 'create'])->name('salas.create');
        Route::get('/{sala}/edit', [SalaController::class, 'edit'])->name('salas.edit');
    });
    
    // ----- ASIENTOS (Solo admin para escritura) -----
    Route::prefix('asientos')->group(function () {
        // Todos pueden VER asientos
        Route::get('/', [AsientoController::class, 'index'])->name('asientos.index');
        Route::get('/{asiento}', [AsientoController::class, 'show'])->name('asientos.show');
        
        // Solo admin puede CREAR/EDITAR
        Route::middleware('role:admin')->group(function () {
            Route::get('/create', [AsientoController::class, 'create'])->name('asientos.create');
            Route::get('/{asiento}/edit', [AsientoController::class, 'edit'])->name('asientos.edit');
        });
    });
    
    // ----- FUNCIONES -----
    Route::prefix('funciones')->middleware('auth')->group(function () {
        // Todos los autenticados (empleados y admin) pueden VER funciones
        Route::get('/', [FuncionController::class, 'index'])->name('funciones.index');
        Route::get('/{funcione}', [FuncionController::class, 'show'])->name('funciones.show');
        
        // AJAX - Todos autenticados pueden ver
        Route::get('/', [FuncionController::class, 'ajaxIndex'])->name('funciones.ajax.index');
        Route::get('/{funcione}', [FuncionController::class, 'ajaxShow'])->name('funciones.ajax.show');
    
        // Solo admin puede CREAR/EDITAR/ELIMINAR
        Route::middleware('role:admin')->group(function () {
            Route::get('/create', [FuncionController::class, 'create'])->name('funciones.create');
            Route::get('/{funcione}/edit', [FuncionController::class, 'edit'])->name('funciones.edit');
            
            // Rutas AJAX de escritura (POST/PUT/DELETE)
            Route::post('/', [FuncionController::class, 'store'])->name('funciones.ajax.store');
            Route::put('/{funcione}', [FuncionController::class, 'update'])->name('funciones.ajax.update');
            Route::delete('/{funcione}', [FuncionController::class, 'destroy'])->name('funciones.ajax.destroy');
        });
    });
    
    // ----- TICKETS (Todos los autenticados) -----
    Route::prefix('tickets')->group(function () {
        Route::get('/', [TicketController::class, 'index'])->name('tickets.index');
        Route::get('/create', [TicketController::class, 'create'])->name('tickets.create');
        Route::get('/{ticket}/edit', [TicketController::class, 'edit'])->name('tickets.edit');
        Route::get('/{ticket}', [TicketController::class, 'show'])->name('tickets.show');
    });
    
    // ========== RUTAS API PARA AJAX (PROTEGIDAS) ==========
    Route::prefix('ajax')->group(function () {
        
        // ----- AUTH AJAX -----
        Route::post('/logout', [AuthController::class, 'logout'])->name('ajax.logout');
        
        // ----- PELÍCULAS AJAX (Solo admin) -----
        Route::middleware('role:admin')->prefix('peliculas')->group(function () {
            Route::get('/', [PeliculaController::class, 'ajaxIndex'])->name('peliculas.ajax.index');
            Route::post('/', [PeliculaController::class, 'store'])->name('peliculas.ajax.store');
            Route::get('/{pelicula}', [PeliculaController::class, 'ajaxShow'])->name('peliculas.ajax.show');
            Route::put('/{pelicula}', [PeliculaController::class, 'update'])->name('peliculas.ajax.update');
            Route::delete('/{pelicula}', [PeliculaController::class, 'destroy'])->name('peliculas.ajax.destroy');
        });
        
        // ----- SALAS AJAX (Solo admin) -----
        Route::middleware('role:admin')->prefix('salas')->group(function () {
            Route::get('/', [SalaController::class, 'ajaxIndex'])->name('salas.ajax.index');
            Route::post('/', [SalaController::class, 'store'])->name('salas.ajax.store');
            Route::get('/{sala}', [SalaController::class, 'ajaxShow'])->name('salas.ajax.show');
            Route::put('/{sala}', [SalaController::class, 'update'])->name('salas.ajax.update');
            Route::delete('/{sala}', [SalaController::class, 'destroy'])->name('salas.ajax.destroy');
        });
        
        // ----- ASIENTOS AJAX -----
        Route::prefix('asientos')->group(function () {
            // Todos pueden VER asientos
            Route::get('/', [AsientoController::class, 'ajaxIndex'])->name('asientos.ajax.index');
            Route::get('/{asiento}', [AsientoController::class, 'ajaxShow'])->name('asientos.ajax.show');
            
            // Solo admin puede MODIFICAR
            Route::middleware('role:admin')->group(function () {
                Route::post('/', [AsientoController::class, 'store'])->name('asientos.ajax.store');
                Route::put('/{asiento}', [AsientoController::class, 'update'])->name('asientos.ajax.update');
                Route::delete('/{asiento}', [AsientoController::class, 'destroy'])->name('asientos.ajax.destroy');
            });
        });
        
        // ----- FUNCIONES AJAX -----
        Route::prefix('funciones')->group(function () {
            // Todos pueden VER funciones
            Route::get('/', [FuncionController::class, 'ajaxIndex'])->name('funciones.ajax.index');
            Route::get('/{funcione}', [FuncionController::class, 'ajaxShow'])->name('funciones.ajax.show');
            
            // Solo admin puede MODIFICAR
            Route::middleware('role:admin')->group(function () {
                Route::post('/', [FuncionController::class, 'store'])->name('funciones.ajax.store');
                Route::put('/{funcione}', [FuncionController::class, 'update'])->name('funciones.ajax.update');
                Route::delete('/{funcione}', [FuncionController::class, 'destroy'])->name('funciones.ajax.destroy');
            });
        });
        
        // ----- TICKETS AJAX (Todos) -----
        Route::prefix('tickets')->group(function () {
            Route::get('/', [TicketController::class, 'ajaxIndex'])->name('tickets.ajax.index');
            Route::post('/', [TicketController::class, 'store'])->name('tickets.ajax.store');
            Route::get('/{ticket}', [TicketController::class, 'ajaxShow'])->name('tickets.ajax.show');
            Route::put('/{ticket}', [TicketController::class, 'update'])->name('tickets.ajax.update');
            Route::delete('/{ticket}', [TicketController::class, 'destroy'])->name('tickets.ajax.destroy');
        });

        // Ruta temporal para logout GET (solo para pruebas - después quítala)
        Route::get('/salir', function (Request $request) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect('/login');
        })->name('salir');
    }); // Fin de rutas AJAX
}); // Fin de middleware auth