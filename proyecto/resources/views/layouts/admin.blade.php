<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') - Cine Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f3f4f6; font-family: system-ui, sans-serif; }
        .topbar {
            background-color: #1e40af;
            color: #fff;
            padding: 16px;
        }
        .navbar-horizontal {
            background-color: #ffffff;
            border-bottom: 1px solid #e5e7eb;
            padding: 12px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .navbar-horizontal a {
            padding: 10px 16px;
            border-radius: 8px;
            text-decoration: none;
            color: #4b5563;
            font-weight: 500;
            transition: all 0.2s;
        }
        .navbar-horizontal a:hover,
        .navbar-horizontal a.active {
            background-color: #eff6ff;
            color: #1e40af;
            font-weight: 600;
        }
        .content-wrapper {
            padding: 32px;
            max-width: 1280px;
            margin: 0 auto;
        }
    </style>
</head>
<body>

    <!-- HEADER AZUL -->
    <div class="topbar">
        <div style="max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
            <h1 style="font-size: 24px; margin: 0;">🎬 Cine - Panel Administrador</h1>
            <div style="display: flex; gap: 16px; align-items: center;">
                <span>Bienvenid@, {{ Auth::user()->name ?? Auth::user()->email ?? 'Administrador' }}</span>
                <form action="{{ route('logout') }}" method="POST" style="margin: 0;">
                    @csrf
                    <button type="submit" style="background-color: #dc2626; color: #fff; padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer;">
                        Cerrar sesión
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- NAVBAR HORIZONTAL (debajo del header) -->
    <nav class="navbar-horizontal">
        <div style="max-width: 1280px; margin: 0 auto; display: flex; gap: 8px; padding: 0 32px; flex-wrap: wrap;">
            <a href="{{ url('/dashboard') }}" 
               class="{{ request()->is('dashboard') ? 'active' : '' }}">
                🏠 Inicio
            </a>
            <a href="{{ route('peliculas.index') }}" 
               class="{{ request()->is('peliculas*') ? 'active' : '' }}">
                🎬 Películas
            </a>
            <a href="{{ route('salas.index') }}" 
               class="{{ request()->is('salas*') ? 'active' : '' }}">
                🎭 Salas
            </a>
            <a href="#" class="">
                👥 Usuarios
            </a>
            <a href="#" class="">
                📊 Reportes
            </a>
        </div>
    </nav>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="content-wrapper">
        @yield('content')
    </main>

    @stack('scripts')
</body>
</html>