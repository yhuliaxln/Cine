<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cine – Iniciar Sesión</title>
    <!-- Bootstrap CSS (para que se vea bien, pero mantenemos tus estilos inline) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            min-height: 100vh;
            background-color: #e5e7eb; /* gris oficina como en tu React */
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            font-family: system-ui, -apple-system, sans-serif;
        }
        .login-box {
            width: 420px;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        h2 {
            text-align: center;
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 32px;
            color: #111827;
        }
        .error-message {
            color: #dc2626;
            text-align: center;
            margin-bottom: 16px;
            font-weight: 500;
        }
        label {
            display: block;
            margin-bottom: 6px;
            font-weight: 600;
        }
        input {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #d1d5db;
            font-size: 16px;
        }
        button {
            width: 100%;
            padding: 14px;
            background-color: #2563eb;
            color: #fff;
            font-size: 18px;
            font-weight: 700;
            border: none;
            border-radius: 10px;
            cursor: pointer;
        }
        button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    </style>
</head>
<body>

    <div class="login-box">
        <h2>🎬 Cine – Iniciar Sesión</h2>

        <!-- Mensajes de error o éxito de Laravel -->
        @if (session('error'))
            <p class="error-message">{{ session('error') }}</p>
        @endif

        @if ($errors->any())
            <div class="error-message">
                @foreach ($errors->all() as $error)
                    <p>{{ $error }}</p>
                @endforeach
            </div>
        @endif

        <!-- Formulario POST tradicional -->
        <form method="POST" action="{{ route('login') }}" id="loginForm">
            @csrf

            <!-- EMAIL -->
            <div style="margin-bottom: 20px;">
                <label>Email</label>
                <input type="email" name="email" value="{{ old('email') }}" required placeholder="correo@ejemplo.com">
                @error('email')
                    <p class="error-message">{{ $message }}</p>
                @enderror
            </div>

            <!-- PASSWORD -->
            <div style="margin-bottom: 28px;">
                <label>Contraseña</label>
                <input type="password" name="password" required placeholder="********">
                @error('password')
                    <p class="error-message">{{ $message }}</p>
                @enderror
            </div>

            <!-- BOTÓN -->
            <button type="submit" id="submitBtn">Ingresar</button>
        </form>
    </div>

    <!-- JavaScript simple para loading (igual que tu React) -->
    <script>
        document.getElementById('loginForm').addEventListener('submit', function() {
            const btn = document.getElementById('submitBtn');
            btn.disabled = true;
            btn.textContent = 'Cargando...';
        });
    </script>

</body>
</html>