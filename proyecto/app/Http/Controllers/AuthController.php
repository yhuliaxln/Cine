<?php
// proyecto/app/Http/Controllers/AuthController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * ========== VISTAS BLADE ==========
     */
    
    /**
     * Mostrar formulario de login
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }
    
    /**
     * Mostrar formulario de registro
     */
    public function showRegisterForm()
    {
        return view('auth.register');
    }
    
    /**
     * ========== PROCESAMIENTO DE FORMULARIOS ==========
     */
    
    /**
     * Procesar login (sesiones web)
     */
    public function login(Request $request)
    {
        // Validar datos
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);
        
        // Opcional: campo "remember"
        $remember = $request->filled('remember');

        // Intentar autenticar con SESIONES WEB
        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();
            
            // Usuario autenticado
            $user = Auth::user();
            
            // Redirigir según rol
            return redirect()->intended('/dashboard')
                ->with('success', '¡Bienvenido ' . $user->name . '!');
        }

        // Si falla, regresar con error
        return back()->withErrors([
            'email' => 'Credenciales inválidas',
        ])->onlyInput('email');
    }

    /**
     * Procesar registro
     */
    public function register(Request $request)
    {
        // Validar datos
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'nullable|in:admin,empleado',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Crear usuario (por defecto será empleado)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'empleado',
        ]);

        // Autenticar al usuario automáticamente
        Auth::login($user);

        // Redirigir al dashboard
        return redirect('/dashboard')->with('success', '¡Registro exitoso!');
    }

    /**
     * Cerrar sesión (sesiones web)
     */
    public function logout(Request $request)
    {
        // Cerrar sesión web (no tokens Sanctum)
        Auth::logout();
        
        // Invalidar sesión
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        // Redirigir a login
        return redirect('/login')->with('info', 'Sesión cerrada correctamente.');
    }
    
    /**
     * ========== API PARA AJAX (OPCIONAL) ==========
     * Si necesitas mantener compatibilidad con API
     */
    
    /**
     * Login vía AJAX (para posibles llamadas desde JavaScript)
     */
    public function ajaxLogin(Request $request)
    {
        if (!$request->expectsJson()) {
            abort(403, 'Esta ruta solo acepta JSON');
        }
        
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        $user = Auth::user();
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Login exitoso',
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ]
        ]);
    }
    
    /**
     * Logout vía AJAX
     */
    public function ajaxLogout(Request $request)
    {
        if (!$request->expectsJson()) {
            abort(403, 'Esta ruta solo acepta JSON');
        }
        
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logout exitoso'
        ]);
    }
    
    /**
     * Obtener usuario actual vía AJAX
     */
    public function getCurrentUser(Request $request)
    {
        if (!$request->expectsJson()) {
            abort(403);
        }
        
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['authenticated' => false], 401);
        }
        
        return response()->json([
            'authenticated' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ]);
    }
}