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
    public function index()
    {
        $user = Auth::user();
        $role = strtolower(trim($user->role ?? '')); // Normalizamos: minúsculas + quita espacios

        // Aceptamos tanto 'empleado' como 'employee' (por si en BD está en inglés)
        if ($role === 'empleado' || $role === 'employee') {
            return view('dashboard-empleado');
        }

        // Si no es empleado → asumimos admin (o rol desconocido)
        $stats = [
            'total_peliculas'     => Pelicula::count(),
            'total_salas'         => Sala::count(),
            'total_funciones_hoy' => Funciones::whereDate('fecha_hora_inicio', today())->count(),
            'total_tickets_hoy'   => Ticket::whereDate('created_at', today())->count(),
            'ingresos_hoy'        => Ticket::whereDate('created_at', today())
                                        ->where('estado', 'vendido')
                                        ->sum('precio'),
        ];

        $funciones_proximas = Funciones::with(['pelicula', 'sala'])
            ->where('fecha_hora_inicio', '>=', now())
            ->orderBy('fecha_hora_inicio', 'asc')
            ->take(5)
            ->get();

        return view('dashboard', compact(
            'user',
            'role',
            'stats',
            'funciones_proximas'
        ));
    }

    public function getDashboardData(Request $request)
    {
        if (!$request->expectsJson()) {
            abort(403);
        }

        $user = Auth::user();
        $role = strtolower(trim($user->role ?? ''));

        $data = [
            'user' => [
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $role,
            ],
            'timestamp' => now()->format('Y-m-d H:i:s'),
        ];

        if ($role === 'admin') {
            $data['stats'] = [
                'total_peliculas'     => Pelicula::count(),
                'total_salas'         => Sala::count(),
                'funciones_hoy'       => Funciones::whereDate('fecha_hora_inicio', today())->count(),
                'tickets_hoy'         => Ticket::whereDate('created_at', today())->count(),
                'ingresos_hoy'        => Ticket::whereDate('created_at', today())
                                            ->where('estado', 'vendido')
                                            ->sum('precio'),
            ];
        } else {
            $data['stats'] = [
                'tickets_vendidos_hoy' => Ticket::whereDate('created_at', today())
                                            ->where('estado', 'vendido')
                                            ->count(),
                'funciones_hoy'       => Funciones::whereDate('fecha_hora_inicio', today())->count(),
            ];
        }

        return response()->json($data);
    }
}