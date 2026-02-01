@extends('layouts.app')

@section('content')
<div class="container mt-5">
    <div class="card shadow-lg">
        <div class="card-header bg-primary text-white">
            <h3 class="mb-0">Dashboard Administrador</h3>
        </div>
        <div class="card-body">
            <h4>Bienvenido, {{ $user->name ?? $user->email }}</h4>
            <p>Rol: Administrador</p>

            <div class="row mt-4">
                <div class="col-md-3">
                    <div class="card bg-info text-white">
                        <div class="card-body">
                            <h5>Películas</h5>
                            <p class="display-6">{{ $stats['total_peliculas'] }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <h5>Salas</h5>
                            <p class="display-6">{{ $stats['total_salas'] }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-warning text-dark">
                        <div class="card-body">
                            <h5>Funciones hoy</h5>
                            <p class="display-6">{{ $stats['total_funciones_hoy'] }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-danger text-white">
                        <div class="card-body">
                            <h5>Ingresos hoy</h5>
                            <p class="display-6">${{ number_format($stats['ingresos_hoy'], 2) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <h5 class="mt-5">Próximas funciones</h5>
            <ul class="list-group">
                @foreach($funciones_proximas as $funcion)
                    <li class="list-group-item">
                        {{ $funcion->pelicula->titulo }} - 
                        {{ $funcion->sala->nombre }} - 
                        {{ $funcion->fecha_hora_inicio->format('d/m/Y H:i') }} - 
                        ${{ number_format($funcion->precio, 2) }}
                    </li>
                @endforeach
            </ul>
        </div>
    </div>
</div>
@endsection