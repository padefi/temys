<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActiveMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Verifica si el usuario que se le está haciendo la petisión está activo
        
        // Si la ruta es exactamente 'control-acceso/managed-user-active' (PUT o cualquier método)
        if ($request->is('control-acceso/enable-user-active*')) {
            return $next($request);
        }
    
        $userId = $request->input('user') ?? $request->route('user');
        
        if ($userId) {
            $user = $userId instanceof User ? $userId : User::find($userId);
            if (!$user || !$user->is_active) {
                return response()->json(['message' => 'El usuario está deshabilitado', 'success' => false], 403);
            }
        }

        return $next($request);
    }
}
