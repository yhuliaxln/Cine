<?php

namespace App\Http\Controllers;

use App\Models\Pelicula;
use App\Models\Sala;
use App\Models\Funciones;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Constructor: aplica middleware de autenticación
     */
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    /**
     * Mostrar dashboard principal
     */
    public function index()
    {
        $user = Auth::user();
        $role = $user->role;
        
        // Estadísticas para el dashboard (solo para admin)
        $stats = [];
        
        if ($role === 'admin') {
            $stats = [
                'total_peliculas' => Pelicula::count(),
                'total_salas' => Sala::count(),
                'total_funciones_hoy' => Funciones::whereDate('fecha_hora_inicio', today())->count(),
                'total_tickets_hoy' => Ticket::whereDate('created_at', today())->count(),
                'ingresos_hoy' => Ticket::whereDate('created_at', today())
                    ->where('estado', 'vendido')
                    ->sum('precio'),
            ];
        } else {
            // Estadísticas para empleados
            $stats = [
                'tickets_vendidos_hoy' => Ticket::whereDate('created_at', today())
                    ->where('estado', 'vendido')
                    ->count(),
                'funciones_hoy' => Funciones::whereDate('fecha_hora_inicio', today())->count(),
            ];
        }
        
        // Funciones próximas (para todos)
        $funciones_proximas = Funciones::with(['pelicula', 'sala'])
            ->where('fecha_hora_inicio', '>=', now())
            ->orderBy('fecha_hora_inicio', 'asc')
            ->take(5)
            ->get();
        
        return view('dashboard', [
            'user' => $user,
            'role' => $role,
            'stats' => $stats,
            'funciones_proximas' => $funciones_proximas,
        ]);
    }
    
    /**
     * Obtener datos del dashboard vía AJAX (para actualizaciones en tiempo real)
     */
    public function getDashboardData(Request $request)
    {
        $user = Auth::user();
        
        if (!$request->expectsJson()) {
            abort(403);
        }
        
        // Datos básicos
        $data = [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'timestamp' => now()->format('Y-m-d H:i:s'),
        ];
        
        // Agregar estadísticas según rol
        if ($user->role === 'admin') {
            $data['stats'] = [
                'total_peliculas' => Pelicula::count(),
                'total_salas' => Sala::count(),
                'funciones_hoy' => Funciones::whereDate('fecha_hora_inicio', today())->count(),
                'tickets_hoy' => Ticket::whereDate('created_at', today())->count(),
                'ingresos_hoy' => Ticket::whereDate('created_at', today())
                    ->where('estado', 'vendido')
                    ->sum('precio'),
            ];
        } else {
            $data['stats'] = [
                'tickets_vendidos_hoy' => Ticket::whereDate('created_at', today())
                    ->where('estado', 'vendido')
                    ->count(),
                'funciones_hoy' => Funciones::whereDate('fecha_hora_inicio', today())->count(),
            ];
        }
        
        return response()->json($data);
    }
}