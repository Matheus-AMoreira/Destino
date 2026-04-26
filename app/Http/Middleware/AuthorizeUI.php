<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthorizeUI
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (!$user || !$user->hasPermission($permission)) {
            // Em áreas administrativas e UI protegida, retornamos 403 explicitamente
            // Isso evita redirecionamentos infinitos e é mais seguro
            abort(403, 'Você não tem permissão para acessar esta página.');
        }

        return $next($request);
    }
}
